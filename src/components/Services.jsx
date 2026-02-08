import React from 'react';
import { Shield, Target, Rocket } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Services = () => {
    const { t } = useLanguage();

    const services = [
        {
            icon: <Shield size={40} />,
            title: t('services.assetManagement.title'),
            desc: t('services.assetManagement.desc')
        },
        {
            icon: <Target size={40} />,
            title: t('services.wealthPlanning.title'),
            desc: t('services.wealthPlanning.desc')
        },
        {
            icon: <Rocket size={40} />,
            title: t('services.retirement.title'),
            desc: t('services.retirement.desc')
        }
    ];

    return (
        <section id="services" className="services-section">
            <div className="container">
                <div className="section-header">
                    <h2>{t('services.title')}</h2>
                    <p>{t('services.subtitle')}</p>
                </div>
                <div className="services-grid">
                    {services.map((s, i) => (
                        <div key={i} className="service-card">
                            <div className="service-icon">{s.icon}</div>
                            <h3>{s.title}</h3>
                            <p>{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
        .services-section {
          padding: 8rem 0;
          background: var(--white);
        }
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }
        .section-header h2 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .section-header p {
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
        }
        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .service-card {
          padding: 3rem 2rem;
          border-radius: 12px;
          border: 1px solid #eee;
          text-align: center;
          transition: var(--transition);
        }
        .service-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow);
          border-color: var(--accent);
        }
        .service-icon {
          color: var(--accent);
          margin-bottom: 1.5rem;
        }
        .service-card h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        .service-card p {
          color: #64748b;
          font-size: 0.95rem;
        }
      `}</style>
        </section>
    );
};

export default Services;
