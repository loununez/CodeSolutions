const express = require('express');
const router = express.Router();
const reporteController = require('../controller/ReporteController'); // Cambié la ruta para que coincida con la carpeta 'controller'

// Ruta para los reportes
router.get('/', reporteController.reportes);  // Asegúrate de que la ruta sea correcta

module.exports = router;
