const Notification = require('../../db/models/notificationModel');

class NotificationDAO {
  /**
   * Creates a new notification in the database
   * @param {Object} notificationData - Data for the new notification
   * @returns {Promise<Notification>} - The created notification
   */
  async createNotification(notificationData) {
    try {
      const notification = new Notification(notificationData);
      await notification.save();
      
      return notification;
    } catch (error) {
      throw new Error('Error creating notification: ' + error.message);
    }
  }

  /**
   * Retrieves notifications for a given user
   * @param {string} userId - ID of the user to fetch notifications for
   * @returns {Promise<Notification[]>} - A list of notifications
   */
  async getNotificationsForUser(userId) {
    try {
      return await Notification.find({ user_id: userId }).sort('-createdAt').limit(20);
    } catch (error) {
      throw new Error('Error fetching notifications: ' + error.message);
    }
  }
}

module.exports = new NotificationDAO();
