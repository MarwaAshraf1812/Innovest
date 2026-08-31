import express from 'express';
import dealRoomController from '../controllers/deal_room.controller.js';
import verifyMiddleware from '../middlewares/verify.middleware.js';

const router = express.Router();

// 1. Create or initialize a collaborative Deal Room
router.post('/', verifyMiddleware, (req, res) => dealRoomController.createDealRoom(req, res));

// 2. Fetch deal room details & audit log
router.get('/:deal_room_id', verifyMiddleware, (req, res) => dealRoomController.getDealRoom(req, res));

// 3. Update term sheet terms & add audit trail
router.put('/:deal_room_id/term-sheet', verifyMiddleware, (req, res) => dealRoomController.updateTerms(req, res));

// 4. Digital e-signature execution
router.post('/:deal_room_id/sign', verifyMiddleware, (req, res) => dealRoomController.signTerms(req, res));

export default router;
