import regionRepository from '../repositories/regionRepository.js';

export class RegionService {
  async listarRegiones(filters = {}) {
    return regionRepository.findAll(filters);
  }

  async obtenerRegion(id) {
    const region = await regionRepository.findById(id);
    if (!region) {
      throw new Error('Región no encontrada');
    }
    return region;
  }

  async crearRegion(data) {
    if (!data.Nombre) {
      throw new Error('El nombre es requerido');
    }
    return regionRepository.create(data);
  }

  async actualizarRegion(id, data) {
    const region = await regionRepository.findById(id);
    if (!region) {
      throw new Error('Región no encontrada');
    }
    return regionRepository.update(id, data);
  }

  async eliminarRegion(id) {
    const region = await regionRepository.findById(id);
    if (!region) {
      throw new Error('Región no encontrada');
    }
    return regionRepository.delete(id);
  }
}

export default new RegionService();
