import express from 'express';
import LikeController from '../controllers/like.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import { checkPermissions } from '../middlewares/checkPermissions.middleware.js';

const router = express.Router();

// Route to toggle a like (like if not liked, unlike if already liked)
router.post('/toggle/:page_id',
  AuthMiddleware(),
  checkPermissions(['LIKE_PAGE']),
  LikeController.toggleLike);

// Route to create a like
router.post('/:page_id',
  AuthMiddleware(),
  checkPermissions(['LIKE_PAGE']), 
  LikeController.createLike);

// Route to delete a like
router.delete('/:page_id/:like_id',
  AuthMiddleware(),
  checkPermissions(['DISLIKE_PAGE']),
  LikeController.deleteLike);

// Route to get likes for a page
router.get('/:page_id/likes',
  AuthMiddleware(),
  checkPermissions(['VIEW_LIKES']),
  LikeController.getLikesByPage);

export default router;
