const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const auth = require('../middlewares/authMiddleware');

// Crear reporte
router.post('/', auth, ReportController.create);

// Obtener todos los reportes (solo admin)
router.get('/', auth, ReportController.getAll);

// Actualizar estado del reporte (solo admin)
router.put('/:id/status', auth, ReportController.updateStatus);

module.exports = router;