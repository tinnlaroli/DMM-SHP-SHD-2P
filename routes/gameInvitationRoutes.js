const express = require('express');
const router = express.Router();
const GameInvitationController = require('../controllers/gameInvitationController');
const authmiddleware = require('../middlewares/authMiddleware');

// Obtener todas las invitaciones activas
router.get('/', GameInvitationController.getAll);

// Crear nueva invitación de juego
router.post('/', GameInvitationController.create);

// Ver detalles de una invitación
router.get('/:id', GameInvitationController.getById);

// Actualizar una invitación existente
router.put('/:id', GameInvitationController.update);

// Cancelar una invitación
router.delete('/:id', GameInvitationController.remove);

// Unirse a una invitación
router.post('/:id/join', GameInvitationController.join);

// Aceptar o rechazar participación
router.put('/:id/status', GameInvitationController.updateStatus);

// Ver próximas citas del usuario
router.get('/upcoming', GameInvitationController.getUpcoming);

module.exports = router;
