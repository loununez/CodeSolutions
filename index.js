// Importamos las herramientas necesarias
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const app = express();


// Habilitamos el manejo de datos en formato JSON
app.use(express.json());

// Permitimos leer datos de formularios
app.use(express.urlencoded({ extended: true }));

// Definimos la carpeta pública para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Habilitamos el manejo de cookies
app.use(cookieParser());


// Configuramos el manejo de sesiones de usuarios
app.use(require('./middlewares/session'));

// Agregamos un registro de actividad (log)
app.use(require('./middlewares/logger'));


// Usamos Pug como motor de plantillas
app.set('view engine', 'pug');

// Definimos dónde están las plantillas
app.set('views', path.join(__dirname, 'vistas'));

// Compartimos datos comunes con todas las vistas
app.use((req, res, next) => {
  res.locals = {
    tituloSitio: 'Code Solutions',  
    user: req.user,  
    currentPath: req.path  
  };
  next();
});


// Importamos los grupos de rutas
const rutasPrincipales = require('./rutas/index');
const rutasAuth = require('./rutas/authRoutes');
const rutasProyectos = require('./rutas/proyectoRoutes');
const rutasEmpleados = require('./rutas/empleadoRoutes');
const rutasTareas = require('./rutas/tareaRoutes');
const rutasReportes = require('./rutas/reporteRoutes');

// Rutas accesibles sin login
app.use('/auth', rutasAuth);  
app.use('/', rutasPrincipales); 


// Verificación de usuario logueado
const authMiddleware = require('./middlewares/auth');

// Rutas protegidas 
app.use('/proyectos', authMiddleware, rutasProyectos);
app.use('/empleados', authMiddleware, rutasEmpleados);
app.use('/tareas', authMiddleware, rutasTareas);
app.use('/reportes', authMiddleware, rutasReportes);


// Página no encontrada (404)
app.use((req, res) => {
  res.status(404).render('error', {
    titulo: 'Página no encontrada',
    mensajeError: 'Lo sentimos, no pudimos encontrar lo que buscas'
  });
});

// Error interno del servidor (500)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).render('error', {
    titulo: 'Error en el sistema',
    mensajeError: 'Ocurrió un problema. Por favor intenta más tarde.'
  });
});

// Inicio del servidor
const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
  console.log(`\nServidor corriendo en: http://localhost:${PUERTO}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log('Rutas disponibles:');
  console.log('- GET  /               Página principal');
  console.log('- GET  /auth/login     Formulario de login');
  console.log('- POST /auth/login     Procesar login');
  console.log('- GET  /auth/logout    Cerrar sesión');
  console.log('- GET  /empleados*     Rutas protegidas');
});