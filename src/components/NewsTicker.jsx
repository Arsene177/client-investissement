import React from 'react';
import { TrendingUp, Globe2 } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const NewsTicker = () => {
    const { t } = useLanguage();

    const newsItems = [
        { id: 1, key: 'news1' },
        { id: 2, key: 'news2' },
        { id: 3, key: 'news3' },
        { id: 4, key: 'news4' },
        { id: 5, key: 'news5' },
        { id: 6, key: 'news6' }
    ];

    return (
        <div className="news-ticker-wrapper">
            <div className="ticker-label">
                <Globe2 size={16} />
                <span>{t('newsTicker.label')}</span>
            </div>
            <div className="ticker-content">
                <div className="ticker-scroll">
                    {/* Duplicate items for seamless loop */}
                    {[...newsItems, ...newsItems].map((item, index) => (
                        <div key={`${item.id}-${index}`} className="ticker-item">
                            <TrendingUp size={14} className="ticker-icon" />
                            <span>{t(`newsTicker.${item.key}`)}</span>
                        </div>
                    ))}
                </div>
            </div>

            <style>{`
        .news-ticker-wrapper {
          background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
          border-bottom: 2px solid rgba(59, 130, 246, 0.3);
          display: flex;
          align-items: center;
          overflow: hidden;
          position: relative;
        }

        .ticker-label {
          background: var(--accent-gradient);
          color: var(--white);
          padding: 0.75rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 700;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
          z-index: 1;
        }

        .ticker-content {
          flex: 1;
          overflow: hidden;
          position: relative;
        }

        .ticker-scroll {
          display: flex;
          gap: 3rem;
          animation: scroll 60s linear infinite;
          padding: 0.75rem 0;
        }

        .ticker-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--white);
          font-size: 0.9rem;
          white-space: nowrap;
          opacity: 0.95;
        }

        .ticker-icon {
          color: #10b981;
          flex-shrink: 0;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .ticker-scroll:hover {
          animation-play-state: paused;
        }

        @media (max-width: 768px) {
          .ticker-label {
            padding: 0.6rem 1rem;
            font-size: 0.75rem;
          }

          .ticker-label span {
            display: none;
          }

          .ticker-item {
            font-size: 0.85rem;
          }
        }
      `}</style>
        </div>
    );
};

export default NewsTicker;
