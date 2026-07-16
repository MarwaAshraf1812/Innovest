const PageDAO = require('../common/daos/page.dao');
const notificationService = require('./notification.service');
// const socketIO = require('../config/socket');
const CommunityPages = require('../db/models/communityPagesModel');

class PageService {
  /**
   * Creates a new page in a community with the given community ID and pending status.
   * The page is created with the data provided in the request body.
   * @param {Object} pageData - The page data to create the page with.
   * @param {String} communityId - The ID of the community to add the page to.
   * @param {String} userId - The ID of the user creating the page.
   * @param {String} adminId - The ID of the admin user to notify about the new page.
   * @returns {Promise<Page>} - The created page document.
   * @throws {Error} - If an error occurs while creating the page.
   */
  async createPage(pageData, communityId, userId, adminId) {
    console.log(communityId)
    try {
      const page = await PageDAO.createPage(pageData, userId, communityId);
      console.log(page)
      const communityPageEntry = new CommunityPages({
        community_id: communityId,
        page_id: page.page_id,
        page_status: 'PENDING',
      });
      await communityPageEntry.save();

      // Optional: Notify admins about the new pending page
      notificationService.notifyAdmin(adminId, 'post', {
        page_id: page.page_id,
        author: userId,
      });

      // Emit event to notify others
      // socketIO.getIO().emit('new_page_created', page);

      return page; // Return the created page
    } catch (error) {
      throw new Error('Error creating page in community: ' + error.message);
    }
  }

  /**
   * Updates a page by ID with the given data.
   * @param {String} pageId - The ID of the page to update.
   * @param {Object} pageData - The data to update the page with.
   * @param {String} userId - The ID of the user updating the page.
   * @returns {Promise<Page>} - The updated page document.
   * @throws {Error} - If an error occurs while updating the page.
   */
  async updatePage(pageId, pageData, userId) {
    try {
      const page = await PageDAO.updatePage(pageId, pageData, userId);
      const communityPage = await CommunityPages.findOne({ page_id: pageId });

      return page;
    } catch (error) {
      throw new Error('Error updating page: ' + error.message);
    }
  }

  /**
   * Deletes a page by its ID.
   * @param {String} pageId - The ID of the page to delete.
   * @param {String} userId - The ID of the user deleting the page.
   * @returns {Promise<Boolean>} - True if the page was deleted successfully.
   * @throws {Error} - If the page could not be deleted.
   */
  async deletePage(pageId, userId, communityId) {
    try {
      const deleted = await PageDAO.deletePage(pageId, userId, communityId);
      return deleted;
    } catch (error) {
      throw new Error('Error deleting page: ' + error.message);
    }
  }

  /**
   * Retrieves a page by its ID.
   * @param {String} pageId - The ID of the page to retrieve.
   * @returns {Promise<Page>} - The retrieved page document.
   * @throws {Error} - If an error occurs while retrieving the page.
   */
  async getPageById(pageId) {
    try {
      return await PageDAO.getPageById(pageId);
    } catch (error) {
      throw new Error('Error getting page by ID: ' + error.message);
    }
  }

  /**
   * Retrieves all pages that are pending approval.
   * @returns {Promise<Page[]>} - An array of all pending page documents.
   * @throws {Error} - If an error occurs while retrieving the pending pages.
   */
  async getPendingPages() {
    try {
      const pages = await PageDAO.getPendingPages();
      console.log(`Service received ${pages.length} pending pages`);
      return pages;
    } catch (error) {
      console.error('Error in Service getPendingPages:', error);
      throw new Error('Error getting pending pages: ' + error.message);
    }
  }

  /**
   * Retrieves all pages that are part of a community.
   * @param {String} communityId - The ID of the community to retrieve pages for.
   * @returns {Promise<Page[]>} - An array of all pages that are part of the community.
   * @throws {Error} - If an error occurs while retrieving the pages.
   */
  async getPages(communityId) {
    try {
      return await PageDAO.getCommunityPages(communityId);
    } catch (error) {
      console.log(error.message);
      throw new Error('Error getting pages by community: ' + error.message);
    }
  }

  /**
   * Approves a page to be added to a community.
   * @param {String} communityId - The ID of the community to add the page to.
   * @param {String} pageId - The ID of the page to approve.
   * @param {String} adminId - The ID of the admin user to notify about the new page.
   * @param {String} userId - The ID of the user who created the page.
   * @returns {Promise<Page>} - The approved page document.
   * @throws {Error} - If an error occurs while approving the page.
   */
  async approvePageToAddCommunity(communityId, pageId, adminId, userId) {
    try {
      const page = await PageDAO.approvePageToAddCommunity(communityId, pageId, adminId);
      notificationService.notifyUser(userId, 'post', {
        page_id: page.page_id,
      });

      return page;
    } catch (error) {
      throw new Error('Error approving page: ' + error.message);
    }
  }

  /**
   * Rejects a page to be added to a community.
   * @param {String} communityId - The ID of the community to reject the page from.
   * @param {String} pageId - The ID of the page to reject.
   * @param {String} adminId - The ID of the admin user to notify about the rejected page.
   * @returns {Promise<Page>} - The rejected page document.
   * @throws {Error} - If an error occurs while rejecting the page.
   */
  async rejectPageToAddCommunity(communityId, pageId, adminId) {
    try {
      const rejectedPage = await PageDAO.rejectPageToAddCommunity(communityId, pageId, adminId);
      const communityPage = await CommunityPages.findOne({ page_id: pageId });
  
      if (!communityPage) {
        throw new Error('Page not found in the specified community');
      }
  
      // Notify the author of the page rejection
      if (rejectedPage && rejectedPage.author) {
        notificationService.notifyUser(
          rejectedPage.author,
          'pageRejected',
          {
            pageId,
            communityId,
            adminId,
            message: `Your page has been rejected from the community ${communityId}.`
          }
        );
      }

      return rejectedPage;
    } catch (error) {
      throw new Error('Error rejecting page: ' + error.message);
    }
  }
  

  /**
   * Removes a page from a community.
   * @param {String} communityId - The ID of the community to remove the page from.
   * @param {String} pageId - The ID of the page to remove.
   * @param {String} userId - The ID of the user who is removing the page.
   * @param {Boolean} isAdmin - Indicates whether the user is an admin.
   * @returns {Promise<Page>} - The removed page document.
   * @throws {Error} - If an error occurs while removing the page.
   */
  async removePageFromCommunity(communityId, pageId, userId, isAdmin) {
    try {
      return await PageDAO.removePageFromCommunity(communityId, pageId, userId, isAdmin);
    } catch (error) {
      throw new Error('Error removing page from community: ' + error.message);
    }
  }

    /**
   * Searches pages based on tags, username, and title.
   * @param {Object} searchCriteria - The search criteria including tags, username, and title.
   * @returns {Promise<Array>} - A list of pages matching the search criteria.
   */
  async searchPages(searchCriteria) {
    try {
      return await PageDAO.searchPages(searchCriteria);
    } catch (error) {
      throw new Error('Error in service layer while searching pages: ' + error.message);
    }
  }
}

module.exports = new PageService();
