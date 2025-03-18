const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateUpdateProfile, validateAddGame, validateAddPlayTime } = require('../middlewares/validation');

// Get complete profile
router.get('/:id/profile', authMiddleware, profileController.getProfile);

// Update profile
router.put('/:id/profile', authMiddleware, validateUpdateProfile, profileController.updateProfile);

// Game preferences
router.get('/:id/games', authMiddleware, profileController.getGames);
router.post('/games', authMiddleware, validateAddGame, profileController.addGame);
router.delete('/games/:gameId', authMiddleware, profileController.removeGame);

// Play time preferences
router.get('/:id/play-times', authMiddleware, profileController.getPlayTimes);
router.post('/play-times', authMiddleware, validateAddPlayTime, profileController.addPlayTime);
router.delete('/play-times/:timeId', authMiddleware, profileController.removePlayTime);

module.exports = router;