import { Router } from 'express';
import commentRoutes from '../routes/comment.routes.js';

const router = Router();
router.use('/comments', commentRoutes);

export default router;
