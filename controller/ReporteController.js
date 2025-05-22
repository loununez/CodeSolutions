const fs = require('fs').promises;

module.exports = {
    // Método para generar y mostrar reportes
    reportes: async (req, res) => {
        try {
            // Leemos y procesamos los archivos JSON que son lista de tareas, lista de empleados y lista de proyectos
            // Si algún archivo no existe o tiene error, usamos array vacío
            const [tareas, empleados, proyectos] = await Promise.all([
                fs.readFile('./datos/tareas.json', 'utf8').then(JSON.parse).catch(() => []),
                fs.readFile('./datos/empleados.json', 'utf8').then(JSON.parse).catch(() => []),
                fs.readFile('./datos/proyectos.json', 'utf8').then(JSON.parse).catch(() => [])
            ]);

            // Calculamos el total de horas registradas sumando todas las tareas
            const totalHoras = tareas.reduce((sum, t) => sum + parseInt(t.horasRegistradas || 0), 0);
            
            // Creamos un reporte por empleado con nombre del empleado, cantidad de tareas asignadas, horas registradas y lista de tareas
            const tareasPorEmpleado = empleados.map(empleado => {
                const tareasEmpleado = tareas.filter(t => t.empleadoId === empleado.id);
                return {
                    nombre: empleado.nombre,
                    cantidad: tareasEmpleado.length,
                    horas: tareasEmpleado.reduce((sum, t) => sum + parseInt(t.horasRegistradas || 0), 0),
                    tareas: tareasEmpleado
                };
            });

            // Mostramos la vista de reportes con los datos calculados
            res.render('reportes/reportes', {
                titulo: 'Reportes',
                totalHoras,         
                tareasPorEmpleado,  
                proyectos           
            });
        } catch (error) {
            // Si tiene un error, se muestra la pagina de "error"
            console.error(error);
            res.status(500).render('error', {
                titulo: 'Error',
                mensajeError: 'Error al generar reportes'
            });
        }
    }
};