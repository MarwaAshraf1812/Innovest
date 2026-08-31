import express from 'express';
import vdrController from '../controllers/vdr.controller.js';
import verifyMiddleware from '../middlewares/verify.middleware.js';

const router = express.Router();

// 1. Stream watermarked PDF pitch deck
router.get('/stream/:filename', verifyMiddleware, (req, res) => vdrController.streamWatermarkedDocument(req, res));

// 2. Record slide heatmap heartbeat
router.post('/page-view-log', verifyMiddleware, (req, res) => vdrController.logSlideMetric(req, res));

// 3. Get page heatmap analytics for document
router.get('/analytics/:document_id', verifyMiddleware, (req, res) => vdrController.getDeckAnalytics(req, res));

// 4. Set/Revoke VDR access permissions for investor
router.post('/access-control', verifyMiddleware, (req, res) => vdrController.updateAccessControl(req, res));

export default router;
