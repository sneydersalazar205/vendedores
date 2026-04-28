import { prisma } from '../models/prisma.js';

export class ClienteRepository {
  // Obtener todos los clientes
  async findAll(filters = {}) {
    return prisma.cliente.findMany({
      where: filters,
      include: {
        estadocliente: true,
        direccion: true,
        pedido: true,
      },
    });
  }

  // Obtener cliente por ID
  async findById(id) {
    return prisma.cliente.findUnique({
      where: { IdCliente: id },
      include: {
        estadocliente: true,
        direccion: true,
        pedido: true,
        visitaspedido: true,
      },
    });
  }

  // Obtener cliente por cédula
  async findByCedula(cedula) {
    return prisma.cliente.findFirst({
      where: { Cedula: cedula },
      include: { estadocliente: true },
    });
  }

  // Obtener cliente por email
  async findByEmail(email) {
    return prisma.cliente.findFirst({
      where: { Email: email },
    });
  }

  // Crear cliente
  async create(data) {
    return prisma.cliente.create({
      data,
      include: { estadocliente: true },
    });
  }

  // Actualizar cliente
  async update(id, data) {
    return prisma.cliente.update({
      where: { IdCliente: id },
      data,
      include: { estadocliente: true },
    });
  }

  // Eliminar cliente
  async delete(id) {
    return prisma.cliente.delete({
      where: { IdCliente: id },
    });
  }

  // Obtener clientes por estado
  async findByEstado(estadoId) {
    return prisma.cliente.findMany({
      where: { IdEstadoCliente: estadoId },
      include: { estadocliente: true },
    });
  }

  // Obtener clientes con pedidos pendientes
  async findWithPendingOrders() {
    return prisma.cliente.findMany({
      include: {
        pedido: {
          where: { detallepedido: {} },
        },
      },
    });
  }
}

export default new ClienteRepository();
