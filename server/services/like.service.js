const LikeDAO = require('../common/daos/like.dao');

class LikeService {
  async createLike(pageId, userId) {
    try {
      return await LikeDAO.createLike(pageId, userId);
    } catch (error) {
      throw new Error('Error creating like: ' + error.message);
    }
  }

  async deleteLike(likeId, userId) {
    try {
      return await LikeDAO.deleteLike(likeId, userId);
    } catch (error) {
      throw new Error('Error deleting like: ' + error.message);
    }
  }

  async getLikesByPage(pageId) {
    try {
      return await LikeDAO.getLikesByPage(pageId);
    } catch (error) {
      throw new Error('Error fetching likes: ' + error.message);
    }
  }

  async hasUserLikedPage(pageId, userId) {
    try {
      return await LikeDAO.hasUserLikedPage(pageId, userId);
    } catch (error) {
      throw new Error('Error checking like status: ' + error.message);
    }
  }

  async toggleLike(pageId, userId) {
    try {
      return await LikeDAO.toggleLike(pageId, userId);
    } catch (error) {
      throw new Error('Error toggling like: ' + error.message);
    }
  }
}

module.exports = new LikeService();
