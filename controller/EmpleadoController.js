const Empleado = require('../modelos/Empleado');

module.exports = {
  listar: async (req, res) => {
    try {
      const empleados = await Empleado.find().lean();
      res.render('empleados/listar', { 
        empleados,
        mensajeSuccess: req.query.success || null,
        mensajeError: req.query.error || null
      });
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).render('error', { 
        mensajeError: 'Error al obtener los empleados' 
      });
    }
  },

  cambiarEstado: async (req, res) => {
    try {
      const empleado = await Empleado.findById(req.params.id);
      if (!empleado) {
        return res.redirect('/empleados?error=Empleado no encontrado');
      }

      empleado.estaActivo = !empleado.estaActivo;
      await empleado.save();
      res.redirect('/empleados?success=Estado actualizado correctamente');
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      res.redirect('/empleados?error=Error al cambiar el estado');
    }
  },

  eliminar: async (req, res) => {
    try {
      const empleado = await Empleado.findByIdAndDelete(req.params.id);
      if (!empleado) {
        return res.redirect('/empleados?error=Empleado no encontrado');
      }
      res.redirect('/empleados?success=Empleado eliminado correctamente');
    } catch (error) {
      console.error('Error al eliminar empleado:', error);
      res.redirect('/empleados?error=Error al eliminar el empleado');
    }
  },

  mostrarFormulario: (req, res) => {
    res.render('empleados/crear', {
      datos: {},
      error: null,
      mensajeError: null
    });
  },

  crear: async (req, res) => {
    const { nombre, email, perfilTecnico, especialidad, habilidades, telefono, estado } = req.body;
    
    try {
      const nuevoEmpleado = new Empleado({
        nombre,
        email,
        perfilTecnico,
        especialidad,
        habilidades: habilidades || [],
        telefono,
        estaActivo: estado === 'Activo'
      });

      await nuevoEmpleado.save();
      res.redirect('/empleados?success=Empleado creado correctamente');
    } catch (error) {
      console.error('Error al crear empleado:', error);
      res.render('empleados/crear', {
        datos: req.body,
        error: error.message,
        mensajeError: 'Error al crear el empleado. Por favor, verifica los datos.'
      });
    }
  }
};