import rutaRepository from '../repositories/rutaRepository.js';
import visitaRepository from '../repositories/visitaRepository.js';

export class RutaService {
  // Crear ruta
  async crearRuta(data) {
    return rutaRepository.create(data);
  }

  // Obtener ruta completa
  async obtenerRuta(rutaId) {
    const ruta = await rutaRepository.findById(rutaId);
    if (!ruta) {
      throw new Error('Ruta no encontrada');
    }
    return ruta;
  }

  // Listar rutas
  async listarRutas(filters = {}) {
    return rutaRepository.findAll(filters);
  }

  // Obtener rutas activas
  async obtenerRutasActivas() {
    return rutaRepository.findActive();
  }

  // Obtener rutas de un usuario
  async obtenerRutasUsuario(usuarioId) {
    return rutaRepository.findByUsuario(usuarioId);
  }

  // Asignar ruta a usuario
  async asignarRutaAUsuario(rutaId, usuarioId) {
    const ruta = await this.obtenerRuta(rutaId);
    
    return prisma.rutausuario.create({
      data: {
        IdRuta: rutaId,
        IdUsuario: usuarioId,
        FechaAsignacion: new Date(),
        Estado: 'asignada',
      },
    });
  }

  // Iniciar ruta
  async iniciarRuta(rutaId, usuarioId) {
    return prisma.rutausuario.updateMany({
      where: {
        IdRuta: rutaId,
        IdUsuario: usuarioId,
      },
      data: {
        FechaInicio: new Date(),
        Estado: 'en_progreso',
      },
    });
  }

  // Finalizar ruta
  async finalizarRuta(rutaId, usuarioId) {
    return prisma.rutausuario.updateMany({
      where: {
        IdRuta: rutaId,
        IdUsuario: usuarioId,
      },
      data: {
        FechaFin: new Date(),
        Estado: 'completada',
      },
    });
  }

  // Calcular distancia total de la ruta
  async calcularDistanciaTotal(rutaId) {
    const ruta = await this.obtenerRuta(rutaId);
    
    // Aquí podrías calcular la distancia real usando una API de mapas
    // Por ahora es un placeholder
    let distanciaTotal = 0;
    
    if (ruta.rutadetalle && ruta.rutadetalle.length > 0) {
      for (let i = 0; i < ruta.rutadetalle.length - 1; i++) {
        const punto1 = ruta.rutadetalle[i];
        const punto2 = ruta.rutadetalle[i + 1];
        
        // Calcular distancia Haversine entre dos puntos
        distanciaTotal += this.distanciaHaversine(
          punto1.Latitud,
          punto1.Longitud,
          punto2.Latitud,
          punto2.Longitud
        );
      }
    }

    return distanciaTotal;
  }

  // Fórmula de Haversine para calcular distancia entre coordenadas
  distanciaHaversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Actualizar ruta
  async actualizarRuta(rutaId, data) {
    return rutaRepository.update(rutaId, data);
  }

  // Eliminar ruta
  async eliminarRuta(rutaId) {
    return rutaRepository.delete(rutaId);
  }
}

export default new RutaService();
