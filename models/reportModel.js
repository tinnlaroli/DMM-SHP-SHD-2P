const db = require('../config/db');

const ReportModel = {
  // Crear un nuevo reporte
  async createReport(data) {
    const query = `
      INSERT INTO reports (reporter_id, reported_id, reason, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *
    `;
    const values = [data.reporter_id, data.reported_id, data.reason];
    const { rows } = await db.query(query, values);
    return rows[0];
  },

  // Obtener todos los reportes (admin)
  async getAllReports() {
    const query = `
      SELECT r.*, u1.name AS reporter_name, u2.name AS reported_name
      FROM reports r
      JOIN users u1 ON r.reporter_id = u1.id
      JOIN users u2 ON r.reported_id = u2.id
      ORDER BY r.created_at DESC
    `;
    const { rows } = await db.query(query);
    return rows;
  },

  // Actualizar estado del reporte
  async updateStatus(id, status) {
    const query = `
      UPDATE reports
      SET status = $1
      WHERE id = $2
      RETURNING *
    `;
    const { rows } = await db.query(query, [status, id]);
    return rows[0];
  }
};

module.exports = ReportModel;