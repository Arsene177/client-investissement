import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Insights = () => {
    const { t } = useLanguage();

    const posts = [
        {
            title: t('insights.article1.title'),
            desc: t('insights.article1.desc'),
            date: 'March 2026',
            image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800'
        },
        {
            title: t('insights.article2.title'),
            desc: t('insights.article2.desc'),
            date: 'February 2026',
            image: 'https://images.unsplash.com/photo-1473186578172-c141e6798ee4?auto=format&fit=crop&q=80&w=800'
        }
    ];

    return (
        <section id="insights" className="insights-section">
            <div className="container">
                <div className="section-header">
                    <h2>{t('insights.title')}</h2>
                    <p>{t('insights.subtitle')}</p>
                </div>
                <div className="insights-grid">
                    {posts.map((post, i) => (
                        <div key={i} className="insight-card">
                            <div className="insight-image" style={{ backgroundImage: `url(${post.image})` }}></div>
                            <div className="insight-content">
                                <div className="insight-meta">
                                    <Calendar size={14} />
                                    <span>{post.date}</span>
                                </div>
                                <h3>{post.title}</h3>
                                <p>{post.desc}</p>
                                <a href="#" className="insight-link">
                                    {t('insights.readMore')} <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <style>{`
        .insights-section {
          padding: 8rem 0;
          background: var(--bg);
        }
        .insights-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2.5rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .insight-card {
          background: var(--white);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transition: var(--transition);
        }
        .insight-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        .insight-image {
          height: 200px;
          background-size: cover;
          background-position: center;
        }
        .insight-content {
          padding: 2rem;
        }
        .insight-meta {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: #94a3b8;
          margin-bottom: 1rem;
        }
        .insight-content h3 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          line-height: 1.4;
        }
        .insight-content p {
          color: #64748b;
          font-size: 0.95rem;
          margin-bottom: 1.5rem;
          line-height: 1.6;
        }
        .insight-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          text-decoration: none;
          color: var(--accent);
          font-weight: 600;
          font-size: 0.9rem;
        }
        .insight-link:hover {
          gap: 0.75rem;
        }
      `}</style>
        </section>
    );
};

export default Insights;
