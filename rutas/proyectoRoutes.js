const express = require('express');
const router = express.Router();
const ProyectoController = require('../controller/ProyectoController');  // Asegúrate de que el path sea correcto

// Ruta para mostrar la lista de proyectos
router.get('/', ProyectoController.listar);  // Asegúrate de que 'listar' sea una función en el controlador

// Ruta para mostrar el formulario de creación de proyecto
router.get('/crear', ProyectoController.mostrarFormulario);

// Ruta para crear un proyecto
router.post('/', ProyectoController.crear);

// Ruta para editar un proyecto
router.get('/editar/:id', ProyectoController.mostrarFormularioEditar);

// Ruta para guardar los cambios de un proyecto editado
router.post('/editar/:id', ProyectoController.editar);

// Ruta para eliminar un proyecto
router.post('/eliminar/:id', ProyectoController.eliminar);

module.exports = router;
