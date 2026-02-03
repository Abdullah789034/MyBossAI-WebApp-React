import User from '../models/User.js';
import Notification from '../models/Notification.js';
import Task from '../models/Task.js';
import MessageTemplate from '../models/MessageTemplate.js';
import { screenActivity, getActivityStats } from '../utils/screening.js';
import { generateMockMessage, getNotificationType } from '../utils/mockMessages.js';
import { generatePersonalizedMessage } from '../utils/llmIntegration.js';

/**
 * Monitor user activity and send notifications
 */
export const monitorUserActivity = async (userId, io = null) => {
  try {
    const user = await User.findById(userId);
    if (!user) return;

    const currentTime = new Date();
    const activityScreen = screenActivity(user, currentTime);

    // Update user activity status
    user.isActive = activityScreen.recentlyActive;
    if (activityScreen.recentlyActive) {
      user.lastActivityTime = currentTime;
    }
    await user.save();

    // Get user tasks for stats
    const tasks = await Task.find({ user: userId });
    const taskStats = getActivityStats(user, tasks);

    // Send notification if needed
    if (activityScreen.shouldNotify && user.settings.hourlyCheckEnabled) {
      const notificationType = getNotificationType(
        activityScreen.recentlyActive,
        activityScreen.inActiveHours,
        user.settings.bossIntensity
      );

      // Get custom messages or use defaults
      let message = null;
      
      // Try LLM integration first (commented out for now)
      // message = await generatePersonalizedMessage(user, activityScreen, taskStats);
      
      // If LLM doesn't provide message, use templates
      if (!message) {
        // Get custom message templates
        const template = await MessageTemplate.findOne({
          user: userId,
          intensity: user.settings.bossIntensity,
          type: notificationType,
        });

        message = generateMockMessage(
          notificationType,
          user.settings.bossIntensity,
          activityScreen.recentlyActive,
          template ? { [notificationType]: template.messages } : null
        );
      }

      // Create notification
      const notification = await Notification.create({
        user: userId,
        message,
        type: notificationType,
      });

      // Emit live update via socket
      if (io) {
        io.to(`user-${userId}`).emit('new-notification', notification);
      }

      // Send browser notification if enabled
      if (io) {
        io.to(`user-${userId}`).emit('browser-notification', {
          title: 'Boss Notification',
          body: message,
        });
      }
    }

    // Emit activity update
    if (io) {
      io.to(`user-${userId}`).emit('activity-update', {
        isActive: activityScreen.recentlyActive,
        activityScore: activityScreen.activityScore,
        inActiveHours: activityScreen.inActiveHours,
        taskStats,
      });
    }

    return {
      activityScreen,
      taskStats,
    };
  } catch (error) {
    console.error('Activity monitoring error:', error);
    return null;
  }
};

/**
 * Hourly check for all active users
 */
export const hourlyActivityCheck = async (io) => {
  try {
    const users = await User.find({
      'settings.hourlyCheckEnabled': true,
    });

    for (const user of users) {
      await monitorUserActivity(user._id.toString(), io);
    }

    console.log(`Hourly check completed for ${users.length} users`);
  } catch (error) {
    console.error('Hourly check error:', error);
  }
};

/**
 * Start periodic activity monitoring
 */
export const startActivityMonitoring = (io) => {
  // Check every hour
  setInterval(() => {
    hourlyActivityCheck(io);
  }, 60 * 60 * 1000);

  // Also check immediately
  hourlyActivityCheck(io);

  // Check every minute for active users
  setInterval(async () => {
    const users = await User.find({
      'settings.notificationsEnabled': true,
    });

    for (const user of users) {
      await monitorUserActivity(user._id.toString(), io);
    }
  }, 60 * 1000); // Every minute

  console.log('Activity monitoring started');
};


