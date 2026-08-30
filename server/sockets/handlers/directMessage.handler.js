/**
 * Direct Message Socket Handlers
 */
const registerDirectMessageHandlers = (io, socket) => {
  // Register user to their private socket room
  socket.on('registerUserSocket', (userId) => {
    if (userId) {
      socket.join(userId.toString());
      console.log(`Socket joined user room: ${userId}`);
    }
  });

  // Handle sending direct messages
  socket.on('sendMessage', (message) => {
    if (message && message.receiver_id) {
      io.to(message.receiver_id.toString()).emit('receiveMessage', message);
    }
  });
};

export default registerDirectMessageHandlers;
