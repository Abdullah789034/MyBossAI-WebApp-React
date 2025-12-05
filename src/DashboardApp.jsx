import { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import { ModeSwitcher } from './components/ModeSwitcher';
import { Dashboard } from './components/Dashboard';
import { TaskList } from './components/TaskList';
import { NotificationPanel } from './components/NotificationPanel';
import { Settings } from './components/Settings';
import { MessageEditor } from './components/MessageEditor';
import { KeywordManager } from './components/KeywordManager';
import { Navbar } from './components/Navbar';
import { BackgroundArt } from './components/BackgroundArt';
import { MessageSquare, Shield, X } from 'lucide-react';

export default function DashboardApp() {
  const {
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
  } = useAppState();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [showMessageEditor, setShowMessageEditor] = useState(false);
  const [showKeywordManager, setShowKeywordManager] = useState(false);

  return (
    <div className={`app ${mode} ${settings.darkMode ? 'dark-mode' : 'light-mode'}`}>
      <BackgroundArt />
      <Navbar darkMode={settings.darkMode} onToggleDarkMode={() => updateSettings({ darkMode: !settings.darkMode })} />
      <header className="app-header">
        <div className="header-left">
          <h1>My Boss AI</h1>
          <ModeSwitcher mode={mode} onToggle={toggleMode} />
        </div>
        <div className="header-right">
          {mode === 'boss' && (
            <>
              <button
                className="keyword-manager-button"
                onClick={() => setShowKeywordManager(true)}
                title="Manage Blocked Keywords"
              >
                <Shield size={20} />
              </button>
              <button
                className="message-editor-button"
                onClick={() => setShowMessageEditor(true)}
                title="Edit Messages"
              >
                <MessageSquare size={20} />
              </button>
            </>
          )}
          <NotificationPanel
            notifications={notifications}
            onMarkAsRead={markNotificationAsRead}
            onMarkAllAsRead={markAllNotificationsAsRead}
          />
          <Settings settings={settings} onUpdate={updateSettings} mode={mode} />
        </div>
      </header>

      <main className="app-main">
        <nav className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
          >
            Tasks
          </button>
        </nav>

        <div className="content-area">
          {activeTab === 'dashboard' && (
            <Dashboard activityStatus={activityStatus} tasks={tasks} />
          )}
          {activeTab === 'tasks' && (
            <TaskList
              tasks={tasks}
              onStatusChange={updateTaskStatus}
              onAddTask={addTask}
              onDeleteTask={deleteTask}
              mode={mode}
            />
          )}
        </div>
      </main>

      <MessageEditor
        settings={settings}
        isOpen={showMessageEditor}
        onClose={() => setShowMessageEditor(false)}
        loadMessages={loadMessages}
        updateMessages={updateMessages}
      />

      {mode === 'boss' && (
        <KeywordManagerModal
          isOpen={showKeywordManager}
          onClose={() => setShowKeywordManager(false)}
          keywords={settings.blockedKeywords || []}
          onUpdate={(keywords) => updateSettings({ blockedKeywords: keywords })}
        />
      )}
    </div>
  );
}

function KeywordManagerModal({ isOpen, onClose, keywords, onUpdate }) {
  if (!isOpen) return null;

  return (
    <div className="keyword-manager-modal">
      <div className="keyword-manager-content">
        <div className="keyword-manager-header-modal">
          <h2>Manage Blocked Keywords</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <KeywordManager keywords={keywords} onUpdate={onUpdate} />
      </div>
    </div>
  );
}

