const Community = require('../../db/models/communityModel');
const { v4: uuidv4 } = require('uuid');
const CommunityUsers = require('../../db/models/communityUsersModel');
const { User } = require('../../db/models/userModel');

class CommunityDAO {
  /**
   * Creates a new community using the provided data
   * @param {Object} communityData - Data for the new community
   * @returns {Promise<Community>} - The newly created community
   * @throws {Error} - If an error occurs while saving the community
   */
  async createCommunity(communityData) {
    try {
      if (communityData.admins && !Array.isArray(communityData.admins)) {
        communityData.admins = [communityData.admins];
      }

      const community = new Community({
        community_id: uuidv4(),
        ...communityData,
      });

      return await community.save();
    } catch (error) {
      if (error.code === 1100) {
        throw new Error(
          `A community with the name "${communityData.community_name}" already exists.`,
        );
      }
      throw new Error('Error creating community: ' + error.message);
    }
  }

  /**
   * Updates an existing community using the provided data
   * @param {string} communityId - The unique id of the community to update
   * @param {Object} communityData - Data for the updated community
   * @returns {Promise<Community>} - The updated community
   * @throws {Error} - If an error occurs while updating the community or if the community is not found
   */
  async updateCommunity(communityId, communityData) {
    try {
      const updatedCommunity = await Community.findOneAndUpdate(
        { community_id: communityId },
        communityData,
        { new: true },
      );

      if (!updatedCommunity) {
        throw new Error('Community not found');
      }
      return updatedCommunity;
    } catch (error) {
      throw new Error('Error updating community: ' + error.message);
    }
  }

  /**
   * Deletes a community by its id
   * @param {string} communityId - The unique id of the community to delete
   * @returns {Promise<Community>} - The deleted community
   * @throws {Error} - If an error occurs while deleting the community
   * or if the community is not found
   */
  async deleteCommunity(communityId) {
    try {
      const deletedCommunity = await Community.findOneAndDelete({
        community_id: communityId,
      });
      if (!deletedCommunity) {
        throw new Error('Community not found');
      }
      return deletedCommunity;
    } catch (error) {
      throw new Error('Error deleting community: ' + error.message);
    }
  }

  async _enrichCommunityWithUsers(communityDoc) {
    if (!communityDoc) return null;
    const plain = communityDoc.toObject ? communityDoc.toObject() : communityDoc;
    const memberships = await CommunityUsers.find({
      community_id: plain.community_id,
      member_status: 'APPROVED',
      is_active: true
    }).lean();
    
    const userIds = memberships.map(m => m.user_id).filter(Boolean);
    const users = await User.find({ id: { $in: userIds } }, 'id first_name last_name username email profile_image role').lean();
    
    plain.users = memberships
      .map(m => {
        const userObj = users.find(u => u.id === m.user_id);
        if (userObj) {
          return {
            ...userObj,
            role: m.role || 'MEMBER',
            is_active: m.is_active
          };
        }
        return null;
      })
      .filter(Boolean);
    return plain;
  }

  /**
   * Retrieves all communities in the database
   * @returns {Promise<Community[]>} - An array of all communities
   * @throws {Error} - If an error occurs while fetching the communities
   */
  async getAllCommunities() {
    try {
      const communities = await Community.find({});
      return await Promise.all(communities.map(c => this._enrichCommunityWithUsers(c)));
    } catch (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Retrieves a community by its id
   * @param {string} communityId - The unique id of the community to retrieve
   * @returns {Promise<Community>} - The community
   * @throws {Error} - If an error occurs while fetching the community or
   * if the community is not found
   */
  async getCommunity(communityId) {
    try {
      const community = await Community.findOne({ community_id: communityId });
      if (!community) {
        throw new Error(`Community not found with ID: ${communityId}`);
      }
      return await this._enrichCommunityWithUsers(community);
    } catch (error) {
      console.error('Error fetching community:', error);
      throw new Error('Error fetching community: ' + error.message);
    }
  }

  /**
   * Retrieves a community by its name
   * @param {string} community_id - The community name to retrieve
   * @returns {Promise<Community>} - The community
   * @throws {Error} - If an error occurs while fetching the community
   */
  async getCommunityByName(community_name) {
    try {
      const community = await Community.findOne({ community_name: community_name });
      if (!community) {
        throw new Error('Community not found');
      }
      return await this._enrichCommunityWithUsers(community);
    } catch (error) {
      console.error('Error fetching community by name:', error);
      throw new Error('Error fetching community: ' + error.message);
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
      const existingUser = await CommunityUsers.findOne({
        community_id: communityId,
        user_id: userId,
      });

      if (existingUser) {
        console.log(`User with ID: ${userId} is already in community with ID: ${communityId}`);
        return {
          message: `User is already a member of the community.`,
          communityUser: existingUser,
        };
      }
      const communityUserEntry = new CommunityUsers({
        user_id: userId,
        community_id: communityId,
        member_status: 'PENDING',
        role: 'MEMBER',
      });
      return await communityUserEntry.save();
    } catch (error) {
      console.error('Error adding user to pending users:', error);
      throw new Error('Error adding user to pending users: ' + error.message);
    }
  }

  async getPendingUsers() {
    try {
      const pendingUsers = await CommunityUsers.find({
        member_status: 'PENDING',
      });
      
      const enriched = await Promise.all(pendingUsers.map(async (entry) => {
        const userObj = await User.findOne({ id: entry.user_id }).select('first_name last_name username email role');
        const commObj = await require('../../db/models/communityModel').findOne({ community_id: entry.community_id }).select('community_name');
        return {
          id: entry._id,
          user_id: entry.user_id,
          community_id: entry.community_id,
          member_status: entry.member_status,
          role: entry.role,
          user: userObj,
          community: commObj
        };
      }));

      return enriched;
    } catch (error) {
      console.error('Error fetching pending users:', error);
      throw new Error('Error fetching pending users: ' + error.message);
    }
  }

  /**
   * Adds a user to a community's user list
   * @param {string} communityId - The unique id of the community to add the user to
   * @param {string} userId - The unique id of the user to add
   * @returns {Promise<Community>} - The updated community
   * @throws {Error} - If an error occurs while updating the community
   */
  async approveUserToJoinCommunity(communityId, userId) {
    try {
      console.log('Approving user:', userId);
      console.log('In community:', communityId);
      const communityUser = await CommunityUsers.findOneAndUpdate(
        { community_id: communityId, user_id: userId, member_status: 'PENDING' },
        { member_status: 'APPROVED' },
        { new: true }
      );
  
      if (!communityUser) {
        throw new Error(`There is no pending user with ID ${userId} in community ${communityId}`);
      }

      const community = await Community.findOneAndUpdate(
        { community_id: communityId },
        { $addToSet: { users: userId }, $inc: { member_count: 1 } },
        { new: true }
      );

      const updateUserCommunities = await User.findOneAndUpdate(
        { id: userId },
        { $addToSet: { user_communities: communityId } },
        { new: true }
      );
      if (!community) {
        throw new Error(`Community not found with ID: ${communityId}`);
      }
      if (!updateUserCommunities) {
        throw new Error(`User not found with ID: ${userId}`);
      }
  
      console.log('Successfully approved user:', { communityId, userId });
      return community;
    } catch (error) {
      console.error('Error in approveUserToJoinCommunity:', error);
      throw error;
    }
  }
  
  async rejectUserToJoinCommunity(communityId, userId) {
    try {
      return await CommunityUsers.findOneAndDelete({
        community_id: communityId,
        user_id: userId
      })
    } catch (error) {
      console.error('Error rejecting user to join community:', error);
      throw new Error('Error rejecting user to join community: ' + error.message);
    }
  }

  /**
   * Removes a user from a community's user list
   * @param {string} communityId - The unique id of the community to remove the user from
   * @param {string} userId - The unique id of the user to remove
   * @returns {Promise<Community>} - The updated community
   * @throws {Error} - If an error occurs while updating the community
   */
  async removeUserFromCommunity(communityId, userId) {
    try {
      const removedUser = await CommunityUsers.findOneAndDelete({
        community_id: communityId,
        user_id: userId
      });

      if (!removedUser) {
        throw new Error(`User with ID: ${userId} not found in community with ID: ${communityId}`);
      }

      const updatedCommunity = await Community.findOneAndUpdate(
        { community_id: communityId },
        { $pull: { users: userId }, $inc: { member_count: -1 } },
        { new: true }
      );

      if (!updatedCommunity) {
        throw new Error(`Community with ID: ${communityId} not found`);
      }

      console.log('Successfully removed user from community:', { communityId, userId });

      return {
        message: "User removed from community successfully.",
        updatedCommunity
      };
    } catch (error) {
      console.error('Error removing user from community:', error);
      throw new Error('Error removing user from community: ' + error.message);
    }
  }


  /**
   * Retrieves the users of a community
   * @param {string} communityId - The unique id of the community to retrieve users for
   * @returns {Promise<Community>} - The community with its users populated
   * @throws {Error} - If an error occurs while retrieving the community
   */
  async getCommunityUsers(communityId) {
    try {
      const memberships = await CommunityUsers.find({ community_id: communityId, member_status: 'APPROVED' }).lean();
      const userIds = memberships.map(m => m.user_id).filter(Boolean);
      const users = await User.find({ id: { $in: userIds } }, 'id first_name last_name username email profile_image role').lean();
      
      return memberships.map(m => {
        const userObj = users.find(u => u.id === m.user_id);
        return {
          ...m,
          user_id: userObj || null
        };
      });
    } catch (error) {
      console.error('Error fetching community users:', error);
      throw new Error('Error fetching community users: ' + error.message);
    }
  }

  async checkMembershipStatus(user_id, community_id) {
    try {
      console.log(`Checking membership for user: ${user_id} in community: ${community_id}`);

      const communityUser = await CommunityUsers.findOne({ user_id, community_id });

      if (!communityUser) {
        console.log('No community user found for this user and community.');
        throw new Error('User is not part of this community');
      }

      if (communityUser.member_status !== 'APPROVED') {
        console.log('User is not approved');
        throw new Error('User is not approved to perform this action in the community');
      }

      return true;
    } catch (error) {
      console.error('Error checking membership status:', error.message);
      throw new Error('Error checking membership status: ' + error.message);
    }
  }

  async updateUserActiveStatus(communityId, userId, isActive) {
    try {
      const communityUser = await CommunityUsers.findOneAndUpdate(
        { community_id: communityId, user_id: userId },
        { is_active: isActive },
        { new: true }
      );
      if (!communityUser) {
        throw new Error(`Membership record not found for user ${userId} in community ${communityId}`);
      }
      return communityUser;
    } catch (error) {
      console.error('Error updating user active status:', error);
      throw new Error('Error updating user active status: ' + error.message);
    }
  }

  async searchCommunitiesByName(communityNameQuery) {
    try {
      const communities = await Community.find({
        community_name: { $regex: communityNameQuery, $options: 'i' }
      });

      if (communities.length === 0) {
        throw new Error('No communities found with the given name');
      }

      return await Promise.all(communities.map(c => this._enrichCommunityWithUsers(c)));
    } catch (error) {
      throw new Error('Error searching for community: ' + error.message);
    }

  }
}

module.exports = new CommunityDAO();
