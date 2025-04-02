const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const auth = require('../middlewares/authMiddleware');

// Crear reporte
router.post('/',  ReportController.create);

// Obtener todos los reportes (solo admin)
router.get('/',  ReportController.getAll);

// Actualizar estado del reporte (solo admin)
router.put('/:id/status',  ReportController.updateStatus);

module.exports = router;