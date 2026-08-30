import mongoose from 'mongoose';
import { getIo } from '../config/socket.js';
import LikeService from '../services/like.service.js';
import PageService from '../services/page.service.js';
import notificationService from '../services/notification.service.js';

class LikeController {
  /**
   * Creates a new like for a given page by ID and user ID.
   */
  async createLike(req, res) {
    try {
      const { page_id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(page_id)) {
        return res.status(400).json({ message: 'Invalid page_id format' });
      }
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
   */
  async toggleLike(req, res) {
    try {
      const { page_id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(page_id)) {
        return res.status(400).json({ message: 'Invalid page_id format' });
      }
      const userId = req.user.id;

      const result = await LikeService.toggleLike(page_id, userId);

      try {
        getIo().to(page_id).emit('likeToggled', { page_id, userId, liked: result.liked, likeCount: result.likeCount });
      } catch (_) {}

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
   */
  async deleteLike(req, res) {
    try {
      const { like_id, page_id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(page_id)) {
        return res.status(400).json({ message: 'Invalid page_id format' });
      }
      const userId = req.user.id;

      const hasLiked = await LikeService.hasUserLikedPage(page_id, userId);
      if (!hasLiked) {
        return res.status(403).json({ message: 'You can only delete your own like' });
      }

      const page = await LikeService.deleteLike(like_id, userId);
      if (!page) {
        return res.status(404).json({ message: 'Like not found' });
      }

      getIo().to(page_id).emit('like-deleted', { like_id });

      return res.status(200).json({ message: 'Like deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting like: ' + error.message });
    }
  }

  /**
   * Retrieves all likes for a given page by ID.
   */
  async getLikesByPage(req, res) {
    try {
      const { page_id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(page_id)) {
        return res.status(400).json({ message: 'Invalid page_id format' });
      }
      const likes = await LikeService.getLikesByPage(page_id);

      return res.status(200).json(likes);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching likes: ' + error.message });
    }
  }
}

export default new LikeController();
