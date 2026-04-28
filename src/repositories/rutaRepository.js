import { prisma } from '../models/prisma.js';

export class RutaRepository {
  // Obtener todas las rutas
  async findAll(filters = {}) {
    return prisma.ruta.findMany({
      where: filters,
      include: {
        rutausuario: {
          include: { usuario: true, visita: true },
        },
        rutadetalle: {
          include: { direccion: true },
        },
      },
    });
  }

  // Obtener ruta por ID
  async findById(id) {
    return prisma.ruta.findUnique({
      where: { IdRuta: id },
      include: {
        rutausuario: {
          include: { usuario: true, visita: true },
        },
        rutadetalle: {
          include: { direccion: true, visita: true },
          orderBy: { OrdenVisita: 'asc' },
        },
      },
    });
  }

  // Crear ruta
  async create(data) {
    return prisma.ruta.create({
      data,
      include: {
        rutausuario: true,
        rutadetalle: true,
      },
    });
  }

  // Actualizar ruta
  async update(id, data) {
    return prisma.ruta.update({
      where: { IdRuta: id },
      data,
      include: {
        rutausuario: true,
        rutadetalle: true,
      },
    });
  }

  // Eliminar ruta
  async delete(id) {
    return prisma.ruta.delete({
      where: { IdRuta: id },
    });
  }

  // Obtener rutas por fecha
  async findByDate(date) {
    return prisma.ruta.findMany({
      where: { Fecha: date },
      include: { rutausuario: true, rutadetalle: true },
    });
  }

  // Obtener rutas activas
  async findActive() {
    return prisma.ruta.findMany({
      where: { Estado: 1 },
      include: { rutausuario: true, rutadetalle: true },
    });
  }

  // Obtener rutas por usuario
  async findByUsuario(usuarioId) {
    return prisma.rutausuario.findMany({
      where: { IdUsuario: usuarioId },
      include: {
        ruta: {
          include: { rutadetalle: true },
        },
      },
    });
  }
}

export default new RutaRepository();
