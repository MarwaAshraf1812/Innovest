import { Router } from 'express';
import messageRoutes from '../routes/message.routes.js';

const router = Router();
router.use('/messages', messageRoutes);

export default router;
