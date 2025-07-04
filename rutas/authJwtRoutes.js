const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../modelos/Usuario');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'claveultrasecreta';

// REGISTRO
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  const existe = await Usuario.findOne({ username });
  if (existe) return res.status(400).json({ error: 'Usuario ya existe' });

  const passwordHash = await bcrypt.hash(password, 10);
  const nuevoUsuario = new Usuario({ username, passwordHash });

  await nuevoUsuario.save();

  res.status(201).json({ mensaje: 'Usuario creado' });
});

// LOGIN
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const usuario = await Usuario.findOne({ username });
  if (!usuario) return res.status(401).json({ error: 'Credenciales inválidas' });

  const valido = await usuario.validarPassword(password);
  if (!valido) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign(
    { id: usuario._id, username: usuario.username },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  res.json({ token });
});

module.exports = router;