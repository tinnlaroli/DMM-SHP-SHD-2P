const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const auth = require('../middlewares/authMiddleware');

// Obtener notificaciones del usuario
router.get('/',  NotificationController.getAll);

// Marcar una notificación como leída
router.put('/:id/read',  NotificationController.markAsRead);

// Marcar todas como leídas
router.put('/read-all',  NotificationController.markAllAsRead);

// Eliminar una notificación
router.delete('/:id',  NotificationController.remove);

module.exports = router;
