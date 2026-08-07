const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint,
  getComplaints,
  getComplaintById,
  assignAgent,
  updateComplaintStatus,
  getAdminAnalytics
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .post(
    protect,
    authorize('USER', 'ADMIN'),
    [
      body('title').notEmpty().withMessage('Title is required'),
      body('description').notEmpty().withMessage('Description is required')
    ],
    createComplaint
  )
  .get(protect, getComplaints);

router.get('/analytics/admin', protect, authorize('ADMIN'), getAdminAnalytics);

router.get('/:id', protect, getComplaintById);
router.put('/:id/assign', protect, authorize('ADMIN'), assignAgent);
router.put('/:id/status', protect, authorize('AGENT', 'ADMIN'), updateComplaintStatus);

module.exports = router;
