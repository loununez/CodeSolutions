// Lista de usuarios que son permitidos 
const users = [
  // Usuario de ejemplo
  { id: 1, username: 'admin', password: '1234' } 
];

// Objeto para guardar las sesiones 
const sessions = {};

// Middleware que verifica si hay un usuario logueado
module.exports = (req, res, next) => {
  const sessionId = req.cookies?.sessionId;
  req.user = sessionId 
    ? users.find(user => user.id === sessions[sessionId]) 
    : null;
  
  //Se continua la ejecución
  next();
};

// Se exporta también las listas de usuarios y sesiones 
module.exports.users = users;    // Lista de usuarios
module.exports.sessions = sessions; // Sesiones activas