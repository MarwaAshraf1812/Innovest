import UserService from '../services/user.service.js';
import { User } from '../db/models/userModel.js';
import Project from '../db/models/projectModel.js';
import CommunityUsers from '../db/models/communityUsersModel.js';
import Investment from '../db/models/investmentModel.js';
import NotificationService from '../services/notification.service.js';
import Notification from '../db/models/notificationModel.js';

class UserController {
  /**
   * Updates an existing user identified by the given ID.
   * @param {Object} req - The HTTP request object containing the user ID in the params and update data in the body.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with the updated user or an error message.
   */
  async updateUser(req, res) {
    try {
      const requesterId = req.user.id;
      const requesterRole = req.user.role;
      const targetUserId = req.params.id;

      const isAdmin = ['ADMIN', 'SUPER_ADMIN'].includes(requesterRole);

      if (!isAdmin && requesterId !== targetUserId) {
        return res.status(403).json({ message: 'Forbidden: You can only update your own profile data.' });
      }

      let updateData = { ...req.body };

      // If not an admin, restrict the keys they can modify
      if (!isAdmin) {
        const allowedKeys = [
          'first_name',
          'last_name',
          'phone',
          'country',
          'user_background',
          'experience',
          'investment_preferences',
          'profile_image',
          'following'
        ];
        const filteredData = {};
        allowedKeys.forEach(key => {
          if (updateData[key] !== undefined) {
            filteredData[key] = updateData[key];
          }
        });
        updateData = filteredData;
      }

      const updatedUser = await UserService.updateUser(targetUserId, updateData);
      if (!updatedUser)
        return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ message: 'User updated', user: updatedUser });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Deletes a user identified by the given ID.
   * @param {Object} req - The HTTP request object containing the user ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a 204 status code if successful or an error message.
   */
  async deleteUser(req, res) {
    try {
      const deletedUser = await UserService.deleteUser(req.params.id);
      if (!deletedUser)
        return res.status(404).json({ message: 'User not found' });
      res.status(200).json({ message: 'User deleted', deletedUser });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Retrieves a user identified by the given ID.
   * @param {Object} req - The HTTP request object containing the user ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with the user or an error message.
   */
  async getUserById(req, res) {
    try {
      const user = await UserService.getUserById(req.params.id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Retrieves all users.
   * @param {Object} req - The HTTP request object.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a list of all users or an error message.
   */
  async getUsers(req, res) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * Handles the request to search users by username.
   * @param {Object} req - The request object containing query params.
   * @param {Object} res - The response object to send the results.
   */
  async searchUsers(req, res) {
    const { usernameQuery } = req.query;

    if (!usernameQuery) {
      return res.status(400).json({ error: 'Username query is required' });
    }

    try {
      const users = await UserService.searchUsersByUsername(usernameQuery);

      if (!users || users.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  /**
   * Returns all verified users with role INVESTOR.
   * Used by ExploreInvestorsView to populate the investor directory.
   */
  async getInvestors(req, res) {
    try {
      const investors = await User.find(
        { role: 'INVESTOR', is_verified: true },
        { password: 0, id_documents: 0 }
      ).lean();
      return res.status(200).json(investors);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * Returns summary stats for the logged-in user's dashboard.
   * Covers: active pitches, communities joined, and investments made.
   */
  async getUserStats(req, res) {
    try {
      const userId = req.user.id;
      const role   = req.user.role;

      let dbUserId = userId;
      if (role === 'INVESTOR') {
        const userObj = await User.findOne({ id: userId });
        if (userObj) {
          dbUserId = userObj._id;
        }
      }

      const [pitchCount, communityCount, investmentCount] = await Promise.all([
        role === 'ENTREPRENEUR'
          ? Project.countDocuments({ entrepreneur_id: userId, approved: 'approved' })
          : 0,
        CommunityUsers.countDocuments({ user_id: userId, member_status: 'APPROVED' }),
        role === 'INVESTOR'
          ? Investment.countDocuments({ investor_id: dbUserId })
          : 0,
      ]);

      return res.status(200).json({ pitchCount, communityCount, investmentCount });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getNotifications(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await NotificationService.getNotificationsForUser(userId);
      return res.status(200).json(notifications);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async markNotificationAsRead(req, res) {
    try {
      const userId = req.user.id;
      const { notification_id } = req.params;
      const notification = await Notification.findOneAndUpdate(
        { _id: notification_id, user_id: userId },
        { read: true },
        { new: true }
      );
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      return res.status(200).json(notification);
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async markAllNotificationsAsRead(req, res) {
    try {
      const userId = req.user.id;
      await Notification.updateMany({ user_id: userId, read: false }, { read: true });
      return res.status(200).json({ message: 'All notifications marked as read' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

export default new UserController();
