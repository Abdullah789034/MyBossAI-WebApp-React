const mockTasks = [
  {
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the current project',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    status: 'pending',
    priority: 'high',
  },
  {
    title: 'Review code changes',
    description: 'Review and test all pending code changes',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // 1 day
    status: 'in-progress',
    priority: 'high',
  },
  {
    title: 'Update dependencies',
    description: 'Update all project dependencies to latest versions',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    status: 'pending',
    priority: 'medium',
  },
  {
    title: 'Write unit tests',
    description: 'Add unit tests for new features',
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days
    status: 'pending',
    priority: 'medium',
  },
  {
    title: 'Optimize performance',
    description: 'Identify and fix performance bottlenecks',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    status: 'pending',
    priority: 'low',
  },
];

class TaskService {
  constructor() {
    this.tasks = [];
  }

  initializeTasks() {
    const saved = localStorage.getItem('boss-ai-tasks');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        this.tasks = parsed.map(task => ({
          ...task,
          dueDate: new Date(task.dueDate),
          assignedAt: new Date(task.assignedAt),
        }));
        return;
      } catch (e) {
        console.error('Failed to load tasks from storage', e);
      }
    }
    
    this.tasks = mockTasks.map((task, index) => ({
      ...task,
      id: `task-${index + 1}`,
      assignedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    }));
    this.saveTasks();
  }

  saveTasks() {
    localStorage.setItem('boss-ai-tasks', JSON.stringify(this.tasks));
  }

  getTasks() {
    return [...this.tasks];
  }

  getTaskById(id) {
    return this.tasks.find(t => t.id === id);
  }

  addTask(task) {
    const newTask = {
      ...task,
      id: `task-${Date.now()}`,
      assignedAt: new Date(),
    };
    this.tasks.push(newTask);
    this.saveTasks();
    return newTask;
  }

  updateTaskStatus(id, status) {
    const task = this.tasks.find(t => t.id === id);
    if (task) {
      task.status = status;
      this.saveTasks();
    }
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
  }

  getTasksByStatus(status) {
    return this.tasks.filter(t => t.status === status);
  }

  getOverdueTasks() {
    const now = new Date();
    return this.tasks.filter(t => 
      t.status !== 'completed' && 
      new Date(t.dueDate) < now
    );
  }
}

export const taskService = new TaskService();


