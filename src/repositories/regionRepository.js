import { prisma } from '../models/prisma.js';

export class RegionRepository {
  async findAll(filters = {}) {
    return prisma.region.findMany({
      where: filters,
      include: { ciudad: true },
    });
  }

  async findById(id) {
    return prisma.region.findUnique({
      where: { IdRegion: id },
      include: { ciudad: true },
    });
  }

  async create(data) {
    return prisma.region.create({
      data,
      include: { ciudad: true },
    });
  }

  async update(id, data) {
    return prisma.region.update({
      where: { IdRegion: id },
      data,
      include: { ciudad: true },
    });
  }

  async delete(id) {
    return prisma.region.delete({
      where: { IdRegion: id },
    });
  }
}

export default new RegionRepository();
