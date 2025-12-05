# My Boss AI - Complete App Structure

## Project Overview

A productivity management application that acts like a boss, assigning tasks, tracking activity, and sending notifications to keep you accountable during work hours.

## Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: CSS3 with CSS Variables
- **Icons**: Lucide React
- **State Management**: React Hooks (Custom hooks)

## Project Structure

```
MyBossAI/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ModeSwitcher.tsx      # Boss/Employee mode toggle
│   │   ├── Dashboard.tsx         # Main dashboard with stats
│   │   ├── TaskList.tsx           # Task management interface
│   │   ├── NotificationPanel.tsx # Notification display
│   │   └── Settings.tsx          # App configuration
│   ├── services/          # Business logic services
│   │   ├── activityTracker.ts    # Tracks user activity
│   │   ├── notificationService.ts # Manages notifications
│   │   └── taskService.ts        # Task CRUD operations
│   ├── hooks/            # Custom React hooks
│   │   └── useAppState.ts        # Main app state management
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts              # All type definitions
│   ├── utils/            # Utility functions
│   │   └── mockMessages.ts       # Mock message generator
│   ├── App.tsx           # Main app component
│   ├── App.css           # App-specific styles
│   ├── main.tsx          # App entry point
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
└── README.md             # Project documentation
```

## Core Features

### 1. Mode Switching
- **Location**: `src/components/ModeSwitcher.tsx`
- Toggle between "Boss Mode" and "Employee Mode"
- Visual indicator of current mode
- Affects UI styling and perspective

### 2. Activity Tracking
- **Location**: `src/services/activityTracker.ts`
- Monitors mouse, keyboard, and scroll events
- Tracks last activity time
- Determines if user is "active" (within 5 minutes of last activity)
- Checks if current time is within active work hours

### 3. Task Management
- **Location**: `src/services/taskService.ts`
- Pre-loaded mock tasks with different priorities
- Task statuses: pending, in-progress, completed, overdue
- Task CRUD operations
- Priority levels: low, medium, high

### 4. Notification System
- **Location**: `src/services/notificationService.ts`
- Hourly activity checks during work hours
- Browser notification support
- Notification types: warning, critical, info, motivation
- Intensity levels: gentle, moderate, harsh

### 5. Mock Messages
- **Location**: `src/utils/mockMessages.ts`
- Pre-defined messages for each intensity level
- Context-aware message selection
- Different messages based on activity status

### 6. Settings
- **Location**: `src/components/Settings.tsx`
- Configure active work hours (start/end)
- Set boss intensity (gentle/moderate/harsh)
- Toggle notifications on/off
- Toggle hourly checks on/off
- Settings persisted in localStorage

### 7. Dashboard
- **Location**: `src/components/Dashboard.tsx`
- Task statistics (pending, in-progress, completed, overdue)
- Activity status indicator
- Work hours status badge
- Visual cards with icons

### 8. Task List
- **Location**: `src/components/TaskList.tsx`
- Display all tasks
- Click to cycle through statuses
- Priority badges
- Overdue indicators
- Task details (title, description, due date)

## Data Flow

1. **App Initialization**
   - Loads settings from localStorage
   - Initializes mock tasks
   - Starts activity tracking
   - Requests notification permissions

2. **Activity Monitoring**
   - Event listeners track user activity
   - Updates activity status every minute
   - Triggers notifications if inactive during work hours

3. **Hourly Checks**
   - Runs every hour during active work hours
   - Checks activity status
   - Generates appropriate notifications
   - Shows browser notifications if permitted

4. **State Management**
   - Centralized in `useAppState` hook
   - Manages mode, tasks, notifications, activity, settings
   - Provides update functions to components

## Key Components Breakdown

### ModeSwitcher
- Simple toggle button
- Shows current mode with icon
- Calls `toggleMode` from app state

### Dashboard
- Displays task statistics
- Shows activity indicator
- Work hours badge
- Responsive grid layout

### TaskList
- Lists all tasks
- Interactive status updates
- Priority and overdue indicators
- Empty state handling

### NotificationPanel
- Dropdown panel
- Unread count badge
- Notification list with icons
- Mark as read functionality

### Settings
- Modal overlay
- Time input controls
- Radio buttons for intensity
- Checkboxes for toggles

## Mock Data

### Tasks
- 5 pre-defined tasks with various priorities
- Random assignment dates
- Different due dates (1-5 days from now)

### Messages
- **Gentle**: Friendly, supportive messages
- **Moderate**: Professional, firm messages
- **Harsh**: Aggressive, demanding messages

## Future Enhancements (Roadmap)

1. **AI Integration**
   - Replace mock messages with AI-generated content
   - Dynamic message generation based on context
   - Personalized boss personality

2. **Persistence**
   - Database integration for tasks
   - User accounts and profiles
   - Task history and analytics

3. **Advanced Features**
   - Task creation UI
   - Productivity reports
   - Time tracking
   - Goal setting
   - Achievement system

4. **Mobile App**
   - React Native version
   - Push notifications
   - Offline support

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Open browser to `http://localhost:5173`

4. Configure settings:
   - Click settings icon
   - Set your active work hours
   - Choose boss intensity
   - Enable notifications

5. Switch to Employee Mode and start working!

## Configuration

### Active Hours
- Default: 9:00 - 17:00 (9 AM to 5 PM)
- Configurable in settings
- Notifications only during active hours

### Boss Intensity
- **Gentle**: Supportive, friendly messages
- **Moderate**: Professional, firm messages
- **Harsh**: Aggressive, demanding messages

### Activity Threshold
- Currently set to 5 minutes
- User is considered "inactive" if no activity for 5+ minutes
- Can be modified in `activityTracker.ts`

## Browser Compatibility

- Modern browsers with ES6+ support
- Notification API support recommended
- LocalStorage support required


