const express = require('express');
const router = express.Router();
const authController = require('../controller/AuthController');

// Formulario de login
router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

// POST /auth/login
router.post('/login', authController.login);

// GET /auth/logout
router.get('/logout', authController.logout);

// Nuevo endpoint para registrar usuario desde Postman
router.post('/registrar', authController.registrar);

module.exports = router;