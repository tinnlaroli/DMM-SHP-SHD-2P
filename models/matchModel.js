const db = require('../config/db');

const MatchModel = {
  async getMatchesByUserId(userId) {
    const query = `
      SELECT * FROM matches
      WHERE user_one = $1 OR user_two = $1
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  },

  async getMatchById(matchId, userId) {
    const query = `
      SELECT * FROM matches
      WHERE id = $1 AND (user_one = $2 OR user_two = $2)
    `;
    const result = await db.query(query, [matchId, userId]);
    return result.rows[0] || null;
  },

  async getUnmatchedUsers(userId) {
    const query = `
      SELECT * FROM users
      WHERE id != $1
        AND id NOT IN (
          SELECT user_two FROM matches WHERE user_one = $1
          UNION
          SELECT user_one FROM matches WHERE user_two = $1
        )
    `;
    const result = await db.query(query, [userId]);
    return result.rows;
  },

  async deleteMatch(matchId, userId) {
    const query = `
      DELETE FROM matches
      WHERE id = $1 AND (user_one = $2 OR user_two = $2)
      RETURNING *
    `;
    const result = await db.query(query, [matchId, userId]);
    return result.rows.length > 0;
  }
};

module.exports = MatchModel;