const db = require('../config/db');

class UserPlayTime {
  static async create(userId, playTimeId) {
    const query = `
      INSERT INTO user_play_times (user_id, play_time_id)
      VALUES ($1, $2)
      RETURNING *
    `;
    
    try {
      const { rows } = await db.query(query, [userId, playTimeId]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating user play time: ${error.message}`);
    }
  }

  static async findByUserId(userId) {
    const query = `
      SELECT upt.id, upt.play_time_id, ptp.name as play_time_name
      FROM user_play_times upt
      JOIN play_time_preferences ptp ON upt.play_time_id = ptp.id
      WHERE upt.user_id = $1
    `;
    
    try {
      const { rows } = await db.query(query, [userId]);
      return rows;
    } catch (error) {
      throw new Error(`Error finding user play times: ${error.message}`);
    }
  }

  static async delete(userId, playTimeId) {
    const query = `
      DELETE FROM user_play_times
      WHERE user_id = $1 AND play_time_id = $2
      RETURNING *
    `;
    
    try {
      const { rows } = await db.query(query, [userId, playTimeId]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error deleting user play time: ${error.message}`);
    }
  }

  static async deleteAllForUser(userId) {
    const query = `
      DELETE FROM user_play_times
      WHERE user_id = $1
    `;
    
    try {
      await db.query(query, [userId]);
      return true;
    } catch (error) {
      throw new Error(`Error deleting all user play times: ${error.message}`);
    }
  }
}

module.exports = UserPlayTime;