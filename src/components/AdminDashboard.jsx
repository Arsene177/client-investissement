import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../LanguageContext';
import {
    Plus,
    Edit2,
    Trash2,
    Globe,
    TrendingUp,
    Users,
    Layers,
    X,
    PlusCircle,
    AlertCircle,
    CheckCircle,
    BarChart3,
    Search
} from 'lucide-react';
import { API_ENDPOINTS, getHeaders } from '../config/api';

const AdminDashboard = ({ user, onLogout }) => {
    const { t } = useLanguage();
    const [plans, setPlans] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [stats, setStats] = useState({ totalUsers: 0, totalPlans: 0, globalAUM: '$0.00' });
    const [formError, setFormError] = useState('');
    const modalRef = useRef(null);

    const [formData, setFormData] = useState({
        name_en: '',
        name_fr: '',
        roi: '',
        min_deposit: '',
        settlement_time: '24H',
        risk: 'Moderate',
        focus: '',
        description_en: '',
        description_fr: '',
        badge: 'STANDARD',
        display_order: 0,
        is_active: true,
        country_id: null,
        country_code_input: 'GLOBAL'
    });

    const [activeTab, setActiveTab] = useState('plans'); // 'plans' or 'users'
    const [usersList, setUsersList] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [planFilter, setPlanFilter] = useState('all');
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [messagingUser, setMessagingUser] = useState(null);
    const [isBulkMode, setIsBulkMode] = useState(false);
    const [messageData, setMessageData] = useState({ subject: '', content: '' });
    const [conversation, setConversation] = useState([]);
    const [loadingConversation, setLoadingConversation] = useState(false);

    const fetchConversation = async (otherUserId) => {
        setLoadingConversation(true);
        try {
            const res = await fetch(`${API_ENDPOINTS.ADMIN_SEND_MESSAGE}/conversation/${otherUserId}`, {
                headers: getHeaders()
            });
            const data = await res.json();
            if (!res.ok) {
                console.error('[Conversation Fix] Database Error Detail:', data);
                return;
            }
            setConversation(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error fetching conversation:', err);
        } finally {
            setLoadingConversation(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (activeTab === 'users') {
            fetchUsers();
        }
    }, [activeTab, planFilter]);

    // De-bounced search or manual search already works via Enter, 
    // but planFilter should definitely trigger a refresh.

    const fetchData = async () => {
        setLoading(true);
        try {
            const [plansRes, countriesRes, statsRes] = await Promise.all([
                fetch(API_ENDPOINTS.ALL_PLANS, { headers: getHeaders() }),
                fetch(API_ENDPOINTS.COUNTRIES, { headers: getHeaders() }),
                fetch(API_ENDPOINTS.ADMIN_STATS, { headers: getHeaders() })
            ]);
            const plansData = await plansRes.json();
            const countriesData = await countriesRes.json();
            const statsData = await statsRes.json();
            setPlans(plansData);
            setCountries(countriesData);
            setStats(statsData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const url = new URL(API_ENDPOINTS.ADMIN_USERS);
            if (userSearch) url.searchParams.append('search', userSearch);
            if (planFilter !== 'all') url.searchParams.append('planId', planFilter);

            console.log('Fetching users from:', url.toString());
            const res = await fetch(url.toString(), { headers: getHeaders() });
            const data = await res.json();
            
            if (!res.ok) {
                console.error('Fetch Users failed:', data);
                const errorStr = data.error || data.message || JSON.stringify(data);
                setMessage({ type: 'error', text: `Fetch Error: ${errorStr}` });
                setUsersList([]);
                return;
            }

            console.log('Fetched users data:', data);
            if (!Array.isArray(data)) {
                console.error('Data is not an array:', data);
                setUsersList([]);
                return;
            }
            
            setUsersList(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            setMessage({ type: 'error', text: 'Network error. Check console for details.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSuspendUser = async (userId, isSuspended) => {
        try {
            const res = await fetch(API_ENDPOINTS.ADMIN_SUSPEND_USER(userId), {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify({ suspended: !isSuspended })
            });

            if (res.ok) {
                setMessage({ type: 'success', text: isSuspended ? 'Account reactivated' : 'Account suspended' });
                fetchUsers();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }
        } catch (err) {
            console.error('Error suspending user:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        try {
            const endpoint = isBulkMode ? API_ENDPOINTS.ADMIN_SEND_BULK_MESSAGE : API_ENDPOINTS.ADMIN_SEND_MESSAGE;

            const body = isBulkMode ? {
                sender_id: user.id,
                receiver_ids: usersList.filter(u => u.role === 'client').map(u => u.id),
                subject: messageData.subject,
                content: messageData.content
            } : {
                sender_id: user.id,
                receiver_id: messagingUser.id,
                subject: messageData.subject,
                content: messageData.content
            };

            console.log('Sending message to:', messagingUser?.id, 'from admin:', user?.id);
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(body)
            });

            if (res.ok) {
                const data = await res.json();
                const successMsg = isBulkMode
                    ? t('admin.messageSentTo').replace('{count}', data.count || (Array.isArray(data.results) ? data.results.length : 1))
                    : 'Message sent successfully';

                setMessage({ type: 'success', text: successMsg });
                setIsMessageModalOpen(false);
                setMessageData({ subject: '', content: '' });
                fetchUsers(); // Refresh to potentially show new stats/status
                setTimeout(() => setMessage({ type: '', text: '' }), 5000);
            } else {
                const errorData = await res.json();
                console.error('Failed to send message:', errorData);
                const errorText = errorData.error || errorData.message || 'Server error';
                setMessage({ type: 'error', text: `Failed: ${errorText}` });
            }
        } catch (err) {
            console.error('Error sending message:', err);
            setMessage({ type: 'error', text: 'Network error. Could not send message.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 5000);
        }
    };

    const handleOpenBulkMessageModal = () => {
        setMessagingUser(null);
        setIsBulkMode(true);
        setIsMessageModalOpen(true);
        setConversation([]);
    };

    const handleOpenMessageModal = (user) => {
        setMessagingUser(user);
        setIsBulkMode(false);
        setIsMessageModalOpen(true);
        if (user && user.id) {
            fetchConversation(user.id);
        }
    };

    const handleOpenModal = (plan = null) => {
        // ... existing handleOpenModal code ...
        setFormError('');
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name_en: plan.name_en || plan.name || '',
                name_fr: plan.name_fr || plan.name || '',
                roi: plan.roi,
                min_deposit: plan.min_deposit,
                settlement_time: plan.settlement_time || '24H',
                risk: plan.risk,
                focus: plan.focus || '',
                description_en: plan.description_en || '',
                description_fr: plan.description_fr || '',
                badge: plan.badge || 'STANDARD',
                display_order: plan.display_order || 0,
                is_active: plan.is_active !== undefined ? plan.is_active : true,
                country_id: plan.country_id,
                country_code_input: plan.country_id ? (plan.country_code || plan.phone_code) : 'GLOBAL'
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name_en: '',
                name_fr: '',
                roi: '',
                min_deposit: '',
                settlement_time: '24H',
                risk: 'Moderate',
                focus: '',
                description_en: '',
                description_fr: '',
                badge: 'STANDARD',
                display_order: 0,
                is_active: true,
                country_id: null,
                country_code_input: 'GLOBAL'
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');

        // Basic validation - check both names
        if ((!formData.name_en && !formData.name_fr) || !formData.roi || !formData.min_deposit) {
            setFormError('Veuillez remplir les champs obligatoires (Nom, ROI, Dépôt).');
            if (modalRef.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const method = editingPlan ? 'PUT' : 'POST';
        const url = editingPlan
            ? API_ENDPOINTS.PLAN_BY_ID(editingPlan.id)
            : API_ENDPOINTS.PLANS;

        try {
            // For older API versions that might only expect 'name'
            const submissionData = {
                ...formData,
                name: formData.name_fr || formData.name_en
            };

            const response = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(submissionData)
            });

            const data = await response.json();

            if (response.ok) {
                setMessage({ type: 'success', text: editingPlan ? 'Plan mis à jour !' : 'Plan créé !' });
                setIsModalOpen(false);
                fetchData();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } else {
                setFormError(data.message || 'Operation failed. Please check your inputs.');
                if (modalRef.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            setFormError('Network error. Please try again.');
            if (modalRef.current) modalRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.confirmDelete'))) return;

        try {
            const response = await fetch(API_ENDPOINTS.PLAN_BY_ID(id), {
                method: 'DELETE',
                headers: getHeaders()
            });
            if (response.ok) {
                setPlans(plans.filter(p => p.id !== id));
                setMessage({ type: 'success', text: 'Plan deleted' });
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }
        } catch (err) {
            console.error('Delete failed:', err);
        }
    };

    const adminStats = [
        { label: t('admin.stats.totalUsers'), value: (stats.totalClients || stats.totalUsers).toLocaleString(), icon: <Users />, color: 'blue' },
        { label: t('admin.stats.totalPlans'), value: stats.totalPlans.toLocaleString(), icon: <Layers />, color: 'emerald' },
        { label: t('admin.stats.globalAUM'), value: stats.globalAUM, icon: <TrendingUp />, color: 'indigo' },
    ];

    return (
        <div className="admin-container">
            <header className="admin-header">
                <div className="container header-flex">
                    <div className="title-group">
                        <h1>{t('admin.title')}</h1>
                        <span className="badge">System Administrator</span>
                    </div>
                    <button className="btn-logout" onClick={onLogout}>
                        {t('dashboard.logout')}
                    </button>
                </div>
            </header>

            <main className="container admin-main">
                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        {message.text}
                    </div>
                )}

                <div className="stats-grid">
                    {adminStats.map((stat, idx) => (
                        <div key={idx} className={`stat-card border-${stat.color}`}>
                            <div className={`stat-icon bg-${stat.color}`}>{stat.icon}</div>
                            <div className="stat-info">
                                <span>{stat.label}</span>
                                <h3>{stat.value}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="admin-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
                        onClick={() => setActiveTab('plans')}
                    >
                        <Layers size={18} /> {t('admin.managePlans')}
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        <Users size={18} /> {t('admin.manageUsers')}
                    </button>
                </div>

                {activeTab === 'plans' ? (
                    <section className="management-section card">
                        <div className="card-header">
                            <h2><BarChart3 size={20} /> {t('admin.managePlans')}</h2>
                            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                                <Plus size={18} /> {t('admin.addPlan')}
                            </button>
                        </div>

                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>{t('admin.planName')}</th>
                                        <th>{t('admin.country')}</th>
                                        <th>{t('admin.roi')}</th>
                                        <th>{t('admin.minDeposit')}</th>
                                        <th>{t('admin.risk')}</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center">Synchronizing database...</td></tr>
                                    ) : plans.map(plan => (
                                        <tr key={plan.id}>
                                            <td className="font-bold">{plan.name_fr || plan.name_en || plan.name}</td>
                                            <td>
                                                <span className="country-tag">
                                                    {plan.country_id
                                                        ? `${plan.country_flag} ${plan.country_name}`
                                                        : `🌐 ${t('admin.global')}`
                                                    }
                                                </span>
                                            </td>
                                            <td className="text-accent font-bold">{plan.roi}</td>
                                            <td>{plan.min_deposit}</td>
                                            <td><span className={`risk-tag ${plan.risk.toLowerCase()}`}>{plan.risk}</span></td>
                                            <td className="actions-cell">
                                                <button className="icon-btn edit" onClick={() => handleOpenModal(plan)}><Edit2 size={16} /></button>
                                                <button className="icon-btn delete" onClick={() => handleDelete(plan.id)}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                ) : (
                    <section className="management-section card">
                        <div className="card-header user-mgmt-header">
                            <h2><Users size={20} /> {t('admin.manageUsers')}</h2>
                            <div className="filter-group">
                                <span style={{ fontSize: '10px', color: '#94a3b8' }}>API: {API_ENDPOINTS.ADMIN_USERS}</span>
                                <div className="search-wrapper">
                                    <Search size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search name, email..."
                                        value={userSearch}
                                        onChange={(e) => setUserSearch(e.target.value)}
                                        onKeyUp={(e) => e.key === 'Enter' && fetchUsers()}
                                    />
                                </div>
                                <select
                                    value={planFilter}
                                    onChange={(e) => setPlanFilter(e.target.value)}
                                >
                                    <option value="all">{t('admin.allPlans')}</option>
                                    {plans.map(p => (
                                        <option key={p.id} value={p.id}>{p.name_fr || p.name_en || p.name}</option>
                                    ))}
                                </select>
                                <button
                                    className="btn btn-outline"
                                    style={{ gap: '0.5rem' }}
                                    onClick={handleOpenBulkMessageModal}
                                    disabled={usersList.length === 0}
                                >
                                    <Globe size={16} /> {t('admin.messageAll')}
                                </button>
                            </div>
                        </div>

                        <div className="table-responsive">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>{t('admin.user')}</th>
                                        <th>{t('admin.email')}</th>
                                        <th>{t('admin.country')}</th>
                                        <th>{t('admin.plan')}</th>
                                        <th>{t('admin.status')}</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="6" className="text-center">{t('admin.loadingUsers')}</td></tr>
                                    ) : usersList.length > 0 ? (
                                        usersList.map(u => (
                                            <tr key={u.id}>
                                                <td>
                                                    <div className="user-info-cell">
                                                        <div className="flex items-center gap-2">
                                                            <span className="user-name">{u.full_name}</span>
                                                            {u.role === 'admin' && <span className="badge-admin">ADMIN</span>}
                                                        </div>
                                                        <span className="user-username">@{u.username}</span>
                                                    </div>
                                                </td>
                                                <td>{u.email}</td>
                                                <td>{u.countries?.flag} {u.countries?.name}</td>
                                                <td>
                                                    {u.investment_plans ? (
                                                        <span className="plan-badge-ui">{u.investment_plans.name}</span>
                                                    ) : (
                                                        <span className="no-plan">No Plan</span>
                                                    )}
                                                </td>
                                                <td>
                                                    <span className={`status-tag ${u.is_suspended ? 'suspended' : 'active'}`}>
                                                        {u.is_suspended ? t('admin.suspended') : t('admin.active')}
                                                    </span>
                                                </td>
                                                <td className="actions-cell">
                                                    <button
                                                        className="icon-btn message"
                                                        title="Send Message"
                                                        onClick={() => handleOpenMessageModal(u)}
                                                    >
                                                        <Globe size={16} />
                                                    </button>
                                                    <button
                                                        className={`icon-btn suspend ${u.is_suspended ? 'reactivate' : ''}`}
                                                        title={u.is_suspended ? 'Activate' : 'Suspend'}
                                                        onClick={() => handleSuspendUser(u.id, u.is_suspended)}
                                                    >
                                                        {u.is_suspended ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="6" className="text-center">{t('admin.noUsersFound')}</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                )}
            </main>

            {
                isModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content admin-modal" ref={modalRef}>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}><X /></button>
                            <div className="modal-header">
                                <PlusCircle size={32} className="text-accent" />
                                <h3>{editingPlan ? 'Modifier le Plan' : 'Initialiser un Nouveau Portefeuille'}</h3>
                            </div>

                            <form onSubmit={handleSubmit} className="admin-form" noValidate>
                                {formError && (
                                    <div className="alert alert-error" style={{ marginBottom: '1.5rem', padding: '0.75rem' }}>
                                        <AlertCircle size={16} />
                                        <span>{formError}</span>
                                    </div>
                                )}
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Nom du Plan (FR)</label>
                                        <input
                                            type="text"
                                            value={formData.name_fr}
                                            onChange={e => setFormData({ ...formData, name_fr: e.target.value })}
                                            required
                                            placeholder="e.g. Or Standard"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Plan Name (EN)</label>
                                        <input
                                            type="text"
                                            value={formData.name_en}
                                            onChange={e => setFormData({ ...formData, name_en: e.target.value })}
                                            required
                                            placeholder="e.g. Gold Standard"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Retour sur Investissement (%)</label>
                                        <input
                                            type="text"
                                            value={formData.roi}
                                            onChange={e => setFormData({ ...formData, roi: e.target.value })}
                                            placeholder="e.g. 8-12%"
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Dépôt Minimum</label>
                                        <input
                                            type="text"
                                            value={formData.min_deposit}
                                            onChange={e => setFormData({ ...formData, min_deposit: e.target.value })}
                                            placeholder="e.g. $5,000"
                                            required
                                        />
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Juridiction Cible</label>
                                        <div className="code-input-wrapper">
                                            <input
                                                type="text"
                                                value={formData.country_code_input}
                                                onChange={e => {
                                                    const val = e.target.value.toUpperCase();
                                                    const found = countries.find(c => c.code === val || c.phone_code === val);
                                                    setFormData({
                                                        ...formData,
                                                        country_code_input: val,
                                                        country_id: val === 'GLOBAL' ? null : (found ? found.id : formData.country_id)
                                                    });
                                                }}
                                                placeholder="Code (e.g. US, FR, GLOBAL)"
                                            />
                                            <div className="resolved-country">
                                                {formData.country_id ? (
                                                    <>
                                                        {countries.find(c => c.id == formData.country_id)?.flag} {' '}
                                                        {countries.find(c => c.id == formData.country_id)?.name}
                                                    </>
                                                ) : (
                                                    <span>🌐 {t('admin.global') || 'Global'}</span>
                                                )}
                                            </div>
                                        </div>
                                        <p className="input-hint">Type ISO code (US, FR) or Phone code (1, 33)</p>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Catégorie du Plan</label>
                                        <select
                                            value={formData.badge}
                                            onChange={e => setFormData({ ...formData, badge: e.target.value })}
                                        >
                                            <option value="SIMPLE">SIMPLE</option>
                                            <option value="STANDARD">STANDARD</option>
                                            <option value="PREMIUM">PREMIUM</option>
                                        </select>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Description (FR)</label>
                                        <textarea
                                            value={formData.description_fr}
                                            onChange={e => setFormData({ ...formData, description_fr: e.target.value })}
                                            placeholder="Description française..."
                                            rows="3"
                                        ></textarea>
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Description (EN)</label>
                                        <textarea
                                            value={formData.description_en}
                                            onChange={e => setFormData({ ...formData, description_en: e.target.value })}
                                            placeholder="English description..."
                                            rows="3"
                                        ></textarea>
                                    </div>

                                    <div className="form-group full-width" style={{ display: 'none' }}>
                                        {/* Hidden background fields to preserve API compatibility */}
                                        <input type="text" value={formData.risk} readOnly />
                                        <input type="text" value={formData.settlement_time} readOnly />
                                        <input type="number" value={formData.display_order} readOnly />
                                    </div>

                                    <div className="form-group full-width">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={formData.is_active}
                                                onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
                                                style={{ width: 'auto', margin: 0 }}
                                            />
                                            <span>Statut Actif</span>
                                        </label>
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>{t('admin.cancel') || 'Annuler'}</button>
                                    <button type="submit" className="btn btn-primary">{t('admin.save') || 'Enregistrer'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            {
                isMessageModalOpen && (
                    <div className="modal-overlay">
                        <div className="modal-content admin-modal message-modal-premium" style={{ maxWidth: '500px' }}>
                            <button className="close-btn" onClick={() => setIsMessageModalOpen(false)}><X /></button>
                            <div className="modal-header">
                                <PlusCircle size={32} className="text-secondary" />
                                <h3>
                                    {isBulkMode ? t('admin.messageAll') : `${t('admin.user')}: ${messagingUser?.full_name}`}
                                </h3>
                            </div>

                            {!isBulkMode && (
                                <div className="conversation-history">
                                    {loadingConversation ? (
                                        <div className="text-center p-4">
                                            <div className="spinner-small"></div>
                                            <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Syncing history...</p>
                                        </div>
                                    ) : conversation.length > 0 ? (
                                        <div className="chat-thread">
                                            {conversation.map((msg) => (
                                                <div key={msg.id} className={`chat-bubble ${msg.sender_id === user.id ? 'sent' : 'received'}`}>
                                                    <div className="bubble-content">
                                                        {msg.content}
                                                        <span className="bubble-time">
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="empty-history text-center p-8">
                                            <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>No previous messages with this user.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            <form onSubmit={handleSendMessage} className="admin-form" style={{ marginTop: '1rem' }}>
                                <div className="form-group full-width">
                                    <label>{t('admin.subject')}</label>
                                    <input
                                        type="text"
                                        value={messageData.subject}
                                        onChange={e => setMessageData({ ...messageData, subject: e.target.value })}
                                        placeholder="Sujet du message..."
                                        required
                                    />
                                </div>
                                <div className="form-group full-width">
                                    <label>{t('admin.messageContent')}</label>
                                    <textarea
                                        value={messageData.content}
                                        onChange={e => setMessageData({ ...messageData, content: e.target.value })}
                                        placeholder="Ecrivez votre message ici..."
                                        rows="4"
                                        required
                                    ></textarea>
                                </div>
                                <div className="form-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setIsMessageModalOpen(false)}>{t('admin.cancel')}</button>
                                    <button type="submit" className="btn btn-primary">{t('admin.send')}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

            <style>{`
                .admin-container {
                    background: #f1f5f9;
                    min-height: 100vh;
                }

                .admin-header {
                    background: #1e293b;
                    color: white;
                    padding: 1.5rem 0;
                }

                .header-flex {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .title-group {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }

                .title-group h1 { font-size: 1.5rem; margin: 0; }
                
                .badge {
                    background: rgba(16, 185, 129, 0.2);
                    color: #10b981;
                    border: 1px solid rgba(16, 185, 129, 0.3);
                    padding: 2px 10px;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .btn-logout {
                    background: none;
                    border: 1px solid rgba(255,255,255,0.2);
                    color: rgba(255,255,255,0.7);
                    padding: 0.5rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                }

                .admin-main { padding-top: 2.5rem; }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1.5rem;
                    margin-bottom: 2.5rem;
                }

                .stat-card {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    display: flex;
                    align-items: center;
                    gap: 1.25rem;
                    border-left: 4px solid #cbd5e1;
                }

                .stat-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }

                .bg-blue { background: #3b82f6; }
                .bg-emerald { background: #10b981; }
                .bg-indigo { background: #6366f1; }
                
                .border-blue { border-left-color: #3b82f6; }
                .border-emerald { border-left-color: #10b981; }
                .border-indigo { border-left-color: #6366f1; }

                .stat-info span { font-size: 0.8rem; color: #64748b; font-weight: 600; }
                .stat-info h3 { font-size: 1.5rem; margin: 0.1rem 0; color: #1e293b; }

                .admin-tabs {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                }

                .tab-btn {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    background: white;
                    border-radius: 10px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-weight: 600;
                    color: #64748b;
                    transition: all 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
                }

                .tab-btn.active {
                    background: #3b82f6;
                    color: white;
                }

                .management-section { background: white; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
                .card-header { padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
                .card-header h2 { font-size: 1.25rem; display: flex; align-items: center; gap: 0.75rem; color: #1e293b; }

                .user-mgmt-header {
                    display: flex;
                    justify-content: space-between;
                    flex-wrap: wrap;
                    gap: 1.5rem;
                }

                .filter-group {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                }

                .search-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                    background: #f1f5f9;
                    padding: 0 1rem;
                    border-radius: 8px;
                    min-width: 250px;
                }

                .search-wrapper input {
                    border: none;
                    background: none;
                    padding: 0.6rem 0.5rem;
                    font-size: 0.9rem;
                    width: 100%;
                    outline: none;
                }

                .search-wrapper svg {
                    color: #94a3b8;
                }

                .admin-table { width: 100%; border-collapse: collapse; }
                .admin-table th { background: #f8fafc; text-align: left; padding: 1.25rem 2rem; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; }
                .admin-table td { padding: 1.25rem 2rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; }
                
                .user-info-cell { display: flex; flex-direction: column; }
                .user-name { font-weight: 700; }
                .user-username { font-size: 0.8rem; color: #64748b; }

                .badge-admin {
                    background: #fef3c7;
                    color: #92400e;
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 1px 4px;
                    border-radius: 4px;
                    border: 1px solid #fde68a;
                }

                .plan-badge-ui {
                    background: #e0f2fe;
                    color: #0369a1;
                    padding: 0.2rem 0.6rem;
                    border-radius: 4px;
                    font-size: 0.75rem;
                    font-weight: 700;
                }

                .no-plan { color: #94a3b8; font-style: italic; font-size: 0.85rem; }

                .status-tag {
                    font-size: 0.75rem;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 4px;
                    text-transform: uppercase;
                }
                .status-tag.active { background: #dcfce7; color: #166534; }
                .status-tag.suspended { background: #fee2e2; color: #991b1b; }

                .country-tag { background: #f1f5f9; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px; width: fit-content; }
                
                .risk-tag { font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
                .risk-tag.low { background: #dcfce7; color: #166534; }
                .risk-tag.moderate { background: #fef9c3; color: #854d0e; }
                .risk-tag.high { background: #fee2e2; color: #991b1b; }

                .actions-cell { display: flex; gap: 0.75rem; }
                .icon-btn { border: none; background: #f1f5f9; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; }
                .icon-btn.edit:hover { background: #dbeafe; color: #2563eb; }
                .icon-btn.delete:hover { background: #fee2e2; color: #dc2626; }
                .icon-btn.message:hover { background: #e0f2fe; color: #0284c7; }
                .icon-btn.suspend:hover { background: #fee2e2; color: #dc2626; }
                .icon-btn.reactivate:hover { background: #dcfce7; color: #059669; }

                /* Modal Styles */
                .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
                .admin-modal { background: white; max-width: 600px; padding: 2.5rem; border-radius: 24px; position: relative; max-height: 90vh; overflow-y: auto; }
                
                .admin-form { margin-top: 2rem; }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
                .full-width { grid-column: span 2; }
                
                .form-section-title {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: #1e293b;
                    border-bottom: 2px solid #e2e8f0;
                    padding-bottom: 0.5rem;
                    margin-bottom: 1rem;
                }

                .code-input-wrapper {
                    position: relative;
                }

                .resolved-country {
                    margin-top: 0.5rem;
                    font-size: 0.85rem;
                    color: var(--accent);
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .input-hint {
                    font-size: 0.7rem;
                    color: #94a3b8;
                    margin-top: 0.25rem;
                }

                .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: #475569; }
                .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }
                
                .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2.5rem; }

                /* Chat Styles */
                .conversation-history {
                    max-height: 250px;
                    overflow-y: auto;
                    background: #f8fafc;
                    border-radius: 12px;
                    padding: 1rem;
                    margin: -1rem -2.5rem 1rem -2.5rem; /* Full width inside modal */
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    flex-direction: column-reverse; /* Latest at bottom */
                }

                .chat-thread {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .chat-bubble {
                    max-width: 80%;
                    display: flex;
                    flex-direction: column;
                }

                .chat-bubble.sent {
                    align-self: flex-end;
                }

                .chat-bubble.received {
                    align-self: flex-start;
                }

                .bubble-content {
                    padding: 0.75rem 1rem;
                    border-radius: 12px;
                    font-size: 0.85rem;
                    position: relative;
                    line-height: 1.4;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
                }

                .sent .bubble-content {
                    background: #3b82f6;
                    color: white;
                    border-bottom-right-radius: 2px;
                }

                .received .bubble-content {
                    background: #f1f5f9;
                    color: #1e293b;
                    border-bottom-left-radius: 2px;
                }

                .bubble-time {
                    display: block;
                    font-size: 0.65rem;
                    margin-top: 0.25rem;
                    opacity: 0.7;
                    text-align: right;
                }

                .spinner-small {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #3b82f6;
                    border-top-color: transparent;
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                    margin: 0 auto 0.5rem;
                }

                @keyframes spin { to { transform: rotate(360deg); } }

                .alert { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; border-radius: 10px; margin-bottom: 2rem; font-weight: 500; }
                .alert-success { background: #ecfdf5; color: #059669; border: 1px solid #10b981; }
                .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #f87171; }

                @media (max-width: 768px) {
                  .stats-grid { grid-template-columns: 1fr; }
                  .form-grid { grid-template-columns: 1fr; }
                  .full-width { grid-column: auto; }
                }
            `}</style>
        </div >
    );
};

export default AdminDashboard;
