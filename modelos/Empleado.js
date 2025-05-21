// Importamos la herramienta para generar IDs únicos
const { v4: uuidv4 } = require('uuid');

// Definimos la plantilla para crear empleados
class Empleado {
  constructor(nombre, email, perfilTecnico, especialidad, habilidades = []) {
    // Información del empleado
    this.id = uuidv4();          
    this.nombre = nombre;        
    this.email = email;          
    this.perfilTecnico = perfilTecnico; 
    this.especialidad = especialidad;  
    
    // Habilidades
    this.habilidades = habilidades;
    
    //Configuración automática al crear un estado (activo por defecto) y fecha de registro
    this.estaActivo = true;      
    this.fechaCreacion = new Date().toISOString();
  }
}

// Permitimos que otros archivos puedan crear empleados usando esta funcion
module.exports = Empleado;
