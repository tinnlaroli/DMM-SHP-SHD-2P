const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');
const auth = require('../middlewares/authMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');

// Crear reporte
router.post('/',authMiddleware,  ReportController.create);

// Obtener todos los reportes (solo admin)
router.get('/',authMiddleware,  ReportController.getAll);

// Actualizar estado del reporte (solo admin)
router.put('/:id/status',authMiddleware,  ReportController.updateStatus);

module.exports = router;