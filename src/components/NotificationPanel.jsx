import { Bell, X, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function NotificationPanel({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle size={18} className="icon-critical" />;
      case 'warning':
        return <AlertTriangle size={18} className="icon-warning" />;
      case 'motivation':
        return <TrendingUp size={18} className="icon-motivation" />;
      default:
        return <Info size={18} className="icon-info" />;
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  return (
    <div className="notification-panel">
      <button
        className="notification-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-button"
                onClick={onMarkAllAsRead}
              >
                Mark all as read
              </button>
            )}
            <button
              className="close-button"
              onClick={() => setIsOpen(false)}
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-notifications">No notifications yet.</div>
            ) : (
              notifications.map(notification => {
                const notifId = notification._id || notification.id;
                return (
                <div
                  key={notifId}
                  className={`notification-item ${notification.type} ${notification.read ? 'read' : 'unread'}`}
                  onClick={() => !notification.read && onMarkAsRead(notifId)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <p className="notification-message">{notification.message}</p>
                    <span className="notification-time">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>
                </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

