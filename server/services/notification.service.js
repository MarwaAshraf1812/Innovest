const NotificationDAO = require('../common/daos/notification.dao');
const Admin = require('../db/models/adminModel');
const { getIo } = require('../config/socket');

class NotificationService {

  /**
   * Creates a new notification for the given user with the given type and data.
   * Sends the notification to the user using socket.io.
   * @param {string} userId - The ID of the user to notify.
   * @param {string} type - The type of the notification.
   * @param {Object} data - The data for the notification.
   * @returns {Promise<Notification>} - The newly created notification.
   * @throws {Error} - If an error occurs while creating the notification.
   */
  async createNotification(userId, type, data) {
    try {
      const notificationData = { user_id: userId, type: type, data: data };
      const notification = await NotificationDAO.createNotification(notificationData);
      getIo().to(userId.toString()).emit('new_notification', notification);
      return notification;
    } catch (error) {
      throw new Error('Error creating notification: ' + error.message);
    }
  }

  /**
   * Notifies a user with a notification of the given type and data.
   * @param {string} userId - The ID of the user to notify.
   * @param {string} type - The type of the notification.
   * @param {Object} data - The data for the notification.
   * @returns {Promise<Notification>} - The created notification.
   */
  async notifyUser(userId, type, data) {
    return this.createNotification(userId, type, data);
  }

  /**
   * Notifies an admin user with a notification of the given type and data.
   * @param {string} adminId - The ID of the admin user to notify.
   * @param {string} type - The type of the notification.
   * @param {Object} data - The data for the notification.
   * @returns {Promise<Notification>} - The created notification.
   * @throws {Error} - If the admin user could not be found or the notification could not be created.
   */

  /**
   * Notifies an admin user with a notification of the given type and data.
   * @param {string} adminId - The ID of the admin user to notify.
   * @param {string} type - The type of the notification.
   * @param {Object} data - The data for the notification.
   * @returns {Promise<Notification>} - The created notification.
   * @throws {Error} - If the admin user could not be found or the notification could not be created.
   */
  async notifyAdmin(adminId, type, data) {
    try {
      const admin = await Admin.findOne({admin_id: adminId});
      if (!admin) {
        throw new Error('Admin not found');
      }
      return this.createNotification(admin.admin_id, type, data);
    } catch (error) {
      throw new Error('Error notifying admin: ' + error.message);
    }
  }

  /**
   * Retrieves all notifications for a user.
   * @param {string} userId - The ID of the user to retrieve notifications for.
   * @returns {Promise<Notification[]>} - A list of all notifications for the user or an empty array if an error occurs.
   */
  async getNotificationsForUser(userId) {
    try {
      return await NotificationDAO.getNotificationsForUser(userId);
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  }
}

module.exports = new NotificationService();
