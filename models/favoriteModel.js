const db = require("../config/db");

const Favorite = {
  async addFavorite(postId, userId) {
    const query = "INSERT INTO favorites (post_id, user_id) VALUES ($1, $2) RETURNING *";
    const values = [postId, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async removeFavorite(postId, userId) {
    const query = "DELETE FROM favorites WHERE post_id = $1 AND user_id = $2 RETURNING *";
    const values = [postId, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  }
};

module.exports = Favorite;