const express = require('express');
const router = express.Router();
const mentorController = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, mentorController.getAllMentors);
router.get('/match', protect, mentorController.getRecommendedMentors);
router.post('/book', protect, mentorController.createBooking);
router.get('/bookings', protect, mentorController.getMyBookings);

module.exports = router;
