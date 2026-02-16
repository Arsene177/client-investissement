import React, { useState, useEffect } from 'react';
import { Users, TrendingUp, DollarSign } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const AnalyticsPage = () => {
  const { t } = useLanguage();

  // Initial data
  const [stats, setStats] = useState({
    totalInvestments: 5328,
    totalInvestmentAmount: 4640763.6,
    totalGains: 9264426.84
  });

  const initialInvestments = [
    { user: '*******35', hours: 'x1.34', amount: 34261.09, gains: 45909.85 },
    { user: '*******61', hours: 'x1.56', amount: 23297.55, gains: 36344.16 },
    { user: '*******61', hours: 'x1.98', amount: 22840.73, gains: 45224.63 },
    { user: '*******25', hours: 'x5.11', amount: 14797.31, gains: 75614.22 },
    { user: '*******35', hours: 'x1.5', amount: 13054.99, gains: 19582.47 },
    { user: '*******51', hours: 'x0', amount: 11371.68, gains: 0 },
    { user: '*******25', hours: 'x0', amount: 5598.98, gains: 0 },
    { user: '*******69', hours: 'x0', amount: 5492, gains: 0 }
  ];

  const [investments, setInvestments] = useState(initialInvestments);

  // Generate random user ID
  const generateUserId = () => {
    const digits = Math.floor(Math.random() * 100);
    return `*******${digits}`;
  };

  // Generate random multiplier
  const generateMultiplier = () => {
    const multipliers = ['x0', 'x1.2', 'x1.34', 'x1.5', 'x1.56', 'x1.98', 'x2.5', 'x3.0', 'x5.11'];
    return multipliers[Math.floor(Math.random() * multipliers.length)];
  };

  // Update stats periodically
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setStats(prev => ({
        totalInvestments: prev.totalInvestments + Math.floor(Math.random() * 3),
        totalInvestmentAmount: prev.totalInvestmentAmount + (Math.random() * 50000),
        totalGains: prev.totalGains + (Math.random() * 100000)
      }));
    }, 3000); // Update every 3 seconds

    return () => clearInterval(statsInterval);
  }, []);

  // Add new investment periodically
  useEffect(() => {
    const investmentInterval = setInterval(() => {
      const newAmount = Math.random() * 50000 + 5000;
      const multiplier = generateMultiplier();
      const multiplierValue = parseFloat(multiplier.replace('x', '')) || 0;
      const newGains = multiplierValue > 0 ? newAmount * multiplierValue : 0;

      const newInvestment = {
        user: generateUserId(),
        hours: multiplier,
        amount: parseFloat(newAmount.toFixed(2)),
        gains: parseFloat(newGains.toFixed(2))
      };

      setInvestments(prev => {
        const updated = [newInvestment, ...prev];
        return updated.slice(0, 8); // Keep only last 8 investments
      });
    }, 5000); // Add new investment every 5 seconds

    return () => clearInterval(investmentInterval);
  }, []);

  return (
    <div className="analytics-page">
      <div className="container">
        <div className="page-header">
          <h1>{t('analytics.title')}</h1>
          <p>{t('analytics.subtitle')}</p>
          <div className="live-indicator">
            <span className="live-dot"></span>
            <span className="live-text">LIVE</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card orange">
            <div className="stat-icon">
              <Users size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('analytics.totalInvestments')}</span>
              <span className="stat-value">{stats.totalInvestments.toLocaleString()}</span>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">
              <DollarSign size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('analytics.totalAmount')}</span>
              <span className="stat-value">{stats.totalInvestmentAmount.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} XAF</span>
            </div>
          </div>

          <div className="stat-card orange">
            <div className="stat-icon">
              <TrendingUp size={28} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{t('analytics.totalGains')}</span>
              <span className="stat-value">{stats.totalGains.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} XAF</span>
            </div>
          </div>
        </div>

        {/* Investments Table */}
        <div className="investments-table-wrapper">
          <table className="investments-table">
            <thead>
              <tr>
                <th>{t('analytics.username')}</th>
                <th>{t('analytics.hours')}</th>
                <th>{t('analytics.investmentAmount')}</th>
                <th>{t('analytics.gainsReceived')}</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((inv, index) => (
                <tr key={index} className="fade-in">
                  <td className="username">{inv.user}</td>
                  <td className="hours">{inv.hours}</td>
                  <td className="amount">{inv.amount.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} XAF</td>
                  <td className="gains">{inv.gains.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} XAF</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .analytics-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%);
          padding: 8rem 2rem 4rem;
        }

        .page-header {
          text-align: center;
          margin-bottom: 4rem;
          position: relative;
        }

        .page-header h1 {
          font-size: 3rem;
          color: var(--white);
          margin-bottom: 1rem;
          background: var(--accent-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .page-header p {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .live-indicator {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(239, 68, 68, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 50px;
          margin-top: 1rem;
        }

        .live-dot {
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .live-text {
          color: #ef4444;
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 1px;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }

        .stats-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .stat-card {
          background: linear-gradient(135deg, #ea580c 0%, #dc2626 100%);
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          box-shadow: 0 10px 40px rgba(234, 88, 12, 0.3);
          transition: var(--transition);
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 50px rgba(234, 88, 12, 0.4);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--white);
        }

        .stat-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .stat-label {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: var(--white);
          transition: all 0.3s ease;
        }

        .investments-table-wrapper {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 2rem;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow-x: auto;
        }

        .investments-table {
          width: 100%;
          border-collapse: collapse;
        }

        .investments-table thead {
          background: rgba(234, 88, 12, 0.2);
        }

        .investments-table th {
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--white);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .investments-table tbody tr {
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          transition: var(--transition);
        }

        .investments-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.05);
        }

        .investments-table tbody tr.fade-in {
          animation: fadeInRow 0.5s ease-in;
        }

        @keyframes fadeInRow {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .investments-table td {
          padding: 1.25rem 1.5rem;
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
        }

        .username {
          color: #a78bfa !important;
          font-weight: 600;
        }

        .hours {
          color: #fbbf24 !important;
          font-weight: 600;
        }

        .amount {
          color: #34d399 !important;
          font-weight: 600;
        }

        .gains {
          color: #60a5fa !important;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .analytics-page {
            padding: 6rem 1rem 3rem;
          }

          .page-header h1 {
            font-size: 2rem;
          }

          .stats-cards {
            grid-template-columns: 1fr;
          }

          .investments-table-wrapper {
            padding: 1rem;
          }

          .investments-table th,
          .investments-table td {
            padding: 1rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsPage;
