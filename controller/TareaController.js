const fs = require('fs').promises; 
const Tarea = require('../modelos/Tarea'); 
const archivoTareas = './datos/tareas.json'; 

// Función para leer datos de cualquier archivo JSON
async function leerDatos(archivo) {
  try {
    const datos = await fs.readFile(archivo, 'utf8');
    return JSON.parse(datos);
  } catch {
    // Si falla porque el archivo no existe, creamos uno nuevo vacío
    await fs.writeFile(archivo, '[]');
    return []; // Devolvemos array vacío
  }
}

// Función guardar tareas
async function guardarTareas(tareas) {
  await fs.writeFile(archivoTareas, JSON.stringify(tareas));
}

// Exportamos las funciones que manejarán las tareas
module.exports = {
  // Muestra la lista de tareas con información relacionada
  listar: async (req, res) => {
    try {
      // Obtenemos tareas, empleados y proyectos
      const tareas = await leerDatos(archivoTareas);
      const empleados = await leerDatos('./datos/empleados.json');
      const proyectos = await leerDatos('./datos/proyectos.json');
      
      // Mostramos la vista con todos los datos
      res.render('tareas/listar', { 
        tareas: tareas,
        empleados: empleados,
        proyectos: proyectos
      });
    } catch (error) {
      // Si hay error, mostramos página de "error"
      console.error('Error:', error);
      res.status(500).render('error', {
        titulo: 'Error',
        mensajeError: 'Error al cargar las tareas'
      });
    }
  },

  // Muestra el formulario para crear nueva tarea
  mostrarFormulario: async (req, res) => {
    try {
      // Necesitamos empleados y proyectos para el formulario
      const tareas = await leerDatos(archivoTareas);
      const empleados = await leerDatos('./datos/empleados.json');
      const proyectos = await leerDatos('./datos/proyectos.json');
      res.render('tareas/crear', { empleados, proyectos });
    } catch {
      // Si falla, mostramos formulario con que tuvo un error
      res.render('tareas/crear', { error: true });
    }
  },

  // Muestra el formulario para editar una tarea - SK
  mostrarFormularioEditar: async (req, res) => {

    try {
      const tareas = await leerDatos(archivoTareas); 
      const empleados = await leerDatos('./datos/empleados.json');
      const proyectos = await leerDatos('./datos/proyectos.json');

      // Buscamos la tarea a editar
      const tarea = tareas.find(t => t.id === req.params.id);
      if (!tarea) {
        return res.status(404).render('error', { mensajeError: 'Tarea no encontrada' });
      }

      res.render('tareas/editar', {
        tarea,
        empleados,
        proyectos
      });
    } catch (error) {
      console.error('Error mostrando formulario de edición:', error);
      res.status(500).redirect('/tareas');
    }
  },

  // Edita una tarea existente - SK
editar: async (req, res) => {
  try {
    const tareas = await leerDatos(archivoTareas); 
    
    const tareasActualizadas = tareas.map(tarea => {
      return tarea.id === req.params.id ? { ...tarea, ...req.body } : tarea;
    });

    await guardarTareas(tareasActualizadas);
    res.redirect('/tareas');
  } catch (error) {
    res.render('tareas/editar', { error: true, tarea: req.body });
  }
},

  // Crea una nueva tarea
  crear: async (req, res) => {
    // Extraemos datos del formulario
    const { proyectoId, nombre, horasRegistradas, empleadoId } = req.body;
    
    try {
      // Tenemos tareas existentes
      const tareas = await leerDatos(archivoTareas);
      // Agregamos nueva tarea
      tareas.push(new Tarea(proyectoId, nombre, horasRegistradas, empleadoId));
      // Guardamos cambios
      await guardarTareas(tareas);
      // Nos redirigimos a la lista
      res.redirect('/tareas');
    } catch {
      // Si falla, mostramos formulario con datos ingresados
      res.render('tareas/crear', { error: true, datos: req.body });
    }
  },

  // Actualiza el estado de una tarea
  cambiarEstado: async (req, res) => {
    const { id } = req.params; 
    const { estado } = req.body;
    
    try {
      const tareas = await leerDatos(archivoTareas);
      // Buscamos y actualizamos solo la tarea específica
      const tareasActualizadas = tareas.map(tarea => {
        if (tarea.id === id) {
          return { ...tarea, estado };
        }
        return tarea;
      });
      
      // Guardamos los cambios
      await guardarTareas(tareasActualizadas);
      res.redirect('/tareas');
    } catch {
      // Si falla, nos redirigimos a la lista
      res.status(500).redirect('/tareas');
    }
  },

  // Asigna un empleado a una tarea
  asignarEmpleado: async (req, res) => {
    const { id } = req.params; 
    const { empleadoId } = req.body; 
    
    try {
      const tareas = await leerDatos(archivoTareas);
      // Buscamos y actualizamos solo la tarea específica
      const tareasActualizadas = tareas.map(tarea => {
        if (tarea.id === id) {
          return { ...tarea, empleadoId };
        }
        return tarea;
      });
      
      // Guardamos los cambios
      await guardarTareas(tareasActualizadas);
      res.redirect('/tareas');
    } catch {
      // Si falla, nos redirigimos a la lista
      res.status(500).redirect('/tareas');
    }
  },

  // Elimina una tarea - SK
eliminar: async (req, res) => {
  try {
    const tareas = await leerDatos(archivoTareas); 
    const tareasActualizadas = tareas.filter(tarea => tarea.id !== req.params.id);
    
    await guardarTareas(tareasActualizadas);
    res.redirect('/tareas');
  } catch (error) {
    res.status(500).redirect('/tareas');
  }
}
};