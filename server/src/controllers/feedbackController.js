const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

const submitFeedback = async (req, res) => {
  try {
    const { complaintId, rating, comment } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the complaint creator can submit feedback' });
    }

    const existingFeedback = await Feedback.findOne({ complaintId });
    if (existingFeedback) {
      return res.status(400).json({ message: 'Feedback has already been submitted for this complaint' });
    }

    const feedback = await Feedback.create({
      complaintId,
      userId: req.user._id,
      rating,
      comment: comment || ''
    });

    res.status(201).json(feedback);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('userId', 'name email')
      .populate('complaintId', 'ticketId title category status')
      .sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitFeedback,
  getAllFeedback
};
