import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';
import { useCountry } from '../CountryContext';
import { X, Lock, User, AlertCircle, CheckCircle, Mail, UserPlus, Phone, Globe } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { countries } = useCountry();
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [countryId, setCountryId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setFullName('');
    setPhone('');
    setCountryId('');
    setError('');
    setSuccess(false);
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isRegister ? API_ENDPOINTS.REGISTER : API_ENDPOINTS.LOGIN;
    const body = isRegister
      ? { username, email, password, full_name: fullName, phone, country_id: countryId }
      : { username, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        if (isRegister) {
          setTimeout(() => {
            setIsRegister(false);
            setSuccess(false);
          }, 2000);
        } else {
          localStorage.setItem('user', JSON.stringify(data.user));
          if (onLoginSuccess) onLoginSuccess(data.user);
          setTimeout(() => {
            onClose();
            if (data.user.role === 'admin') {
              navigate('/admin');
            } else {
              navigate('/dashboard');
            }
          }, 1500);
        }
      } else {
        if (data.message === 'User not found') setError(t('loginModal.errorUser'));
        else if (data.message === 'Invalid credentials') setError(t('loginModal.errorPass'));
        else if (data.message === 'Email already exists') setError(t('loginModal.errorEmail'));
        else if (data.message === 'Username already exists') setError(t('loginModal.errorUsername'));
        else setError(data.message);
      }
    } catch (err) {
      setError(t('loginModal.errorServer'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={() => { onClose(); resetForm(); }}><X size={24} /></button>

        <div className="modal-header">
          <div className="lock-icon">{isRegister ? <UserPlus size={32} /> : <Lock size={32} />}</div>
          <h2>{isRegister ? t('loginModal.registerTitle') : t('loginModal.title')}</h2>
        </div>

        {error && <div className="error-msg"><AlertCircle size={18} /> {error}</div>}
        {success && <div className="success-msg"><CheckCircle size={18} /> {isRegister ? "Registration Successful! Please login." : t('loginModal.success')}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <>
              <div className="form-group">
                <label>{t('loginModal.fullName')}</label>
                <div className="input-wrapper">
                  <User size={18} />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('loginModal.email')}</label>
                <div className="input-wrapper">
                  <Mail size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('loginModal.phone')}</label>
                <div className="input-wrapper">
                  <Phone size={18} />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6 XX XX XX XX"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>{t('loginModal.country')}</label>
                <div className="input-wrapper">
                  <Globe size={18} />
                  <select
                    value={countryId}
                    onChange={(e) => setCountryId(e.target.value)}
                    required
                    style={{ paddingLeft: '2.8rem' }}
                  >
                    <option value="">{t('loginModal.selectCountry')}</option>
                    {countries.map(country => (
                      <option key={country.id} value={country.id}>
                        {country.flag} {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div className="form-group">
            <label>{t('loginModal.username')}</label>
            <div className="input-wrapper">
              <User size={18} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="client_demo"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>{t('loginModal.password')}</label>
            <div className="input-wrapper">
              <Lock size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="login-submit-btn" disabled={loading || success}>
            {loading ? '...' : (isRegister ? t('loginModal.registerBtn') : t('loginModal.btn'))}
          </button>
        </form>

        <div className="modal-footer">
          <p>
            {isRegister ? t('loginModal.haveAccount') : t('loginModal.noAccount')}{' '}
            <button className="toggle-mode-btn" onClick={toggleMode}>
              {isRegister ? t('loginModal.loginLink') : t('loginModal.signupLink')}
            </button>
          </p>
        </div>
      </div>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.3s ease;
        }

        .modal-content {
          background: var(--white);
          width: 100%;
          max-width: 440px;
          padding: 2.5rem;
          border-radius: 20px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          max-height: 90vh;
          overflow-y: auto;
        }

        .close-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          transition: var(--transition);
        }

        .close-btn:hover {
          color: var(--text);
          transform: rotate(90deg);
        }

        .modal-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .lock-icon {
          width: 56px;
          height: 56px;
          background: rgba(16, 185, 129, 0.1);
          color: var(--accent);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.25rem;
        }

        .modal-header h2 {
          font-size: 1.5rem;
          color: var(--primary);
        }

        .login-form {
          display: grid;
          gap: 1.25rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #64748b;
          margin-bottom: 0.5rem;
          display: block;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-wrapper svg {
          position: absolute;
          left: 1rem;
          color: #94a3b8;
        }

        .input-wrapper input {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.8rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: var(--transition);
        }

        .input-wrapper input:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          outline: none;
        }

        .input-wrapper select {
          width: 100%;
          padding: 0.75rem 1rem 0.75rem 2.8rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.95rem;
          transition: var(--transition);
          background: var(--white);
          cursor: pointer;
        }

        .input-wrapper select:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
          outline: none;
        }

        .login-submit-btn {
          background: var(--accent);
          color: var(--white);
          border: none;
          padding: 0.85rem;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition);
          margin-top: 0.5rem;
        }

        .login-submit-btn:hover:not(:disabled) {
          background: #0d9668;
          transform: translateY(-2px);
        }

        .login-submit-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-footer {
          margin-top: 2rem;
          text-align: center;
          font-size: 0.9rem;
          color: #64748b;
          border-top: 1px solid #f1f5f9;
          padding-top: 1.5rem;
        }

        .toggle-mode-btn {
          background: none;
          border: none;
          color: var(--accent);
          font-weight: 700;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
        }

        .error-msg {
          background: #fee2e2;
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        .success-msg {
          background: #ecfdf5;
          color: #059669;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.25rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default LoginModal;
