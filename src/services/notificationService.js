import { generateMockMessage, getNotificationType } from '../utils/mockMessages';

class NotificationService {
  constructor() {
    this.notifications = [];
    this.hourlyCheckInterval = null;
    this.onNotification = null;
  }

  startHourlyChecks(settings, getActivityStatus, onNotification) {
    this.onNotification = onNotification;

    if (!settings.hourlyCheckEnabled) return;

    // Check every hour
    this.hourlyCheckInterval = setInterval(() => {
      const activityStatus = getActivityStatus();
      this.checkAndNotify(settings, activityStatus);
    }, 60 * 60 * 1000); // 1 hour

    // Also check immediately
    const activityStatus = getActivityStatus();
    this.checkAndNotify(settings, activityStatus);
  }

  stopHourlyChecks() {
    if (this.hourlyCheckInterval) {
      clearInterval(this.hourlyCheckInterval);
      this.hourlyCheckInterval = null;
    }
    this.onNotification = null;
  }

  checkAndNotify(settings, activityStatus) {
    if (!settings.notificationsEnabled || !this.onNotification) return;

    const now = new Date();
    const currentHour = now.getHours();
    const isInActiveHours = currentHour >= settings.activeHours.start && 
                           currentHour < settings.activeHours.end;

    if (!isInActiveHours) return;

    const type = getNotificationType(
      activityStatus.isActive,
      isInActiveHours,
      settings.bossIntensity
    );

    const message = generateMockMessage(
      type,
      settings.bossIntensity,
      activityStatus.isActive
    );

    const notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date(),
      read: false,
    };

    this.notifications.push(notification);
    this.onNotification(notification);

    // Show browser notification if permission granted
    if ('Notification' in window && window.Notification.permission === 'granted') {
      new window.Notification('Boss Notification', {
        body: message,
        icon: '/vite.svg',
      });
    }
  }

  requestNotificationPermission() {
    if ('Notification' in window && window.Notification.permission === 'default') {
      window.Notification.requestPermission();
    }
  }

  getNotifications() {
    return [...this.notifications];
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
  }

  clearNotifications() {
    this.notifications = [];
  }
}

export const notificationService = new NotificationService();


