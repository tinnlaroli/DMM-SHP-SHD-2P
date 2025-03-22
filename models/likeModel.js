const db = require("../config/db");

const Like = {
  async addLike(postId, userId) {
    const query = "INSERT INTO likes (post_id, user_id) VALUES ($1, $2) RETURNING *";
    const values = [postId, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async removeLike(postId, userId) {
    const query = "DELETE FROM likes WHERE post_id = $1 AND user_id = $2 RETURNING *";
    const values = [postId, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  }
};

module.exports = Like;
