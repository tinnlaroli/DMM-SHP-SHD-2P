const db = require('../config/db');

class PlayTimePreference {
  static async getAll() {
    const query = `
      SELECT *
      FROM play_time_preferences
      ORDER BY id
    `;
    
    try {
      const { rows } = await db.query(query);
      return rows;
    } catch (error) {
      throw new Error(`Error getting play time preferences: ${error.message}`);
    }
  }

  static async findById(id) {
    const query = `
      SELECT *
      FROM play_time_preferences
      WHERE id = $1
    `;
    
    try {
      const { rows } = await db.query(query, [id]);
      return rows[0] || null;
    } catch (error) {
      throw new Error(`Error finding play time preference: ${error.message}`);
    }
  }

  static async create(name) {
    const query = `
      INSERT INTO play_time_preferences (name)
      VALUES ($1)
      RETURNING *
    `;
    
    try {
      const { rows } = await db.query(query, [name]);
      return rows[0];
    } catch (error) {
      throw new Error(`Error creating play time preference: ${error.message}`);
    }
  }
}

module.exports = PlayTimePreference;