const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/matchController');
const auth = require('../middlewares/authMiddleware');

router.get('/',  MatchController.getUserMatches);
router.get('/recommendations',  MatchController.getRecommendations);
router.get('/:id',  MatchController.getMatchById);
router.post('/calculate/:userId',  MatchController.calculateMatch);
router.delete('/:id',  MatchController.deleteMatch);

module.exports = router;
