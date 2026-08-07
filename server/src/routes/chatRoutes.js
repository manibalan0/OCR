const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:complaintId', protect, getMessages);
router.post('/', protect, sendMessage);

module.exports = router;
