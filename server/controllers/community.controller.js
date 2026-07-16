const CommunityServices = require('../services/community.service');
const {
  CreateCommunityDTO,
  UpdateCommunityDTO,
} = require('../common/dtos/communityDTO/community.dto');

class CommunityController {
  /**
   * Creates a new community using the provided data
   * @param {Object} req - The HTTP request object
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with the created community or an error message
   */
  async createCommunity(req, res) {
    try {
      // check on it again
      const admin_id = req.user.id;
      const communityData = new CreateCommunityDTO(req.body);
      const community = await CommunityServices.createCommunity(
        admin_id,
        communityData,
      );
      res.status(201).json({ message: 'Community created', community });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Updates an existing community using the provided data
   * @param {Object} req - The HTTP request object containing the
   * community name in the params and update data in the body
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with the updated community or an error message
   */
  async updateCommunity(req, res) {
    try {
      const { community_id } = req.params;
      const admin_id = req.user.id;
      const communityData = new UpdateCommunityDTO(req.body);

      const community = await CommunityServices.updateCommunity(
        community_id,
        admin_id,
        communityData,
      );
      res.status(200).json({ message: 'Community updated', community });
    } catch (error) {
      console.error('Error in updateCommunity:', error);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Deletes a community by its name
   * @param {Object} req - The HTTP request object containing the community name in the params
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with a 200 status code if successful or an error message
   */
  async deleteCommunity(req, res) {
    try {
      const { community_id } = req.params;
      const admin_id = req.user.id;

      const community = await CommunityServices.deleteCommunity(
        community_id,
        admin_id,
      );
      res.status(200).json({ message: 'Community deleted', community });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Retrieves a community by its name
   * @param {Object} req - The HTTP request object containing the community name in the params
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with the community or an error message
   */
  async getCommunityById(req, res) {
    try {
      const { community_id } = req.params;
      const community = await CommunityServices.getCommunityById(community_id);
      res.status(200).json(community);
    } catch (error) {
      console.error('Error in getCommunityById:', error);
      res.status(400).json({ message: error.message, stack: error.stack });
    }
  }

  /**
   * Retrieves all communities in the database
   * @param {Object} req - The HTTP request object
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with an array of all communities or an error message
   */
  async getAllCommunities(req, res) {
    try {
      const communities = await CommunityServices.getAllCommunities();
      res.status(200).json({ communities });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Retrieves a community by its name
   * @param {Object} req - The HTTP request object containing the community name in the params
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with the community or an error message
   */
  async getCommunityByName(req, res) {
    try {
      const { community_name } = req.params;
      const community =
        await CommunityServices.getCommunityByName(community_name);
      res.status(200).json({ community });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Adds a user to a community's pending users list
   * @param {Object} req - The HTTP request object containing
   * the community id in the params and the user id in the body
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with the updated community or an error message
   */
  async addUserToPendingUsers(req, res, next) {
    try {
      let communityId, userId, socket;
      let isExpress = false;

      // Handle both Express route signature (req, res) and Socket.IO signature (communityId, userId, socket)
      if (req && req.params && req.user) {
        isExpress = true;
        communityId = req.params.community_id;
        userId = req.user.id;
      } else {
        communityId = req;
        userId = res;
        socket = next;
      }

      if (!communityId || !userId) {
        if (isExpress) {
          return res.status(400).json({ message: "Invalid communityId or userId" });
        }
        throw new Error("Invalid communityId or userId");
      }

      const community = await CommunityServices.addUserToPendingUsers(
        communityId,
        userId,
      );

      if (isExpress) {
        return res.status(200).json({ message: "Join request submitted successfully", community });
      } else {
        if (socket) {
          socket.emit("joinRequestPending", { message: "Your request is pending approval.", community });
        }
        return community;
      }
    } catch (error) {
      console.error('Error in addUserToPendingUsers:', error);
      if (req && req.params && req.user) {
        return res.status(400).json({ message: error.message });
      }
      throw error;
    }
  }

  async getPendingUsers(req, res) {
    try {
      const pendingUsers = await CommunityServices.getPendingUsers();
  
      if (!pendingUsers || pendingUsers.length === 0) {
        console.log('No pending users found');
        return res.status(404).json({ message: 'No pending users found' });
      }
  
      console.log(`Returning ${pendingUsers.length} pending users`);
      return res.status(200).json(
        pendingUsers,
      );
    } catch (error) {
      console.error('Error in Controller getPendingUsers:', error);
      return res.status(500).json({
        message: 'Error fetching pending users: ' + error.message,
      });
    }
  }

  async getMyMemberships(req, res) {
    try {
      const userId = req.user.id;
      const CommunityUsers = require('../db/models/communityUsersModel');
      const memberships = await CommunityUsers.find({ user_id: userId });
      return res.status(200).json(memberships || []);
    } catch (error) {
      console.error('Error in Controller getMyMemberships:', error);
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * Approves a user to join a community
   * @param {Object} req - The HTTP request object containing
   * the community id in the params and the user id in the body
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with the updated community or an error message
   */
  async approveUserToJoinCommunity(req, res) {
    try {
      const { community_id, user_id } = req.params;
      console.log('Approving user to join community', community_id, user_id);

      const community = await CommunityServices.approveUserToJoinCommunity(
        community_id,
        user_id,
      );
      const hasJoined =
        Array.isArray(community.users) && community.users.includes(user_id);

      console.log(
        user_id,
        hasJoined ? 'successfully joined' : 'failed to join',
      );

      if (hasJoined) {
        community.member_count = community.users.length;
        await community.save();
        
        try {
          const NotificationService = require('../services/notification.service');
          await NotificationService.notifyUser(user_id, 'communityJoinApproved', {
            community_id,
            community_name: community.community_name,
            message: `Your request to join the community "${community.community_name}" has been approved.`
          });
        } catch (err) {
          console.error("Failed to notify user about community join approval:", err);
        }

        res.status(200).json({
          message: 'User has successfully joined the community.',
          community,
        });
      } else {
        res.status(400).json({
          message: 'Failed to join the community. Please try again.',
          community,
        });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Rejects a user to join a community
   * @param {Object} req - The HTTP request object containing
   * the community id in the params and the user id in the body
   * @param {Object} res - The HTTP response object
   * @returns {Promise<void>} - Responds with the updated community or an error message
   */
  async rejectUserToJoinCommunity(req, res) {
    try {
      const { community_id, user_id } = req.params;
      const community = await CommunityServices.rejectUserToJoinCommunity(
        community_id,
        user_id,
      );

      try {
        const NotificationService = require('../services/notification.service');
        await NotificationService.notifyUser(user_id, 'communityJoinRejected', {
          community_id,
          community_name: community?.community_name || 'Community',
          message: `Your request to join the community "${community?.community_name || 'Community'}" has been rejected.`
        });
      } catch (err) {
        console.error("Failed to notify user about community join rejection:", err);
      }

      res.status(200).json({
        message: 'User has been rejected from joining the community.',
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Removes a user from a community
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Promise<void>}
   */
  async removeUserFromCommunity(req, res) {
    const { community_id, user_id } = req.params;
    const authenticatedUserId = req.user.id;
    const userRole = req.user.role;

    const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN';

    if (!isAdmin && authenticatedUserId !== user_id) {
      return res
        .status(403)
        .json({
          message: 'Forbidden: You can only remove yourself from the community',
        });
    }

    try {
      const updatedCommunity = await CommunityServices.removeUserFromCommunity(
        community_id,
        user_id,
      );
      res
        .status(200)
        .json({ message: 'User removed from community'});
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateUserActiveStatus(req, res) {
    const { community_id, user_id } = req.params;
    const { is_active } = req.body;

    if (is_active === undefined) {
      return res.status(400).json({ message: 'is_active field is required' });
    }

    try {
      const updatedUser = await CommunityServices.updateUserActiveStatus(
        community_id,
        user_id,
        !!is_active
      );
      res.status(200).json({ message: 'User active status updated successfully', membership: updatedUser });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieves users of a community
   * @param {Object} req - The request object
   * @param {Object} res - The response object
   * @returns {Promise<void>}
   */
  async getCommunityUsers(req, res) {
    const { community_id } = req.params;

    try {
      const users = await CommunityServices.getCommunityUsers(community_id);
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  /**
   * Handles the request to search for communities by their name.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  async searchCommunities(req, res) {
    try {
      const { communityNameQuery } = req.query;
      if (!communityNameQuery) {
        return res.status(400).json({ message: 'Community name is required' });
      }

      const communities =
        await CommunityServices.searchCommunitiesByName(communityNameQuery);
      res.status(200).json(communities);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CommunityController();
