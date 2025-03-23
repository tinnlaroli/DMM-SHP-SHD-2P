const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notificationController');
const auth = require('../middlewares/authMiddleware');

// Obtener notificaciones del usuario
router.get('/', auth, NotificationController.getAll);

// Marcar una notificación como leída
router.put('/:id/read', auth, NotificationController.markAsRead);

// Marcar todas como leídas
router.put('/read-all', auth, NotificationController.markAllAsRead);

// Eliminar una notificación
router.delete('/:id', auth, NotificationController.remove);

module.exports = router;
