const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Chat routes
router.post('/direct', chatController.createOrGetDirectChat);
router.post('/group', chatController.createGroupChat);
router.get('/', chatController.getMyChats);
router.get('/:chatId', chatController.getChat);
router.put('/group/:chatId', chatController.updateGroupChat);
router.post('/group/:chatId/participants', chatController.addParticipants);
router.delete('/group/:chatId/participants/:userId', chatController.removeParticipant);
router.post('/group/:chatId/leave', chatController.leaveGroup);

module.exports = router;
