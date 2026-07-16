const Admin = require('../../db/models/adminModel');

/**
 * adminDao class provides methods for interacting with admin user data.
 * It performs CRUD operations and handles interactions with the Admin model.
 */
class AdminDao {
  /**
   * Creates a new user with the given data.
   * @param {Object} userData - The user data to be stored in the database.
   * @returns {Promise<Admin>} - The newly created user.
   * @throws {Error} If the user couldn't be created.
   */
  async createAdmin(userData) {
    try {
      const user = new Admin(userData);
      return await user.save();
    } catch (error) {
      throw new Error('Error creating user: ' + error.message);
    }
  }

  /**
   * Updates the user with the given id with the provided data.
   * @param {string} id - The id of the user to be updated.
   * @param {Object} userData - The new data to update the user with.
   * @returns {Promise<Admin>} - The updated user.
   * @throws {Error} If the user couldn't be updated.
   */
  async updateAdmin(adminId, updateData) {
    try {
      const updatedAdmin = await Admin.findOneAndUpdate(
        { admin_id: adminId },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedAdmin) {
        throw new Error('Admin not found');
      }

      return updatedAdmin;
    } catch (error) {
      throw new Error('Error updating admin: ' + error.message);
    }
  }


  /**
   * Deletes the user with the given id.
   * @param {string} id - The id of the user to be deleted.
   * @returns {Promise<Admin>} - The deleted user.
   * @throws {Error} If the user couldn't be deleted.
   */
  async deleteAdmin(adminId) {
    try {
      const deletedAdmin = await Admin.findOneAndDelete({ admin_id: adminId });
      if (!deletedAdmin) {
        throw new Error('Admin not found');
      }
      return deletedAdmin;
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }

  /**
   * Retrieves all users with the role of either 'ADMIN' or 'SUPER_ADMIN'.
   * @returns {Promise<Admin[]>} - A list of all users with the roles 'ADMIN' or 'SUPER_ADMIN'.
   * @throws {Error} If the users couldn't be fetched.
   */
  async getAllAdmins() {
    try {
      return await Admin.find({ role: 'ADMIN' });
    } catch (error) {
      throw new Error('Error fetching users: ' + error.message);
    }
  }

  /**
   * Retrieves the user with the given id.
   * @param {string} id - The id of the user to be retrieved.
   * @returns {Promise<Admin>} - The user with the given id.
   * @throws {Error} If the user couldn't be fetched.
   */
  async getAdminByID(adminId) {
    try {
      return await Admin.findOne({ admin_id: adminId });
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }

  /**
   * Retrieves the user with the given email.
   * @param {string} email - The email of the user to be retrieved.
   * @returns {Promise<Admin>} - The user with the given email.
   * @throws {Error} If the user couldn't be fetched.
   */
  async getAdminByEmail(email) {
    try {
      return await Admin.findOne({ email: email });
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }

  /**
   * Retrieves the user with the given username.
   * @param {string} username - The username of the user to be retrieved.
   * @returns {Promise<Admin>} - The user with the given username.
   * @throws {Error} If the user couldn't be fetched.
   */
  async getAdminByUsername(username) {
    try {
      return await Admin.findOne({ username: username });
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }
  /**
   * Checks if a user is an admin
   * @param {string} admin_id - The unique identifier of the admin
   * @returns {Promise<boolean>} - Returns true if the user is an admin, false otherwise
   * @throws {Error} - If the admin cannot be found or there's an error querying the database
   */
  async isAdmin(adminId) {
    try {
      const admin = await Admin.findOne({ admin_id: adminId });
      if (!admin) {
        console.log(`No admin found with id: ${adminId}`);
        return false;
      }
      console.log(`Admin found: ${admin.role}`);
      return admin.role === 'SUPER_ADMIN' || admin.role === 'ADMIN';
    } catch (error) {
      console.error('Error checking admin status:', error);
      throw new Error('Unable to verify admin status');
    }
  }

  /**
  * Searches for admins by username.
  * @param {string} usernameQuery - The username to search for.
  * @returns {Promise<Admin[]>} - A list of admins that match the search query.
  * @throws {Error} If the admins couldn't be fetched.
  */
    async searchAdminsByUsername(usernameQuery) {
      try {
        const admins = await Admin.find({
          username: { $regex: usernameQuery, $options: 'i' },
        });
  
        if (admins.length === 0) {
          return null; // No admins found
        }
  
        return admins;
      } catch (error) {
        throw new Error('Error searching admins by username: ' + error.message);
      }
    }
  
}

module.exports = new AdminDao();
