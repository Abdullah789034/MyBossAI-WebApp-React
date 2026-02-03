import express from 'express';
import { protect } from '../middleware/auth.js';
import MessageTemplate from '../models/MessageTemplate.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// @route   GET /api/messages
// @desc    Get all message templates for user
// @access  Private
router.get('/', async (req, res) => {
  try {
    const templates = await MessageTemplate.find({ user: req.user._id });
    
    // Organize by intensity and type
    const organized = {
      gentle: { warning: [], critical: [], info: [], motivation: [] },
      moderate: { warning: [], critical: [], info: [], motivation: [] },
      harsh: { warning: [], critical: [], info: [], motivation: [] },
    };

    templates.forEach(template => {
      organized[template.intensity][template.type] = template.messages;
    });

    res.json(organized);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   PUT /api/messages
// @desc    Update message templates (Boss mode only)
// @access  Private
router.put('/', async (req, res) => {
  try {
    if (req.user.mode !== 'boss') {
      return res.status(403).json({ message: 'Only boss can edit messages' });
    }

    const { intensity, type, messages } = req.body;

    if (!['gentle', 'moderate', 'harsh'].includes(intensity)) {
      return res.status(400).json({ message: 'Invalid intensity' });
    }

    if (!['warning', 'critical', 'info', 'motivation'].includes(type)) {
      return res.status(400).json({ message: 'Invalid message type' });
    }

    const template = await MessageTemplate.findOneAndUpdate(
      { user: req.user._id, intensity, type },
      { messages },
      { upsert: true, new: true }
    );

    res.json(template);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


