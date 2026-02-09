import React from 'react';
import { useLanguage } from '../LanguageContext';

const Hero = ({ onLoginClick }) => {
  const { t } = useLanguage();

  return (
    <header className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1>{t('hero.title')}</h1>
          <p>{t('hero.subtitle')}</p>
          <button onClick={onLoginClick} className="btn btn-hero">Register now</button>
        </div>
      </div>

      {/* Simple SVG background decoration to mimic the mockup's graph lines */}
      <div className="hero-bg-accent">
        <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="none">
          <path d="M0,350 Q250,300 500,320 T1000,200" fill="none" stroke="var(--accent)" strokeWidth="2" opacity="0.3" />
          <path d="M0,300 Q300,250 600,280 T1000,150" fill="none" stroke="var(--accent-gold)" strokeWidth="1" opacity="0.2" />
        </svg>
      </div>

      <style>{`
        .hero {
          padding: 10rem 0 12rem;
          text-align: center;
          background: linear-gradient(135deg, #0A192F 0%, #112240 100%);
          color: var(--white);
          position: relative;
          overflow: hidden;
        }

        .hero-container {
          position: relative;
          z-index: 2;
        }

        .hero h1 {
          color: var(--white);
          font-size: 4rem;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          font-weight: 700;
        }

        .hero p {
          font-size: 1.25rem;
          max-width: 600px;
          margin: 0 auto 3rem;
          opacity: 0.9;
          line-height: 1.5;
        }

        .btn-hero {
          background: var(--accent);
          color: var(--white);
          padding: 1rem 2.5rem;
          font-size: 1.1rem;
          border: 2px solid var(--accent);
        }

        .btn-hero:hover {
          background: transparent;
          color: var(--accent);
        }

        .hero-bg-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 50%;
          z-index: 1;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .hero { padding: 8rem 0; }
          .hero h1 { font-size: 2.5rem; }
          .hero p { font-size: 1.1rem; }
        }
      `}</style>
    </header>
  );
};

export default Hero;
