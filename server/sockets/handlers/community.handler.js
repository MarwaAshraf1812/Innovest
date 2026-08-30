const mongoose = require('mongoose');
const { addUserToPendingUsers, approveUserToJoinCommunity } = require('../../controllers/community.controller');

/**
 * Community Administrative Socket Handlers
 */
const registerCommunityHandlers = (io, socket) => {
  socket.on('joinCommunity', async (communityId, userId) => {
    try {
      if (!communityId || !userId || !mongoose.Types.ObjectId.isValid(communityId)) {
        console.warn(`Invalid joinCommunity payload: communityId=${communityId}, userId=${userId}`);
        return socket.emit('error', 'Invalid community ID or user ID format.');
      }

      console.log('Received communityId:', communityId);
      console.log('Received userId:', userId);

      await addUserToPendingUsers(communityId, userId, socket);

      io.emit('newJoinRequest', { communityId, userId });
      socket.emit('joinRequestPending', 'Your request is pending approval.');
    } catch (error) {
      console.error('Error handling join community request:', error);
      socket.emit('error', 'Something went wrong.');
    }
  });

  socket.on('approveJoinRequest', async (communityId, userId) => {
    try {
      if (!communityId || !userId || !mongoose.Types.ObjectId.isValid(communityId)) {
        return socket.emit('error', 'Invalid community ID or user ID format.');
      }

      await approveUserToJoinCommunity(communityId, userId, socket);
      io.emit('joinRequestApproved', { communityId, userId });
      socket.emit('joinRequestApproved', { communityId, userId, message: 'User approved successfully.' });
    } catch (error) {
      console.error('Error handling approve join request:', error);
      socket.emit('error', 'Something went wrong.');
    }
  });
};

module.exports = registerCommunityHandlers;
