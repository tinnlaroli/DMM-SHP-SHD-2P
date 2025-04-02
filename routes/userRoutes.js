const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateUserUpdate, validateUserSettings } = require('../middlewares/validation');

// Get user profile by ID
router.get('/:id', userController.getUserProfile);

// Update current user profile
router.put('/me', validateUserUpdate, userController.updateProfile);

// Update user settings
router.put('/settings', validateUserSettings, userController.updateSettings);

module.exports = router;