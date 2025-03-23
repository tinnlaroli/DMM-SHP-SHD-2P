const db = require('../config/db');

const NotificationModel = {
  // Obtener notificaciones por usuario
  async getByUserId(userId) {
    const query = `
      SELECT * FROM notifications
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  },

  // Marcar una notificación como leída
  async markAsRead(id, userId) {
    const query = `
      UPDATE notifications
      SET seen = TRUE
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [id, userId]);
    return rows[0];
  },

  // Marcar todas como leídas para un usuario
  async markAllAsRead(userId) {
    const query = `
      UPDATE notifications
      SET seen = TRUE
      WHERE user_id = $1
      RETURNING *
    `;
    const { rows } = await db.query(query, [userId]);
    return rows;
  },

  // Eliminar una notificación
  async delete(id, userId) {
    const query = `
      DELETE FROM notifications
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [id, userId]);
    return rows[0];
  }
};

module.exports = NotificationModel;