const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/matchController');
const auth = require('../middlewares/authMiddleware');

router.get('/', auth, MatchController.getUserMatches);
router.get('/recommendations', auth, MatchController.getRecommendations);
router.get('/:id', auth, MatchController.getMatchById);
router.post('/calculate/:userId', auth, MatchController.calculateMatch);
router.delete('/:id', auth, MatchController.deleteMatch);

module.exports = router;
