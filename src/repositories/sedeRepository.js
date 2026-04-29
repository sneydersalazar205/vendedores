import { prisma } from '../models/prisma.js';

export class SedeRepository {
  async findAll(filters = {}) {
    return prisma.sede.findMany({
      where: filters,
      include: { ciudad: true, usuario: true },
    });
  }

  async findById(id) {
    return prisma.sede.findUnique({
      where: { IdSede: id },
      include: { ciudad: true, usuario: true },
    });
  }

  async findByCiudad(ciudadId) {
    return prisma.sede.findMany({
      where: { IdCiudad: ciudadId },
      include: { ciudad: true, usuario: true },
    });
  }

  async create(data) {
    return prisma.sede.create({
      data,
      include: { ciudad: true, usuario: true },
    });
  }

  async update(id, data) {
    return prisma.sede.update({
      where: { IdSede: id },
      data,
      include: { ciudad: true, usuario: true },
    });
  }

  async delete(id) {
    return prisma.sede.delete({
      where: { IdSede: id },
    });
  }
}

export default new SedeRepository();
