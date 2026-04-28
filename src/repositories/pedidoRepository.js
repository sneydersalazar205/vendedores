import { prisma } from '../models/prisma.js';

export class PedidoRepository {
  // Obtener todos los pedidos
  async findAll(filters = {}) {
    return prisma.pedido.findMany({
      where: filters,
      include: {
        cliente: true,
        detallepedido: {
          include: {
            producto: true,
            metodopago: true,
            iva: true,
          },
        },
        visitaspedido: true,
      },
    });
  }

  // Obtener pedido por ID
  async findById(id) {
    return prisma.pedido.findUnique({
      where: { IdPedido: id },
      include: {
        cliente: true,
        detallepedido: {
          include: {
            producto: true,
            metodopago: true,
            iva: true,
          },
        },
        visitaspedido: true,
        devoluciones: true,
      },
    });
  }

  // Crear pedido
  async create(data) {
    return prisma.pedido.create({
      data,
      include: {
        cliente: true,
        detallepedido: true,
      },
    });
  }

  // Actualizar pedido
  async update(id, data) {
    return prisma.pedido.update({
      where: { IdPedido: id },
      data,
      include: {
        cliente: true,
        detallepedido: true,
      },
    });
  }

  // Eliminar pedido
  async delete(id) {
    return prisma.pedido.delete({
      where: { IdPedido: id },
    });
  }

  // Obtener pedidos por cliente
  async findByCliente(clienteId) {
    return prisma.pedido.findMany({
      where: { IdCliente: clienteId },
      include: {
        detallepedido: {
          include: { producto: true },
        },
      },
    });
  }

  // Obtener pedidos por rango de fechas
  async findByDateRange(startDate, endDate) {
    return prisma.pedido.findMany({
      where: {
        FechaPedido: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: { cliente: true, detallepedido: true },
    });
  }

  // Obtener total de ventas por período
  async getTotalSalesByPeriod(startDate, endDate) {
    return prisma.pedido.aggregate({
      _sum: { Total: true },
      _count: true,
      where: {
        FechaPedido: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
  }
}

export default new PedidoRepository();
