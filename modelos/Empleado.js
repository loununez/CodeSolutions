const mongoose = require('mongoose');

const empleadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  perfilTecnico: { type: String, required: true },
  especialidad: { type: String, required: true },
  habilidades: { type: [String], default: [] },
  telefono: { type: String, default: '' },
  estaActivo: { type: Boolean, default: true },
  fechaCreacion: { type: Date, default: Date.now }
});

// Acá creamos y exportamos el modelo
const Empleado = mongoose.model('Empleado', empleadoSchema);
module.exports = Empleado;