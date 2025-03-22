const db = require("../config/db");

const Reply = {
  async addReply(commentId, userId, content) {
    const query = "INSERT INTO replies (comment_id, user_id, content) VALUES ($1, $2, $3) RETURNING *";
    const values = [commentId, userId, content];
    const result = await db.query(query, values);
    return result.rows[0];
  }
};

module.exports = Reply;
