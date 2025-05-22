// Importación de módulos necesarios
const fs = require('fs').promises; // Módulo para manejar archivos
const Proyecto = require('../modelos/Proyecto'); // Modelo de proyecto
const archivo = './datos/proyectos.json'; // Ruta del archivo de datos

// Función para obtener todos los proyectos
const obtenerProyectos = async () => {
  try {
    // Lee el archivo y convierte el texto JSON 
    const datos = await fs.readFile(archivo, 'utf8');
    return JSON.parse(datos).filter(p => p?.nombre);
  } catch {
    // Si hay error, el archivo no existe, crea uno nuevo vacío
    await fs.writeFile(archivo, '[]');
    return [];
  }
};

// Función para guardar los proyectos en el archivo
const guardarProyectos = async (proyectos) => {
  await fs.writeFile(archivo, JSON.stringify(proyectos));
};

// Controlador con las operaciones CRUD para proyectos
module.exports = {
  // Obtiene y muestra la lista de proyectos
  listar: async (req, res) => {
    try {
      const proyectos = await obtenerProyectos();
      res.render('proyectos/listar', { proyectos });
    } catch {
      res.render('proyectos/listar', { proyectos: [] });
    }
  },

  // Muestra el formulario de creación
  mostrarFormularioCrear: (req, res) => res.render('proyectos/crear'),

  // Muestra el formulario de edición con los datos del proyecto
  mostrarFormularioEditar: async (req, res) => {
    const proyectos = await obtenerProyectos();
    const proyecto = proyectos.find(p => p.id === req.params.id);
    res.render('proyectos/editar', { proyecto });
  },

  // Crea un nuevo proyecto
  crear: async (req, res) => {
    try {
      const proyectos = await obtenerProyectos();
      proyectos.push(new Proyecto(req.body.nombre, req.body.descripcion, req.body.cliente));
      await guardarProyectos(proyectos);
      res.redirect('/proyectos');
    } catch {
      res.render('proyectos/crear', { error: true, datos: req.body });
    }
  },

  // Actualiza un proyecto existente
  actualizar: async (req, res) => {
    try {
      const proyectos = await obtenerProyectos();
      const actualizados = proyectos.map(p => 
        p.id === req.params.id ? { ...p, ...req.body } : p
      );
      await guardarProyectos(actualizados);
      res.redirect('/proyectos');
    } catch {
      res.render('proyectos/editar', { error: true, proyecto: req.body });
    }
  },

  // Elimina un proyecto
  eliminar: async (req, res) => {
    try {
      const proyectos = await obtenerProyectos();
      const filtrados = proyectos.filter(p => p.id !== req.params.id);
      await guardarProyectos(filtrados);
      res.redirect('/proyectos');
    } catch {
      res.status(500).redirect('/proyectos');
    }
  }
};