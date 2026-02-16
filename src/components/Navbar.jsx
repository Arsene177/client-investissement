import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, ChevronDown, Menu, X, Globe, User, LogOut } from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useCountry } from '../CountryContext';

const Navbar = ({ user, onLogout, onLoginClick }) => {
  const { lang, t, switchLanguage } = useLanguage();
  const { selectedCountry, countries, changeCountry } = useCountry();
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <a href="/" className="logo">
          <img src="/assets/logo.jpg" alt="FUTUR GROUP INVEST" className="logo-image" />
        </a>

        <div className="nav-actions-desktop">
          {/* Country Selector */}
          {selectedCountry && (
            <div className="country-selector">
              <button
                className="country-btn"
                onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
              >
                <span className="country-flag">{selectedCountry.flag}</span>
                <span className="country-name">{selectedCountry.name}</span>
                <ChevronDown size={14} />
              </button>

              {isCountryDropdownOpen && (
                <div className="country-dropdown">
                  {countries.map(country => (
                    <button
                      key={country.id}
                      className={`country-option ${selectedCountry.id === country.id ? 'active' : ''}`}
                      onClick={() => {
                        changeCountry(country);
                        setIsCountryDropdownOpen(false);
                      }}
                    >
                      <span className="country-flag">{country.flag}</span>
                      <span>{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

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
              <Link to="/#home">{t('nav.home')}</Link>
              <Link to="/#services">{t('nav.services')}</Link>
              <Link to="/analytics">{t('nav.insights')}</Link>
              <Link to="/#about">{t('nav.about')}</Link>
              <Link to="/#contact">{t('nav.contact')}</Link>
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
                    background: linear-gradient(135deg, #0A192F 0%, #1a2942 50%, #2d1b4e 100%);
                    padding: 0.75rem 0;
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                    color: var(--white);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }

                .nav-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .logo {
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    color: var(--white);
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.95);
                    border-radius: 12px;
                    transition: var(--transition);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .logo:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(59, 130, 246, 0.3);
                }

                .logo-image {
                    height: 55px;
                    width: auto;
                    object-fit: contain;
                    display: block;
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

                .country-selector {
                    position: relative;
                    margin-right: 1.5rem;
                }

                .country-btn {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    border-radius: 8px;
                    padding: 0.5rem 0.75rem;
                    color: var(--white);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.85rem;
                    transition: var(--transition);
                }

                .country-btn:hover {
                    background: rgba(255, 255, 255, 0.15);
                }

                .country-flag {
                    font-size: 1.2rem;
                }

                .country-name {
                    font-weight: 500;
                }

                .country-dropdown {
                    position: absolute;
                    top: calc(100% + 0.5rem);
                    left: 0;
                    background: var(--white);
                    border-radius: 12px;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    min-width: 200px;
                    max-height: 400px;
                    overflow-y: auto;
                    z-index: 1000;
                    padding: 0.5rem;
                }

                .country-option {
                    width: 100%;
                    background: none;
                    border: none;
                    padding: 0.75rem 1rem;
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: var(--transition);
                    color: var(--text);
                    font-size: 0.9rem;
                    text-align: left;
                }

                .country-option:hover {
                    background: var(--bg);
                }

                .country-option.active {
                    background: var(--accent-gradient);
                    color: var(--white);
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
