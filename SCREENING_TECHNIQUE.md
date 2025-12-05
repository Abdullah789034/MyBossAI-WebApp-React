# Activity Screening Technique Explanation

## Overview
The screening technique is a multi-layered system that monitors user activity, determines their work status, and triggers appropriate notifications based on their behavior during active work hours.

## How It Works

### 1. **Activity Tracking (Frontend)**
The frontend tracks user activity in real-time using the `ActivityTracker` class:

- **Events Monitored**: Mouse movements, clicks, keyboard presses, scrolling, and touch events
- **Activity Window**: User is considered "active" if they've interacted within the last 5 minutes
- **Real-time Updates**: Activity status is sent to the backend every minute via WebSocket

**Location**: `src/services/activityTracker.js`

```javascript
// Tracks: mousedown, mousemove, keypress, scroll, touchstart, click
// Updates every minute
// Considers user active if last activity < 5 minutes ago
```

### 2. **Screening Functions (Backend)**

The backend uses several screening functions to analyze user activity:

#### a) **`isInActiveHours(activeHours, currentTime)`**
- **Purpose**: Checks if current time falls within user's configured work hours
- **Logic**: Compares current hour with `activeHours.start` and `activeHours.end`
- **Example**: If active hours are 9-17, returns `true` between 9 AM and 5 PM

#### b) **`isRecentlyActive(lastActivityTime, thresholdMinutes = 5)`**
- **Purpose**: Determines if user has been active recently
- **Logic**: Calculates time difference between now and last activity
- **Threshold**: Default 5 minutes (configurable)
- **Returns**: `true` if activity within threshold, `false` otherwise

#### c) **`calculateActivityScore(lastActivityTime, thresholdMinutes = 5)`**
- **Purpose**: Provides a numerical score (0-100) representing activity level
- **Scoring**:
  - **100**: Active within threshold (fully active)
  - **50**: Active within 2x threshold (partially active)
  - **0**: Inactive beyond 2x threshold
- **Use Case**: Provides granular activity metrics for analytics

#### d) **`screenActivity(user, currentTime)`**
- **Purpose**: Main screening function that combines all checks
- **Returns**:
  ```javascript
  {
    inActiveHours: boolean,        // Is it work time?
    recentlyActive: boolean,        // Has user been active?
    activityScore: number,          // 0-100 activity score
    shouldNotify: boolean,          // Should we send notification?
    severity: 'none' | 'high' | 'low'  // Notification severity
  }
  ```
- **Notification Logic**: 
  - `shouldNotify = true` when:
    - User is in active hours AND
    - User is NOT recently active AND
    - Notifications are enabled

**Location**: `server/utils/screening.js`

### 3. **Activity Monitoring Service (Backend)**

The `activityMonitor` service runs continuously and performs:

#### **Hourly Checks**
- Runs every hour (60 minutes)
- Checks all users with `hourlyCheckEnabled: true`
- Performs full activity screening for each user
- Sends notifications if user is inactive during work hours

#### **Minute-by-Minute Checks**
- Runs every minute (60 seconds)
- Checks all users with `notificationsEnabled: true`
- Provides real-time activity updates
- Updates user's `isActive` status in database

#### **Notification Generation**
When a notification is needed:
1. Determines notification type based on:
   - Activity status
   - Active hours status
   - Boss intensity setting (gentle/moderate/harsh)
2. Retrieves message template from database (or uses defaults)
3. Creates notification record
4. Sends real-time update via WebSocket
5. Optionally sends browser notification

**Location**: `server/services/activityMonitor.js`

### 4. **Activity Statistics**

The system also tracks task-related statistics:

```javascript
{
  pendingTasks: number,
  inProgressTasks: number,
  completedTasks: number,
  overdueTasks: number,
  totalTasks: number,
  completionRate: number  // Percentage
}
```

These stats are used for:
- Dashboard display
- Activity scoring
- Future LLM integration (for personalized messages)

**Location**: `server/utils/screening.js` → `getActivityStats()`

## Flow Diagram

```
1. User Activity (Frontend)
   ↓
   Mouse/Keyboard/Scroll Events
   ↓
   ActivityTracker detects activity
   ↓
   Updates lastActivityTime
   ↓
   Sends to backend via WebSocket
   ↓
2. Backend Screening (Every Minute)
   ↓
   screenActivity() function called
   ↓
   ├─ Check: Is in active hours?
   ├─ Check: Recently active? (< 5 min)
   ├─ Calculate: Activity score
   └─ Determine: Should notify?
   ↓
3. Notification Decision
   ↓
   IF (inActiveHours && !recentlyActive && notificationsEnabled)
   ↓
   Generate notification message
   ↓
   Create notification in database
   ↓
   Send via WebSocket to frontend
   ↓
   Display to user
```

## Key Parameters

### Configurable Settings:
- **Active Hours**: User-defined work hours (default: 9 AM - 5 PM)
- **Boss Intensity**: gentle, moderate, or harsh (affects message tone)
- **Notifications Enabled**: Toggle notifications on/off
- **Hourly Check Enabled**: Toggle hourly monitoring on/off

### Fixed Parameters:
- **Activity Threshold**: 5 minutes (user considered inactive after 5 min)
- **Check Intervals**: 
  - Hourly checks: Every 60 minutes
  - Real-time checks: Every 60 seconds

## Example Scenarios

### Scenario 1: Active User During Work Hours
- Time: 10:30 AM (within 9 AM - 5 PM)
- Last activity: 2 minutes ago
- Result: `recentlyActive: true`, `shouldNotify: false`
- Action: No notification sent

### Scenario 2: Inactive User During Work Hours
- Time: 2:00 PM (within 9 AM - 5 PM)
- Last activity: 8 minutes ago
- Result: `recentlyActive: false`, `shouldNotify: true`
- Action: Notification sent with severity "high"

### Scenario 3: Inactive User Outside Work Hours
- Time: 7:00 PM (outside 9 AM - 5 PM)
- Last activity: 30 minutes ago
- Result: `recentlyActive: false`, `shouldNotify: false`
- Action: No notification (outside work hours)

### Scenario 4: User Just Became Active
- Time: 11:00 AM
- Last activity: 1 minute ago
- Result: `recentlyActive: true`, `activityScore: 100`
- Action: Status updated to "active", no notification

## Future Enhancements

1. **LLM Integration**: Use activity data and task stats to generate personalized messages
2. **Machine Learning**: Learn user patterns and adjust thresholds
3. **Advanced Screening**: Screen for specific application usage, website visits
4. **Productivity Metrics**: Track productivity trends over time
5. **Custom Thresholds**: Allow users to set custom activity thresholds

## Files Involved

- **Frontend Tracking**: `src/services/activityTracker.js`
- **Screening Logic**: `server/utils/screening.js`
- **Monitoring Service**: `server/services/activityMonitor.js`
- **State Management**: `src/hooks/useAppState.jsx`
- **User Model**: `server/models/User.js`


