const express = require('express');
const { submitFeedback, getAllFeedback } = require('../controllers/feedbackController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('USER'), submitFeedback);
router.get('/', protect, authorize('ADMIN', 'AGENT'), getAllFeedback);

module.exports = router;
