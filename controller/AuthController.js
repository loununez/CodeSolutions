const Usuario = require('../modelos/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secreto123'; // usá una variable de entorno en producción

module.exports = {
  // Login de usuario
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const usuario = await Usuario.findOne({ username });

      if (!usuario) {
        return res.status(401).render('login', { error: 'Usuario o contraseña inválidos' });
      }

      const passwordValido = await bcrypt.compare(password, usuario.passwordHash); // 👈🏼 ojo acá también

      if (!passwordValido) {
        return res.status(401).render('login', { error: 'Usuario o contraseña inválidos' });
      }

      // Creamos el token con los datos del usuario
      const token = jwt.sign(
        {
          id: usuario._id,
          username: usuario.username,
          rol: usuario.rol
        },
        JWT_SECRET,
        { expiresIn: '1h' }
      );

      // Guardamos el token como cookie httpOnly
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });

      res.redirect('/');
    } catch (error) {
      console.error('Error en login:', error);
      res.status(500).render('login', { error: 'Error interno del servidor' });
    }
  },

  // Logout
  logout: (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
  },

  // Registro de usuario
  registrar: async (req, res) => {
    try {
      const { username, password, rol } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: 'Faltan datos requeridos' });
      }

      const existe = await Usuario.findOne({ username });
      if (existe) {
        return res.status(400).json({ error: 'Usuario ya existe' });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const nuevoUsuario = new Usuario({
        username,
        passwordHash,
        rol: rol || 'usuario'
      });

      await nuevoUsuario.save();

      res.status(201).json({ mensaje: 'Usuario creado con éxito' });
    } catch (error) {
      console.error('Error en el registro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};