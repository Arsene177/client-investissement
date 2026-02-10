import React from 'react';
import { Bitcoin, TrendingUp, Building2, Zap, Activity, PieChart, BarChart3, Shield } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const MarketInfo = () => {
  const { t } = useLanguage();

  const targetMarkets = [
    {
      icon: <Bitcoin size={24} />,
      title: t('marketInfo.crypto'),
      markets: t('marketInfo.cryptoMarkets')
    },
    {
      icon: <TrendingUp size={24} />,
      title: t('marketInfo.forex'),
      markets: t('marketInfo.forexMarkets')
    },
    {
      icon: <Building2 size={24} />,
      title: t('marketInfo.stocks'),
      markets: t('marketInfo.stockMarkets')
    },
    {
      icon: <Zap size={24} />,
      title: t('marketInfo.derivatives'),
      markets: t('marketInfo.derivativesMarkets')
    }
  ];

  const analysisTools = [
    {
      icon: <Activity size={24} />,
      title: t('marketInfo.realtime')
    },
    {
      icon: <PieChart size={24} />,
      title: t('marketInfo.technical')
    },
    {
      icon: <BarChart3 size={24} />,
      title: t('marketInfo.ai')
    },
    {
      icon: <Shield size={24} />,
      title: t('marketInfo.risk')
    }
  ];

  return (
    <section className="market-info">
      <div className="container">
        <div className="section-header">
          <h2>{t('marketInfo.title')}</h2>
        </div>

        <div className="market-grid">
          <div className="market-column">
            <h3 className="column-title">{t('marketInfo.targetMarkets')}</h3>
            <div className="market-list">
              {targetMarkets.map((market, index) => (
                <div key={index} className="market-item">
                  <div className="market-icon">{market.icon}</div>
                  <div className="market-content">
                    <h4>{market.title}</h4>
                    <p>{market.markets}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="market-column">
            <h3 className="column-title">{t('marketInfo.analysisTools')}</h3>
            <div className="market-list">
              {analysisTools.map((tool, index) => (
                <div key={index} className="market-item">
                  <div className="market-icon">{tool.icon}</div>
                  <div className="market-content">
                    <h4>{tool.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .market-info {
          padding: 6rem 0;
          background: var(--white);
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-header h2 {
          font-size: 3rem;
          color: var(--primary);
        }

        .market-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
          gap: 3rem;
        }

        .market-column {
          background: var(--bg);
          padding: 3rem 2.5rem;
          border-radius: 20px;
          border-left: 4px solid var(--accent-blue);
        }

        .market-column:nth-child(2) {
          border-left-color: var(--accent-purple);
        }

        .column-title {
          font-size: 1.75rem;
          color: var(--primary);
          margin-bottom: 2rem;
          font-weight: 700;
        }

        .market-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .market-item {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.25rem;
          background: var(--white);
          border-radius: 12px;
          transition: var(--transition);
        }

        .market-item:hover {
          transform: translateX(8px);
          box-shadow: var(--shadow);
        }

        .market-icon {
          color: var(--accent-blue);
          flex-shrink: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 8px;
        }

        .market-column:nth-child(2) .market-icon {
          color: var(--accent-purple);
          background: rgba(168, 85, 247, 0.1);
        }

        .market-content h4 {
          font-size: 1.1rem;
          color: var(--primary);
          margin-bottom: 0.25rem;
          font-weight: 600;
        }

        .market-content p {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        @media (max-width: 768px) {
          .section-header h2 {
            font-size: 2.25rem;
          }

          .market-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .market-column {
            padding: 2rem 1.5rem;
          }

          .column-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default MarketInfo;
