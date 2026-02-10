import React from 'react';
import { TrendingUp, Clock, DollarSign, Award } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Stats = () => {
  const { t } = useLanguage();

  const stats = [
    {
      icon: <TrendingUp size={32} />,
      value: '20 – 35%',
      label: t('stats.dailyReturn'),
      color: 'blue'
    },
    {
      icon: <Clock size={32} />,
      value: '24h',
      label: t('stats.withdrawalTime'),
      color: 'purple'
    },
    {
      icon: <DollarSign size={32} />,
      value: '50 USD',
      label: t('stats.minInvestment'),
      color: 'blue'
    },
    {
      icon: <Award size={32} />,
      value: '98.97%',
      label: t('stats.satisfaction'),
      color: 'purple'
    }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className={`stat-card stat-${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-section {
          padding: 4rem 0;
          background: var(--bg);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
        }

        .stat-card {
          background: var(--white);
          padding: 2.5rem 2rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: var(--shadow);
          transition: var(--transition);
          border-top: 4px solid transparent;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
        }

        .stat-card.stat-blue {
          border-top-color: var(--accent-blue);
        }

        .stat-card.stat-blue .stat-icon {
          color: var(--accent-blue);
        }

        .stat-card.stat-purple {
          border-top-color: var(--accent-purple);
        }

        .stat-card.stat-purple .stat-icon {
          color: var(--accent-purple);
        }

        .stat-icon {
          margin-bottom: 1rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--primary);
          margin-bottom: 0.5rem;
          font-family: 'Merriweather', serif;
        }

        .stat-label {
          font-size: 0.95rem;
          color: var(--text-light);
          line-height: 1.4;
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1.5rem;
          }

          .stat-card {
            padding: 2rem 1.5rem;
          }

          .stat-value {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Stats;
