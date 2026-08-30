/**
 * System and Channel Notification Socket Handlers
 */
const registerNotificationHandlers = (io, socket) => {
  // Direct Message Notification Channel
  socket.on('notify:directMessage', ({ receiverId, notification } = {}) => {
    if (receiverId && notification) {
      io.to(receiverId.toString()).emit('new_notification', {
        ...notification,
        channel: 'directMessage',
      });
    }
  });

  // Community Alert Channel
  socket.on('notify:communityAlert', ({ communityRoom, notification } = {}) => {
    if (communityRoom && notification) {
      io.to(communityRoom.toString()).emit('new_notification', {
        ...notification,
        channel: 'communityAlert',
      });
    }
  });

  // System-wide Announcement Channel
  socket.on('notify:systemAnnouncement', ({ notification } = {}) => {
    if (notification) {
      io.emit('new_notification', {
        ...notification,
        channel: 'system',
      });
    }
  });
};

module.exports = registerNotificationHandlers;
