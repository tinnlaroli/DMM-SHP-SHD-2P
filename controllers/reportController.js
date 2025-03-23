const ReportModel = require('../models/reportModel');

const ReportController = {
  // Crear reporte
  async create(req, res) {
    try {
      const reporter_id = req.user.id;
      const { reported_id, reason } = req.body;

      if (reporter_id === reported_id) {
        return res.status(400).json({ success: false, message: 'No puedes reportarte a ti mismo' });
      }

      const report = await ReportModel.createReport({ reporter_id, reported_id, reason });
      res.status(201).json({ success: true, data: report });
    } catch (error) {
      console.error('Error creando reporte:', error);
      res.status(500).json({ success: false, message: 'Error al crear el reporte' });
    }
  },

  // Obtener todos los reportes (admin)
  async getAll(req, res) {
    try {
      if (!req.user.is_admin) {
        return res.status(403).json({ success: false, message: 'No autorizado' });
      }

      const reports = await ReportModel.getAllReports();
      res.status(200).json({ success: true, data: reports });
    } catch (error) {
      console.error('Error obteniendo reportes:', error);
      res.status(500).json({ success: false, message: 'Error al obtener reportes' });
    }
  },

  // Actualizar estado del reporte (admin)
  async updateStatus(req, res) {
    try {
      if (!req.user.is_admin) {
        return res.status(403).json({ success: false, message: 'No autorizado' });
      }

      const id = req.params.id;
      const { status } = req.body; // 'pending', 'reviewed', 'banned'
      const updated = await ReportModel.updateStatus(id, status);

      if (!updated) {
        return res.status(404).json({ success: false, message: 'Reporte no encontrado' });
      }

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Error actualizando estado del reporte:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar el estado del reporte' });
    }
  }
};

module.exports = ReportController;