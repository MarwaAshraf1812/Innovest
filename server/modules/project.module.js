import { Router } from 'express';
import projectRoutes from '../routes/project.routes.js';

const router = Router();
router.use('/project', projectRoutes);

export default router;
