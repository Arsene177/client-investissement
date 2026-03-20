import React, { useState, useEffect } from 'react';
import { useLanguage } from '../LanguageContext';
import {
  TrendingUp,
  Wallet,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  ShieldCheck,
  CreditCard,
  User,
  MapPin,
  ChevronRight,
  BarChart4,
  Plus,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { API_ENDPOINTS, getHeaders } from '../config/api';

const Dashboard = ({ user: initialUser, onLogout }) => {
  const { t } = useLanguage();
  const [user, setUser] = useState(initialUser);
  const [countries, setCountries] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio', 'plans', 'messages'
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [subscriptions, setSubscriptions] = useState([]);
  const [loadingSubscriptions, setLoadingSubscriptions] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [investAmount, setInvestAmount] = useState('');
  const [submittingSub, setSubmittingSub] = useState(false);
  const [notification, setNotification] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchCountries();
    if (user.selected_country_id) {
      fetchPlans(user.selected_country_id);
    }
    fetchMessages();
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    setLoadingSubscriptions(true);
    try {
      const response = await fetch(API_ENDPOINTS.USER_SUBSCRIPTIONS(user.id), {
        headers: getHeaders()
      });
      const data = await response.json();
      setSubscriptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching subscriptions:', err);
      setSubscriptions([]);
    } finally {
      setLoadingSubscriptions(true); // Should be false, wait
      setLoadingSubscriptions(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await fetch(API_ENDPOINTS.USER_MESSAGES(user.id), {
        headers: getHeaders()
      });
      const data = await response.json();
      // Ensure data is an array
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setMessages([]);
    } finally {
      setLoadingMessages(false);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await fetch(API_ENDPOINTS.MARK_MESSAGE_READ(messageId), {
        method: 'PUT',
        headers: getHeaders()
      });
      setMessages(messages.map(m => m.id === messageId ? { ...m, is_read: true } : m));
    } catch (err) {
      console.error('Error marking message as read:', err);
    }
  };
  // ... existing code ...

  const fetchCountries = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ACTIVE_COUNTRIES, {
        headers: getHeaders()
      });
      const data = await response.json();
      setCountries(data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const fetchPlans = async (countryId) => {
    setLoadingPlans(true);
    try {
      const response = await fetch(API_ENDPOINTS.PLANS_BY_COUNTRY(countryId), {
        headers: getHeaders()
      });
      const data = await response.json();
      setAvailablePlans(data);
    } catch (err) {
      console.error('Error fetching plans:', err);
    } finally {
      setLoadingPlans(false);
    }
  };

  const handleCountryChange = async (e) => {
    const countryId = e.target.value;
    if (!countryId) return;

    try {
      const response = await fetch(API_ENDPOINTS.UPDATE_USER_COUNTRY, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ userId: user.id, countryId })
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        fetchPlans(countryId);
      }
    } catch (err) {
      console.error('Error updating country:', err);
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!selectedPlan || !investAmount) return;

    setSubmittingSub(true);
    try {
      const response = await fetch(API_ENDPOINTS.SUBSCRIBE, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          user_id: user.id,
          plan_id: selectedPlan.id,
          amount: parseFloat(investAmount)
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsSubscribeModalOpen(false);
        setInvestAmount('');
        fetchSubscriptions();
        setNotification({
          type: 'success',
          text: `Successfully initialised secure investment in ${selectedPlan.name}. View details in your portfolio.`
        });

        // Auto-hide notification after 5 seconds
        setTimeout(() => setNotification({ type: '', text: '' }), 5000);
      } else {
        setNotification({
          type: 'error',
          text: data.error || 'Failed to complete subscription. Please try again.'
        });
      }
    } catch (err) {
      console.error('Error subscribing:', err);
      setNotification({
        type: 'error',
        text: 'A network error occurred. Please check your connection and try again.'
      });
    } finally {
      setSubmittingSub(false);
    }
  };

  const openSubscribeModal = (plan) => {
    setSelectedPlan(plan);
    setInvestAmount(plan.min_deposit.replace(/[^0-9.]/g, ''));
    setIsSubscribeModalOpen(true);
  };

  const totalInvested = Array.isArray(subscriptions)
    ? subscriptions.reduce((sum, sub) => sum + parseFloat(sub.amount), 0)
    : 0;

  const stats = [
    { label: t('dashboard.portfolio'), value: `$${totalInvested.toLocaleString()}`, change: '', icon: <Wallet className="text-accent" />, positive: true },
    { label: t('dashboard.invested'), value: `$${totalInvested.toLocaleString()}`, change: '', icon: <TrendingUp className="text-primary" />, positive: true },
    { label: t('dashboard.activePlans'), value: subscriptions.length.toString(), change: '', icon: <PieChart className="text-blue-500" />, positive: true },
  ];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="container header-content">
          <div className="user-welcome">
            <h1>{t('dashboard.welcome')}, {user.full_name}</h1>
            <p className="subtitle">Aureus Wealth Management | {user.role.toUpperCase()}</p>
          </div>

          <div className="header-actions">
            <div className="country-selector-wrapper">
              <MapPin size={16} className="pin-icon" />
              <select
                value={user.selected_country_id || ""}
                onChange={handleCountryChange}
                className="country-select"
              >
                <option value="" disabled>{t('dashboard.selectCountry')}</option>
                {countries.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>
            </div>
            <button className="btn-logout" onClick={onLogout}>
              {t('dashboard.logout')}
            </button>
          </div>
        </div>

        {notification.text && (
          <div className={`notification-banner ${notification.type}`}>
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span>{notification.text}</span>
            <button className="close-notification" onClick={() => setNotification({ type: '', text: '' })}>
              <X size={14} />
            </button>
          </div>
        )}
      </header>

      <main className="container dashboard-main">
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'portfolio' ? 'active' : ''}`}
            onClick={() => setActiveTab('portfolio')}
          >
            <PieChart size={18} /> {t('dashboard.portfolio') || 'Portfolio'}
          </button>
          <button
            className={`tab-btn ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
          >
            <BarChart4 size={18} /> {t('dashboard.availablePlans') || 'Investment Plans'}
          </button>
          <button
            className={`tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <div className="relative">
              <Clock size={18} />
              {Array.isArray(messages) && messages.some(m => !m.is_read) && <span className="unread-dot"></span>}
            </div>
            {t('dashboard.messages') || 'Messages'}
          </button>
        </div>

        {activeTab === 'portfolio' && (
          <div className="stats-grid">
            {stats.map((stat, idx) => (
              <div key={idx} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <span>{stat.label}</span>
                  <h3>{stat.value}</h3>
                  {stat.change && (
                    <p className={stat.positive ? 'positive' : 'negative'}>
                      {stat.change} <span>{stat.positive ? '↑' : '↓'}</span>
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="dashboard-sections">
          {activeTab === 'plans' && (
            <div className="plans-section card">
              <div className="card-header">
                <h3><BarChart4 size={20} /> {t('dashboard.availablePlans')}</h3>
                {user.selected_country_id && (
                  <span className="country-badge">
                    {countries.find(c => c.id == user.selected_country_id)?.name}
                  </span>
                )}
              </div>
              <div className="plans-list">
                {loadingPlans ? (
                  <div className="loading-state">Loading curated plans...</div>
                ) : availablePlans.length > 0 ? (
                  availablePlans.map(plan => (
                    <div key={plan.id} className="plan-item">
                      <div className="plan-main">
                        <div className="flex items-center gap-2">
                          <h4>{plan.name}</h4>
                          {!plan.country_id && <span className="title-badge">GLOBAL</span>}
                        </div>
                        <p className="focus">{plan.focus}</p>
                      </div>
                      <div className="plan-details-grid">
                        <div className="detail">
                          <span>{t('dashboard.roi')}</span>
                          <p className="text-accent font-bold">{plan.roi}</p>
                        </div>
                        <div className="detail">
                          <span>{t('dashboard.minDeposit')}</span>
                          <p>{plan.min_deposit}</p>
                        </div>
                        <div className="detail">
                          <span>{t('dashboard.riskLevel')}</span>
                          <p className={`risk-${plan.risk.toLowerCase().replace(' ', '-')}`}>{plan.risk}</p>
                        </div>
                      </div>
                      <button
                        className="invest-btn subscribe-action"
                        onClick={() => openSubscribeModal(plan)}
                        title="Subscribe to this plan"
                      >
                        <Plus size={20} />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <MapPin size={48} />
                    <p>Please select a country to view available investment opportunities.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="messages-section card">
              <div className="card-header">
                <h3><Clock size={20} /> {t('dashboard.messages') || 'Internal Communications'}</h3>
              </div>
              <div className="messages-list">
                {loadingMessages ? (
                  <div className="loading-state">Syncing with secure server...</div>
                ) : messages.length > 0 ? (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`message-item ${msg.is_read ? 'read' : 'unread'}`}
                      onClick={() => !msg.is_read && markAsRead(msg.id)}
                    >
                      <div className="message-header">
                        <div className="sender-info">
                          <span className="sender-name">{msg.sender?.full_name}</span>
                          <span className="sender-role">{msg.sender?.role}</span>
                        </div>
                        <span className="message-date">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="message-subject">{msg.subject}</h4>
                      <p className="message-content">{msg.content}</p>
                      {!msg.is_read && <button className="mark-read-btn" onClick={() => markAsRead(msg.id)}>Mark as read</button>}
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <ShieldCheck size={48} />
                    <p>No messages from the administration yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'portfolio' && (
            <div className="portfolio-section card">
              <div className="card-header">
                <h3><PieChart size={20} /> {t('dashboard.myPortfolio') || 'My Active Portfolio'}</h3>
              </div>
              <div className="subscriptions-list">
                {loadingSubscriptions ? (
                  <div className="loading-state">Loading your investments...</div>
                ) : subscriptions.length > 0 ? (
                  subscriptions.map(sub => (
                    <div key={sub.id} className="plan-item subscription-item">
                      <div className="plan-main">
                        <div className="flex items-center gap-2">
                          <h4>{sub.investment_plans?.name}</h4>
                          <span className={`status-badge status-${sub.status}`}>{sub.status.toUpperCase()}</span>
                        </div>
                        <p className="focus">Started on {new Date(sub.created_at).toLocaleDateString()}</p>
                      </div>
                      <div className="plan-details-grid">
                        <div className="detail">
                          <span>Invested</span>
                          <p className="text-accent font-bold">${parseFloat(sub.amount).toLocaleString()}</p>
                        </div>
                        <div className="detail">
                          <span>ROI</span>
                          <p className="text-emerald-600 font-bold">{sub.investment_plans?.roi}</p>
                        </div>
                        <div className="detail">
                          <span>Settlement</span>
                          <p>{sub.investment_plans?.settlement_time}</p>
                        </div>
                      </div>
                      <div className="portfolio-actions">
                        <div className="growth-indicator positive">+0.0%</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <Wallet size={48} />
                    <p>You haven't started any investment plans yet. Explore our curated opportunities to grow your wealth.</p>
                    <button className="btn btn-primary" onClick={() => setActiveTab('plans')}>Explore Plans</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {isSubscribeModalOpen && selectedPlan && (
            <div className="modal-overlay">
              <div className="modal-content subscription-modal">
                <button className="close-btn" onClick={() => setIsSubscribeModalOpen(false)}><X /></button>
                <div className="modal-header">
                  <div className="icon-circle">
                    <TrendingUp size={32} className="text-accent" />
                  </div>
                  <h3>Confirm Subscription</h3>
                  <p>Initializing secure investment into {selectedPlan.name}</p>
                </div>

                <form onSubmit={handleSubscribe} className="subscription-form">
                  <div className="form-group">
                    <label>Investment Amount (USD)</label>
                    <div className="input-wrapper">
                      <span className="currency-prefix">$</span>
                      <input
                        type="number"
                        value={investAmount}
                        onChange={(e) => setInvestAmount(e.target.value)}
                        placeholder={`Min: ${selectedPlan.min_deposit}`}
                        required
                        min={selectedPlan.min_deposit.replace(/[^0-9.]/g, '')}
                        step="100"
                      />
                    </div>
                    <small className="form-hint">Minimum deposit for this plan is {selectedPlan.min_deposit}</small>
                  </div>

                  <div className="plan-summary-box">
                    <div className="summary-item">
                      <span>Target ROI</span>
                      <p className="text-accent">{selectedPlan.roi}</p>
                    </div>
                    <div className="summary-item">
                      <span>Risk Level</span>
                      <p>{selectedPlan.risk}</p>
                    </div>
                    <div className="summary-item">
                      <span>Settlement</span>
                      <p>{selectedPlan.settlement_time}</p>
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline" onClick={() => setIsSubscribeModalOpen(false)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={submittingSub}>
                      {submittingSub ? 'Processing...' : 'Complete Subscription'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="side-cards">
            {/* Profile Summary Card */}
            <div className="profile-summary card">
              <div className="card-header">
                <h3><User size={20} /> {t('dashboard.profile')}</h3>
              </div>
              <div className="profile-details">
                <div className="profile-avatar">
                  {user.full_name.charAt(0)}
                </div>
                <h4>{user.full_name}</h4>
                <p>@{user.username}</p>
                <div className="verification-badge">
                  <ShieldCheck size={16} /> Verified Investor
                </div>
                <div className="quick-info">
                  <div className="info-item">
                    <CreditCard size={16} />
                    <span>**** 4920</span>
                  </div>
                </div>
                <button className="btn btn-primary w-full mt-auto">{t('dashboard.settings')}</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        .dashboard-container {
          background: #f8fafc;
          min-height: 100vh;
          padding-bottom: 4rem;
        }

        .dashboard-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .dashboard-tabs .tab-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          background: white;
          border-radius: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
          color: #64748b;
          transition: all 0.2s;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .dashboard-tabs .tab-btn.active {
          background: var(--primary);
          color: white;
        }

        .unread-dot {
          position: absolute;
          top: -4px;
          right: -4px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          border: 2px solid white;
        }

        .relative { position: relative; }

        .messages-list { padding: 1rem; }
        
        .message-item {
          padding: 1.5rem;
          border-radius: 12px;
          border: 1px solid #f1f5f9;
          margin-bottom: 1rem;
          transition: all 0.2s;
          cursor: pointer;
        }

        .message-item.unread {
          background: #f8fafc;
          border-left: 4px solid var(--accent);
        }

        .message-item:hover { border-color: var(--accent); transform: translateX(4px); }

        .message-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
        }

        .sender-info { display: flex; flex-direction: column; }
        .sender-name { font-weight: 700; color: var(--primary); }
        .sender-role { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 800; }
        .message-date { font-size: 0.8rem; color: #94a3b8; }

        .message-subject { font-size: 1.1rem; color: var(--primary); margin-bottom: 0.5rem; }
        .message-content { font-size: 0.95rem; color: #475569; line-height: 1.6; }

        .mark-read-btn {
          margin-top: 1rem;
          background: none;
          border: 1px solid #e2e8f0;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.8rem;
          color: #64748b;
          cursor: pointer;
        }

        .mark-read-btn:hover { background: #f1f5f9; }
// ... existing styles ...

        .dashboard-header {
          background: var(--white);
          padding: 1.5rem 0;
          border-bottom: 1px solid #e2e8f0;
          margin-bottom: 2rem;
          box-shadow: 0 2px 4px rgba(0,0,0,0.02);
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-welcome h1 {
          font-size: 1.5rem;
          color: var(--primary);
          margin-bottom: 0.1rem;
        }

        .subtitle {
          color: #64748b;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .country-selector-wrapper {
          display: flex;
          align-items: center;
          background: #f1f5f9;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          gap: 0.75rem;
          border: 1px solid #e2e8f0;
        }

        .pin-icon { color: var(--accent); }

        .country-select {
          background: none;
          border: none;
          font-weight: 600;
          color: var(--primary);
          cursor: pointer;
          font-size: 0.9rem;
          outline: none;
        }

        .btn-logout {
          background: none;
          border: 1px solid #fecaca;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          color: #dc2626;
          font-weight: 600;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-logout:hover { background: #fef2f2; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--white);
          padding: 1.5rem;
          border-radius: 16px;
          display: flex;
          align-items: center;
          gap: 1.25rem;
          box-shadow: var(--shadow);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: #f8fafc;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-info span { font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
        .stat-info h3 { font-size: 1.5rem; margin: 0.2rem 0; color: var(--primary); }
        .positive { color: #10b981; }
        .negative { color: #ef4444; }

        .dashboard-sections {
          display: grid;
          grid-template-columns: 1fr 340px;
          gap: 2rem;
        }

        .card {
          background: var(--white);
          border-radius: 20px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .card-header {
          padding: 1.5rem;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .country-badge {
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent);
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        .plans-list { min-height: 300px; padding: 1rem; }

        .plan-item {
          display: grid;
          grid-template-columns: 1.5fr 3fr 48px;
          align-items: center;
          padding: 1.5rem;
          border-radius: 12px;
          margin-bottom: 1rem;
          border: 1px solid #f1f5f9;
          transition: all 0.2s;
        }

        .plan-item:hover { border-color: var(--accent); transform: translateX(4px); }

        .plan-main h4 { font-size: 1.1rem; color: var(--primary); margin-bottom: 0.25rem; }
        .plan-main .focus { font-size: 0.85rem; color: #64748b; }

        .title-badge {
          background: #e0f2fe;
          color: #0369a1;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.5px;
        }

        .flex { display: flex; }
        .items-center { align-items: center; }
        .gap-2 { gap: 0.5rem; }

        .plan-details-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          padding: 0 1rem;
        }

        .detail span { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; }
        .detail p { font-size: 0.95rem; font-weight: 600; color: var(--primary); margin-top: 0.2rem; }

        .risk-low { color: #10b981; }
        .risk-moderate { color: #f59e0b; }
        .risk-high { color: #ef4444; }

        .invest-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: none;
          background: #f1f5f9;
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .invest-btn:hover { background: var(--accent); color: var(--white); }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #94a3b8;
        }

        .empty-state svg { margin-bottom: 1.5rem; opacity: 0.3; }

        .profile-details {
          padding: 2.5rem 1.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .profile-avatar {
          width: 90px;
          height: 90px;
          background: linear-gradient(135deg, var(--primary) 0%, #1e293b 100%);
          color: var(--white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          box-shadow: 0 10px 20px -5px rgba(15, 23, 42, 0.3);
        }

        .verification-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #dcfce7;
          color: #166534;
          padding: 0.5rem 1rem;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 700;
          margin: 1.5rem 0;
        }

        .status-badge {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 12px;
        }
        .status-active { background: #dcfce7; color: #166534; }
        .status-completed { background: #f1f5f9; color: #475569; }
        .status-pending { background: #fef3c7; color: #92400e; }

        .growth-indicator {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 6px;
        }
        .growth-indicator.positive { background: #ecfdf5; color: #10b981; }

        .subscription-modal {
          max-width: 500px !important;
        }

        .icon-circle {
          width: 64px;
          height: 64px;
          background: rgba(16, 185, 129, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .subscription-form { padding: 1.5rem; }
        
        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .currency-prefix {
          position: absolute;
          left: 1rem;
          color: #64748b;
          font-weight: 700;
        }

        .subscription-form input {
          width: 100%;
          padding: 0.85rem 1rem 0.85rem 2rem;
          border: 2px solid #e2e8f0;
          border-radius: 10px;
          font-size: 1.1rem;
          font-weight: 700;
          transition: all 0.2s;
        }

        .subscription-form input:focus {
          border-color: var(--accent);
          outline: none;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
        }

        .plan-summary-box {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 1.5rem 0;
          border: 1px solid #e2e8f0;
        }

        .summary-item span { font-size: 0.65rem; color: #64748b; text-transform: uppercase; font-weight: 700; }
        .summary-item p { font-size: 0.9rem; font-weight: 700; color: var(--primary); margin-top: 0.25rem; }

        .form-hint { color: #64748b; font-size: 0.75rem; display: block; margin-top: 0.5rem; }

        .close-notification {
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          opacity: 0.7;
          display: flex;
          align-items: center;
          padding: 4px;
        }

        .close-notification:hover { opacity: 1; }

        .notification-banner {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          font-size: 0.9rem;
          font-weight: 600;
          animation: slideDown 0.3s ease-out;
        }

        .notification-banner.success {
          background: #ecfdf5;
          color: #065f46;
          border-bottom: 1px solid #10b981;
        }

        .notification-banner.error {
          background: #fef2f2;
          color: #991b1b;
          border-bottom: 1px solid #ef4444;
        }

        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        @media (max-width: 1024px) {
          .dashboard-sections { grid-template-columns: 1fr; }
          .stat-card { padding: 1.25rem; }
        }

        @media (max-width: 768px) {
          .header-content { flex-direction: column; gap: 1.5rem; text-align: center; }
          .plan-item { grid-template-columns: 1fr; gap: 1.5rem; text-align: center; }
          .plan-details-grid { padding: 0; }
          .invest-btn { margin: 0 auto; }
        }
      `}</style>
    </div >
  );
};

export default Dashboard;
