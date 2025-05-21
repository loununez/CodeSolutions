const { v4: uuidv4 } = require('uuid');

class Proyecto {
    constructor(nombre, descripcion, cliente) {
        this.id = uuidv4();
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.cliente = cliente;
        this.estado = 'activo';
        this.fechaCreacion = new Date().toISOString();
    }
}

module.exports = Proyecto;