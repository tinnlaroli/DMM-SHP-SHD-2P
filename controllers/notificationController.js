const NotificationModel = require('../models/notificationModel');

const NotificationController = {
  // Obtener notificaciones del usuario
  async getAll(req, res) {
    try {
      const userId = req.user.id;
      const notifications = await NotificationModel.getByUserId(userId);
      res.status(200).json({ success: true, data: notifications });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ success: false, message: 'Error al obtener notificaciones' });
    }
  },

  // Marcar notificación como leída
  async markAsRead(req, res) {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      const updated = await NotificationModel.markAsRead(id, userId);
      if (!updated) return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      res.status(500).json({ success: false, message: 'Error al marcar como leída' });
    }
  },

  // Marcar todas como leídas
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.id;
      const updated = await NotificationModel.markAllAsRead(userId);
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      console.error('Error marking all as read:', error);
      res.status(500).json({ success: false, message: 'Error al marcar todas como leídas' });
    }
  },

  // Eliminar notificación
  async remove(req, res) {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      const deleted = await NotificationModel.delete(id, userId);
      if (!deleted) return res.status(404).json({ success: false, message: 'Notificación no encontrada' });
      res.status(200).json({ success: true, message: 'Notificación eliminada correctamente' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar notificación' });
    }
  }
};

module.exports = NotificationController;