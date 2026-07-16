const express = require('express');
const CommentController = require('../controllers/comment.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const { checkPermissions } = require('../middlewares/checkPermissions.middleware');

const router = express.Router();

// Route to create a new comment
router.post('/:page_id',
    AuthMiddleware(),
    checkPermissions(['COMMENT_ON_PAGE']),
    CommentController.createComment
);

// Route to fetch comments by page_id
router.get('/:page_id',
    AuthMiddleware(),
    CommentController.getComments
);

// Route to delete a comment (only allowed by the user who created it, or the page author)
router.delete('/:comment_id',
    AuthMiddleware(),
    CommentController.deleteComment
);

// Route to update a comment (only allowed by the user who created it)
router.put('/:comment_id',
    AuthMiddleware(),
    CommentController.updateComment
);

module.exports = router;
