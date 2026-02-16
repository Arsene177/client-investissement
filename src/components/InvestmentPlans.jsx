import React, { useState, useEffect } from 'react';
import { Flag, DollarSign, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useCountry } from '../CountryContext';
import { API_ENDPOINTS } from '../config/api';

const InvestmentPlans = () => {
  const { t, language } = useLanguage();
  const { selectedCountry } = useCountry();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCountry) {
      fetchPlans();
    }
  }, [selectedCountry]);

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_ENDPOINTS.PLANS_BY_COUNTRY(selectedCountry.id));
      const data = await response.json();
      // Filter active plans and sort by display_order
      const activePlans = data.filter(p => p.is_active).sort((a, b) => a.display_order - b.display_order);
      setPlans(activePlans);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const getGradientForPlan = (planName) => {
    if (planName.toLowerCase().includes('bronze')) return 'linear-gradient(135deg, #CD7F32 0%, #B87333 100%)';
    if (planName.toLowerCase().includes('silver')) return 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)';
    if (planName.toLowerCase().includes('gold')) return 'linear-gradient(135deg, #FFD700 0%, #FFC700 100%)';
    return 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)'; // Default gradient
  };

  const getBorderColor = (planName) => {
    if (planName.toLowerCase().includes('bronze')) return '#CD7F32';
    if (planName.toLowerCase().includes('silver')) return '#C0C0C0';
    if (planName.toLowerCase().includes('gold')) return '#FFD700';
    return '#3B82F6'; // Default color
  };

  if (!loading && plans.length === 0) {
    return (
      <section className="investment-plans">
        <div className="container">
          <div className="section-header">
            <h2>{t('investmentPlans.title')}</h2>
            <p>{t('investmentPlans.subtitle')}</p>
          </div>
          <div className="loading-state">
            {t('investmentPlans.noPlans') || 'No investment plans available at the moment.'}
          </div>
        </div>
      </section>
    );
  }

  const displayPlans = plans;

  return (
    <section className="investment-plans">
      <div className="container">
        <div className="section-header">
          <h2>{t('investmentPlans.title')}</h2>
          <p>{t('investmentPlans.subtitle')}</p>
          {selectedCountry && (
            <p className="country-indicator">
              {selectedCountry.flag} Plans for {selectedCountry.name}
            </p>
          )}
        </div>

        {loading ? (
          <div className="loading-state">Loading investment plans...</div>
        ) : (
          <div className="plans-grid">
            {displayPlans.map((plan, index) => {
              const gradient = plan.gradient || getGradientForPlan(plan.name);
              const borderColor = plan.borderColor || getBorderColor(plan.name);
              const description = language === 'fr' ? (plan.description_fr || plan.description_en) : (plan.description_en || plan.description_fr);

              return (
                <div key={index} className="plan-card" style={{ '--border-color': borderColor }}>
                  <div className="plan-badge" style={{ background: gradient }}>
                    {plan.badge}
                  </div>

                  <div className="plan-header">
                    <Flag size={28} style={{ color: borderColor }} />
                    <h3>{plan.name}</h3>
                  </div>

                  <p className="plan-description">{description}</p>

                  <div className="plan-stats">
                    <div className="stat-item">
                      <DollarSign size={18} />
                      <div>
                        <span className="stat-label">{t('investmentPlans.entry')}</span>
                        <span className="stat-value">{plan.min_deposit}</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="percentage-icon">{plan.roi}</div>
                      <div>
                        <span className="stat-label">{t('investmentPlans.roi')}</span>
                        <span className="stat-value">{plan.roi}</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <Clock size={18} />
                      <div>
                        <span className="stat-label">{t('investmentPlans.settlement')}</span>
                        <span className="stat-value">{plan.settlement_time}</span>
                      </div>
                    </div>
                  </div>

                  <button className="btn btn-plan">
                    {t('investmentPlans.startTrading')} <ArrowRight size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div className="cta-container">
          <button className="btn btn-subscribe">{t('investmentPlans.subscribe')}</button>
        </div>
      </div>

      <style>{`
        .investment-plans {
          padding: 6rem 0;
          background: linear-gradient(180deg, #EEF2FF 0%, var(--bg) 100%);
        }

        .section-header {
          text-align: center;
          max-width: 700px;
          margin: 0 auto 4rem;
        }

        .section-header h2 {
          font-size: 3rem;
          color: var(--primary);
          margin-bottom: 1rem;
        }

        .section-header p {
          font-size: 1.15rem;
          color: var(--text-light);
        }

        .country-indicator {
          margin-top: 1rem;
          font-size: 1rem;
          color: var(--accent-blue);
          font-weight: 600;
        }

        .loading-state {
          text-align: center;
          padding: 3rem;
          font-size: 1.1rem;
          color: var(--text-light);
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
          margin-bottom: 3rem;
        }

        .plan-card {
          background: var(--white);
          border-radius: 20px;
          padding: 2.5rem 2rem;
          box-shadow: var(--shadow);
          transition: var(--transition);
          border-left: 4px solid var(--border-color);
          position: relative;
        }

        .plan-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-lg);
        }

        .plan-badge {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--white);
          letter-spacing: 0.5px;
        }

        .plan-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .plan-header h3 {
          font-size: 1.75rem;
          color: var(--primary);
          margin: 0;
        }

        .plan-description {
          color: var(--text-light);
          line-height: 1.6;
          margin-bottom: 2rem;
          font-size: 0.95rem;
        }

        .plan-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: var(--bg);
          border-radius: 12px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          text-align: center;
        }

        .stat-item svg {
          color: var(--accent-blue);
        }

        .percentage-icon {
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-purple);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-light);
          display: block;
        }

        .stat-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--primary);
          display: block;
        }

        .btn-plan {
          width: 100%;
          background: var(--accent-gradient);
          color: var(--white);
          padding: 1rem;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-weight: 600;
          border: 2px solid transparent;
        }

        .btn-plan:hover {
          background: transparent;
          border-color: var(--accent-purple);
          color: var(--accent-purple);
        }

        .cta-container {
          text-align: center;
          margin-top: 3rem;
        }

        .btn-subscribe {
          background: var(--primary);
          color: var(--white);
          padding: 1.2rem 3rem;
          font-size: 1.1rem;
          border-radius: 50px;
          font-weight: 600;
          border: 2px solid var(--primary);
        }

        .btn-subscribe:hover {
          background: transparent;
          color: var(--primary);
          border-color: var(--primary);
        }

        @media (max-width: 768px) {
          .section-header h2 {
            font-size: 2.25rem;
          }

          .plans-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .plan-stats {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .stat-item {
            flex-direction: row;
            justify-content: flex-start;
            text-align: left;
          }
        }
      `}</style>
    </section>
  );
};

export default InvestmentPlans;
