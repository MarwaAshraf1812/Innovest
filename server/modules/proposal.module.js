import { Router } from 'express';
import proposalRoutes from '../routes/proposal.routes.js';

const router = Router();
router.use('/proposals', proposalRoutes);

export default router;
