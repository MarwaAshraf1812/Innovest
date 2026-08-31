import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import { dbConection } from './config/db.js';
import { initSocketServer } from './sockets/index.js';
import { apiRateLimiter, authRateLimiter } from './middlewares/rateLimiter.js';

import adminModule from './modules/admin.module.js';
import communityModule from './modules/community.module.js';
import userModule from './modules/user.module.js';
import messageModule from './modules/message.module.js';
import likeModule from './modules/like.module.js';
import commentModule from './modules/comment.module.js';
import ProjectModule from './modules/project.module.js';
import proposalModule from './modules/proposal.module.js';
import vdrRoutes from './routes/vdr.routes.js';
import aiMatchmakingRoutes from './routes/ai_matchmaking.routes.js';
import dealRoomRoutes from './routes/deal_room.routes.js';

dotenv.config();
const app = express();
const server = http.createServer(app);

// Initialize modularized Socket.IO system
initSocketServer(server);

dbConection();

// Cors
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://client-ruddy-iota-11.vercel.app',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(null, true); // Fallback allow in dev/staging if needed
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply Rate Limiters
app.use('/api/', apiRateLimiter);
app.use('/api/user/login', authRateLimiter);
app.use('/api/user/signup', authRateLimiter);

// Routes
app.use('/api', adminModule);
app.use('/api', communityModule);
app.use('/api', userModule);
app.use('/api', messageModule);
app.use('/api', likeModule);
app.use('/api', commentModule);
app.use('/api', ProjectModule);
app.use('/api', proposalModule);
app.use('/api/vdr', vdrRoutes);
app.use('/api/matchmaking', aiMatchmakingRoutes);
app.use('/api/deal-room', dealRoomRoutes);

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
