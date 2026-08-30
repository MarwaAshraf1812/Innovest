import CommentDAO from '../common/daos/comment.dao.js';
import Page from '../db/models/pageModel.js';
import NotificationService from '../services/notification.service.js';

class CommentService {
    /**
     * Creates a new comment for a given page by ID and user ID.
     * @param {String} user_id - The ID of the user creating the comment.
     * @param {String} page_id - The ID of the page to comment on.
     * @param {String} content - The content of the comment.
     * @returns {Promise<Comment>} - A promise that resolves with the newly created comment document.
     * @throws {Error} - If an error occurs while creating the comment.
     */
    async createComment(user_id, page_id, content) {
        try {
            const comment = await CommentDAO.createComment(user_id, page_id, content);
            return comment;
        } catch (error) {
            throw new Error('Error creating comment: ' + error.message);
        }
    }

    /**
     * Retrieves all comments for a given page by ID and populates
     * the `user` field with the username of the user who made the comment.
     * @param {String} page_id - The ID of the page to get comments for.
     * @returns {Promise<Comment[]>} - A promise that resolves with an array of
     *   comment objects, each containing the `user` field with the username
     *   of the user who made the comment.
     * @throws {Error} - If an error occurs while fetching the comments.
     */
    async getCommentsByPage(page_id) {
        try {
            return await CommentDAO.getCommentsByPage(page_id);
        } catch (error) {
            throw new Error('Error fetching comments: ' + error.message);
        }
    }

    /**
     * Deletes a comment by its ID and the ID of the user who made it.
     * @param {String} comment_id - The ID of the comment to delete.
     * @param {String} user_id - The ID of the user who made the comment.
     * @returns {Promise<void>} - A promise that resolves if the comment is
     *   successfully deleted.
     * @throws {Error} - If the comment is not found, or if the user is not
     *   authorized to delete the comment.
     */
    async deleteComment(comment_id, user_id, isAdmin) {
        try {
            return await CommentDAO.deleteComment(comment_id, user_id, isAdmin);
        } catch (error) {
            throw new Error('Error deleting comment: ' + error.message);
        }
    }

    /**
     * Updates a comment by its ID and the ID of the user who made it, replacing
     * its content with the provided string. If the comment is successfully
     * updated, the updated comment is returned.
     * @param {String} comment_id - The ID of the comment to update.
     * @param {String} user_id - The ID of the user who made the comment.
     * @param {String} content - The new content of the comment.
     * @returns {Promise<Comment>} - A promise that resolves with the updated
     *   comment document if the comment is successfully updated.
     * @throws {Error} - If the comment is not found, or if the user is not
     *   authorized to update the comment.
     */
    async updateComment(comment_id, user_id, content) {
        try {
            return await CommentDAO.updateComment(comment_id, user_id, content);
        } catch (error) {
            throw new Error('Error updating comment: ' + error.message);
        }
    }
}

export default new CommentService();
