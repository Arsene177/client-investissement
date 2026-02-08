import React from 'react';
import { Compass, Leaf, BarChart3, Target, Calculator, Info } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const getPlansData = (t) => [
  {
    icon: <Compass />,
    name: t('plans.balanced.name'),
    roi: '6-8%',
    minDeposit: '$50,000',
    risk: t('plans.moderate'),
    focus: t('plans.balanced.focus'),
  },
  {
    icon: <Leaf />,
    name: t('plans.sustainable.name'),
    roi: '5-7%',
    minDeposit: '$25,000',
    risk: t('plans.lowModerate'),
    focus: t('plans.sustainable.focus'),
  },
  {
    icon: <BarChart3 />,
    name: t('plans.highYield.name'),
    roi: '10-14%',
    minDeposit: '$100,000',
    risk: t('plans.high'),
    focus: t('plans.highYield.focus'),
  }
];

const InvestmentPlans = () => {
  const { t } = useLanguage();
  const plans = getPlansData(t);

  return (
    <section className="plans" id="plans">
      <div className="container">
        <div className="plans-grid">
          {plans.map((plan, index) => (
            <div className="plan-card" key={index}>
              <div className="plan-card-inner">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-icon-wrapper">
                  <div className="plan-icon-circle">
                    {React.cloneElement(plan.icon, { size: 32 })}
                  </div>
                </div>

                <div className="plan-metrics">
                  <div className="metric">
                    <TrendingUp size={16} />
                    <span>{t('plans.return')}: <strong>{plan.roi}</strong></span>
                  </div>
                  <div className="metric">
                    <Calculator size={16} />
                    <span>{t('plans.min')}: <strong>{plan.minDeposit}</strong></span>
                  </div>
                  <div className="metric">
                    <Info size={16} />
                    <span>{t('plans.risk')}: <strong>{plan.risk}</strong></span>
                  </div>
                  <div className="metric">
                    <Target size={16} />
                    <span>{t('plans.focusLabel')}: <strong>{plan.focus}</strong></span>
                  </div>
                </div>

                <button className="btn btn-plan">{t('plans.learnMore')}</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .plans {
          background: var(--bg);
          padding: 8rem 0;
          margin-top: -5rem;
          position: relative;
          z-index: 10;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .plan-card {
          background: var(--white);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.05);
          transition: var(--transition);
          border: 1px solid #eee;
          display: flex;
          flex-direction: column;
        }

        .plan-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px rgba(0,0,0,0.1);
          border-color: var(--accent);
        }

        .plan-card-inner {
          padding: 2.5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .plan-name {
          font-size: 1.4rem;
          margin-bottom: 2rem;
          min-height: 3.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .plan-icon-wrapper {
          margin-bottom: 2.5rem;
          display: flex;
          justify-content: center;
        }

        .plan-icon-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px solid var(--accent-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--accent-gold);
        }

        .plan-metrics {
          text-align: left;
          margin-bottom: 2.5rem;
          flex-grow: 1;
        }

        .metric {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.8rem;
          font-size: 0.9rem;
          color: #64748b;
        }

        .metric svg {
          color: var(--accent);
          flex-shrink: 0;
        }

        .metric strong {
          color: var(--text);
        }

        .btn-plan {
          width: 100%;
          background: var(--accent);
          color: var(--white);
          border-radius: 6px;
          padding: 0.8rem;
          font-size: 1rem;
          font-weight: 500;
          text-transform: none;
        }

        .btn-plan:hover {
          background: #0d9668;
        }

        @media (max-width: 768px) {
          .plans { padding: 4rem 0; margin-top: 0; }
        }
      `}</style>
    </section>
  );
};

// Simple icon for Target Annual Return if TrendingUp is already used
const TrendingUp = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
);

export default InvestmentPlans;
