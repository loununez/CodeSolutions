const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const app = express();


// Middleware para autenticación con JWT y sesiones
const jwtAuth = require('./middlewares/jwtAuth');
const authMiddleware = require('./middlewares/auth');

// Rutas JWT y tradicionales
const authJwtRoutes = require('./rutas/authJwtRoutes');
const rutasPrincipales = require('./rutas/index');
const rutasAuth = require('./rutas/authRoutes');
const rutasProyectos = require('./rutas/proyectoRoutes');
const rutasEmpleados = require('./rutas/empleadoRoutes');
const rutasTareas = require('./rutas/tareaRoutes');
const rutasReportes = require('./rutas/reporteRoutes');

// 🔹 Conexión a MongoDB Atlas
const mongoURL = 'mongodb+srv://admin:KxUAOX5lmx7lQmQk@codesolutions.u20nvod.mongodb.net/?retryWrites=true&w=majority&appName=CodeSolutions';

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error('Error de conexión a MongoDB:', error));
db.once('open', () => console.log('Conectado a MongoDB correctamente'));

// 🔹 Middlewares globales
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(require('./middlewares/logger'));

// 🔹 Archivos estáticos y vistas
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'vistas'));

// 🔹 Variables globales para las vistas
app.use((req, res, next) => {
  res.locals = {
    tituloSitio: 'Code Solutions',
    user: req.user, // Puede venir de jwtAuth o authMiddleware
    currentPath: req.path,
  };
  next();
});

// 🔹 Rutas públicas
app.use('/api/auth', authJwtRoutes);   // Registro / Login con JWT (API)
app.use('/auth', rutasAuth);           // Login tradicional (formulario)
app.use('/', rutasPrincipales);        // Página de inicio

// 🔹 Rutas protegidas por JWT (API)
app.use('/api/proyectos', jwtAuth, rutasProyectos);
app.use('/api/empleados', jwtAuth, rutasEmpleados);
app.use('/api/tareas', jwtAuth, rutasTareas);
app.use('/api/reportes', jwtAuth, rutasReportes);

// 🔹 Rutas protegidas tradicionales (vistas con sesiones)
app.use('/proyectos', authMiddleware, rutasProyectos);
app.use('/empleados', authMiddleware, rutasEmpleados);
app.use('/tareas', authMiddleware, rutasTareas);
app.use('/reportes', authMiddleware, rutasReportes);

// 🔹 Errores
app.use((req, res) => {
  res.status(404).render('error', {
    titulo: 'Página no encontrada',
    mensajeError: 'Lo sentimos, no pudimos encontrar lo que buscas',
  });
});

app.use((err, req, res, next) => {
  console.error('Error inesperado:', err.stack);
  res.status(500).render('error', {
    titulo: 'Error en el sistema',
    mensajeError: 'Ocurrió un problema. Por favor intenta más tarde.',
  });
});

// 🔹 Inicio del servidor
const PUERTO = process.env.PUERTO || 3000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en: http://localhost:${PUERTO}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Rutas disponibles:
  - GET  /               Página principal
  - GET  /auth/login     Formulario de login
  - POST /auth/login     Procesar login
  - GET  /auth/logout    Cerrar sesión
  - GET  /empleados*     Rutas protegidas`);
});