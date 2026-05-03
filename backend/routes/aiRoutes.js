const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/roadmap', protect, aiController.generateRoadmap);
router.post('/chat', protect, aiController.chatWithAI);
router.post('/analyze-resume', protect, upload.single('resume'), aiController.analyzeResume);
router.post('/compare-resumes', protect, upload.array('resumes', 5), aiController.compareResumes);

module.exports = router;
