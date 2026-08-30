const socketConfig = require('../config/socket');
const registerDirectMessageHandlers = require('./handlers/directMessage.handler');
const registerCommunityHandlers = require('./handlers/community.handler');
const registerNotificationHandlers = require('./handlers/notification.handler');

/**
 * Main Socket Manager
 * Decouples socket configuration from Express app.js and enables horizontal scalability.
 */
const initSocketServer = (server) => {
  const io = socketConfig.init(server);

  // Connection Lifecycle
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Attach modular handler suites
    registerDirectMessageHandlers(io, socket);
    registerCommunityHandlers(io, socket);
    registerNotificationHandlers(io, socket);

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = { initSocketServer };
