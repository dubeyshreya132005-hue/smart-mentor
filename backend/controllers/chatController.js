const Message = require('../models/Message');
const User = require('../models/User');

const Booking = require('../models/Booking');

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
    const userId = req.user.id;
    const isMentor = req.user.role === 'mentor';
    
    // Only return users where an accepted booking exists
    const bookings = await Booking.find({
      $or: [{ student: userId }, { mentor: userId }],
      status: 'accepted'
    }).populate(isMentor ? 'student' : 'mentor', 'name avatar role targetRole');

    const contactsMap = new Map();
    bookings.forEach(b => {
      const contact = isMentor ? b.student : b.mentor;
      if (contact) contactsMap.set(contact._id.toString(), contact);
    });
    
    res.status(200).json({ success: true, contacts: Array.from(contactsMap.values()) });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching contacts.' });
  }
};

// DELETE /api/chat/connection/:contactId
exports.disconnectContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { contactId } = req.params;
    
    await Booking.updateMany({
      $or: [
        { student: userId, mentor: contactId },
        { student: contactId, mentor: userId }
      ],
      status: 'accepted'
    }, {
      status: 'completed'
    });
    
    res.status(200).json({ success: true, message: 'Connection removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error disconnecting.' });
  }
};
