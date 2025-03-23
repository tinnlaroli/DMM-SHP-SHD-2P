const db = require('../config/db');

const SearchModel = {
  // Buscar usuarios por nombre
  async searchUsers(query) {
    const sql = `
      SELECT id, name, profile_picture, bio
      FROM users
      WHERE name ILIKE $1
    `;
    const { rows } = await db.query(sql, [`%${query}%`]);
    return rows;
  },

  // Buscar publicaciones por contenido o título de juego
  async searchPosts(query) {
    const sql = `
      SELECT p.*, u.name AS author_name, u.profile_picture AS author_profile_picture
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.content ILIKE $1 OR p.game_title ILIKE $1
      ORDER BY p.created_at DESC
    `;
    const { rows } = await db.query(sql, [`%${query}%`]);
    return rows;
  },

  // Buscar juegos desde las preferencias de usuarios (distinct)
  async searchGames(query) {
    const sql = `
      SELECT DISTINCT UNNEST(game_preferences) AS game
      FROM users
      WHERE $1 = '' OR EXISTS (
        SELECT 1 FROM UNNEST(game_preferences) g WHERE g ILIKE $2
      )
    `;
    const { rows } = await db.query(sql, [query, `%${query}%`]);
    return rows.map(r => r.game);
  },

  // Buscar invitaciones de juego
  async searchGameInvitations(query) {
    const sql = `
      SELECT * FROM game_invitations
      WHERE game_title ILIKE $1 OR game_platform ILIKE $1
      ORDER BY game_date ASC
    `;
    const { rows } = await db.query(sql, [`%${query}%`]);
    return rows;
  }
};

module.exports = SearchModel;