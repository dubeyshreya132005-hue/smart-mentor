const User = require('../models/User');
const Booking = require('../models/Booking');

// GET /api/mentors
exports.getAllMentors = async (req, res) => {
  try {
    const { skill, search } = req.query;
    let query = { role: 'mentor', isApproved: true };

    if (skill) {
      query.expertise = { $in: [new RegExp(skill, 'i')] };
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { bio: new RegExp(search, 'i') },
      ];
    }

    const mentors = await User.find(query).select('-password');
    res.status(200).json({ success: true, mentors });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching mentors.' });
  }
};

// GET /api/mentors/match
exports.getRecommendedMentors = async (req, res) => {
  try {
    const student = await User.findById(req.user.id);
    if (!student) return res.status(404).json({ success: false, message: 'Student not found.' });

    const studentSkills = student.skills || [];
    const targetRole = student.targetRole || '';

    // Find mentors who have expertise in student's skills or target role
    let mentors = await User.find({ role: 'mentor', isApproved: true }).select('-password');

    // Simple matching algorithm: score based on skill overlap
    const scoredMentors = mentors.map(mentor => {
      let score = 0;
      const mentorExpertise = mentor.expertise || [];
      
      // Points for overlapping skills
      studentSkills.forEach(skill => {
        if (mentorExpertise.some(e => e.toLowerCase().includes(skill.toLowerCase()))) {
          score += 20;
        }
      });

      // Points for matching target role
      if (mentor.bio.toLowerCase().includes(targetRole.toLowerCase())) {
        score += 30;
      }

      // Bonus for high ratings
      score += (mentor.rating || 0) * 5;

      return { ...mentor.toObject(), matchScore: Math.min(score, 100) };
    });

    // Sort by score and take top 5
    const recommendations = scoredMentors
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    res.status(200).json({ success: true, recommendations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error matching mentors.' });
  }
};

// POST /api/mentors/book
exports.createBooking = async (req, res) => {
  try {
    const { mentorId, date, slot, topic, message } = req.body;

    const booking = await Booking.create({
      student: req.user.id,
      mentor: mentorId,
      date,
      slot,
      topic,
      message
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error creating booking.' });
  }
};

// GET /api/mentors/bookings
exports.getMyBookings = async (req, res) => {
  try {
    const query = req.user.role === 'mentor' ? { mentor: req.user.id } : { student: req.user.id };
    const bookings = await Booking.find(query)
      .populate('student', 'name email avatar')
      .populate('mentor', 'name email avatar expertise')
      .sort('-date');

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching bookings.' });
  }
};
