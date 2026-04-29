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
      where: { IdCiudad: id },
      include: { region: true, sede: true },
    });
  }

  async findByRegion(regionId) {
    return prisma.ciudad.findMany({
      where: { IdRegion: regionId },
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
      where: { IdCiudad: id },
      data,
      include: { region: true, sede: true },
    });
  }

  async delete(id) {
    return prisma.ciudad.delete({
      where: { IdCiudad: id },
    });
  }
}

export default new CiudadRepository();
