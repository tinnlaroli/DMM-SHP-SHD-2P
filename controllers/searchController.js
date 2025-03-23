const SearchModel = require('../models/searchModel');

const SearchController = {
  async searchUsers(req, res) {
    try {
      const query = req.query.q || '';
      const results = await SearchModel.searchUsers(query);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ success: false, message: 'Error al buscar usuarios' });
    }
  },

  async searchPosts(req, res) {
    try {
      const query = req.query.q || '';
      const results = await SearchModel.searchPosts(query);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error('Error searching posts:', error);
      res.status(500).json({ success: false, message: 'Error al buscar publicaciones' });
    }
  },

  async searchGames(req, res) {
    try {
      const query = req.query.q || '';
      const results = await SearchModel.searchGames(query);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error('Error searching games:', error);
      res.status(500).json({ success: false, message: 'Error al buscar juegos' });
    }
  },

  async searchGameInvitations(req, res) {
    try {
      const query = req.query.q || '';
      const results = await SearchModel.searchGameInvitations(query);
      res.status(200).json({ success: true, data: results });
    } catch (error) {
      console.error('Error searching game invitations:', error);
      res.status(500).json({ success: false, message: 'Error al buscar invitaciones de juego' });
    }
  }
};

module.exports = SearchController;