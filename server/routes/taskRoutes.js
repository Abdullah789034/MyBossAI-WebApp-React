import express from 'express';
import { protect } from '../middleware/auth.js';
import Task from '../models/Task.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/tasks
// @desc    Get all tasks for user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    // Check for overdue tasks
    tasks.forEach(task => {
      task.checkOverdue();
      if (task.isModified()) {
        task.save();
      }
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private (Boss mode only)
router.post('/', async (req, res) => {
  try {
    if (req.user.mode !== 'boss') {
      return res.status(403).json({ message: 'Only boss can create tasks' });
    }

    const { title, description, dueDate, priority, status } = req.body;

    const task = await Task.create({
      user: req.user._id,
      title,
      description: description || '',
      dueDate: new Date(dueDate),
      priority: priority || 'medium',
      status: status || 'pending',
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, dueDate, priority, status } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate) task.dueDate = new Date(dueDate);
    if (priority) task.priority = priority;
    if (status) {
      task.status = status;
      if (status === 'completed' && !task.completedAt) {
        task.completedAt = new Date();
      } else if (status !== 'completed') {
        task.completedAt = null;
      }
    }

    task.checkOverdue();
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private (Boss mode only)
router.delete('/:id', async (req, res) => {
  try {
    if (req.user.mode !== 'boss') {
      return res.status(403).json({ message: 'Only boss can delete tasks' });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check if task belongs to user
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await task.deleteOne();

    res.json({ message: 'Task removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


