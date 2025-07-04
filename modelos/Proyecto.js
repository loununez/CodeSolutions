const mongoose = require('mongoose');

const ProyectoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  fechaInicio: { type: Date, required: true },
  fechaFin: { type: Date, required: true },
  progreso: { type: Number, required: true, default: 0 },
  estado: { type: String, required: true },
  horasRegistradas: { type: Number, required: true, default: 0 },  // Nuevo campo para horas registradas
  horasTrabajadas: { type: Number, required: true, default: 0 },   // Nuevo campo para horas trabajadas
});

module.exports = mongoose.model('Proyecto', ProyectoSchema);

