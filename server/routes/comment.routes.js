import express from 'express';
import CommentController from '../controllers/comment.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { checkPermissions } from '../middlewares/checkPermissions.middleware.js';
import validatePayload from '../middlewares/validatePayload.middleware.js';
import { createCommentValidationSchema } from '../db/validators/commentValidator.js';

const router = express.Router();

// Route to create a new comment
router.post('/:page_id',
    AuthMiddleware(),
    checkPermissions(['COMMENT_ON_PAGE']),
    validatePayload(createCommentValidationSchema),
    CommentController.createComment
);

// Route to fetch comments by page_id
router.get('/:page_id',
    AuthMiddleware(),
    CommentController.getComments
);

// Route to delete a comment
router.delete('/:comment_id',
    AuthMiddleware(),
    CommentController.deleteComment
);

// Route to update a comment
router.put('/:comment_id',
    AuthMiddleware(),
    validatePayload(createCommentValidationSchema),
    CommentController.updateComment
);

export default router;
