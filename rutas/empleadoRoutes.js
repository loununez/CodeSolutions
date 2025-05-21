// Importamos las herramientas necesarias
const express = require('express'); 
const router = express.Router();  

// Importamos el controlador de empleados
const empleadoController = require('../controller/EmpleadoController');

// Definimos las rutas y sus acciones
// Muestra la lista de empleados (página principal)
router.get('/', empleadoController.listar);

// Muestra el formulario para agregar nuevo empleado
router.get('/crear', empleadoController.mostrarFormulario);

// Procesa el formulario de nuevo empleado con validacion al incio
router.post(
  '/', 
  require('../middlewares/validarCampos'), 
  empleadoController.crear
);

// Hacemos que estas rutas estén disponibles para el archivo principal
module.exports = router;