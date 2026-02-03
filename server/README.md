# My Boss AI - Backend Server

Express.js backend with MongoDB, Socket.io, and JWT authentication.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start MongoDB (if local):
```bash
mongod
```

4. Run the server:
```bash
npm run dev  # Development with nodemon
# or
npm start    # Production
```

## Environment Variables

- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)
- `CLIENT_URL` - Frontend URL for CORS

## Project Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/
│   ├── User.js              # User model
│   ├── Task.js              # Task model
│   ├── Notification.js      # Notification model
│   └── MessageTemplate.js   # Message template model
├── routes/
│   ├── authRoutes.js        # Authentication routes
│   ├── userRoutes.js        # User routes
│   ├── taskRoutes.js        # Task routes
│   ├── notificationRoutes.js # Notification routes
│   └── messageRoutes.js     # Message routes
├── services/
│   └── activityMonitor.js   # Activity monitoring service
├── utils/
│   ├── generateToken.js    # JWT token generation
│   ├── mockMessages.js      # Default messages
│   ├── screening.js         # Activity screening
│   └── llmIntegration.js    # LLM integration (commented)
└── server.js                # Main server file
```

## API Documentation

See main README.md for API endpoints.

## Activity Monitoring

The server automatically monitors user activity:
- Checks every minute during active hours
- Hourly checks for all users
- Sends notifications when inactive
- Updates activity scores
- Broadcasts via WebSocket

## LLM Integration

LLM integration is prepared but disabled. See `utils/llmIntegration.js` for details.


