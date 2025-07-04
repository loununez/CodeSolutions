const express = require('express');
const router = express.Router();

// Importa el controlador de tareas desde la carpeta 'controller'
const tareaController = require('../controller/TareaController');  // Asegúrate de que el path sea correcto

// Rutas para las tareas
router.get('/', tareaController.listar); // Mostrar lista de tareas
router.get('/crear', tareaController.mostrarFormulario); // Mostrar formulario de creación
router.post('/', tareaController.crear); // Crear una nueva tarea
router.get('/editar/:id', tareaController.mostrarFormularioEditar); // Mostrar formulario de edición
router.post('/editar/:id', tareaController.editar); // Editar una tarea
router.post('/eliminar/:id', tareaController.eliminar); // Eliminar tarea

module.exports = router;


