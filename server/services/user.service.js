const userDao = require('../common/daos/user.dao');


class UserServices {
  /**
   * Updates the user with the given id with the provided data.
   * @param {string} userId - The id of the user to be updated.
   * @param {Object} userData - The new data to update the user with.
   * @returns {Promise<User>} - The updated user.
   * @throws {Error} If the user couldn't be updated.
   */
  async updateUser(userId, userData) {
    try {
      return await userDao.updateUser(userId, userData)
    } catch (error) {
      throw new Error('Error updating user in service: ' + error.message);
    }
  }

  /**
   * Deletes the user with the given id.
   * @param {string} userId - The id of the user to be deleted.
   * @returns {Promise<User>} - The deleted user.
   * @throws {Error} If the user couldn't be deleted.
   */
  async deleteUser(userId) {
    try {
      return await userDao.deleteUser(userId)
    } catch (error) {
      throw new ErrorEvent('Error deleting user:' + error.message);
    }
  }

  /**
   * Retrieves all users.
   * @returns {Promise<User[]>} - A list of all users.
   * @throws {Error} If the users couldn't be fetched.
   */
  async getAllUsers() {
    try {
      return await userDao.getAllUsers();
    } catch (error) {
      throw new Error('Error fetching users: ' + error.message);
    }
  }

  /**
   * Retrieves the user with the given id.
   * @param {string} userId - The id of the user to be retrieved.
   * @returns {Promise<User>} - The user with the given id.
   * @throws {Error} If the user couldn't be fetched.
   */
  async getUserById(userId) {
    try {
      return await userDao.getUserById(userId);
    } catch (error) {
      throw new Error('Error fetching user:' + error.message);
    }
  }

  /**
   * Retrieves the user with the given username.
   * @param {string} username - The username of the user to be retrieved.
   * @returns {Promise<User>} - The user with the given username.
   * @throws {Error} If the user couldn't be fetched.
   */
  async getUserByUser(username) {
    try {
      return await userDao.getUserByUsername(username);
    } catch (error) {
      throw new Error('Error fetching user:' + error.message);
    }
  }

  /**
  * Searches for users by username.
  * @param {string} usernameQuery - The username to search for.
  * @returns {Promise<User[]>} - A list of users that match the search query.
  * @throws {Error} If the users couldn't be fetched.
  */
  async searchUsersByUsername(usernameQuery) {
    try {
      return await userDao.searchUsersByUsername(usernameQuery);
    } catch (error) {
      throw new Error('Error searching users by username: ' + error.message);
    }
  }
}

module.exports = new UserServices();
