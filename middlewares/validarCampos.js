// Verificador de datos para formularios
module.exports = (req, res, next) => {
  
  // Revisamos cuando envían datos (POST o PUT)
  if (req.method === 'POST' || req.method === 'PUT') {
    
    // Si el formulario viene vacío
    if (!req.body || Object.keys(req.body).length === 0) {
      // Mostramos error y no se puede continuar
      return res.status(400).render('error', {
        error: 'No enviaste ningún dato. Completa el formulario.' 
      });
    }
  }
  
  // Si todo está bien, se continua
  next();
};