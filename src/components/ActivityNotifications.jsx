import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, X } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const ActivityNotifications = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [nextId, setNextId] = useState(1);

  const activities = [
    { type: 'investment', amount: 15000, user: 'Sophia Garcia' },
    { type: 'withdrawal', amount: 5000, user: 'Liam Johnson' },
    { type: 'investment', amount: 10000, user: 'Emma Wilson' },
    { type: 'withdrawal', amount: 2500, user: 'Noah Davis' },
    { type: 'investment', amount: 7500, user: 'Ava Miller' },
    { type: 'withdrawal', amount: 3000, user: 'Olivia Brown' },
    { type: 'investment', amount: 20000, user: 'James Martinez' },
    { type: 'withdrawal', amount: 4500, user: 'Isabella Rodriguez' },
    { type: 'investment', amount: 12000, user: 'Benjamin Jones' }
  ];

  useEffect(() => {
    const generateRandomAmount = () => {
      // Starting from $50, weighted towards smaller amounts but can go up to $25k
      const base = 50;
      const rand = Math.random();
      if (rand > 0.95) return base + Math.floor(Math.random() * 24950); // High: $50-25000
      if (rand > 0.8) return base + Math.floor(Math.random() * 4950);  // Medium: $50-5000
      return base + Math.floor(Math.random() * 950);                   // Low: $50-1000
    };

    const generateRandomUser = () => {
      const names = [
        'Emma Wilson', 'Liam Johnson', 'Olivia Brown', 'Noah Davis', 'Ava Miller',
        'Sophia Garcia', 'James Martinez', 'Isabella Rodriguez', 'Benjamin Jones',
        'Mia Hernandez', 'Lucas Walker', 'Charlotte Wright', 'Alexander Hill',
        'Amelia Scott', 'Elijah Green', 'Abigail Adams', 'Daniel Nelson',
        'Harper Baker', 'Matthew Lee', 'Evelyn Taylor'
      ];
      
      const name = names[Math.floor(Math.random() * names.length)];
      if (Math.random() > 0.5) return name; // 50% chance full name

      // 50% chance masked name (e.g., "Emma W***")
      const parts = name.split(' ');
      if (parts.length > 1) {
        return `${parts[0]} ${parts[1].charAt(0)}***`;
      }
      return `${name.substring(0, 3)}***`;
    };

    const showNotification = () => {
      // Clear any existing notifications first to ensure only 1 is visible
      setNotifications([]);

      const types = ['investment', 'withdrawal', 'investment']; // Weighted towards investments
      const type = types[Math.floor(Math.random() * types.length)];

      const newNotification = {
        id: nextId,
        type,
        amount: generateRandomAmount(),
        user: generateRandomUser()
      };

      // Small delay to trigger animation if clearing previous one
      setTimeout(() => {
        setNotifications([newNotification]);
        setNextId(prev => prev + 1);
      }, 100);

      // Auto-remove after 8 seconds
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
      }, 8100);
    };

    // Show first notification after 60 seconds
    const initialTimeout = setTimeout(showNotification, 60000);

    // Then show notifications every 60 seconds
    const interval = setInterval(() => {
      showNotification();
    }, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [nextId]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="activity-notifications">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
        >
          <div className="notification-icon">
            {notification.type === 'investment' ? (
              <TrendingUp size={20} />
            ) : (
              <TrendingDown size={20} />
            )}
          </div>
          <div className="notification-content">
            <p className="notification-text">
              <strong>{notification.user}</strong> {t(`activityNotifications.${notification.type}`)} <strong>${notification.amount.toLocaleString()}</strong>
            </p>
          </div>
          <button
            className="notification-close"
            onClick={() => removeNotification(notification.id)}
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <style>{`
        .activity-notifications {
          position: fixed;
          top: 80px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          max-width: 350px;
        }

        .notification {
          background: var(--white);
          border-radius: 12px;
          padding: 1rem 1.25rem;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 1rem;
          animation: slideIn 0.3s ease-out;
          border-left: 4px solid;
        }

        .notification.investment {
          border-left-color: #10b981;
        }

        .notification.withdrawal {
          border-left-color: #f59e0b;
        }

        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification.investment .notification-icon {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }

        .notification.withdrawal .notification-icon {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .notification-content {
          flex: 1;
        }

        .notification-text {
          margin: 0;
          font-size: 0.9rem;
          color: var(--text);
          line-height: 1.4;
        }

        .notification-text strong {
          color: var(--primary);
          font-weight: 600;
        }

        .notification-close {
          background: none;
          border: none;
          color: var(--text-light);
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: var(--transition);
          flex-shrink: 0;
        }

        .notification-close:hover {
          background: var(--bg);
          color: var(--text);
        }

        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .activity-notifications {
            top: 70px;
            right: 10px;
            left: 10px;
            max-width: none;
          }

          .notification {
            padding: 0.875rem 1rem;
          }

          .notification-icon {
            width: 36px;
            height: 36px;
          }

          .notification-text {
            font-size: 0.85rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ActivityNotifications;
