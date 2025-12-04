const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Message routes
router.get('/chat/:chatId', messageController.getMessages);
router.post('/chat/:chatId', messageController.sendMessage);
router.post('/chat/:chatId/attachment', messageController.sendMessageWithAttachment);
router.put('/chat/:chatId/read', messageController.markAsRead);
router.delete('/:messageId', messageController.deleteMessage);
router.put('/:messageId', messageController.editMessage);

module.exports = router;
