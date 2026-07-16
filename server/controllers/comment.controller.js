const { getIo } = require('../config/socket');
const CommentService = require('../services/comment.service');
const notificationService = require('../services/notification.service');

class CommentController {
  /**
   * Creates a new comment for a given page by ID and user ID.
   * The comment is created with the data provided in the request body.
   * @param {Object} req - The HTTP request object containing the page ID in the params and comment data in the body.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a 201 status code if successful, a 500 status code if an error occurred.
   */
  async createComment(req, res) {
    try {
      const { page_id } = req.params;
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
   * @param {Object} req - The HTTP request object containing the page ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a list of comment objects,
   * each containing the `user` field with the username
   *   of the user who made the comment.
   * @throws {Error} - If an error occurs while fetching the comments.
   */
  async getComments(req, res) {
    const { page_id } = req.params;

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
   * Deletes a comment by its ID and the ID of the user who made it.
   * @param {Object} req - The HTTP request object containing the comment ID in the params.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a 200 status code if successful, a 500 status code if an error occurred.
   * @throws {Error} - If an error occurs while deleting the comment.
   */
  async deleteComment(req, res) {
    const { comment_id } = req.params;
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
   * Updates a comment by its ID and the ID of the user who made it, replacing
   * its content with the provided string. If the comment is successfully
   * updated, the updated comment is returned.
   * @param {Object} req - The HTTP request object containing the comment ID in the params and updated comment data in the body.
   * @param {Object} res - The HTTP response object.
   * @returns {Promise<void>} - Responds with a 200 status code if successful, a 500 status code if an error occurred.
   * @throws {Error} - If an error occurs while updating the comment.
   */
  async updateComment(req, res) {
    const { comment_id } = req.params;
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
