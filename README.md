# My Boss AI - Complete Full-Stack Application

A productivity management application with a complete backend, authentication, and real-time updates.

## Features

### Frontend
- **Authentication**: Login/Signup pages with JWT
- **Boss/Employee Mode**: Switch between perspectives
- **Task Management**: Create, update, delete tasks (Boss mode)
- **Activity Tracking**: Real-time activity monitoring
- **Notifications**: Live notifications via WebSocket
- **Message Editor**: Customize boss messages (Boss mode)
- **Dark Mode**: Theme switching
- **Settings**: Configure work hours, intensity, notifications

### Backend
- **RESTful API**: Express.js with MongoDB
- **Authentication**: JWT-based auth with bcrypt
- **WebSocket**: Real-time updates via Socket.io
- **Activity Monitoring**: Automated screening and notifications
- **LLM Integration**: Ready for AI message generation (commented out)
- **MongoDB**: Persistent data storage

## Tech Stack

### Frontend
- React 18
- React Router
- Axios
- Socket.io Client
- Lucide React Icons
- Vite

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- Socket.io
- JWT
- Bcrypt

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/my-boss-ai
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

5. Start MongoDB (if running locally):
```bash
mongod
```

6. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to root directory:
```bash
cd ..
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional):
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/mode` - Update user mode
- `PUT /api/users/settings` - Update settings
- `PUT /api/users/activity` - Update activity status

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task (Boss only)
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task (Boss only)

### Notifications
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

### Messages
- `GET /api/messages` - Get message templates
- `PUT /api/messages` - Update messages (Boss only)

## WebSocket Events

### Client → Server
- `join-room` - Join user's room
- `activity-update` - Send activity update
- `task-update` - Notify task change

### Server → Client
- `new-notification` - New notification received
- `activity-update` - Activity status changed
- `task-changed` - Task updated
- `browser-notification` - Browser notification trigger

## Database Models

### User
- Authentication info
- Settings (active hours, intensity, etc.)
- Activity status
- Mode (boss/employee)

### Task
- Title, description
- Status, priority
- Due date
- User reference

### Notification
- Message, type
- Read status
- Timestamp
- User reference

### MessageTemplate
- Intensity level
- Message type
- Messages array
- User reference

## Activity Monitoring

The system automatically:
- Monitors user activity every minute
- Checks activity during active hours
- Sends notifications when inactive
- Updates activity scores
- Broadcasts live updates via WebSocket

## LLM Integration

LLM integration is prepared but commented out. To enable:

1. Uncomment code in `server/utils/llmIntegration.js`
2. Add `OPENAI_API_KEY` to `.env`
3. Set `LLM_ENABLED=true` in `.env`
4. Install OpenAI package: `npm install openai`

## Production Deployment

1. Build frontend:
```bash
npm run build
```

2. Set environment variables in production
3. Use process manager (PM2) for backend
4. Configure MongoDB Atlas or production MongoDB
5. Set up reverse proxy (Nginx)

## License

MIT
