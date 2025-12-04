const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// All routes require authentication
router.use(auth);

// Upload routes
router.post('/file', upload.single('file'), uploadController.uploadFile);
router.post('/image', upload.single('image'), uploadController.uploadImage);
router.delete('/file', uploadController.deleteFile);

module.exports = router;
