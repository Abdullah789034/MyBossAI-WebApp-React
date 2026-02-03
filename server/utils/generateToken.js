import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is always set - use a consistent default
const DEFAULT_SECRET = 'my-boss-ai-default-secret-key-2024-production-ready-12345';

// Ensure JWT_SECRET is always set
const getJWTSecret = () => {
  // Always use default for now - can be changed later
  const secret = process.env.JWT_SECRET || DEFAULT_SECRET;
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = secret;
    console.warn('⚠️  WARNING: JWT_SECRET not set. Using default secret. Set JWT_SECRET in .env for production!');
  }
  // Ensure it's a string and not empty
  if (typeof secret !== 'string' || secret.length === 0) {
    const fallback = DEFAULT_SECRET;
    process.env.JWT_SECRET = fallback;
    return fallback;
  }
  return secret;
};

export const generateToken = (id) => {
  try {
    const secret = getJWTSecret();
    
    // Double check secret is valid
    if (!secret || typeof secret !== 'string' || secret.length === 0) {
      console.error('JWT_SECRET is invalid, using fallback');
      const fallbackSecret = DEFAULT_SECRET;
      process.env.JWT_SECRET = fallbackSecret;
      return jwt.sign({ id }, fallbackSecret, {
        expiresIn: '30d',
      });
    }
    
    return jwt.sign({ id }, secret, {
      expiresIn: '30d',
    });
  } catch (error) {
    console.error('Error generating token:', error);
    // Last resort fallback
    return jwt.sign({ id }, DEFAULT_SECRET, {
      expiresIn: '30d',
    });
  }
};
