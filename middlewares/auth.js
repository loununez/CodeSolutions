const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secreto123';

module.exports = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect('/auth/login');
  }

  try {
    const usuario = jwt.verify(token, JWT_SECRET);

    // Lo guardamos para usar en controladores y vistas
    req.user = usuario;
    res.locals.user = usuario;

    next();
  } catch (error) {
    console.error('Token inválido:', error.message);
    res.clearCookie('token');
    return res.redirect('/auth/login');
  }
};