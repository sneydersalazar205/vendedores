import { prisma } from '../models/prisma.js';

export class VisitaRepository {
  // Obtener todas las visitas
  async findAll(filters = {}) {
    return prisma.visita.findMany({
      where: filters,
      include: {
        rutadetalle: { include: { direccion: true } },
        rutausuario: { include: { usuario: true } },
        estadovisita: true,
        visitaspedido: true,
      },
    });
  }

  // Obtener visita por ID
  async findById(id) {
    return prisma.visita.findUnique({
      where: { IdVisita: id },
      include: {
        rutadetalle: { include: { direccion: true } },
        rutausuario: { include: { usuario: true } },
        estadovisita: true,
        visitaspedido: { include: { pedido: true } },
      },
    });
  }

  // Crear visita
  async create(data) {
    return prisma.visita.create({
      data,
      include: {
        rutadetalle: true,
        estadovisita: true,
      },
    });
  }

  // Actualizar visita
  async update(id, data) {
    return prisma.visita.update({
      where: { IdVisita: id },
      data,
      include: {
        estadovisita: true,
        rutadetalle: true,
      },
    });
  }

  // Eliminar visita
  async delete(id) {
    return prisma.visita.delete({
      where: { IdVisita: id },
    });
  }

  // Obtener visitas por ruta
  async findByRuta(rutaId) {
    return prisma.visita.findMany({
      where: { rutadetalle: { IdRuta: rutaId } },
      include: { rutadetalle: true, estadovisita: true },
    });
  }

  // Obtener visitas válidas
  async findValid() {
    return prisma.visita.findMany({
      where: { EsValida: true },
      include: { estadovisita: true },
    });
  }

  // Obtener visitas por estado
  async findByEstado(estadoId) {
    return prisma.visita.findMany({
      where: { IdEstadoVisita: estadoId },
      include: { estadovisita: true, rutausuario: true },
    });
  }
}

export default new VisitaRepository();
