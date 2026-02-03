import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false,
  },
  mode: {
    type: String,
    enum: ['boss', 'employee'],
    default: 'employee',
  },
  settings: {
    activeHours: {
      start: { type: Number, default: 9 },
      end: { type: Number, default: 17 },
    },
    bossIntensity: {
      type: String,
      enum: ['gentle', 'moderate', 'harsh'],
      default: 'moderate',
    },
    notificationsEnabled: { type: Boolean, default: true },
    hourlyCheckEnabled: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
    blockedKeywords: { type: [String], default: [] }, // Keywords that mark user as inactive
  },
  lastActivityTime: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);

