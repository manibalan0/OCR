const express = require('express');
const { body } = require('express-validator');
const {
  registerUser,
  loginUser,
  getUserProfile,
  getAgents,
  getAllUsers,
  updateUserRole
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  loginUser
);

router.get('/profile', protect, getUserProfile);
router.get('/agents', protect, authorize('ADMIN'), getAgents);
router.get('/users', protect, authorize('ADMIN'), getAllUsers);
router.put('/users/:id/role', protect, authorize('ADMIN'), updateUserRole);

module.exports = router;
