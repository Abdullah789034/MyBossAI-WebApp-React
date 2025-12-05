import { Clock, CheckCircle, Circle, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export function TaskList({ tasks, onStatusChange, onAddTask, onDeleteTask, mode }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={18} className="icon-completed" />;
      case 'in-progress':
        return <Clock size={18} className="icon-in-progress" />;
      case 'overdue':
        return <AlertCircle size={18} className="icon-overdue" />;
      default:
        return <Circle size={18} className="icon-pending" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      default:
        return 'priority-low';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const isOverdue = (task) => {
    return task.status !== 'completed' && new Date(task.dueDate) < new Date();
  };

  const handleStatusClick = (task) => {
    const taskId = task._id || task.id;
    if (task.status === 'pending') {
      onStatusChange(taskId, 'in-progress');
    } else if (task.status === 'in-progress') {
      onStatusChange(taskId, 'completed');
    } else if (task.status === 'completed') {
      onStatusChange(taskId, 'pending');
    }
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    onAddTask({
      title: newTask.title,
      description: newTask.description,
      dueDate: new Date(newTask.dueDate || Date.now() + 24 * 60 * 60 * 1000),
      status: 'pending',
      priority: newTask.priority,
    });

    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
    });
    setShowAddForm(false);
  };

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks</h2>
        {mode === 'boss' && (
          <button
            className="add-task-button"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            <Plus size={18} />
            Add Task
          </button>
        )}
      </div>

      {mode === 'boss' && showAddForm && (
        <form className="add-task-form" onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Task title *"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Task description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            rows="3"
          />
          <div className="form-row">
            <label>
              Due Date:
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </label>
            <label>
              Priority:
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-button">Add Task</button>
            <button type="button" onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="tasks-container">
        {tasks.length === 0 ? (
          <div className="empty-state">No tasks assigned yet.</div>
        ) : (
          tasks.map(task => {
            const taskId = task._id || task.id;
            const overdue = isOverdue(task);
            return (
              <div
                key={taskId}
                className={`task-card ${task.status} ${overdue ? 'overdue' : ''}`}
              >
                <div className="task-header">
                  <button
                    className="task-status-button"
                    onClick={() => handleStatusClick(task)}
                    aria-label={`Mark task as ${task.status === 'pending' ? 'in progress' : task.status === 'in-progress' ? 'completed' : 'pending'}`}
                  >
                    {getStatusIcon(overdue ? 'overdue' : task.status)}
                  </button>
                  <div className="task-title-section">
                    <h3 className="task-title">{task.title}</h3>
                    <span className={`priority-badge ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  {mode === 'boss' && (
                    <button
                      className="delete-task-button"
                      onClick={() => onDeleteTask(taskId)}
                      aria-label="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <p className="task-description">{task.description}</p>
                <div className="task-footer">
                  <span className="task-due-date">
                    Due: {formatDate(task.dueDate)}
                  </span>
                  {overdue && (
                    <span className="overdue-badge">Overdue</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

