const MatchModel = require('../models/matchModel');
const UserModel = require('../models/userModel');
const matchAlgorithm = require('../utils/matchAlgorithm');

const MatchController = {
  // Obtener todos los matches del usuario
  async getUserMatches(req, res) {
    try {
      const userId = req.user.id;
      const matches = await MatchModel.getMatchesByUserId(userId);
      res.status(200).json({ success: true, count: matches.length, data: matches });
    } catch (error) {
      console.error('Error fetching matches:', error);
      res.status(500).json({ success: false, message: 'Error al obtener los matches' });
    }
  },

  // Obtener recomendaciones de posibles matches
  async getRecommendations(req, res) {
    try {
      const userId = req.user.id;
      const user = await UserModel.findById(userId);
      const candidates = await MatchModel.getUnmatchedUsers(userId);

      const recommendations = candidates.map(candidate => {
        const score = matchAlgorithm.calculateTotalScore(user, candidate);
        return { user: candidate, score };
      }).sort((a, b) => b.score - a.score);

      res.status(200).json({ success: true, data: recommendations });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      res.status(500).json({ success: false, message: 'Error al obtener recomendaciones' });
    }
  },

  // Ver detalles de un match específico
  async getMatchById(req, res) {
    try {
      const userId = req.user.id;
      const matchId = req.params.id;
      const match = await MatchModel.getMatchById(matchId, userId);

      if (!match) {
        return res.status(404).json({ success: false, message: 'Match no encontrado' });
      }

      res.status(200).json({ success: true, data: match });
    } catch (error) {
      console.error('Error fetching match:', error);
      res.status(500).json({ success: false, message: 'Error al obtener el match' });
    }
  },

  // Calcular compatibilidad con otro usuario
  async calculateMatch(req, res) {
    try {
      const user1Id = req.user.id;
      const user2Id = parseInt(req.params.userId);

      if (user1Id === user2Id) {
        return res.status(400).json({ success: false, message: 'No puedes calcular compatibilidad contigo mismo' });
      }

      const user1 = await UserModel.findById(user1Id);
      const user2 = await UserModel.findById(user2Id);
      const score = matchAlgorithm.calculateTotalScore(user1, user2);

      res.status(200).json({ success: true, data: { score } });
    } catch (error) {
      console.error('Error calculating match:', error);
      res.status(500).json({ success: false, message: 'Error al calcular compatibilidad' });
    }
  },

  // Eliminar un match
  async deleteMatch(req, res) {
    try {
      const userId = req.user.id;
      const matchId = req.params.id;
      const deleted = await MatchModel.deleteMatch(matchId, userId);

      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Match no encontrado o no autorizado' });
      }

      res.status(200).json({ success: true, message: 'Match eliminado correctamente' });
    } catch (error) {
      console.error('Error deleting match:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar el match' });
    }
  }
};

module.exports = MatchController;
