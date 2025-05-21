const { v4: uuidv4 } = require('uuid');

class Tarea {
    constructor(proyectoId, nombre, horasRegistradas, empleadoId = null) {
        this.id = uuidv4();
        this.proyectoId = proyectoId;
        this.nombre = nombre;
        this.horasRegistradas = horasRegistradas;
        this.empleadoId = empleadoId;
        this.estado = 'pendiente';
        this.fechaCreacion = new Date().toISOString();
    }
}

module.exports = Tarea;