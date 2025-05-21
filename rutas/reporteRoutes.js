// Importamos Express 
const express = require('express');
const router = express.Router();

// Importamos el controlador que genera los reportes
const ReporteController = require('../controller/ReporteController');

// Definimos la única ruta de reportes
// Cuando visiten la página principal de reportes
router.get('/', ReporteController.reportes);

// Exportamos la configuración de esta ruta
module.exports = router;