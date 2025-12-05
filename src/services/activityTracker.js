class ActivityTracker {
  constructor() {
    this.lastActivityTime = null;
    this.activityCheckInterval = null;
    this.onActivityChange = null;
    this.urlCheckInterval = null;
    this.blockedKeywords = [];
    this.currentUrl = '';
    this.isOnBlockedSite = false;
  }

  startTracking(onChange, blockedKeywords = []) {
    this.onActivityChange = onChange;
    this.blockedKeywords = blockedKeywords.map(k => k.toLowerCase());
    this.updateActivity();
    
    // Track mouse and keyboard activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const updateActivity = () => {
      this.lastActivityTime = new Date();
      this.updateActivity();
    };

    events.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Check current URL for blocked keywords
    this.checkCurrentUrl();
    
    // Monitor URL changes (for SPA navigation)
    let lastUrl = window.location.href;
    this.urlCheckInterval = setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        this.checkCurrentUrl();
      }
    }, 1000); // Check every second

    // Check activity every minute
    this.activityCheckInterval = setInterval(() => {
      this.updateActivity();
    }, 60000);
  }

  stopTracking() {
    if (this.activityCheckInterval) {
      clearInterval(this.activityCheckInterval);
      this.activityCheckInterval = null;
    }
    if (this.urlCheckInterval) {
      clearInterval(this.urlCheckInterval);
      this.urlCheckInterval = null;
    }
    this.onActivityChange = null;
    this.blockedKeywords = [];
    this.isOnBlockedSite = false;
  }

  checkCurrentUrl() {
    if (this.blockedKeywords.length === 0) {
      this.isOnBlockedSite = false;
      return;
    }

    try {
      const url = window.location.href.toLowerCase();
      const title = document.title.toLowerCase();
      const urlAndTitle = url + ' ' + title;

      // Check if URL or title contains any blocked keyword
      const containsBlockedKeyword = this.blockedKeywords.some(keyword => 
        urlAndTitle.includes(keyword.toLowerCase())
      );

      this.isOnBlockedSite = containsBlockedKeyword;
      this.currentUrl = window.location.href;
      
      // If on blocked site, don't update lastActivityTime
      // This effectively marks user as inactive
    } catch (error) {
      console.error('Error checking URL:', error);
    }
  }

  updateBlockedKeywords(keywords) {
    this.blockedKeywords = keywords.map(k => k.toLowerCase());
    this.checkCurrentUrl();
  }

  updateActivity() {
    if (!this.onActivityChange) return;

    const now = new Date();
    let isActive = this.lastActivityTime 
      ? (now.getTime() - this.lastActivityTime.getTime()) < 5 * 60 * 1000 // 5 minutes
      : false;

    // If user is on a blocked site, mark as inactive
    if (this.isOnBlockedSite) {
      isActive = false;
    }

    this.onActivityChange(isActive, this.isOnBlockedSite);
  }

  getActivityStatus(settings) {
    const now = new Date();
    const currentHour = now.getHours();
    const isInActiveHours = currentHour >= settings.activeHours.start && 
                           currentHour < settings.activeHours.end;

    let isActive = this.lastActivityTime 
      ? (now.getTime() - this.lastActivityTime.getTime()) < 5 * 60 * 1000
      : false;

    // If on blocked site, mark as inactive
    if (this.isOnBlockedSite) {
      isActive = false;
    }

    return {
      isActive,
      lastActivityTime: this.lastActivityTime,
      activeHours: settings.activeHours,
      isOnBlockedSite: this.isOnBlockedSite,
      currentUrl: this.currentUrl,
    };
  }

  isInActiveHours(settings) {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= settings.activeHours.start && 
           currentHour < settings.activeHours.end;
  }
}

export const activityTracker = new ActivityTracker();

