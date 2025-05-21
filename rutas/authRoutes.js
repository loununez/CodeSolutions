const express = require('express');  // Framework para crear el servidor web
const router = express.Router();    // Crea un grupo de rutas
const { v4: uuidv4 } = require('uuid'); // Genera IDs únicos
const { users, sessions } = require('../middlewares/session'); // Trae la lista de usuarios y sesiones

// Muestra el formulario de inicio de sesión
router.get('/login', (req, res) => {
  res.render('login', { error: null }); 
});

// Procesa el formulario de inicio de sesión
router.post('/login', (req, res) => {
  const { username, password } = req.body; 
  
  // Busca si existe un usuario con esas credenciales
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Si las credenciales son correctas crea un ID de sesión único y guarda la sesión
    const sessionId = uuidv4(); 
    sessions[sessionId] = user.id;
    
    // Envía una cookie al navegador para recordar la sesión
    res.cookie('sessionId', sessionId, { httpOnly: true });
    
    return res.redirect('/empleados');
  }
  
  // Si las credenciales son incorrectas muestra error
  res.render('login', { error: 'Usuario o contraseña incorrectos' }); 
});

// Cierra la sesión del usuario
router.get('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId; 
  
  // Elimina la sesión del sistema
  delete sessions[sessionId]; 
  // Borra la cookie del navegador
  res.clearCookie('sessionId'); 
  // Redirige al formulario de login
  res.redirect('/auth/login'); 
});

// Permite que otros archivos puedan usar estas rutas
module.exports = router;