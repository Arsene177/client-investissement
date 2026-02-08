import React from 'react';
import { useLanguage } from '../LanguageContext';

const AboutUs = () => {
    const { t } = useLanguage();

    return (
        <section id="about" className="about-section">
            <div className="container about-container">
                <div className="about-image">
                    <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000" alt="Office" />
                    <div className="experience-badge">
                        <span className="years">15+</span>
                        <span className="years-text">Years of Excellence</span>
                    </div>
                </div>
                <div className="about-content">
                    <span className="subtitle-badge">{t('nav.about')}</span>
                    <h2>{t('aboutUs.title')}</h2>
                    <p className="main-desc">{t('aboutUs.subtitle')}</p>

                    <div className="values-grid">
                        <div className="value-item">
                            <h4>{t('aboutUs.mission')}</h4>
                            <p>{t('aboutUs.missionDesc')}</p>
                        </div>
                        <div className="value-item">
                            <h4>{t('aboutUs.vision')}</h4>
                            <p>{t('aboutUs.visionDesc')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <style>{`
        .about-section {
          padding: 8rem 0;
          background: var(--white);
        }
        .about-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .about-image {
          position: relative;
        }
        .about-image img {
          width: 100%;
          border-radius: 20px;
          box-shadow: 20px 20px 60px rgba(0,0,0,0.1);
        }
        .experience-badge {
          position: absolute;
          bottom: -30px;
          right: -30px;
          background: var(--accent);
          color: var(--white);
          padding: 2rem;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);
        }
        .experience-badge .years {
          font-size: 2.5rem;
          font-weight: 800;
          line-height: 1;
        }
        .experience-badge .years-text {
          font-size: 0.8rem;
          text-transform: uppercase;
          font-weight: 600;
          margin-top: 5px;
          text-align: center;
        }
        .subtitle-badge {
          display: inline-block;
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
        }
        .about-content h2 {
          font-size: 2.8rem;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }
        .main-desc {
          font-size: 1.1rem;
          color: #64748b;
          margin-bottom: 2.5rem;
        }
        .values-grid {
          display: grid;
          gap: 2rem;
        }
        .value-item h4 {
          font-size: 1.2rem;
          color: var(--primary);
          margin-bottom: 0.75rem;
          position: relative;
          padding-left: 1.5rem;
        }
        .value-item h4::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 8px;
          height: 8px;
          background: var(--accent);
          border-radius: 50%;
        }
        .value-item p {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.6;
        }
        @media (max-width: 992px) {
          .about-container { grid-template-columns: 1fr; gap: 6rem; }
          .about-image { max-width: 500px; margin: 0 auto; }
        }
      `}</style>
        </section>
    );
};

export default AboutUs;
