import express from 'express';
import aiMatchmakingController from '../controllers/ai_matchmaking.controller.js';
import verifyMiddleware from '../middlewares/verify.middleware.js';

const router = express.Router();

// 1. Get personalized AI deal flow feed
router.get('/deal-flow', verifyMiddleware, (req, res) => aiMatchmakingController.getDealFlow(req, res));

// 2. Save/Update investor investment mandate
router.post('/mandate', verifyMiddleware, (req, res) => aiMatchmakingController.saveMandate(req, res));

// 3. Get match score for specific project
router.get('/match-score/:project_id', verifyMiddleware, (req, res) => aiMatchmakingController.getProjectMatchScore(req, res));

export default router;
