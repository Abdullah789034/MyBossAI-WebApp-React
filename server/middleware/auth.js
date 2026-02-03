import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Consistent default secret (must match generateToken.js)
const DEFAULT_SECRET = 'my-boss-ai-default-secret-key-2024-production-ready-12345';

// Ensure JWT_SECRET is always set
const getJWTSecret = () => {
  return process.env.JWT_SECRET || DEFAULT_SECRET;
};

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  try {
    const secret = getJWTSecret();
    
    if (!secret || typeof secret !== 'string' || secret.length === 0) {
      return res.status(500).json({ message: 'Server configuration error' });
    }
    
    const decoded = jwt.verify(token, secret);
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

