import { prisma } from '../models/prisma.js';

export class CiudadRepository {
  async findAll(filters = {}) {
    return prisma.ciudad.findMany({
      where: filters,
      include: { region: true, sede: true },
    });
  }

  async findById(id) {
    return prisma.ciudad.findUnique({
      where: { IdCiudad: parseInt(id) },
      include: { region: true, sede: true },
    });
  }

  async findByRegion(regionId) {
    return prisma.ciudad.findMany({
      where: { IdRegion: parseInt(regionId) },
      include: { region: true, sede: true },
    });
  }

  async create(data) {
    return prisma.ciudad.create({
      data,
      include: { region: true, sede: true },
    });
  }

  async update(id, data) {
    return prisma.ciudad.update({
      where: { IdCiudad: parseInt(id) },
      data,
      include: { region: true, sede: true },
    });
  }

  async delete(id) {
    await prisma.$executeRaw`DELETE FROM "ciudad" WHERE "IdCiudad" = ${parseInt(id)}`;
  }
}

export default new CiudadRepository();
