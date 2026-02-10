import React from 'react';
import { useLanguage } from '../LanguageContext';

const Hero = ({ onLoginClick }) => {
  const { t } = useLanguage();

  return (
    <header className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">{t('hero.title')}</span>
          </h1>
          <p className="hero-subtitle">
            {t('hero.subtitle')}
          </p>
          <button onClick={onLoginClick} className="btn btn-hero">{t('hero.cta')}</button>
          <div className="guarantee-badge">
            <span>✓ {t('hero.guarantee')}</span>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="hero-bg-accent">
        <svg width="100%" height="100%" viewBox="0 0 1000 400" preserveAspectRatio="none">
          <path d="M0,350 Q250,300 500,320 T1000,200" fill="none" stroke="url(#gradient1)" strokeWidth="2" opacity="0.4" />
          <path d="M0,300 Q300,250 600,280 T1000,150" fill="none" stroke="url(#gradient2)" strokeWidth="1.5" opacity="0.3" />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" />
              <stop offset="100%" stopColor="#A855F7" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#60A5FA" />
              <stop offset="100%" stopColor="#C084FC" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <style>{`
        .hero {
          padding: 10rem 0 12rem;
          text-align: center;
          background: linear-gradient(135deg, #0A192F 0%, #1a2942 50%, #2d1b4e 100%);
          color: var(--white);
          position: relative;
          overflow: hidden;
        }

        .hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 70% 50%, rgba(168, 85, 247, 0.15) 0%, transparent 50%);
          pointer-events: none;
        }

        .hero-container {
          position: relative;
          z-index: 2;
        }

        .hero-title {
          margin-bottom: 1.5rem;
        }

        .gradient-text {
          font-size: 4rem;
          line-height: 1.1;
          font-weight: 700;
          background: linear-gradient(135deg, #3B82F6 0%, #A855F7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
        }

        .hero-subtitle {
          font-size: 1.25rem;
          max-width: 700px;
          margin: 0 auto 2.5rem;
          opacity: 0.95;
          line-height: 1.6;
          color: #E2E8F0;
        }

        .hero-subtitle strong {
          color: var(--white);
          font-weight: 700;
        }

        .btn-hero {
          background: var(--accent-gradient);
          color: var(--white);
          padding: 1.1rem 3rem;
          font-size: 1.15rem;
          border: 2px solid transparent;
          box-shadow: 0 10px 30px rgba(168, 85, 247, 0.3);
          margin-bottom: 1.5rem;
        }

        .btn-hero:hover {
          background: transparent;
          border: 2px solid var(--accent-purple);
          color: var(--accent-purple);
          transform: translateY(-3px);
          box-shadow: 0 15px 40px rgba(168, 85, 247, 0.4);
        }

        .guarantee-badge {
          display: inline-block;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 0.6rem 1.5rem;
          border-radius: 50px;
          font-size: 0.9rem;
          color: #D1D5DB;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .guarantee-badge span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
          .hero { 
            padding: 8rem 0 10rem; 
          }
          
          .gradient-text { 
            font-size: 2.5rem; 
          }
          
          .hero-subtitle { 
            font-size: 1.1rem;
            padding: 0 1rem;
          }

          .btn-hero {
            padding: 1rem 2rem;
            font-size: 1rem;
          }
        }
      `}</style>
    </header>
  );
};

export default Hero;
