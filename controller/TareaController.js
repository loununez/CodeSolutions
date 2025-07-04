const Tarea = require('../modelos/Tarea');
const Empleado = require('../modelos/Empleado');
const Proyecto = require('../modelos/Proyecto');

module.exports = {
  // Muestra la lista de tareas con información relacionada
  listar: async (req, res) => {
    try {
      const tareas = await Tarea.find()
        .populate('empleadoId')
        .populate('proyectoId');

      res.render('tareas/listar', { tareas });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).render('error', {
        titulo: 'Error',
        mensajeError: 'Error al cargar las tareas'
      });
    }
  },

  // Muestra el formulario para crear una nueva tarea
  mostrarFormulario: async (req, res) => {
    try {
      const empleados = await Empleado.find();
      const proyectos = await Proyecto.find();

      res.render('tareas/crear', {
        empleados,
        proyectos
      });
    } catch (error) {
      console.error('Error al mostrar el formulario:', error);
      
      // Asegurarse de pasar empleados y proyectos incluso en caso de error
      const empleados = await Empleado.find().catch(() => []);
      const proyectos = await Proyecto.find().catch(() => []);
      
      res.render('tareas/crear', {
        error: 'Error al cargar el formulario',
        empleados,
        proyectos
      });
    }
  },

  // Crea una nueva tarea y actualiza las horas en el proyecto
  crear: async (req, res) => {
    try {
      const { 
        nombre, 
        descripcion, 
        horasRegistradas, 
        horasTrabajadas, 
        empleadoId, 
        proyectoId, 
        estado,
        prioridad,
        fecha_vencimiento 
      } = req.body;

      // Validación básica de campos requeridos
      if (!prioridad || !fecha_vencimiento) {
        throw new Error('Prioridad y fecha de vencimiento son requeridos');
      }

      // Crear la tarea con todos los campos
      const nuevaTarea = new Tarea({
        nombre,
        descripcion,
        horasRegistradas: Number(horasRegistradas) || 0,
        horasTrabajadas: Number(horasTrabajadas) || 0,
        empleadoId,
        proyectoId,
        estado: estado || 'Pendiente',
        prioridad,
        fecha_vencimiento: new Date(fecha_vencimiento)
      });

      // Guardar la tarea
      await nuevaTarea.save();

      // Actualizar las horas trabajadas en el proyecto
      if (proyectoId) {
        const proyecto = await Proyecto.findById(proyectoId);
        if (proyecto) {
          proyecto.horasTrabajadas += Number(horasTrabajadas) || 0;
          await proyecto.save();
        }
      }

      res.redirect('/tareas');
    } catch (error) {
      console.error('Error al crear tarea:', error);
      
      // Recargar datos necesarios para mostrar el formulario nuevamente
      const [empleados, proyectos] = await Promise.all([
        Empleado.find().catch(() => []),
        Proyecto.find().catch(() => [])
      ]);
      
      res.render('tareas/crear', {
        error: error.message,
        empleados,
        proyectos,
        datos: req.body // Mantener los datos ingresados por el usuario
      });
    }
  },

  // Muestra el formulario para editar una tarea
  mostrarFormularioEditar: async (req, res) => {
    try {
      const tarea = await Tarea.findById(req.params.id);
      if (!tarea) {
        return res.status(404).render('error', {
          mensajeError: 'Tarea no encontrada'
        });
      }

      const [empleados, proyectos] = await Promise.all([
        Empleado.find(),
        Proyecto.find()
      ]);

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

  // Edita una tarea existente y actualiza las horas en el proyecto
  editar: async (req, res) => {
    try {
      const { 
        nombre, 
        descripcion, 
        horasRegistradas, 
        horasTrabajadas, 
        empleadoId, 
        proyectoId, 
        estado,
        prioridad,
        fecha_vencimiento 
      } = req.body;

      // Obtener la tarea original para comparar las horas trabajadas
      const tareaOriginal = await Tarea.findById(req.params.id);

      // Validación de campos requeridos
      if (!prioridad || !fecha_vencimiento) {
        throw new Error('Prioridad y fecha de vencimiento son requeridos');
      }

      // Actualizar la tarea
      const tareaActualizada = await Tarea.findByIdAndUpdate(req.params.id, {
        nombre,
        descripcion,
        horasRegistradas: Number(horasRegistradas) || 0,
        horasTrabajadas: Number(horasTrabajadas) || 0,
        empleadoId,
        proyectoId,
        estado,
        prioridad,
        fecha_vencimiento: new Date(fecha_vencimiento)
      }, { new: true });

      // Actualizar las horas trabajadas en el proyecto si cambió
      if (proyectoId && tareaOriginal) {
        const proyecto = await Proyecto.findById(proyectoId);
        if (proyecto) {
          const diferenciaHoras = (Number(horasTrabajadas) || 0) - (tareaOriginal.horasTrabajadas || 0);
          proyecto.horasTrabajadas += diferenciaHoras;
          await proyecto.save();
        }
      }

      res.redirect('/tareas');
    } catch (error) {
      console.error('Error al editar tarea:', error);
      
      // Recargar datos para mostrar el formulario de edición nuevamente
      const [tarea, empleados, proyectos] = await Promise.all([
        Tarea.findById(req.params.id).catch(() => null),
        Empleado.find().catch(() => []),
        Proyecto.find().catch(() => [])
      ]);
      
      res.render('tareas/editar', {
        error: error.message,
        tarea: tarea || req.body,
        empleados,
        proyectos
      });
    }
  },

  // Elimina una tarea y actualiza las horas trabajadas del proyecto
  eliminar: async (req, res) => {
    try {
      const tarea = await Tarea.findById(req.params.id);
      
      if (!tarea) {
        return res.status(404).render('error', {
          mensajeError: 'Tarea no encontrada'
        });
      }

      // Restar horas del proyecto si existe
      if (tarea.proyectoId) {
        const proyecto = await Proyecto.findById(tarea.proyectoId);
        if (proyecto) {
          proyecto.horasTrabajadas -= tarea.horasTrabajadas || 0;
          await proyecto.save();
        }
      }

      await Tarea.findByIdAndDelete(req.params.id);

      res.redirect('/tareas');
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      res.status(500).redirect('/tareas');
    }
  }
};