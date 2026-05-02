const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.get('/contacts', protect, chatController.getContacts);
router.get('/messages/:otherUserId', protect, chatController.getChatHistory);

module.exports = router;
