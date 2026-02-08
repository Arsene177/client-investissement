import React from 'react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-col">
          <h3>{t('footer.contact')}</h3>
          <div className="contact-item">
            <MapPin size={18} />
            <span>123 Wealth Avenue, Financial District, NY 10001</span>
          </div>
          <div className="contact-item">
            <Phone size={18} />
            <span>+1 (888) 555-2500</span>
          </div>
          <div className="contact-item">
            <Mail size={18} />
            <span>info@aureuswealth.com</span>
          </div>
        </div>

        <div className="footer-col">
          <h3>{t('footer.links')}</h3>
          <ul>
            <li><a href="/">{t('footer.home')}</a></li>
            <li><a href="#about">{t('nav.about')}</a></li>
            <li><a href="#plans">{t('footer.links')}</a></li>
            <li><a href="#contact">{t('nav.contact')}</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>{t('footer.resources')}</h3>
          <ul>
            <li><a href="#insights">{t('nav.insights')}</a></li>
            <li><a href="#privacy">{t('footer.privacy')}</a></li>
            <li><a href="#terms">{t('footer.terms')}</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>{t('footer.newsletter')}</h3>
          <p>{t('footer.newsletterDesc')}</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Your email address" />
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', borderRadius: '4px' }}>{t('footer.subscribe')}</button>
          </form>
          <div className="social-links">
            <Facebook size={20} />
            <Twitter size={20} />
            <Instagram size={20} />
            <Linkedin size={20} />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; 2026 Aureus Wealth Management. {t('footer.rights')}</p>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--primary);
          color: var(--white);
          padding: 5rem 0 0;
          border-top: 1px solid rgba(255,255,255,0.1);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 3rem;
          margin-bottom: 4rem;
        }

        .footer-col h3 {
          color: var(--white);
          font-size: 1.2rem;
          margin-bottom: 2rem;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
        }

        .footer-col p {
          font-size: 0.9rem;
          opacity: 0.7;
          margin-bottom: 1.5rem;
        }

        .contact-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .contact-item svg {
          color: var(--accent);
          flex-shrink: 0;
        }

        .footer-col ul {
          list-style: none;
        }

        .footer-col ul li {
          margin-bottom: 0.8rem;
        }

        .footer-col ul a {
          color: var(--white);
          text-decoration: none;
          font-size: 0.9rem;
          opacity: 0.7;
          transition: var(--transition);
        }

        .footer-col ul a:hover {
          opacity: 1;
          color: var(--accent);
          padding-left: 5px;
        }

        .newsletter-form input {
          width: 100%;
          padding: 0.8rem;
          border-radius: 4px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
          color: var(--white);
          font-size: 0.9rem;
        }

        .social-links {
          display: flex;
          gap: 1.5rem;
          margin-top: 2rem;
          opacity: 0.7;
        }

        .social-links svg {
          cursor: pointer;
          transition: var(--transition);
        }

        .social-links svg:hover {
          color: var(--accent);
          opacity: 1;
        }

        .footer-bottom {
          padding: 2rem 0;
          border-top: 1px solid rgba(255,255,255,0.1);
          text-align: center;
          font-size: 0.8rem;
          opacity: 0.5;
        }

        @media (max-width: 768px) {
          .footer-grid { text-align: center; }
          .contact-item { justify-content: center; }
          .social-links { justify-content: center; }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
