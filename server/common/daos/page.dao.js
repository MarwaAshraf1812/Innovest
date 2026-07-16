const Page = require('../../db/models/pageModel');
const CommunityPages = require('../../db/models/communityPagesModel');
const Community = require('../../db/models/communityModel');
const { validateCreatePage, validateUpdatePage } = require('../../db/validators/pageValidator');
const { checkMembershipStatus } = require('./community.dao');
const { User } = require('../../db/models/userModel');

class PageDAO {
  /**
   * Creates a new page.
   * @param {Object} pageData - Data for the new page.
   * @param {String} userId - ID of the user creating the page.
   * @returns {Promise<Page>} - The newly created page document.
   */
  async createPage(pageData, userId, communityId) {
    try {
      await checkMembershipStatus(userId, communityId);
      const page = new Page({
        ...pageData,
        author: userId,
      });
      return await page.save();
    } catch (error) {
      throw new Error('Error creating page: ' + error.message);
    }
  }

  /**
   * Updates a page.
   * @param {String} pageId - ID of the page to update.
   * @param {Object} pageData - Data to update the page with.
   * @param {String} userId - ID of the user updating the page.
   * @returns {Promise<Page>} - The updated page document.
   */
  async updatePage(pageId, pageData, userId) {
    const page = await Page.findOne({ page_id: pageId, author: userId });
    if (!page) {
      throw new Error('Page not found');
    }
    const { error } = validateUpdatePage(pageData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    if (page.author !== userId) {
      throw new Error('Not authorized to update this page');
    }
    try {
      const updatedPage = await Page.findOneAndUpdate(
        { page_id: pageId, author: userId },
        { $set: pageData },
        { new: true }
      );

      if (!updatedPage) {
        throw new Error('Page not found or not authorized to update');
      }

      return updatedPage;
    } catch (error) {
      throw new Error('Error updating page: ' + error.message);
    }
  }

  /**
   * Deletes a page.
   * @param {String} pageId - ID of the page to delete.
   * @param {String} userId - ID of the user deleting the page.
   * @returns {Promise<Boolean>} - True if the page was deleted successfully.
   * @throws {Error} If the page could not be deleted.
   */
async deletePage(pageId, userId, communityId) {
  try {
    // Ensure page_id is passed as string and matches DB field type
    const deletedPage = await Page.findOneAndDelete({ page_id: String(pageId), author: userId });
    
    if (!deletedPage) {
      throw new Error('Page not found or not authorized to delete');
    }

    const community = await Community.findOneAndUpdate(
      { community_id: String(communityId) }, 
      { 
        $pull: { pages: String(pageId) },
        $inc: { page_count: -1 }
      }, 
      { new: true }
    );

    if (!community) {
      throw new Error('Community not found');
    }

    return true;
  } catch (error) {
    throw new Error('Error deleting page: ' + error.message);
  }
}

async getCommunityPages(communityId) {
  try {
    const community = await Community.findOne({ community_id: communityId }).lean();
    if (!community) {
      throw new Error('Community not found');
    }

    const approvedJunctions = await CommunityPages.find({
      community_id: communityId,
      page_status: 'APPROVED'
    }).lean();

    const pageIds = approvedJunctions.map(j => j.page_id);
    const pages = await Page.find({ page_id: { $in: pageIds } }).lean();

    const populatedPages = await Promise.all(pages.map(async (p) => {
      let authorDetails = null;
      if (p.author) {
        authorDetails = await User.findOne({ id: p.author }).select('id role first_name last_name username profile_image').lean();
      }
      return {
        ...p,
        authorDetails
      };
    }));

    return {
      ...community,
      populatedPages
    };
  } catch (error) {
    throw new Error('Error getting pages by community: ' + error.message);
  }
}


  /**
   * Gets a page by its ID.
   * @param {String} pageId - ID of the page to get.
   * @returns {Promise<Page>} - The page document if found.
   * @throws {Error} If the page could not be fetched.
   */
  async getPageById(pageId) {
    try {
      return await Page.findOne({ page_id: pageId });

    } catch (error) {
      throw new Error('Error getting page by ID: ' + error.message);
    }
  }

  /**
   * Retrieves all pending pages of all communities.
   * @returns {Promise<CommunityPages[]>} - Array of pending community pages.
   * @throws {Error} If an error occurs while fetching the pending pages.
   */
  async getPendingPages() {
    try {
      const pendingPages = await CommunityPages.find({
        page_status: 'PENDING',
      }).lean();
      
      const populated = await Promise.all(pendingPages.map(async (cp) => {
        const pageDetails = await Page.findOne({ page_id: cp.page_id }).lean();
        const communityDetails = await Community.findOne({ community_id: cp.community_id }).lean();
        
        let authorDetails = null;
        if (pageDetails && pageDetails.author) {
          authorDetails = await User.findOne({ id: pageDetails.author }).lean();
        }
        
        return {
          ...cp,
          page: pageDetails,
          community: communityDetails,
          author: authorDetails
        };
      }));
      
      console.log(`Found and populated ${populated.length} pending pages`);
      return populated;
    } catch (error) {
      console.error('Error in DAO getPendingPages:', error);
      throw new Error('Error fetching pending pages: ' + error.message);
    }
  }

  /**
   * Approves a pending page to be added to a community.
   * @param {String} communityId - ID of the community to add the page to.
   * @param {String} pageId - ID of the page to add.
   * @param {String} adminId - ID of the admin approving the page.
   * @returns {Promise<CommunityPages>} - The updated community page document with the approved status.
   * @throws {Error} If an error occurs while approving the page.
   */
  async approvePageToAddCommunity(communityId, pageId, adminId) {
    try {
      const updatedCommunityPage = await CommunityPages.findOneAndUpdate(
        { community_id: communityId, page_id: pageId, page_status: 'PENDING' },
        { $set: { page_status: 'APPROVED', approved_by: adminId } },
        { new: true }
      );

      if (!updatedCommunityPage) {
        throw new Error(`No pending page found in community with ID: ${communityId}`);
      }

      const community = await Community.findOneAndUpdate(
        { community_id: communityId },
        { $addToSet: { pages: pageId }, $inc: { page_count: 1 } },
        { new: true }
      );

      if (!community) {
        throw new Error(`Community not found with ID: ${communityId}`);
      }

      console.log('Successfully approved page:', { communityId, pageId });
      return updatedCommunityPage; // Return the updated community page entry
    } catch (error) {
      throw new Error(`Error approving page to add to community: ${error.message}`);
    }
  }

  /**
   * Rejects a pending page to be added to a community.
   * @param {String} communityId - ID of the community to reject the page from.
   * @param {String} pageId - ID of the page to reject.
   * @param {String} adminId - ID of the admin rejecting the page.
   * @returns {Promise<CommunityPages>} - The updated community page document with the rejected status.
   * @throws {Error} If an error occurs while rejecting the page.
   */
  async rejectPageToAddCommunity(communityId, pageId, adminId) {
    try {
      return await CommunityPages.findOneAndUpdate(
        { community_id: communityId, page_id: pageId },
        { $set: { page_status: 'REJECTED', approved_by: adminId } },
        { new: true }
      );
    } catch (error) {
      throw new Error('Error rejecting page: ' + error.message);
    }
  }

  /**
   * Removes a page from a community.
   * @param {String} communityId - ID of the community to remove the page from.
   * @param {String} pageId - ID of the page to remove.
   * @param {String} userId - ID of the user removing the page.
   * @param {Boolean} isAdmin - Whether the user is an admin or not.
   * @returns {Promise<Object>} - An object containing a success message if the page is removed successfully.
   * @throws {Error} If an error occurs while removing the page.
   */
  async removePageFromCommunity(communityId, pageId, userId, isAdmin) {
    try {
      const removedPage = await CommunityPages.findOneAndDelete({
        community_id: communityId,
        page_id: pageId
      });

      if (!removedPage) {
        throw new Error(`Page with ID: ${pageId} not found in community with ID: ${communityId}`);
      }

      const updatedCommunity = await Community.findOneAndUpdate(
        { community_id: communityId },
        { $pull: { pages: pageId }, $inc: { page_count: -1 } },
        { new: true }
      );

      if (!updatedCommunity) {
        throw new Error(`Community with ID: ${communityId} not found`);
      }

      console.log('Successfully removed page from community:', { communityId, pageId });

      const page = await Page.findOne({ page_id: pageId });
      if (page.author.toString() !== userId && !isAdmin) {
        throw new Error(`User with ID: ${userId} is not authorized to remove this page.`);
      }

      await Page.findOneAndDelete({ page_id: pageId });
      await CommunityPages.findOneAndDelete({ page_id: pageId });

      console.log('Successfully removed page from community');
      return { message: 'Page removed from community successfully' };
    } catch (error) {
      throw new Error('Error removing page from community: ' + error.message);
    }
  }

  /**
 * Searches for pages by tags, username, and title.
 * @param {Object} searchCriteria - Contains search parameters like tags, username, and title.
 * @returns {Promise<Array>} - Array of pages that match the search criteria.
 */
async searchPages(searchCriteria) {
  const { tags, username, title } = searchCriteria;
  try {
    let query = {};

    if (tags && tags.length > 0) {
      query.tags = { $in: tags };
    }

    if (title) {
      query.title = { $regex: title, $options: 'i' };
    }

    if (username) {
      const users = await User.find({
        username: { $regex: username, $options: 'i' },
      });
      const allPages = await Promise.all(users.map( async (user) => {
        return await Page.find({ author: user.id, ...query });
      }))
      return allPages.flat();
    }

  } catch (error) {
    throw new Error('Error searching for pages: ' + error.message);
  }
}

  
}

module.exports = new PageDAO();
