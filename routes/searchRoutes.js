const express = require('express');
const router = express.Router();
const SearchController = require('../controllers/searchController');
const auth = require('../middlewares/authMiddleware');

router.get('/users', auth, SearchController.searchUsers);
router.get('/posts', auth, SearchController.searchPosts);
router.get('/games', auth, SearchController.searchGames);
router.get('/game-invitations', auth, SearchController.searchGameInvitations);

module.exports = router;