// este archivo es para centralizar todas las rutas de la aplicación
const express = require('express');
const router = express();

// Importar rutas específicas
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const profileRoutes = require('./profileRoutes');
const postRoutes = require('./postRoutes');
const socialRoutes = require('./socialRoutes');
// const commentRoutes = require('./commentRoutes');
const matchRoutes = require('./matchRoutes');
const gameInvitationRoutes = require('./gameInvitationRoutes');
const notificationRoutes = require('./notificationRoutes');
const reportRoutes = require('./reportRoutes');
// const searchRoutes = require('./searchRoutes');

// Definir rutas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/users', profileRoutes);
router.use('/posts', postRoutes);
router.use("/social", socialRoutes);
// router.use('/comments', commentRoutes);
router.use('/matches', matchRoutes);
router.use('/game-invitations', gameInvitationRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);
// router.use('/search', searchRoutes);

module.exports = router;