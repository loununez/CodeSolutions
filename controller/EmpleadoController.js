// Importación de módulos necesarios
const fs = require('fs').promises;
const Empleado = require('../modelos/Empleado'); 

// Ruta del archivo JSON donde se almacenan los empleados
const archivoEmpleados = './datos/empleados.json';

// Obtiene los datos de empleados desde el archivo JSON
 //Si el archivo no existe, lo crea con un array vacío

const obtenerEmpleados = async () => {
    try {
        // Lee y parsea el archivo JSON
        const datos = await fs.readFile(archivoEmpleados, 'utf8');
        return JSON.parse(datos);
    } catch (error) {
        // Si hay error (archivo no existe), crea uno nuevo
        await fs.writeFile(archivoEmpleados, '[]');
        return []; 
    }
};

// Exportación de los métodos del controlador
module.exports = {
    
     //Lista todos los empleados
     // Renderiza la vista con los datos obtenidos
    
    listar: async (req, res) => {
        try {
            const empleados = await obtenerEmpleados();
            res.render('empleados/listar', { empleados });
        } catch (error) {
            res.status(500).send('Error al obtener los empleados');
        }
    },

    
     //Muestra el formulario para crear un nuevo empleado
     
    mostrarFormulario: (req, res) => {
        res.render('empleados/crear');
    },

    /**
     * Crea un nuevo empleado y lo guarda en el archivo JSON
     * Recibe los datos del formulario (req.body)
     */
    crear: async (req, res) => {
        const { nombre, email, perfilTecnico, especialidad } = req.body;
        
        try {
            // Obtiene empleados existentes
            const empleados = await obtenerEmpleados();
            
            // Crea y agrega un nuevo empleado
            empleados.push(new Empleado(nombre, email, perfilTecnico, especialidad));
            
            // Guarda la lista actualizada
            await fs.writeFile(archivoEmpleados, JSON.stringify(empleados));
            
            // Redirige al listado
            res.redirect('/empleados');
        } catch (error) {
            // Si falla, muestra el formulario con error
            res.render('empleados/crear', { 
                error: true,
                datos: req.body // Conserva los datos ingresados
            });
        }
    }
};