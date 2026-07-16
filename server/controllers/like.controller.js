const { getIo } = require('../config/socket');
const LikeService = require('../services/like.service');
const PageService = require('../services/page.service');
const notificationService = require('../services/notification.service');

class LikeController {
  /**
   * Creates a new like for a given page by ID and user ID.
   * @param {Object} req - The HTTP request object containing the page ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a 200 status code if successful,
   * a 500 status code if an error occurred.
   */
  async createLike(req, res) {
    try {
      const { page_id } = req.params;
      const userId = req.user.id;

      const page = await LikeService.createLike(page_id, userId);

      if (page) {
        notificationService.notifyUser(page.author, 'pageLiked', { page_id, userId });
      }

      getIo().to(page_id).emit('newLike', { page_id, userId });

      return res.status(200).json({ message: 'Like created successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error creating like: ' + error.message });
    }
  }

  /**
   * Toggles a like for a page — likes if not yet liked, unlikes if already liked.
   * Returns { liked, likeCount } so the client can update UI without an extra request.
   */
  async toggleLike(req, res) {
    try {
      const { page_id } = req.params;
      const userId = req.user.id;

      const result = await LikeService.toggleLike(page_id, userId);

      // Emit real-time event
      try {
        getIo().to(page_id).emit('likeToggled', { page_id, userId, liked: result.liked, likeCount: result.likeCount });
      } catch (_) { /* socket may not be connected in all envs */ }

      return res.status(200).json({
        message: result.liked ? 'Liked successfully' : 'Unliked successfully',
        liked: result.liked,
        likeCount: result.likeCount,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Error toggling like: ' + error.message });
    }
  }

  /**
   * Deletes a like identified by the given ID.
   * @param {Object} req - The HTTP request object containing the like ID and page ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a 200 status code if successful,
   * a 500 status code if an error occurred.
   * @throws {Error} - If an error occurs while deleting the like.
   */
  async deleteLike(req, res) {
    try {
        const { like_id, page_id } = req.params;
        const userId = req.user.id;

        // Check if the user has liked the page
        const hasLiked = await LikeService.hasUserLikedPage(page_id, userId);
        if (!hasLiked) {
            return res.status(403).json({ message: 'You can only delete your own like' });
        }

        // Delete the like
        const page = await LikeService.deleteLike(like_id, userId);
        if (!page) {
            return res.status(404).json({ message: 'Like not found' });
        }

        // Emit the like deletion event
        getIo().to(page_id).emit('like-deleted', { like_id });

        return res.status(200).json({ message: 'Like deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting like: ' + error.message });
    }
}


  /**
   * Retrieves all likes for a given page by ID.
   * @param {Object} req - The HTTP request object containing the page ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a list of like objects,
   * each containing the `user` field with the username
   *   of the user who made the like.
   * @throws {Error} - If an error occurs while fetching the likes.
   */
  async getLikesByPage(req, res) {
    try {
      const { page_id } = req.params;
      const likes = await LikeService.getLikesByPage(page_id);

      return res.status(200).json(likes);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching likes: ' + error.message });
    }
  }
}

module.exports = new LikeController();
