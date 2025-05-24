// Configuración de rutas para manejar tareas
const express = require('express');
const router = express.Router();

// Importamos las funciones que manejan las tareas
const TareaController = require('../controller/TareaController');

// Definimos las rutas disponibles
// Ver lista de todas las tareas
router.get('/', TareaController.listar);

// Mostrar formulario para crear nueva tarea
router.get('/crear', TareaController.mostrarFormulario);

// Guardar una nueva tarea al enviar el formulario
router.post('/', TareaController.crear);

// Muestra el formulario para editar una tarea - SK
router.get('/editar/:id', TareaController.mostrarFormularioEditar);

// Guarda los cambios de la tarea editada - SK
router.post('/editar/:id', TareaController.editar);

// Elimina una tarea - SK
router.post('/eliminar/:id', TareaController.eliminar);

// Cambiar el estado de una tarea existente
router.post('/estado/:id', TareaController.cambiarEstado);

// Asignar un empleado a una tarea
router.post('/asignar/:id', TareaController.asignarEmpleado);

// Exportamos estas rutas para usarlas en la aplicación principal
module.exports = router;