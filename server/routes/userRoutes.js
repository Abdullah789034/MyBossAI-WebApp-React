import express from 'express';
import { protect } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// @route   GET /api/users/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mode: user.mode,
      settings: user.settings,
      isActive: user.isActive,
      lastActivityTime: user.lastActivityTime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/mode
// @desc    Update user mode
// @access  Private
router.put('/mode', protect, async (req, res) => {
  try {
    const { mode } = req.body;
    
    if (!['boss', 'employee'].includes(mode)) {
      return res.status(400).json({ message: 'Invalid mode' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { mode },
      { new: true }
    );

    res.json({
      _id: user._id,
      mode: user.mode,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', protect, async (req, res) => {
  try {
    const { settings } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { settings },
      { new: true }
    );

    res.json({
      settings: user.settings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/users/activity
// @desc    Update user activity
// @access  Private
router.put('/activity', protect, async (req, res) => {
  try {
    const { isActive, lastActivityTime } = req.body;

    const updateData = {};
    if (isActive !== undefined) updateData.isActive = isActive;
    if (lastActivityTime !== undefined) updateData.lastActivityTime = new Date(lastActivityTime);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true }
    );

    res.json({
      isActive: user.isActive,
      lastActivityTime: user.lastActivityTime,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


