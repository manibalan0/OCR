const Complaint = require('../models/Complaint');
const Feedback = require('../models/Feedback');
const User = require('../models/User');

const generateTicketId = () => {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = 'CMP-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority, attachments } = req.body;

    const ticketId = generateTicketId();

    const complaint = await Complaint.create({
      ticketId,
      title,
      description,
      category: category || 'Technical',
      priority: priority || 'Medium',
      attachments: attachments || [],
      userId: req.user._id,
      status: 'Pending'
    });

    const populatedComplaint = await Complaint.findById(complaint._id)
      .populate('userId', 'name email phone')
      .populate('agentId', 'name email department');

    res.status(201).json(populatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'USER') {
      query = { userId: req.user._id };
    } else if (req.user.role === 'AGENT') {
      query = { agentId: req.user._id };
    }

    const { status, category, search } = req.query;

    if (status) {
      query.status = status;
    }
    if (category) {
      query.category = category;
    }
    if (search) {
      query.$or = [
        { ticketId: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const complaints = await Complaint.find(query)
      .populate('userId', 'name email phone')
      .populate('agentId', 'name email department')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('agentId', 'name email department');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (
      req.user.role === 'USER' &&
      complaint.userId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    if (
      req.user.role === 'AGENT' &&
      complaint.agentId &&
      complaint.agentId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    const feedback = await Feedback.findOne({ complaintId: complaint._id });

    res.json({ complaint, feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignAgent = async (req, res) => {
  try {
    const { agentId } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const agent = await User.findById(agentId);
    if (!agent || agent.role !== 'AGENT') {
      return res.status(400).json({ message: 'Invalid agent ID selected' });
    }

    complaint.agentId = agentId;
    if (complaint.status === 'Pending') {
      complaint.status = 'In Progress';
    }

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('userId', 'name email phone')
      .populate('agentId', 'name email department');

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateComplaintStatus = async (req, res) => {
  try {
    const { status, resolutionNotes } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (status) complaint.status = status;
    if (resolutionNotes !== undefined) complaint.resolutionNotes = resolutionNotes;

    await complaint.save();

    const updatedComplaint = await Complaint.findById(complaint._id)
      .populate('userId', 'name email phone')
      .populate('agentId', 'name email department');

    res.json(updatedComplaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminAnalytics = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    const pendingCount = await Complaint.countDocuments({ status: 'Pending' });
    const inProgressCount = await Complaint.countDocuments({ status: 'In Progress' });
    const resolvedCount = await Complaint.countDocuments({ status: 'Resolved' });
    const rejectedCount = await Complaint.countDocuments({ status: 'Rejected' });

    const totalUsers = await User.countDocuments({ role: 'USER' });
    const totalAgents = await User.countDocuments({ role: 'AGENT' });

    const categoryBreakdown = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const agentWorkload = await Complaint.aggregate([
      { $match: { agentId: { $ne: null } } },
      { $group: { _id: '$agentId', count: { $sum: 1 } } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'agentInfo'
        }
      },
      { $unwind: '$agentInfo' },
      {
        $project: {
          agentId: '$_id',
          name: '$agentInfo.name',
          email: '$agentInfo.email',
          count: 1
        }
      }
    ]);

    const feedbacks = await Feedback.find();
    const avgRating =
      feedbacks.length > 0
        ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
        : 0;

    res.json({
      summary: {
        totalComplaints,
        pendingCount,
        inProgressCount,
        resolvedCount,
        rejectedCount,
        totalUsers,
        totalAgents,
        avgRating,
        totalFeedbacks: feedbacks.length
      },
      categoryBreakdown,
      agentWorkload
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignAgent,
  updateComplaintStatus,
  getAdminAnalytics
};
