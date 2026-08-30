import express from 'express';
import MessageController from '../controllers/message.controller.js';
import AuthMiddleware from '../middlewares/auth.middleware.js';
import validatePayload from '../middlewares/validatePayload.middleware.js';
import { createMessageValidationSchema } from '../db/validators/messagesValidator.js';

const router = express.Router();

router.get('/contacts', AuthMiddleware(), MessageController.getContacts);
router.get('/conversation/:other_user_id', AuthMiddleware(), MessageController.getConversation);
router.post('/', AuthMiddleware(), validatePayload(createMessageValidationSchema), MessageController.sendMessage);

export default router;
