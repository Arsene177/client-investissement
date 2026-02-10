import React from 'react';
import { BarChart3, Shield, Users } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const WhyChooseUs = () => {
  const { t } = useLanguage();

  const pillars = [
    {
      icon: <BarChart3 size={40} />,
      title: t('whyChooseUs.precision.title'),
      description: t('whyChooseUs.precision.desc'),
      gradient: 'linear-gradient(135deg, #60A5FA 0%, #3B82F6 100%)',
      shadowColor: 'rgba(59, 130, 246, 0.3)'
    },
    {
      icon: <Shield size={40} />,
      title: t('whyChooseUs.discipline.title'),
      description: t('whyChooseUs.discipline.desc'),
      gradient: 'linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%)',
      shadowColor: 'rgba(139, 92, 246, 0.3)'
    },
    {
      icon: <Users size={40} />,
      title: t('whyChooseUs.profit.title'),
      description: t('whyChooseUs.profit.desc'),
      gradient: 'linear-gradient(135deg, #C084FC 0%, #A855F7 100%)',
      shadowColor: 'rgba(168, 85, 247, 0.3)'
    }
  ];

  return (
    <section className="why-choose-us">
      <div className="container">
        <div className="section-header">
          <h2>{t('whyChooseUs.title')}</h2>
          <p className="intro-text">{t('whyChooseUs.intro')}</p>
        </div>

        <div className="pillars-grid">
          {pillars.map((pillar, index) => (
            <div key={index} className="pillar-card" style={{ '--shadow-color': pillar.shadowColor }}>
              <div className="pillar-gradient" style={{ background: pillar.gradient }}></div>
              <div className="pillar-content">
                <div className="pillar-icon-wrapper">
                  <div className="pillar-icon">{pillar.icon}</div>
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .why-choose-us {
          padding: 6rem 0;
          background: linear-gradient(180deg, var(--bg) 0%, #EEF2FF 100%);
        }

        .section-header {
          text-align: center;
          max-width: 800px;
          margin: 0 auto 4rem;
        }

        .section-header h2 {
          font-size: 3rem;
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        .intro-text {
          font-size: 1.15rem;
          color: var(--text-light);
          line-height: 1.7;
        }

        .pillars-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.5rem;
        }

        .pillar-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          transition: var(--transition);
        }

        .pillar-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px var(--shadow-color);
        }

        .pillar-gradient {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          opacity: 1;
        }

        .pillar-content {
          position: relative;
          padding: 3rem 2.5rem;
          color: var(--white);
          z-index: 1;
        }

        .pillar-icon-wrapper {
          margin-bottom: 1.5rem;
        }

        .pillar-icon {
          width: 70px;
          height: 70px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .pillar-card h3 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: var(--white);
        }

        .pillar-card p {
          font-size: 1rem;
          line-height: 1.6;
          opacity: 0.95;
          color: var(--white);
        }

        @media (max-width: 768px) {
          .section-header h2 {
            font-size: 2.25rem;
          }

          .pillars-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .pillar-content {
            padding: 2.5rem 2rem;
          }

          .pillar-card h3 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;
