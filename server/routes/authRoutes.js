import express from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // Check if user exists
      const userExists = await User.findOne({ email });

      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
      });

      if (user) {
        try {
          const token = generateToken(user._id);
          res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mode: user.mode,
            settings: user.settings,
            token: token,
          });
        } catch (tokenError) {
          console.error('Token generation error:', tokenError);
          res.status(500).json({ message: 'Failed to generate authentication token' });
        }
      } else {
        res.status(400).json({ message: 'Invalid user data' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').exists().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Check for user
      const user = await User.findOne({ email }).select('+password');

      if (user && (await user.matchPassword(password))) {
        try {
          const token = generateToken(user._id);
          res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mode: user.mode,
            settings: user.settings,
            token: token,
          });
        } catch (tokenError) {
          console.error('Token generation error:', tokenError);
          res.status(500).json({ message: 'Failed to generate authentication token' });
        }
      } else {
        res.status(401).json({ message: 'Invalid email or password' });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', async (req, res) => {
  try {
    // This route should be protected with auth middleware
    // For now, we'll handle it in the route that uses it
    res.status(200).json({ message: 'Use /api/users/me with auth token' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

