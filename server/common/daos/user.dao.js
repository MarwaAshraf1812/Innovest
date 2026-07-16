const { userPermissionsEnum } = require('../../db/models/permissionsEnum');
const { User } = require('../../db/models/userModel');

class UserDao {
  /**
   * Creates a new user with the given data.
   * @param {Object} userData - The user data to be stored in the database.
   * @returns {Promise<User>} - The newly created user.
   * @throws {Error} If the user couldn't be created.
   */
  async createUser(userData) {
    try {
      const user = new User({
        ...userData,
        permissions: userPermissionsEnum
      });

      return await user.save();
    } catch (error) {
      console.log(error);
      throw new Error('Error creating user: ' + error.message);
    }
  }

  /**
   * Updates the user with the given id with the provided data.
   * @param {string} userId - The id of the user to be updated.
   * @param {Object} updateData - The new data to update the user with.
   * @returns {Promise<User>} - The updated user.
   * @throws {Error} If the user couldn't be updated.
   */
  async updateUser(userId, updateData) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { id: userId },
        updateData,
        { new: true, runValidators: true },
      );
      if (!updatedUser) {
        throw new Error('User not found');
      }
      return updatedUser;
    } catch (error) {
      throw new Error('Error updating user in dao: ' + error.message);
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
      const deletedUser = await User.findOneAndDelete({ id: userId });
      if (!deletedUser) {
        throw new Error('User not found');
      }
      return deletedUser;
    } catch (error) {
      throw new Error('Error deleting user: ' + error.message);
    }
  }


  async getUserById(userId) {
    try {
      const user = await User.findOne({ id: userId });
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw new Error('Error getting user: ' + error.message);
    }
  }

  /**
   * Retrieves all users.
   * @returns {Promise<User[]>} - A list of all users.
   * @throws {Error} If the users couldn't be fetched.
   */
  async getAllUsers() {
    try {
      return await User.find({});
    } catch (error) {
      throw new Error('Error getting users: ' + error.message);
    }
  }

  /**
   * Retrieves the user with the given email.
   * @param {string} email - The email of the user to be retrieved.
   * @returns {Promise<User>} - The user with the given email.
   * @throws {Error} If the user couldn't be fetched.
   */
  async getUserByEmail(email) {
    try {
      return await User.findOne({ email: email });
    } catch (error) {
      throw new Error('Error getting user: ' + error.message);
    }
  }

  /**
   * Retrieves the user with the given username.
   * @param {string} username - The username of the user to be retrieved.
   * @returns {Promise<User>} - The user with the given username.
   * @throws {Error} If the user couldn't be fetched.
   */
  async getUserByUsername(username) {
    try {
      return await User.findOne({ username: username });
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
    }
  }

  /**
   * Retrieves the user with the given username.
   * @param {string} username - The username of the user to be retrieved.
   * @returns {Promise<User>} - The user with the given username.
   * @throws {Error} If the user couldn't be fetched.
   */
  async getUserByUsername(username) {
    try {
      return await User.findOne({username: username});
    } catch (error) {
      throw new Error('Error fetching user: ' + error.message);
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
      const users = await User.find({
        username: { $regex: usernameQuery, $options: 'i' },
      });

      if (users.length === 0) {
        return null; // No users found
      }

      return users;
    } catch (error) {
      throw new Error('Error searching users by username: ' + error.message);
    }
  }

  async getUsersByVerifiedStatus(isVerified) {
    try {
        return await User.find({ is_verified: isVerified });
    } catch (error) {
        throw new Error('Error fetching users by verification status: ' + error.message);
    }
}
}

module.exports = new UserDao();
