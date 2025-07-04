const mongoose = require('mongoose');  // Asegúrate de importar mongoose

const tareaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String, required: true },
  horasRegistradas: { type: Number, default: 0 },
  horasTrabajadas: { type: Number, default: 0 },
  prioridad: { type: String, enum: ['Alta', 'Media', 'Baja'], required: true },
  fecha_vencimiento: { type: Date, required: true },
  estado: { type: String, enum: ['Pendiente', 'En Progreso', 'Completada'], default: 'Pendiente' },
  empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Empleado' },
  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto' }
});

module.exports = mongoose.model('Tarea', tareaSchema);



