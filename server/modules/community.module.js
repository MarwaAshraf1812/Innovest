import { Router } from 'express';
import communityRoutes from '../routes/community.routes.js';
import communityUserRoutes from '../routes/community.user.routes.js';
import communityPageRoutes from '../routes/community.page.routes.js';

const router = Router();
router.use('/communities', communityRoutes);
router.use('/communities', communityUserRoutes);
router.use('/communities', communityPageRoutes);

export default router;
