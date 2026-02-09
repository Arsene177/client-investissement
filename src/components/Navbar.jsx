import React, { useState } from 'react';
import { TrendingUp, ChevronDown, Menu, X, Globe, User, LogOut } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const Navbar = ({ user, onLogout, onLoginClick }) => {
  const { lang, t, switchLanguage } = useLanguage();
  const [country, setCountry] = useState({ name: 'USA', flag: '🇺🇸' });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <a href="/" className="logo">
          <TrendingUp className="logo-icon" />
          <span>AUREUS</span>
          <small>Wealth Management</small>
        </a>

        <div className="nav-actions-desktop">
          <div className="lang-switcher">
            <Globe size={14} />
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => switchLanguage('en')}
            >EN</button>
            <span className="separator">|</span>
            <button
              className={lang === 'fr' ? 'active' : ''}
              onClick={() => switchLanguage('fr')}
            >FR</button>
          </div>

          {!user && (
            <div className="nav-links">
              <a href="#services">{t('nav.services')}</a>
              <a href="#insights">{t('nav.insights')}</a>
              <a href="#about">{t('nav.about')}</a>
              <a href="#contact">{t('nav.contact')}</a>
            </div>
          )}

          {user ? (
            <div className="user-nav">
              <div className="user-profile">
                <div className="avatar">{user.full_name.charAt(0)}</div>
                <span>{user.full_name}</span>
              </div>
              <button className="btn-logout" onClick={onLogout} title={t('dashboard.logout')}>
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button className="btn btn-primary login-btn" onClick={onLoginClick}>
              <User size={16} />
              {t('nav.login')}
            </button>
          )}
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-lang-switcher">
            <button
              className={lang === 'en' ? 'active' : ''}
              onClick={() => { switchLanguage('en'); setIsMobileMenuOpen(false); }}
            >English</button>
            <button
              className={lang === 'fr' ? 'active' : ''}
              onClick={() => { switchLanguage('fr'); setIsMobileMenuOpen(false); }}
            >Français</button>
          </div>

          {!user ? (
            <>
              <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.services')}</a>
              <a href="#insights" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.insights')}</a>
              <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.about')}</a>
              <a href="#contact" onClick={() => setIsMobileMenuOpen(false)}>{t('nav.contact')}</a>
              <button
                className="btn btn-primary"
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
              >
                {t('nav.login')}
              </button>
            </>
          ) : (
            <div className="mobile-user-actions">
              <p>Logged in as: <strong>{user.full_name}</strong></p>
              <button
                className="btn btn-outline-light"
                style={{ width: '100%', marginTop: '1rem', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => { onLogout(); setIsMobileMenuOpen(false); }}
              >
                {t('dashboard.logout')}
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
                .navbar {
                    background: var(--primary);
                    padding: 1rem 0;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    color: var(--white);
                }

                .nav-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .logo {
                    text-decoration: none;
                    display: flex;
                    flex-direction: column;
                    line-height: 1;
                    color: var(--white);
                }

                .logo-icon {
                    color: var(--accent);
                    margin-bottom: 4px;
                }

                .logo span {
                    font-size: 1.2rem;
                    font-weight: 800;
                    letter-spacing: 1px;
                }

                .logo small {
                    font-size: 0.6rem;
                    text-transform: uppercase;
                    opacity: 0.8;
                    letter-spacing: 0.5px;
                }

                .nav-actions-desktop {
                    display: flex;
                    align-items: center;
                    gap: 2.5rem;
                }

                .lang-switcher {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.8rem;
                    background: rgba(255,255,255,0.1);
                    padding: 4px 10px;
                    border-radius: 4px;
                }

                .lang-switcher button {
                    background: none;
                    border: none;
                    color: var(--white);
                    cursor: pointer;
                    opacity: 0.6;
                    font-weight: 600;
                    padding: 0;
                }

                .lang-switcher button.active {
                    opacity: 1;
                    color: var(--accent);
                }

                .lang-switcher .separator {
                    opacity: 0.3;
                }

                .nav-links {
                    display: flex;
                    gap: 1.5rem;
                }

                .nav-links a {
                    text-decoration: none;
                    color: var(--white);
                    font-size: 0.9rem;
                    font-weight: 500;
                    transition: var(--transition);
                    opacity: 0.8;
                }

                .nav-links a:hover {
                    opacity: 1;
                }

                .user-nav {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                }

                .user-profile {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    font-size: 0.9rem;
                    font-weight: 600;
                }

                .avatar {
                    width: 32px;
                    height: 32px;
                    background: var(--accent);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--white);
                    font-weight: 800;
                }

                .btn-logout {
                    background: none;
                    border: none;
                    color: rgba(255,255,255,0.6);
                    cursor: pointer;
                    transition: var(--transition);
                }

                .btn-logout:hover {
                    color: #ef4444;
                }

                .login-btn {
                    padding: 0.6rem 1.2rem;
                    font-size: 0.9rem;
                    background: var(--accent);
                    border: none;
                    color: var(--white) !important;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .mobile-toggle {
                    display: none;
                    background: none;
                    border: none;
                    color: var(--white);
                    cursor: pointer;
                }

                .mobile-menu {
                    display: flex;
                    flex-direction: column;
                    background: var(--primary);
                    padding: 1.5rem;
                    gap: 1rem;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }

                .mobile-user-actions p {
                    margin-bottom: 0.5rem;
                    font-size: 0.9rem;
                }

                @media (max-width: 992px) {
                    .nav-actions-desktop { display: none; }
                    .mobile-toggle { display: block; }
                }
            `}</style>
    </nav>
  );
};

export default Navbar;
