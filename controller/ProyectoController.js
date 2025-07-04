const Proyecto = require('../modelos/Proyecto');
const Tarea = require('../modelos/Tarea');

// Mostrar la lista de proyectos
module.exports.listar = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().lean();

    for (const proyecto of proyectos) {
      const tareas = await Tarea.find({ proyectoId: proyecto._id });

      let horasRegistradasTotal = 0;
      let horasTrabajadasTotal = 0;

      // Sumar las horas de las tareas asociadas al proyecto
      tareas.forEach(tarea => {
        horasRegistradasTotal += tarea.horas || 0;
        horasTrabajadasTotal += tarea.horasTrabajadas || 0;
      });

      // Agregar las horas al objeto del proyecto (no guardamos en DB)
      proyecto.horasRegistradas = horasRegistradasTotal;
      proyecto.horasTrabajadas = horasTrabajadasTotal;
    }

    // Renderizar la vista con los proyectos y sus horas calculadas
    res.render('proyectos/listar', { proyectos });
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).render('error', {
      titulo: 'Error',
      mensajeError: 'Error al cargar los proyectos'
    });
  }
};

// Mostrar el formulario para crear un nuevo proyecto
module.exports.mostrarFormulario = async (req, res) => {
  try {
    res.render('proyectos/crear');
  } catch (error) {
    console.error('Error al cargar formulario de creación de proyecto:', error);
    res.status(500).render('error', {
      titulo: 'Error',
      mensajeError: 'Error al cargar el formulario de creación de proyecto'
    });
  }
};

// Crear un nuevo proyecto
module.exports.crear = async (req, res) => {
  try {
    const { nombre, descripcion, fechaInicio, fechaFin, progreso, estado } = req.body;

    if (!fechaInicio || !fechaFin) {
      throw new Error('Las fechas son requeridas');
    }

    const nuevoProyecto = new Proyecto({
      nombre,
      descripcion,
      fechaInicio: new Date(fechaInicio),
      fechaFin: new Date(fechaFin),
      progreso: progreso || 0,
      estado
      // No se incluyen horasRegistradas ni horasTrabajadas
    });

    await nuevoProyecto.save();
    res.redirect('/proyectos');
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.render('proyectos/crear', {
      error: true,
      datos: req.body
    });
  }
};

// Mostrar el formulario para editar un proyecto
module.exports.mostrarFormularioEditar = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).render('error', {
        mensajeError: 'Proyecto no encontrado'
      });
    }

    res.render('proyectos/editar', { proyecto });
  } catch (error) {
    console.error('Error al mostrar formulario de edición de proyecto:', error);
    res.status(500).redirect('/proyectos');
  }
};

// Editar un proyecto existente
module.exports.editar = async (req, res) => {
  try {
    const { nombre, descripcion, fechaInicio, fechaFin, progreso, estado } = req.body;

    const proyectoActualizado = await Proyecto.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        descripcion,
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin),
        progreso,
        estado
        // No actualizamos horasRegistradas ni horasTrabajadas
      },
      { new: true }
    );

    if (!proyectoActualizado) {
      return res.status(404).render('error', {
        mensajeError: 'Proyecto no encontrado para editar'
      });
    }

    res.redirect('/proyectos');
  } catch (error) {
    console.error('Error al editar proyecto:', error);
    res.render('proyectos/editar', {
      error: true,
      proyecto: req.body
    });
  }
};

// Eliminar un proyecto
module.exports.eliminar = async (req, res) => {
  try {
    const proyectoEliminado = await Proyecto.findByIdAndDelete(req.params.id);

    if (!proyectoEliminado) {
      return res.status(404).render('error', {
        mensajeError: 'Proyecto no encontrado para eliminar'
      });
    }

    res.redirect('/proyectos');
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    res.status(500).redirect('/proyectos');
  }
};
