import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Contact = () => {
    const { t } = useLanguage();

    return (
        <section id="contact" className="contact-section">
            <div className="container contact-container">
                <div className="contact-info">
                    <span className="subtitle-badge">{t('nav.contact')}</span>
                    <h2>{t('contact.title')}</h2>
                    <p>{t('contact.subtitle')}</p>

                    <div className="info-items">
                        <div className="info-item">
                            <div className="info-icon"><MapPin size={24} /></div>
                            <div>
                                <h4>Location</h4>
                                <p>123 Wealth Avenue, Financial District, NY 10001</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon"><Phone size={24} /></div>
                            <div>
                                <h4>Phone</h4>
                                <p>+1 (888) 555-2500</p>
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-icon"><Mail size={24} /></div>
                            <div>
                                <h4>Email</h4>
                                <p>info@aureuswealth.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="contact-form-wrapper">
                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-group">
                            <label>{t('contact.name')}</label>
                            <input type="text" placeholder={t('contact.placeholderName')} />
                        </div>
                        <div className="form-group">
                            <label>{t('contact.email')}</label>
                            <input type="email" placeholder={t('contact.placeholderEmail')} />
                        </div>
                        <div className="form-group">
                            <label>{t('contact.message')}</label>
                            <textarea rows="5" placeholder={t('contact.placeholderMessage')}></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary submit-btn">
                            {t('contact.send')} <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
            <style>{`
        .contact-section {
          padding: 8rem 0;
          background: var(--primary);
          color: var(--white);
        }
        .contact-container {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 5rem;
          align-items: flex-start;
        }
        .contact-info h2 {
          color: var(--white);
          font-size: 2.8rem;
          margin-bottom: 1.5rem;
        }
        .contact-info p {
          font-size: 1.1rem;
          opacity: 0.8;
          margin-bottom: 3rem;
        }
        .info-items {
          display: grid;
          gap: 2rem;
        }
        .info-item {
          display: flex;
          gap: 1.5rem;
          align-items: center;
        }
        .info-icon {
          width: 50px;
          height: 50px;
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .info-item h4 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: var(--white);
          font-family: 'Inter', sans-serif;
        }
        .info-item p {
          margin-bottom: 0;
          font-size: 0.95rem;
          opacity: 0.7;
        }
        .contact-form-wrapper {
          background: var(--white);
          padding: 3rem;
          border-radius: 20px;
          color: var(--text);
        }
        .contact-form {
          display: grid;
          gap: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.9rem;
          font-weight: 600;
          color: #1e293b;
        }
        .form-group input, .form-group textarea {
          padding: 0.8rem 1rem;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          font-family: inherit;
          font-size: 1rem;
          transition: var(--transition);
        }
        .form-group input:focus, .form-group textarea:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }
        .submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 1rem;
        }
        @media (max-width: 992px) {
          .contact-container { grid-template-columns: 1fr; gap: 4rem; }
          .contact-form-wrapper { padding: 2rem; }
        }
      `}</style>
        </section>
    );
};

export default Contact;
