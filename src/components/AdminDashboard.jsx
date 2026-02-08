import React, { useState, useEffect } from 'react';
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

const AdminDashboard = ({ user, onLogout }) => {
    const { t } = useLanguage();
    const [plans, setPlans] = useState([]);
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        roi: '',
        min_deposit: '',
        risk: 'Moderate',
        focus: '',
        country_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [plansRes, countriesRes] = await Promise.all([
                fetch('http://localhost:5000/api/all-plans'),
                fetch('http://localhost:5000/api/countries')
            ]);
            const plansData = await plansRes.json();
            const countriesData = await countriesRes.json();
            setPlans(plansData);
            setCountries(countriesData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (plan = null) => {
        if (plan) {
            setEditingPlan(plan);
            setFormData({
                name: plan.name,
                roi: plan.roi,
                min_deposit: plan.min_deposit,
                risk: plan.risk,
                focus: plan.focus,
                country_id: plan.country_id
            });
        } else {
            setEditingPlan(null);
            setFormData({
                name: '',
                roi: '',
                min_deposit: '',
                risk: 'Moderate',
                focus: '',
                country_id: countries[0]?.id || ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingPlan ? 'PUT' : 'POST';
        const url = editingPlan
            ? `http://localhost:5000/api/plans/${editingPlan.id}`
            : 'http://localhost:5000/api/plans';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setMessage({ type: 'success', text: editingPlan ? 'Plan updated!' : 'Plan created!' });
                setIsModalOpen(false);
                fetchData();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Operation failed' });
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.confirmDelete'))) return;

        try {
            const response = await fetch(`http://localhost:5000/api/plans/${id}`, { method: 'DELETE' });
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
        { label: t('admin.stats.totalUsers'), value: '1,248', icon: <Users />, color: 'blue' },
        { label: t('admin.stats.totalPlans'), value: plans.length, icon: <Layers />, color: 'emerald' },
        { label: t('admin.stats.globalAUM'), value: '$4.2M', icon: <TrendingUp />, color: 'indigo' },
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
                                        <td className="font-bold">{plan.name}</td>
                                        <td><span className="country-tag">{plan.country_flag} {plan.country_name}</span></td>
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
            </main>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content admin-modal">
                        <button className="close-btn" onClick={() => setIsModalOpen(false)}><X /></button>
                        <div className="modal-header">
                            <PlusCircle size={32} className="text-accent" />
                            <h3>{editingPlan ? t('admin.editPlan') : t('admin.addPlan')}</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>{t('admin.planName')}</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('admin.country')}</label>
                                    <select
                                        value={formData.country_id}
                                        onChange={e => setFormData({ ...formData, country_id: e.target.value })}
                                        required
                                    >
                                        {countries.map(c => (
                                            <option key={c.id} value={c.id}>{c.flag} {c.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>{t('admin.roi')}</label>
                                    <input
                                        type="text"
                                        value={formData.roi}
                                        onChange={e => setFormData({ ...formData, roi: e.target.value })}
                                        placeholder="e.g. 8-12%"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('admin.minDeposit')}</label>
                                    <input
                                        type="text"
                                        value={formData.min_deposit}
                                        onChange={e => setFormData({ ...formData, min_deposit: e.target.value })}
                                        placeholder="e.g. $50,000"
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>{t('admin.risk')}</label>
                                    <select
                                        value={formData.risk}
                                        onChange={e => setFormData({ ...formData, risk: e.target.value })}
                                    >
                                        <option>Low</option>
                                        <option>Moderate</option>
                                        <option>High</option>
                                        <option>Very High</option>
                                    </select>
                                </div>
                                <div className="form-group full-width">
                                    <label>{t('admin.focus')}</label>
                                    <textarea
                                        value={formData.focus}
                                        onChange={e => setFormData({ ...formData, focus: e.target.value })}
                                        placeholder="Describe market focus..."
                                        rows="2"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>{t('admin.cancel')}</button>
                                <button type="submit" className="btn btn-primary">{t('admin.save')}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

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

        .management-section { background: white; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
        .card-header { padding: 1.5rem 2rem; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; }
        .card-header h2 { font-size: 1.25rem; display: flex; align-items: center; gap: 0.75rem; color: #1e293b; }

        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th { background: #f8fafc; text-align: left; padding: 1.25rem 2rem; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; }
        .admin-table td { padding: 1.25rem 2rem; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; color: #1e293b; }
        
        .country-tag { background: #f1f5f9; padding: 4px 10px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; display: flex; align-items: center; gap: 6px; width: fit-content; }
        
        .risk-tag { font-size: 0.75rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; }
        .risk-tag.low { background: #dcfce7; color: #166534; }
        .risk-tag.moderate { background: #fef9c3; color: #854d0e; }
        .risk-tag.high { background: #fee2e2; color: #991b1b; }

        .actions-cell { display: flex; gap: 0.75rem; }
        .icon-btn { border: none; background: #f1f5f9; width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #64748b; transition: all 0.2s; }
        .icon-btn.edit:hover { background: #dbeafe; color: #2563eb; }
        .icon-btn.delete:hover { background: #fee2e2; color: #dc2626; }

        /* Modal Styles */
        .modal-overlay { position: fixed; top:0; left:0; width:100%; height:100%; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .admin-modal { max-width: 600px; padding: 2.5rem; border-radius: 24px; }
        
        .admin-form { margin-top: 2rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .full-width { grid-column: span 2; }
        
        .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.5rem; color: #475569; }
        .form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.75rem; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; }
        
        .form-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2.5rem; }

        .alert { display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.5rem; border-radius: 10px; margin-bottom: 2rem; font-weight: 500; }
        .alert-success { background: #ecfdf5; color: #059669; border: 1px solid #10b981; }
        .alert-error { background: #fef2f2; color: #dc2626; border: 1px solid #f87171; }

        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr; }
          .form-grid { grid-template-columns: 1fr; }
          .full-width { grid-column: auto; }
        }
      `}</style>
        </div>
    );
};

export default AdminDashboard;
