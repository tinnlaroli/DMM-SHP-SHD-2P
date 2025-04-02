const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');
const auth = require('../middlewares/authMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/users', authMiddleware, SearchController.searchUsers);
router.get('/posts',authMiddleware,  SearchController.searchPosts);
router.get('/games',authMiddleware,  SearchController.searchGames);
router.get('/game-invitations',authMiddleware,  SearchController.searchGameInvitations);

module.exports = router;