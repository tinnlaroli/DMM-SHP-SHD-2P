// src/models/commentLikeModel.js
const db = require("../config/db");

const CommentLike = {
  async addCommentLike(commentId, userId) {
    const query = "INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2) RETURNING *";
    const values = [commentId, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  },
  
  async removeCommentLike(commentId, userId) {
    const query = "DELETE FROM comment_likes WHERE comment_id = $1 AND user_id = $2 RETURNING *";
    const values = [commentId, userId];
    const result = await db.query(query, values);
    return result.rows[0];
  }
};

module.exports = CommentLike;