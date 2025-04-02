const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateUpdateProfile, validateAddGame, validateAddPlayTime } = require('../middlewares/validation');

// Obtener perfil completo
router.get('/:id/profile',authMiddleware, profileController.getProfile);

// Actualizar perfil
router.put('/:id/profile',authMiddleware, validateUpdateProfile, profileController.updateProfile);

// Obtener preferencias de juegos
router.get('/:id/games',authMiddleware, profileController.getGames);
// Agregar un juego a las preferencias del usuario
router.post('/games',authMiddleware, validateAddGame, profileController.addGame);
// Eliminar un juego de las preferencias del usuario
router.delete('/games/:gameId',authMiddleware, profileController.removeGame);

// Obtener tiempos de juego del usuario
router.get('/:id/play-times',authMiddleware, profileController.getPlayTimes);
// Agregar un tiempo de juego a las preferencias del usuario
router.post('/play-times',authMiddleware, validateAddPlayTime, profileController.addPlayTime);
// Eliminar un tiempo de juego de las preferencias del usuario
router.delete('/play-times/:timeId',authMiddleware, profileController.removePlayTime);

module.exports = router;
