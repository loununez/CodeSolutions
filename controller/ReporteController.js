const Proyecto = require('../modelos/Proyecto');
const Tarea = require('../modelos/Tarea');
const Empleado = require('../modelos/Empleado');

module.exports = {
  reportes: async (req, res) => {
    try {
      const proyectos = await Proyecto.find();
      const tareas = await Tarea.find().populate('empleadoId').populate('proyectoId');
      const empleados = await Empleado.find();

      // Verificar los proyectos activos y completados
      const proyectosActivos = proyectos.filter(p => p.estado === 'En Progreso').length;
      const proyectosCompletados = proyectos.filter(p => p.estado === 'Completado').length;
      const horasTrabajadasTotales = tareas.reduce((sum, tarea) => sum + tarea.horasTrabajadas, 0);

      // Eficiencia del equipo (tareas completadas / total de tareas)
      const totalTareas = tareas.length;
      const totalTareasCompletadas = tareas.filter(t => t.estado === 'Completada').length;
      const eficienciaEquipo = ((totalTareasCompletadas / totalTareas) * 100).toFixed(2);

      // Aquí estamos creando el resumen de proyectos
      const resumenProyectos = proyectos.map(proyecto => ({
        nombre: proyecto.nombre,
        progreso: proyecto.progreso,
        horasRegistradas: proyecto.horasRegistradas || 0,  // Aseguramos que nunca sea undefined
        horasTrabajadas: proyecto.horasTrabajadas || 0,    // Lo mismo aquí
        estado: proyecto.estado
      }));

      // Enviar los datos a la vista
      res.render('reportes/reportes', {
        titulo: 'Reportes',
        proyectosActivos,
        proyectosCompletados,
        horasTrabajadasTotales,
        eficienciaEquipo,
        resumenProyectos
      });

    } catch (error) {
      console.error(error);
      res.status(500).render('error', {
        titulo: 'Error',
        mensajeError: 'Error al generar reportes'
      });
    }
  }
};
