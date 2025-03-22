const db = require("../config/db");

const Comment = {
  async getComments(postId) {
    const query = "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC";
    const values = [postId];
    const result = await db.query(query, values);
    return result.rows;
  },

  async addComment(postId, userId, content) {
    const query = "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *";
    const values = [postId, userId, content];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async updateComment(commentId, userId, content) {
    const query = "UPDATE comments SET content = $1 WHERE id = $2 AND user_id = $3 RETURNING *";
    const values = [content, commentId, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async deleteComment(commentId, userId) {
    const query = "DELETE FROM comments WHERE id = $1 AND user_id = $2 RETURNING *";
    const values = [commentId, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  }
};

module.exports = Comment;