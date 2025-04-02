const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');
const auth = require('../middlewares/authMiddleware');

router.get('/users',  SearchController.searchUsers);
router.get('/posts',  SearchController.searchPosts);
router.get('/games',  SearchController.searchGames);
router.get('/game-invitations',  SearchController.searchGameInvitations);

module.exports = router;