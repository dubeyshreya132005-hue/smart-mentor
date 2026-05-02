const Message = require('../models/Message');
const User = require('../models/User');

// GET /api/chat/messages/:otherUserId
exports.getChatHistory = async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user.id },
      ],
    }).sort('createdAt');

    res.status(200).json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching chat history.' });
  }
};

// GET /api/chat/contacts
exports.getContacts = async (req, res) => {
  try {
    // For now, return all mentors if student, and all students if mentor
    // In a real app, this would be based on booking history or active chats
    const roleToFind = req.user.role === 'mentor' ? 'student' : 'mentor';
    const contacts = await User.find({ role: roleToFind }).select('name avatar role targetRole');
    
    res.status(200).json({ success: true, contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching contacts.' });
  }
};
