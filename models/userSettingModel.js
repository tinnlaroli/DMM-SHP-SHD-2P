const db = require('../config/db');

const userSettingModel = {
  // Create default settings for a new user
  async create(userId) {
    const query = `
      INSERT INTO user_settings (user_id)
      VALUES ($1)
      RETURNING user_id, private_profile, notifications_enabled, theme, language, timezone
    `;
    
    const { rows } = await db.query(query, [userId]);
    
    return rows[0];
  },
  
  // Get user settings
  async getByUserId(userId) {
    const query = `
      SELECT user_id, private_profile, notifications_enabled, theme, language, timezone
      FROM user_settings
      WHERE user_id = $1
    `;
    
    const { rows } = await db.query(query, [userId]);
    
    return rows[0] || null;
  },
  
  // Update user settings
  async update(userId, settings) {
    const { private_profile, notifications_enabled, theme, language, timezone } = settings;
    
    const query = `
      UPDATE user_settings
      SET private_profile = COALESCE($1, private_profile),
          notifications_enabled = COALESCE($2, notifications_enabled),
          theme = COALESCE($3, theme),
          language = COALESCE($4, language),
          timezone = COALESCE($5, timezone)
      WHERE user_id = $6
      RETURNING user_id, private_profile, notifications_enabled, theme, language, timezone
    `;
    
    const values = [private_profile, notifications_enabled, theme, language, timezone, userId];
    
    const { rows } = await db.query(query, values);
    
    return rows[0] || null;
  }
};

module.exports = userSettingModel;