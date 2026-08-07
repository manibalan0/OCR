const Message = require('../models/Message');
const Complaint = require('../models/Complaint');

const getMessages = async (req, res) => {
  try {
    const { complaintId } = req.params;
    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const messages = await Message.find({ complaintId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { complaintId, message } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const newMessage = await Message.create({
      complaintId,
      senderId: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message
    });

    const io = req.app.get('socketio');
    if (io) {
      io.to(complaintId.toString()).emit('receiveMessage', newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMessages,
  sendMessage
};
