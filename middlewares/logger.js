//  Registra información básica de cada solicitud
module.exports = (req, res, next) => {
  // Se cre un mensaje de registro con fecha y hora actual, tipo de solicitud y URL
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Se puede continuar
  next();
};