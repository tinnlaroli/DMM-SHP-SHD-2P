const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Obtener notificaciones del usuario
router.get('/',authMiddleware,  NotificationController.getAll);

// Marcar una notificación como leída
router.put('/:id/read',authMiddleware,  NotificationController.markAsRead);

// Marcar todas como leídas
router.put('/read-all',authMiddleware,  NotificationController.markAllAsRead);

// Eliminar una notificación
router.delete('/:id',authMiddleware,  NotificationController.remove);

module.exports = router;
