const Like = require('../../db/models/likeModel');
const Page = require('../../db/models/pageModel');
const { User } = require('../../db/models/userModel');

class LikeDAO {
  /**
   * Creates a new like for a given page by ID and user ID.
   * @param {String} pageId - The ID of the page to like.
   * @param {String} userId - The ID of the user who is liking the page.
   * @returns {Promise<Page>} - A promise that resolves with the updated page
   *   document, including the new like count.
   * @throws {Error} - If an error occurs while creating the like.
   */
  async createLike(pageId, userId) {
    try {
      const existingLike = await Like.findOne({ page_id: pageId, user_id: userId });
      if (existingLike) {
        throw new Error('User has already liked this page');
      }

      const like = new Like({ page_id: pageId, user_id: userId });

      const page = await Page.findOneAndUpdate(
        { page_id: pageId },
        { $inc: { likes: 1 } },
        { new: true }
      );

      if (!page) {
        throw new Error('Page not found');
      }

      await like.save();
      return page;
    } catch (error) {
      throw new Error('Error creating like: ' + error.message);
    }
  }


  /**
   * Deletes a like from the database by ID and updates the page's like count.
   * @param {String} likeId - The ID of the like to delete.
   * @param {String} userId - The ID of the user who made the like.
   * @returns {Promise<Page>} - A promise that resolves with the updated page.
   * @throws {Error} - If an error occurs while deleting the like.
   */
  async deleteLike(likeId, userId) {
    try {
        const like = await Like.findOneAndDelete({ like_id: likeId, user_id: userId });
        if (!like) {
            throw new Error('Like not found or not owned by the user');
        }

        const page = await Page.findOneAndUpdate(
            { page_id: like.page_id },
            { $inc: { likes: -1 } },
            { new: true }
        );

        if (!page) {
            throw new Error('Page not found');
        }

        return page;
    } catch (error) {
        throw new Error('Error deleting like: ' + error.message);
    }
}


  /**
   * Retrieves all likes for a given page by ID and populates
   * the `user` field with the username of the user who made the like.
   * @param {String} pageId - The ID of the page to get likes for.
   * @returns {Promise<Like[]>} - A promise that resolves with an array of
   *   like objects, each containing the `user` field with the username
   *   of the user who made the like.
   * @throws {Error} - If an error occurs while fetching the likes.
   */
  async getLikesByPage(pageId) {
    try {
      const likes = await Like.find({ page_id: pageId });
      const populatedLikes = await Promise.all(
        likes.map(async (like) => {
          
          const user = await User.findOne({ id: like.user_id });
          return {
            ...like.toObject(),
            user: user ? { username: user.username } : null,
          };
        })
      );

      return populatedLikes;
    } catch (error) {
      throw new Error('Error fetching likes: ' + error.message);
    }
  }


  /**
   * Checks if a user has liked a given page by ID.
   * @param {String} pageId - The ID of the page to check.
   * @param {String} userId - The ID of the user to check.
   * @returns {Promise<Boolean>} - A promise that resolves with a boolean indicating
   *   whether the user has liked the page.
   * @throws {Error} - If an error occurs while checking the like status.
   */
  async hasUserLikedPage(pageId, userId) {
    try {
      const like = await Like.findOne({ page_id: pageId, user_id: userId });
      return like !== null;
    } catch (error) {
      throw new Error('Error checking if user has liked the page: ' + error.message);
    }
  }

  /**
   * Toggles a like for a given page by a user. If the user has already liked
   * the page, the like is removed and the page's like count is decremented.
   * If the user has not liked the page, a new like is created and the page's
   * like count is incremented.
   * @param {String} pageId - The ID of the page to toggle the like for.
   * @param {String} userId - The ID of the user toggling the like.
   * @returns {Promise<{liked: Boolean, likeCount: Number, likeId: String|null}>}
   */
  async toggleLike(pageId, userId) {
    try {
      const existingLike = await Like.findOne({ page_id: pageId, user_id: userId });

      if (existingLike) {
        // User already liked — remove it
        await Like.deleteOne({ _id: existingLike._id });
        const page = await Page.findOneAndUpdate(
          { page_id: pageId },
          { $inc: { likes: -1 } },
          { new: true }
        );
        return { liked: false, likeCount: page ? page.likes : 0, likeId: null };
      } else {
        // User hasn't liked — create it
        const like = new Like({ page_id: pageId, user_id: userId });
        await like.save();
        const page = await Page.findOneAndUpdate(
          { page_id: pageId },
          { $inc: { likes: 1 } },
          { new: true }
        );
        return { liked: true, likeCount: page ? page.likes : 0, likeId: like.like_id };
      }
    } catch (error) {
      throw new Error('Error toggling like: ' + error.message);
    }
  }
}

module.exports = new LikeDAO();
