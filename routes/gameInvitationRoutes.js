const express = require('express');
const router = express.Router();
const GameInvitationController = require('../controllers/gameInvitationController');
const authmiddleware = require('../middlewares/authMiddleware');

// Obtener todas las invitaciones activas
router.get('/',authmiddleware, GameInvitationController.getAll);

// Crear nueva invitación de juego
router.post('/',authmiddleware, GameInvitationController.create);

// Ver detalles de una invitación
router.get('/:id',authmiddleware, GameInvitationController.getById);

// Actualizar una invitación existente
router.put('/:id',authmiddleware, GameInvitationController.update);

// Cancelar una invitación
router.delete('/:id',authmiddleware, GameInvitationController.remove);

// Unirse a una invitación
router.post('/:id/join',authmiddleware, GameInvitationController.join);

// Aceptar o rechazar participación
router.put('/:id/status',authmiddleware, GameInvitationController.updateStatus);

// Ver próximas citas del usuario
router.get('/upcoming', authmiddleware, GameInvitationController.getUpcoming);

module.exports = router;
