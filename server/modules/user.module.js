import { Router } from 'express';
import userRoutes from '../routes/user.routes.js';

const router = Router();
router.use('/user', userRoutes);
router.use('/users', userRoutes);

export default router;
