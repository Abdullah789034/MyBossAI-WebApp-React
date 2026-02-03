// Screening techniques for activity monitoring

/**
 * Check if user is within active hours
 */
export const isInActiveHours = (activeHours, currentTime = new Date()) => {
  const currentHour = currentTime.getHours();
  return currentHour >= activeHours.start && currentHour < activeHours.end;
};

/**
 * Check if user has been active recently (within threshold)
 */
export const isRecentlyActive = (lastActivityTime, thresholdMinutes = 5) => {
  if (!lastActivityTime) return false;
  const now = new Date();
  const diffMinutes = (now.getTime() - new Date(lastActivityTime).getTime()) / (1000 * 60);
  return diffMinutes < thresholdMinutes;
};

/**
 * Calculate activity score based on recent activity
 */
export const calculateActivityScore = (lastActivityTime, thresholdMinutes = 5) => {
  if (!lastActivityTime) return 0;
  const now = new Date();
  const diffMinutes = (now.getTime() - new Date(lastActivityTime).getTime()) / (1000 * 60);
  
  if (diffMinutes < thresholdMinutes) {
    return 100; // Fully active
  } else if (diffMinutes < thresholdMinutes * 2) {
    return 50; // Partially active
  } else {
    return 0; // Inactive
  }
};

/**
 * Screen user activity and determine if notification should be sent
 */
export const screenActivity = (user, currentTime = new Date()) => {
  const { settings, lastActivityTime, isActive } = user;
  
  const inActiveHours = isInActiveHours(settings.activeHours, currentTime);
  const recentlyActive = isRecentlyActive(lastActivityTime);
  const activityScore = calculateActivityScore(lastActivityTime);
  
  return {
    inActiveHours,
    recentlyActive,
    activityScore,
    shouldNotify: inActiveHours && !recentlyActive && settings.notificationsEnabled,
    severity: recentlyActive ? 'none' : (inActiveHours ? 'high' : 'low'),
  };
};

/**
 * Get activity statistics for user
 */
export const getActivityStats = (user, tasks) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => 
    t.status !== 'completed' && new Date(t.dueDate) < new Date()
  ).length;
  
  return {
    pendingTasks,
    inProgressTasks,
    completedTasks,
    overdueTasks,
    totalTasks: tasks.length,
    completionRate: tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0,
  };
};


