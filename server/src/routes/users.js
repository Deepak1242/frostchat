const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// All routes require authentication
router.use(auth);

// User routes
router.get('/search', userController.searchUsers);
router.get('/all', userController.getAllUsers);
router.get('/profile/:userId', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/avatar', upload.single('avatar'), userController.updateAvatar);
router.put('/status', userController.updateStatus);

module.exports = router;
