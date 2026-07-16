const express = require('express');
const MessageController = require('../controllers/message.controller');
const AuthMiddleware = require('../middlewares/auth.middleware');
const router = express.Router();

router.get('/contacts', AuthMiddleware(), MessageController.getContacts);
router.get('/conversation/:other_user_id', AuthMiddleware(), MessageController.getConversation);
router.post('/', AuthMiddleware(), MessageController.sendMessage);

module.exports = router;
