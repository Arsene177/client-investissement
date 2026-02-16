import React from 'react';
import { PieChart, TrendingUp, BarChart2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Services = () => {
  const { t } = useLanguage();

  const services = [
    {
      icon: <PieChart size={36} />,
      title: t('services.portfolio.title'),
      description: t('services.portfolio.desc')
    },
    {
      icon: <TrendingUp size={36} />,
      title: t('services.advisory.title'),
      description: t('services.advisory.desc')
    },
    {
      icon: <BarChart2 size={36} />,
      title: t('services.analysis.title'),
      description: t('services.analysis.desc')
    }
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <h2 className="section-title">{t('services.title')}</h2>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .services {
          padding: 6rem 0;
          background: var(--white);
        }

        .section-title {
          text-align: center;
          font-size: 3rem;
          color: var(--primary);
          margin-bottom: 4rem;
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2.5rem;
        }

        .service-card {
          background: var(--white);
          padding: 3rem 2rem;
          border-radius: 16px;
          text-align: center;
          box-shadow: var(--shadow);
          transition: var(--transition);
          border: 1px solid #E2E8F0;
        }

        .service-card:hover {
          transform: translateY(-8px);
          box-shadow: var(--shadow-lg);
          border-color: var(--accent-blue);
        }

        .service-icon {
          color: var(--accent-blue);
          margin-bottom: 1.5rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .service-card h3 {
          font-size: 1.5rem;
          color: var(--primary);
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .service-card p {
          color: var(--text-light);
          line-height: 1.6;
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .section-title {
            font-size: 2.25rem;
          }

          .services-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .service-card {
            padding: 2.5rem 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default Services;
