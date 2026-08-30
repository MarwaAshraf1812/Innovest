import { Router } from 'express';
import adminRoutes from '../routes/user.routes.js';

const router = Router();
router.use('/users', adminRoutes);

export default router;
