const mongoose = require('mongoose');
const { getIo } = require('../config/socket');
const CommentService = require('../services/comment.service');
const notificationService = require('../services/notification.service');

class CommentController {
  /**
   * Creates a new comment for a given page by ID and user ID.
   */
  async createComment(req, res) {
    try {
      const { page_id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(page_id)) {
        return res.status(400).json({ message: 'Invalid page_id format' });
      }
      const user_id = req.user.id;
      const { content } = req.body;
      const comment = await CommentService.createComment(
        user_id,
        page_id,
        content,
      );

      if (comment) {
        notificationService.notifyUser(comment.user_id, 'pageCommented', {
          page_id,
          user_id,
        });
      }

      getIo().to(page_id).emit('newLike', { page_id, user_id });

      return res
        .status(201)
        .json({ message: 'Comment created successfully', data: comment });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * Retrieves all comments for a given page by ID.
   */
  async getComments(req, res) {
    const { page_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(page_id)) {
      return res.status(400).json({ message: 'Invalid page_id format' });
    }

    try {
      const comments = await CommentService.getCommentsByPage(page_id);
      return res
        .status(200)
        .json({ message: 'Comments fetched successfully', data: comments });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * Deletes a comment by its ID.
   */
  async deleteComment(req, res) {
    const { comment_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(comment_id)) {
      return res.status(400).json({ message: 'Invalid comment_id format' });
    }
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN' || req.user.role === 'SUPER_ADMIN';

    try {
      await CommentService.deleteComment(comment_id, userId, isAdmin);
      return res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  /**
   * Updates a comment by its ID.
   */
  async updateComment(req, res) {
    const { comment_id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(comment_id)) {
      return res.status(400).json({ message: 'Invalid comment_id format' });
    }
    const userId = req.user.id;
    const { content } = req.body;

    try {
      const updatedComment = await CommentService.updateComment(
        comment_id,
        userId,
        content,
      );
      return res
        .status(200)
        .json({
          message: 'Comment updated successfully',
          data: updatedComment,
        });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new CommentController();
