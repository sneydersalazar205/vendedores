import { prisma } from '../models/prisma.js';

export class ComisionRepository {
  // Obtener todas las comisiones
  async findAll(filters = {}) {
    return prisma.comision.findMany({
      where: filters,
      include: {
        visitaspedido: {
          include: { cliente: true, visita: true },
        },
      },
    });
  }

  // Obtener comisión por ID
  async findById(id) {
    return prisma.comision.findUnique({
      where: { IdComision: id },
      include: {
        visitaspedido: { include: { cliente: true } },
      },
    });
  }

  // Crear comisión
  async create(data) {
    return prisma.comision.create({
      data,
      include: { visitaspedido: true },
    });
  }

  // Actualizar comisión
  async update(id, data) {
    return prisma.comision.update({
      where: { IdComision: id },
      data,
      include: { visitaspedido: true },
    });
  }

  // Obtener comisiones por visita de pedido
  async findByVisitaPedido(visitaPedidoId) {
    return prisma.comision.findMany({
      where: { IdVisitaPedido: visitaPedidoId },
      include: { visitaspedido: true },
    });
  }

  // Obtener comisiones por período
  async findByDateRange(startDate, endDate) {
    return prisma.comision.findMany({
      where: {
        FechaCalculo: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { visitaspedido: true },
    });
  }

  // Calcular total de comisiones
  async getTotalComisionesByPeriod(startDate, endDate) {
    return prisma.comision.aggregate({
      _sum: { MontoComision: true },
      _count: true,
      where: {
        FechaCalculo: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}

export default new ComisionRepository();
