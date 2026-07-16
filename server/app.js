const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const adminModule = require('./modules/admin.module');
const userModule = require('./modules/user.module');
const messageModule = require('./modules/message.module');
const likeModule = require("./modules/like.module");
const communityModule = require('./modules/community.module');
const { dbConection } = require("./config/db");
const bodyParser = require('body-parser');
const http = require('http');
const socketConfig = require('./config/socket');
const commentModule = require("./modules/comment.module");
const { addUserToPendingUsers, approveUserToJoinCommunity } = require('./controllers/community.controller');
const ProjectModule = require('./modules/project.module');



dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketConfig.init(server);

dbConection();

// Cors
const allowedOrigins = ['*', 'http://localhost:5173', 'http://localhost:3000',"https://client-ruddy-iota-11.vercel.app"];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));


app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(require('cookie-parser')());

// Routes
app.use('/api', adminModule());
app.use('/api', communityModule());
app.use('/api', userModule());
app.use('/api', messageModule());
app.use('/api', likeModule());
app.use('/api', commentModule());
app.use('/api', ProjectModule());

// Socket.IO setup
io.on('connection', (socket) => {
  console.log('A user connected');

  // ── User room registration ────────────────────────────────────────────────
  socket.on('registerUserSocket', (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`Socket joined user room: ${userId}`);
    }
  });

  // ── Direct messages ───────────────────────────────────────────────────────
  socket.on('sendMessage', (message) => {
    if (message && message.receiver_id) {
      io.to(message.receiver_id.toString()).emit('receiveMessage', message);
    }
  });

  /**
   * Channel: directMessage
   * Emits a new_notification to the target user's private room.
   * Payload: { receiverId, notification }
   */
  socket.on('notify:directMessage', ({ receiverId, notification } = {}) => {
    if (receiverId && notification) {
      io.to(receiverId.toString()).emit('new_notification', {
        ...notification,
        channel: 'directMessage',
      });
    }
  });

  // ── Community administrative alerts ──────────────────────────────────────
  socket.on("joinCommunity", async (communityId, userId) => {
    try {
      console.log("Received communityId:", communityId);
      console.log("Received userId:", userId);

      await addUserToPendingUsers(communityId, userId, socket);

      io.emit("newJoinRequest", { communityId, userId });
      socket.emit("joinRequestPending", "Your request is pending approval.");
    } catch (error) {
      console.error('Error handling join community request:', error);
      socket.emit('error', 'Something went wrong.');
    }
  });

  socket.on("approveJoinRequest", async (communityId, userId) => {
    try {
      await approveUserToJoinCommunity(communityId, userId, socket);
      io.emit("joinRequestApproved", { communityId, userId });
      socket.emit("joinRequestApproved", { communityId, userId, message: "User approved successfully." });
    } catch (error) {
      console.error('Error handling approve join request:', error);
      socket.emit('error', 'Something went wrong.');
    }
  });

  /**
   * Channel: communityAlert
   * Fans out a notification to all members of a community room.
   * Payload: { communityRoom, notification }
   */
  socket.on('notify:communityAlert', ({ communityRoom, notification } = {}) => {
    if (communityRoom && notification) {
      io.to(communityRoom.toString()).emit('new_notification', {
        ...notification,
        channel: 'communityAlert',
      });
    }
  });

  // ── System-wide announcements ─────────────────────────────────────────────
  /**
   * Channel: systemAnnouncement
   * Broadcasts a platform-wide notification to every connected socket.
   * Should only be emitted by authorised admin clients.
   * Payload: { notification }
   */
  socket.on('notify:systemAnnouncement', ({ notification } = {}) => {
    if (notification) {
      io.emit('new_notification', {
        ...notification,
        channel: 'system',
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
