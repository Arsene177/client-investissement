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
  BarChart4
} from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const Dashboard = ({ user: initialUser, onLogout }) => {
  const { t } = useLanguage();
  const [user, setUser] = useState(initialUser);
  const [countries, setCountries] = useState([]);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(false);

  useEffect(() => {
    fetchCountries();
    if (user.selected_country_id) {
      fetchPlans(user.selected_country_id);
    }
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.ACTIVE_COUNTRIES);
      const data = await response.json();
      setCountries(data);
    } catch (err) {
      console.error('Error fetching countries:', err);
    }
  };

  const fetchPlans = async (countryId) => {
    setLoadingPlans(true);
    try {
      const response = await fetch(API_ENDPOINTS.PLANS_BY_COUNTRY(countryId));
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
        headers: { 'Content-Type': 'application/json' },
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

  const stats = [
    { label: t('dashboard.portfolio'), value: '$0.00', change: '', icon: <Wallet className="text-accent" />, positive: true },
    { label: t('dashboard.invested'), value: '$0.00', change: '', icon: <TrendingUp className="text-primary" />, positive: true },
    { label: t('dashboard.activePlans'), value: '0', change: '', icon: <PieChart className="text-blue-500" />, positive: true },
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
      </header>

      <main className="container dashboard-main">
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

        <div className="dashboard-sections">
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
                    <button className="invest-btn">
                      <ChevronRight size={18} />
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

          <div className="side-cards">
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
    </div>
  );
};

export default Dashboard;
