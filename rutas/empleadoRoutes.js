const express = require('express');
const router = express.Router();
const empleadoController = require('../controller/EmpleadoController');
const validarCampos = require('../middlewares/validarCampos');

// Lista de empleados
router.get('/', empleadoController.listar);

// Mostrar formulario de creación
router.get('/crear', empleadoController.mostrarFormulario);

// Procesar formulario de creación
router.post('/', validarCampos, empleadoController.crear);

// Cambiar estado del empleado
router.post('/actualizar/:id', empleadoController.cambiarEstado);

// Eliminar empleado
router.post('/eliminar/:id', empleadoController.eliminar);

module.exports = router;