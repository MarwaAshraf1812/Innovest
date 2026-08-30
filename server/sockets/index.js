import socketConfig from '../config/socket.js';
import registerDirectMessageHandlers from './handlers/directMessage.handler.js';
import registerCommunityHandlers from './handlers/community.handler.js';
import registerNotificationHandlers from './handlers/notification.handler.js';

/**
 * Main Socket Manager
 * Decouples socket configuration from Express app.js and enables horizontal scalability.
 */
export const initSocketServer = (server) => {
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

export default { initSocketServer };
