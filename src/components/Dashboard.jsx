import { Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';

export function Dashboard({ activityStatus, tasks }) {
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const overdueTasks = tasks.filter(t => 
    t.status !== 'completed' && new Date(t.dueDate) < new Date()
  ).length;

  const currentHour = new Date().getHours();
  const isInActiveHours = currentHour >= activityStatus.activeHours.start && 
                         currentHour < activityStatus.activeHours.end;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Dashboard</h2>
        <div className="activity-indicators">
          <div className={`activity-indicator ${activityStatus.isActive ? 'active' : 'inactive'}`}>
            <Activity size={16} />
            <span>{activityStatus.isActive ? 'Active' : 'Inactive'}</span>
          </div>
          {activityStatus.isOnBlockedSite && (
            <div className="activity-indicator blocked-site">
              <AlertCircle size={16} />
              <span>Blocked Site Detected</span>
            </div>
          )}
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon pending">
            <Clock size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{pendingTasks}</div>
            <div className="stat-label">Pending</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon in-progress">
            <Activity size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{inProgressTasks}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon completed">
            <CheckCircle size={24} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{completedTasks}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        {overdueTasks > 0 && (
          <div className="stat-card overdue">
            <div className="stat-icon overdue">
              <AlertCircle size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-value">{overdueTasks}</div>
              <div className="stat-label">Overdue</div>
            </div>
          </div>
        )}
      </div>

      <div className="work-hours-status">
        <div className={`hours-badge ${isInActiveHours ? 'active' : 'inactive'}`}>
          {isInActiveHours ? (
            <>
              <span>Work Hours Active</span>
              <span className="hours-range">
                {activityStatus.activeHours.start}:00 - {activityStatus.activeHours.end}:00
              </span>
            </>
          ) : (
            <>
              <span>Outside Work Hours</span>
              <span className="hours-range">
                Next: {activityStatus.activeHours.start}:00
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

