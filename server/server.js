import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';

// Load env vars
dotenv.config();

// Check for required environment variables and set a consistent default
const DEFAULT_JWT_SECRET = 'my-boss-ai-default-secret-key-2024-production-ready-12345';
if (!process.env.JWT_SECRET || typeof process.env.JWT_SECRET !== 'string' || process.env.JWT_SECRET.trim().length === 0) {
  console.warn('⚠️  WARNING: JWT_SECRET not set. Using default secret. Set JWT_SECRET in .env for production!');
  process.env.JWT_SECRET = DEFAULT_JWT_SECRET;
} else {
  process.env.JWT_SECRET = process.env.JWT_SECRET.trim();
}

// Connect to database
connectDB();

// Initialize app
const app = express();
const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.CLIENT_URL || 'http://localhost:5173' || 'https://mybossai.devhaki.com//',
//     methods: ['GET', 'POST'],
//   },
// });
const io = new Server(httpServer, {
  cors: {
    origin: ["https://mybossai.devhaki.com", "http://localhost:5173", "https://mybossai.devhaki.com/"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const allowedOrigins = [
  "https://mybossai.devhaki.com",
  "https://mybossai.devhaki.com/",
  "http://localhost:5173"   // for local development
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS Blocked: " + origin));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);


// Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

// Root route to verify server is running
app.get('/', (req, res) => {
  res.send('🚀 Boss AI Server is running...');
});


app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/messages', messageRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Socket.io for live updates
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  socket.on('activity-update', (data) => {
    // Broadcast activity update to user's room
    io.to(`user-${data.userId}`).emit('activity-changed', data);
  });

  socket.on('task-update', (data) => {
    // Broadcast task update to user's room
    io.to(`user-${data.userId}`).emit('task-changed', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// Start activity monitoring
import { startActivityMonitoring } from './services/activityMonitor.js';
startActivityMonitoring(io);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

