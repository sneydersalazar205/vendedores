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
      where: { IdSede: parseInt(id) },
      include: { ciudad: true, usuario: true },
    });
  }

  async findByCiudad(ciudadId) {
    return prisma.sede.findMany({
      where: { IdCiudad: parseInt(ciudadId) },
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
      where: { IdSede: parseInt(id) },
      data,
      include: { ciudad: true, usuario: true },
    });
  }

  async delete(id) {
    await prisma.$executeRaw`DELETE FROM "sede" WHERE "IdSede" = ${parseInt(id)}`;
  }
}

export default new SedeRepository();
