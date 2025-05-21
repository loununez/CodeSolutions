// Middleware para verificar si el usuario está logueado
module.exports = (req, res, next) => {
  // Si no hay usuario en la sesión
  if (!req.user) {
    // Se redirige a la página de login con código de error 401 
    return res.status(401).redirect('/auth/login');
  }
  
  // Si el usuario existe, se puede continuar
  next();
};