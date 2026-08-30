import CommunityDAO from '../common/daos/community.dao.js';
import adminDao from '../common/daos/admin.dao.js';

class CommunityServices {
  /**
   * Creates a new community using the provided data
   * @param {string} admin_id - The unique identifier of the admin creating the community
   * @param {Object} communityData - Data for the new community
   * @returns {Promise<Community>} - The newly created community
   * @throws {Error} - If an error occurs while saving the community
   */
  async createCommunity(admin_id, communityData) {
    try {
      console.log(`Attempting to create community for admin: ${admin_id}`);
      const isAdminResult = await adminDao.isAdmin(admin_id);
      console.log(`isAdmin result: ${isAdminResult}`);

      if (!isAdminResult) {
        const error = new Error('Only admins can create a community');
        error.statusCode = 403;
        throw error;
      }

      communityData.admins = [admin_id];
      const newCommunity = await CommunityDAO.createCommunity(communityData);
      console.log(`Community created: ${newCommunity._id}`);
      return newCommunity;
    } catch (error) {
      console.log(error);
      throw new Error('Error creating community:', error.message);
    }
  }

  /**
   * Updates an existing community using the provided data
   * @param {string} community_id - The unique id of the community to update
   * @param {string} admin_id - The unique identifier of the admin updating the community
   * @param {Object} communityData - Data for the updated community
   * @returns {Promise<Community>} - The updated community
   * @throws {Error} - If an error occurs while updating the
   * community or if the admin is not authorized
   */
  async updateCommunity(community_id, admin_id, communityData) {
    const isAdmin = await adminDao.isAdmin(admin_id);
    if (!isAdmin) {
      throw new Error('Only admins can update a community');
    }

    // Ensure the community exists before updating
    const community = await CommunityDAO.getCommunity(community_id);
    if (!community) {
      throw new Error(`Community not found: ${community_id}`);
    }

    return await CommunityDAO.updateCommunity(community_id, communityData);
  }

  /**
   * Deletes a community by its id
   * @param {string} community_id - The unique id of the community to delete
   * @param {string} admin_id - The unique identifier of the admin deleting the community
   * @returns {Promise<Community>} - The deleted community
   * @throws {Error} - If an error occurs while deleting the community
   * or if the admin is not authorized
   */
  async deleteCommunity(community_id, admin_id) {
    try {
      const isAdmin = await adminDao.isAdmin(admin_id);
      if (!isAdmin) {
        throw new Error('Only admins can delete a community');
      }

      const community = await CommunityDAO.getCommunity(community_id);
      if (!community || !community.admins.includes(admin_id)) {
        throw new Error('Only admins of this community can delete it');
      }
      return await CommunityDAO.deleteCommunity(community_id);
    } catch (error) {
      console.error('Error deleting community:', error);
    }
  }

  /**
   * Retrieves a community by its id
   * @param {string} community_id - The unique id of the community to retrieve
   * @returns {Promise<Community>} - The community
   * @throws {Error} - If an error occurs while fetching the community
   * or if the community is not found
   */
  async getCommunityById(community_id) {
    const community = await CommunityDAO.getCommunity(community_id);
    if (!community) {
      throw new Error(`Community not found: ${community_id}`);
    }
    return community;
  }

  /**
   * Retrieves all communities in the database
   * @returns {Promise<Community[]>} - An array of all communities
   * @throws {Error} - If an error occurs while fetching the communities
   */
  async getAllCommunities() {
    try {
      return await CommunityDAO.getAllCommunities();
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw new Error('Unable to retrieve communities at the moment');
    }
  }

  /**
   * Retrieves a community by its name
   * @param {string} community_name - The unique name of the community to retrieve
   * @returns {Promise<Community>} - The community
   * @throws {Error} - If an error occurs while fetching the community
   * @throws {Error} - If the community is not found
   */
  async getCommunityByName(community_name) {
    try {
      return await CommunityDAO.getCommunityByName(community_name);
    } catch (error) {
      console.error('Error fetching community by name:', error);
    }
  }

  /**
   * Adds a user to a community's pending users list
   * @param {string} communityId - The unique id of the community to add the user to
   * @param {string} userId - The unique id of the user to add
   * @returns {Promise<Community>} - The updated community
   * @throws {Error} - If an error occurs while updating the community
   */
  async addUserToPendingUsers(communityId, userId) {
    try {
      return await CommunityDAO.addUserToPendingUsers(communityId, userId);
    } catch (error) {
      console.error('Error adding user to pending users:', error);
      throw new Error('Unable to add user to pending users at the moment');
    }
  }

  async getPendingUsers() {
    try {
      return await CommunityDAO.getPendingUsers();
    } catch (error) {
      console.error('Error fetching pending users:', error);
      throw new Error('Unable to fetch pending users at the moment');
    }
  }

  /**
   * Approves a user to join a community
   * @param {string} communityId - The unique id of the community to approve the user to join
   * @param {string} userId - The unique id of the user to approve
   * @returns {Promise<Community>} - The updated community
   * @throws {Error} - If an error occurs while approving the user
   */
  async approveUserToJoinCommunity(communityId, userId) {
    try {
      return await CommunityDAO.approveUserToJoinCommunity(communityId, userId);
    } catch (error) {
      console.error('Error in service when approving user:', error);
    }
  }

  /**
   * Rejects a user to join a community
   * @param {string} communityId - The unique id of the community to reject the user from
   * @param {string} userId - The unique id of the user to reject
   * @returns {Promise<Community>} - The updated community
   * @throws {Error} - If an error occurs while rejecting the user
   */
  async rejectUserToJoinCommunity(communityId, userId) {
    try {
      return await CommunityDAO.rejectUserToJoinCommunity(communityId, userId);
    } catch (error) {
      console.error('Error rejecting user:', error);
      throw new Error('Unable to reject user at the moment');
    }
  }

  /**
   * Removes a user from a community
   * @param {string} communityId - The unique id of the community to remove the user from
   * @param {string} userId - The unique id of the user to remove
   * @returns {Promise<Community>} - The updated community
   * @throws {Error} - If an error occurs while removing the user
   */
  async removeUserFromCommunity(communityId, userId) {
    try {
      return await CommunityDAO.removeUserFromCommunity(communityId, userId);
    } catch (error) {
      console.error('Error removing user from community:', error);
      throw new Error('Error removing user from community: ' + error.message);
    }
  }

  /**
   * Retrieves the users of a community
   * @param {string} communityId - The unique id of the community to retrieve the users of
   * @returns {Promise<Array<User>>} - The users of the community
   * @throws {Error} - If an error occurs while fetching the community users
   */
  async getCommunityUsers(communityId) {
    try {
      return await CommunityDAO.getCommunityUsers(communityId);
    } catch (error) {
      console.error('Error fetching community users:', error);
      throw new Error('Error fetching community users: ' + error.message);
    }
  }

  async updateUserActiveStatus(communityId, userId, isActive) {
    try {
      return await CommunityDAO.updateUserActiveStatus(communityId, userId, isActive);
    } catch (error) {
      console.error('Error updating user active status:', error);
      throw new Error('Unable to update user active status: ' + error.message);
    }
  }

  /**
   * Searches for communities by their name.
   * @param {string} communityName - The name of the community to search for.
   * @returns {Promise<Community[]>} - A list of communities that match the search.
   * @throws {Error} - If an error occurs during the search.
   */
  async searchCommunitiesByName(communityNameQuery) {
    try {
      return await CommunityDAO.searchCommunitiesByName(communityNameQuery);
    } catch (error) {
      throw new Error(
        'Error in service layer while searching for communities: ' +
          error.message,
      );
    }
  }
}

export default new CommunityServices();
