import visitaRepository from '../repositories/visitaRepository.js';

export class VisitaService {
  // Registrar visita
  async registrarVisita(data) {
    // Validar datos requeridos
    if (!data.IdRutaDetalle || !data.IdRutaUsuario) {
      throw new Error('Se requieren IdRutaDetalle e IdRutaUsuario');
    }

    // Crear visita
    const visita = await visitaRepository.create({
      ...data,
      FechaHora: data.FechaHora || new Date(),
    });

    return visita;
  }

  // Obtener visita
  async obtenerVisita(visitaId) {
    const visita = await visitaRepository.findById(visitaId);
    if (!visita) {
      throw new Error('Visita no encontrada');
    }
    return visita;
  }

  // Listar visitas
  async listarVisitas(filters = {}) {
    return visitaRepository.findAll(filters);
  }

  // Validar visita (geolocalización)
  async validarVisita(visitaId, latitudReal, longitudReal) {
    const visita = await this.obtenerVisita(visitaId);

    // Calcular error de distancia
    const distancia = this.calcularDistancia(
      visita.Latitud,
      visita.Longitud,
      latitudReal,
      longitudReal
    );

    const esValida = distancia <= 50; // 50 metros de tolerancia

    return visitaRepository.update(visitaId, {
      EsValida: esValida,
      DistanciaErrorMetros: distancia,
    });
  }

  // Calcular distancia entre dos coordenadas (en metros)
  calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  // Obtener visitas válidas
  async obtenerVisitasValidas() {
    return visitaRepository.findValid();
  }

  // Obtener visitas por ruta
  async obtenerVisitasPorRuta(rutaId) {
    return visitaRepository.findByRuta(rutaId);
  }

  // Actualizar estado de visita
  async actualizarEstadoVisita(visitaId, estadoId) {
    return visitaRepository.update(visitaId, {
      IdEstadoVisita: estadoId,
    });
  }

  // Agregar observación a visita
  async agregarObservacion(visitaId, observacion) {
    return visitaRepository.update(visitaId, {
      Observacion: observacion,
    });
  }

  // Obtener estadísticas de visitas
  async obtenerEstadisticasVisitas(rutaId) {
    const visitas = await this.obtenerVisitasPorRuta(rutaId);
    
    const totales = {
      totalVisitas: visitas.length,
      visitasValidas: visitas.filter(v => v.EsValida).length,
      visitasInvalidas: visitas.filter(v => !v.EsValida).length,
      distanciaPromedioError: 0,
    };

    if (visitas.length > 0) {
      const sumaDistancias = visitas.reduce((sum, v) => 
        sum + (v.DistanciaErrorMetros || 0), 0
      );
      totales.distanciaPromedioError = (sumaDistancias / visitas.length).toFixed(2);
    }

    return totales;
  }
}

export default new VisitaService();
