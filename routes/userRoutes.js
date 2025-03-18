const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateUserUpdate, validateUserSettings } = require('../middlewares/validation');

// Get user profile by ID
router.get('/:id', authMiddleware, userController.getUserProfile);

// Update current user profile
router.put('/me', authMiddleware, validateUserUpdate, userController.updateProfile);

// Update user settings
router.put('/settings', authMiddleware, validateUserSettings, userController.updateSettings);

module.exports = router;