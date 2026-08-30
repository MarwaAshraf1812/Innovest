import { Router } from 'express';
import adminRoutes from '../routes/admin.routes.js';

const router = Router();
router.use('/admin', adminRoutes);

export default router;
