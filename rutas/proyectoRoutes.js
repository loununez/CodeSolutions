// Importamos Express
const express = require('express');
const router = express.Router();

// Traemos todas las funciones para manejar proyectos
const ProyectoController = require('../controller/ProyectoController');

// Configuramos las páginas y acciones

// Página principal donde muestra todos los proyectos
router.get('/', ProyectoController.listar);

// Formulario para agregar un proyecto nuevo (CORRECCIÓN: usar mostrarFormularioCrear)
router.get('/crear', ProyectoController.mostrarFormularioCrear);

// Guarda el proyecto nuevo cuando se envía el formulario
router.post('/', ProyectoController.crear);

// Muestra el formulario para modificar un proyecto (CORRECCIÓN: usar mostrarFormularioEditar)
router.get('/editar/:id', ProyectoController.mostrarFormularioEditar);

// Actualiza los cambios del proyecto
router.post('/actualizar/:id', ProyectoController.actualizar);

// Elimina un proyecto existente
router.get('/eliminar/:id', ProyectoController.eliminar);

// Exportamos estas rutas para usarlas en index.js
module.exports = router;