const Comment = require('../../db/models/commentModel');
const Page = require('../../db/models/pageModel');
const { User } = require('../../db/models/userModel');

class CommentDAO {
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
        const newComment = new Comment({ user_id, page_id, content });
        await newComment.save();

        const page = await Page.findOneAndUpdate(
          {page_id: page_id},
          { $inc: { comments: 1 } },
          { new: true }
        );

        if (!page) {
          throw new Error('Page not found');
        }

        return newComment;
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
      const comments = await Comment.find({ page_id: page_id });
      const populatedComments = await Promise.all(
        comments.map(async (comment) => {
          const user = await User.findOne({ id: comment.user_id });
          return {
            ...comment.toObject(),
            user: user ? { 
              username: user.username,
              first_name: user.first_name,
              last_name: user.last_name,
              id: user.id,
              profile_image: user.profile_image,
              role: user.role
            } : null,
          };
        })
      );

      return populatedComments;
    } catch (error) {
        throw new Error('Error fetching comments: ' + error.message);
    }
  }

  /**
   * Deletes a comment by its ID and the ID of the user who made it. If the
   * comment is successfully deleted, the comment count for the page it
   * belongs to is decremented by 1.
   * @param {String} comment_id - The ID of the comment to delete.
   * @param {String} user_id - The ID of the user who made the comment.
   * @returns {Promise<void>} - A promise that resolves if the comment is
   *   successfully deleted.
   * @throws {Error} - If the comment is not found, or if the user is not
   *   authorized to delete the comment.
   */
  async deleteComment(comment_id, user_id, isAdmin) {
    try {
        const comment = await Comment.findOne({ comment_id: comment_id });
        if (!comment) {
            throw new Error('Comment not found');
        }

        if (comment.user_id.toString() !== user_id && !isAdmin) {
            throw new Error('You can only delete your own comment');
        }

        const page_id = comment.page_id;

        await Comment.deleteOne({ comment_id: comment_id });

        const page = await Page.findOneAndUpdate(
          { page_id: page_id },
          { $inc: { comments: -1 } },
          { new: true }
        );

        if (!page) {
          throw new Error('Page not found');
        }

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
        const comment = await Comment.findOne({ comment_id: comment_id });
        if (!comment) {
            throw new Error('Comment not found');
        }

        if (comment.user_id.toString() !== user_id) {
            throw new Error('You can only update your own comment');
        }

        comment.content = content;
        await comment.save();
        return comment;
    } catch (error) {
        throw new Error('Error updating comment: ' + error.message);
    }
  }
}

module.exports = new CommentDAO();
