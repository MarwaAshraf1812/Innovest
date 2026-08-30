import express from 'express';
import likeRoutes from '../routes/like.routes.js';

const router = express.Router();
router.use('/likes', likeRoutes);

export default router;
