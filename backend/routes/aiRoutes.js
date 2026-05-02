const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

router.post('/roadmap', protect, aiController.generateRoadmap);
router.post('/chat', protect, aiController.chatWithAI);

module.exports = router;
