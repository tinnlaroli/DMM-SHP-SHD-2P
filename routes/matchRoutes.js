const express = require('express');
const router = express.Router();
const MatchController = require('../controllers/matchController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/',authMiddleware,  MatchController.getUserMatches);
router.get('/recommendations',authMiddleware,  MatchController.getRecommendations);
router.get('/:id',authMiddleware,  MatchController.getMatchById);
router.post('/calculate/:userId',authMiddleware,  MatchController.calculateMatch);
router.delete('/:id',authMiddleware,  MatchController.deleteMatch);

module.exports = router;
