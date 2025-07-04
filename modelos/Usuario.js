const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  rol: {
    type: String,
    enum: ['admin', 'usuario'],
    default: 'usuario'
  }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
