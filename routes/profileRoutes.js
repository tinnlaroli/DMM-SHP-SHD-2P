const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middlewares/authMiddleware');
const { validateUpdateProfile, validateAddGame, validateAddPlayTime } = require('../middlewares/validation');

// Obtener perfil completo
router.get('/:id/profile', profileController.getProfile);

// Actualizar perfil
router.put('/:id/profile', validateUpdateProfile, profileController.updateProfile);

// Obtener preferencias de juegos
router.get('/:id/games', profileController.getGames);
// Agregar un juego a las preferencias del usuario
router.post('/games', validateAddGame, profileController.addGame);
// Eliminar un juego de las preferencias del usuario
router.delete('/games/:gameId', profileController.removeGame);

// Obtener tiempos de juego del usuario
router.get('/:id/play-times', profileController.getPlayTimes);
// Agregar un tiempo de juego a las preferencias del usuario
router.post('/play-times', validateAddPlayTime, profileController.addPlayTime);
// Eliminar un tiempo de juego de las preferencias del usuario
router.delete('/play-times/:timeId', profileController.removePlayTime);

module.exports = router;
