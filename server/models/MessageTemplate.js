import mongoose from 'mongoose';

const messageTemplateSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  intensity: {
    type: String,
    enum: ['gentle', 'moderate', 'harsh'],
    required: true,
  },
  type: {
    type: String,
    enum: ['warning', 'critical', 'info', 'motivation'],
    required: true,
  },
  messages: [{
    type: String,
    required: true,
  }],
}, {
  timestamps: true,
});

// Ensure unique combination of user, intensity, and type
messageTemplateSchema.index({ user: 1, intensity: 1, type: 1 }, { unique: true });

export default mongoose.model('MessageTemplate', messageTemplateSchema);


