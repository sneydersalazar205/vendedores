import comisionRepository from '../repositories/comisionRepository.js';

export class ComisionService {
  // Calcular comisión
  async calcularComision(visitaPedidoId, porcentaje) {
    const comisiones = await comisionRepository.findByVisitaPedido(visitaPedidoId);

    if (comisiones.length > 0) {
      throw new Error('La comisión ya ha sido calculada para esta visita');
    }

    const visitaPedido = await prisma.visitaspedido.findUnique({
      where: { IdVisitaPedido: visitaPedidoId },
    });

    if (!visitaPedido) {
      throw new Error('Visita de pedido no encontrada');
    }

    const montoVenta = visitaPedido.Total || 0;
    const montoComision = (montoVenta * porcentaje) / 100;

    return comisionRepository.create({
      IdVisitaPedido: visitaPedidoId,
      MontoTotalVenta: montoVenta,
      PorcentajeComision: porcentaje,
      MontoComision: montoComision,
      Estado: 'calculada',
    });
  }

  // Obtener comisión
  async obtenerComision(comisionId) {
    const comision = await comisionRepository.findById(comisionId);
    if (!comision) {
      throw new Error('Comisión no encontrada');
    }
    return comision;
  }

  // Listar comisiones
  async listarComisiones(filters = {}) {
    return comisionRepository.findAll(filters);
  }

  // Obtener comisiones por período
  async obtenerComisionesPorPeriodo(startDate, endDate) {
    return comisionRepository.findByDateRange(startDate, endDate);
  }

  // Obtener reporte de comisiones
  async obtenerReporteComisiones(startDate, endDate) {
    const stats = await comisionRepository.getTotalComisionesByPeriod(startDate, endDate);
    
    return {
      totalComisiones: stats._sum.MontoComision || 0,
      cantidadComisiones: stats._count || 0,
      promedioComision: stats._sum.MontoComision && stats._count ? 
        (stats._sum.MontoComision / stats._count).toFixed(2) : 0,
    };
  }

  // Cambiar estado de comisión
  async cambiarEstadoComision(comisionId, estado) {
    const estadosValidos = ['calculada', 'aprobada', 'pagada', 'rechazada'];
    
    if (!estadosValidos.includes(estado)) {
      throw new Error(`Estado inválido. Válidos: ${estadosValidos.join(', ')}`);
    }

    return comisionRepository.update(comisionId, { Estado: estado });
  }

  // Pagar comisión
  async pagarComision(comisionId) {
    return this.cambiarEstadoComision(comisionId, 'pagada');
  }

  // Rechazar comisión
  async rechazarComision(comisionId) {
    return this.cambiarEstadoComision(comisionId, 'rechazada');
  }
}

export default new ComisionService();
