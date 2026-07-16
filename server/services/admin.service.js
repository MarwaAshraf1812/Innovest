const adminDao = require('../common/daos/admin.dao');
const bycrypt = require('bcryptjs');
/**
 * AdminServices class provides methods for managing admin users.
 * It interacts with the adminDao to perform CRUD operations on admin data.
 */
class AdminServices {

  /**
   * Creates a new admin user.
   * @param {Object} adminData - The data for the new admin user.
   * @returns {Promise<Object>} The created admin user.
   */
  async createAdmin(adminData) {
    try {
      const salt = await bycrypt.genSalt(10);
      adminData.password = await bycrypt.hash(adminData.password, salt);
      return await adminDao.createAdmin(adminData);
    } catch (error) {
      throw new Error('Error creating admin: ' + error.message);
    }
  }

  /**
   * Updates an existing admin user by ID.
   * @param {string} id - The ID of the admin user to update.
   * @param {Object} adminData - The new data for the admin user.
   * @returns {Promise<Object>} The updated admin user.
   */
  async updateAdmin(id, adminData) {
    return await adminDao.updateAdmin(id, adminData);
  }

  /**
   * Retrieves all admin users.
   * @returns {Promise<Array>} A list of all admin users.
   */
  async getAllAdmins() {
    return await adminDao.getAllAdmins();
  }

  /**
   * Retrieves an admin user by ID.
   * @param {string} id - The ID of the admin user to retrieve.
   * @returns {Promise<Object>} The admin user with the specified ID.
   */
  async getAdminByID(id) {
    return await adminDao.getAdminByID(id);
  }

  /**
   * Deletes an admin user by ID.
   * @param {string} id - The ID of the admin user to delete.
   * @returns {Promise<Object>} The deleted admin user.
   */
  async deleteAdmin(id) {
    return await adminDao.deleteAdmin(id);
  }


  /**
     * Searches for admins by username.
     * @param {string} usernameQuery - The username query to search for.
     * @returns {Promise<Admin[]>} - List of admins matching the search query.
     * @throws {Error} If the search couldn't be performed.
     */
  async searchAdminsByUsername(usernameQuery) {
    try {
      return await adminDao.searchAdminsByUsername(usernameQuery);
    } catch (error) {
      throw new Error('Error searching admins by username: ' + error.message);
    }
  }
}

module.exports = new AdminServices();
