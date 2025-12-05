import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { taskAPI, notificationAPI, userAPI, messageAPI } from '../services/api';
import { getSocket } from '../services/socket';
import { activityTracker } from '../services/activityTracker';

export function useAppState() {
  const { user, updateUser } = useAuth();
  const [mode, setMode] = useState(user?.mode || 'employee');
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activityStatus, setActivityStatus] = useState({
    isActive: user?.isActive || false,
    lastActivityTime: user?.lastActivityTime || null,
    activeHours: user?.settings?.activeHours || { start: 9, end: 17 },
    isOnBlockedSite: false,
    currentUrl: '',
  });
  const [settings, setSettings] = useState(user?.settings || {
    activeHours: { start: 9, end: 17 },
    bossIntensity: 'moderate',
    notificationsEnabled: true,
    hourlyCheckEnabled: true,
    darkMode: false,
    blockedKeywords: [],
  });

  // Sync with user from auth context
  useEffect(() => {
    if (user) {
      setMode(user.mode || 'employee');
      setSettings(user.settings || settings);
      setActivityStatus(prev => ({
        ...prev,
        isActive: user.isActive || false,
        lastActivityTime: user.lastActivityTime || null,
        activeHours: user.settings?.activeHours || prev.activeHours,
      }));
    }
  }, [user]);

  // Apply dark mode
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
    }
  }, [settings.darkMode]);

  // Load tasks
  useEffect(() => {
    if (user) {
      loadTasks();
    }
  }, [user]);

  // Load notifications
  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  // Socket.io live updates
  useEffect(() => {
    if (!user) return;

    const socket = getSocket();
    if (!socket) return;

    socket.on('new-notification', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    socket.on('activity-update', (data) => {
      setActivityStatus(prev => ({
        ...prev,
        isActive: data.isActive,
        activityScore: data.activityScore,
      }));
    });

    socket.on('task-changed', () => {
      loadTasks();
    });

    return () => {
      if (socket) {
        socket.off('new-notification');
        socket.off('activity-update');
        socket.off('task-changed');
      }
    };
  }, [user]);

  // Activity tracking
  useEffect(() => {
    if (!user) return;

    const handleActivityChange = async (isActive, isOnBlockedSite = false) => {
      const now = new Date();
      await userAPI.updateActivity({
        isActive,
        lastActivityTime: now.toISOString(),
      });
      
      setActivityStatus(prev => ({
        ...prev,
        isActive,
        lastActivityTime: now,
        isOnBlockedSite,
      }));

      // Emit to socket
      const socket = getSocket();
      if (socket) {
        socket.emit('activity-update', {
          userId: user._id,
          isActive,
          lastActivityTime: now,
          isOnBlockedSite,
        });
      }
    };

    // Start tracking with blocked keywords
    const blockedKeywords = user.settings?.blockedKeywords || [];
    activityTracker.startTracking(handleActivityChange, blockedKeywords);

    return () => {
      activityTracker.stopTracking();
    };
  }, [user]);

  // Update blocked keywords when settings change
  useEffect(() => {
    if (user && settings.blockedKeywords) {
      activityTracker.updateBlockedKeywords(settings.blockedKeywords);
    }
  }, [settings.blockedKeywords, user]);

  // Update activity status periodically
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const status = activityTracker.getActivityStatus(settings);
      setActivityStatus(status);
    }, 60000);

    return () => clearInterval(interval);
  }, [settings, user]);

  const loadTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      setTasks(response.data);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  const loadNotifications = async () => {
    try {
      const response = await notificationAPI.getAll();
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const toggleMode = useCallback(async () => {
    const newMode = mode === 'boss' ? 'employee' : 'boss';
    try {
      await userAPI.updateMode(newMode);
      setMode(newMode);
      updateUser({ mode: newMode });
    } catch (error) {
      console.error('Failed to update mode:', error);
    }
  }, [mode, updateUser]);

  const updateSettings = useCallback(async (newSettings) => {
    const updated = { ...settings, ...newSettings };
    try {
      await userAPI.updateSettings(updated);
      setSettings(updated);
      updateUser({ settings: updated });
    } catch (error) {
      console.error('Failed to update settings:', error);
    }
  }, [settings, updateUser]);

  const updateTaskStatus = useCallback(async (taskId, status) => {
    try {
      await taskAPI.update(taskId, { status });
      await loadTasks();
      
      // Emit to socket
      const socket = getSocket();
      if (socket && user) {
        socket.emit('task-update', { userId: user._id });
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    }
  }, [user]);

  const addTask = useCallback(async (task) => {
    try {
      await taskAPI.create(task);
      await loadTasks();
      
      // Emit to socket
      const socket = getSocket();
      if (socket && user) {
        socket.emit('task-update', { userId: user._id });
      }
    } catch (error) {
      console.error('Failed to add task:', error);
      throw error;
    }
  }, [user]);

  const deleteTask = useCallback(async (taskId) => {
    try {
      await taskAPI.delete(taskId);
      await loadTasks();
      
      // Emit to socket
      const socket = getSocket();
      if (socket && user) {
        socket.emit('task-update', { userId: user._id });
      }
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  }, [user]);

  const markNotificationAsRead = useCallback(async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => {
          const nId = n._id || n.id;
          return nId === notificationId ? { ...n, read: true } : n;
        })
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  const loadMessages = useCallback(async () => {
    try {
      const response = await messageAPI.getAll();
      return response.data;
    } catch (error) {
      console.error('Failed to load messages:', error);
      return null;
    }
  }, []);

  const updateMessages = useCallback(async (intensity, type, messages) => {
    try {
      await messageAPI.update({ intensity, type, messages });
    } catch (error) {
      console.error('Failed to update messages:', error);
      throw error;
    }
  }, []);

  return {
    mode,
    tasks,
    notifications,
    activityStatus,
    settings,
    toggleMode,
    updateSettings,
    updateTaskStatus,
    addTask,
    deleteTask,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    loadMessages,
    updateMessages,
  };
}
