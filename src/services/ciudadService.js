import ciudadRepository from '../repositories/ciudadRepository.js';

export class CiudadService {
  async listarCiudades(filters = {}) {
    return ciudadRepository.findAll(filters);
  }

  async obtenerCiudad(id) {
    const ciudad = await ciudadRepository.findById(id);
    if (!ciudad) {
      throw new Error('Ciudad no encontrada');
    }
    return ciudad;
  }

  async obtenerCiudadesPorRegion(regionId) {
    return ciudadRepository.findByRegion(regionId);
  }

  async crearCiudad(data) {
    if (!data.Nombre) {
      throw new Error('El nombre es requerido');
    }
    if (!data.IdRegion) {
      throw new Error('El ID de región es requerido');
    }
    return ciudadRepository.create(data);
  }

  async actualizarCiudad(id, data) {
    const ciudad = await ciudadRepository.findById(id);
    if (!ciudad) {
      throw new Error('Ciudad no encontrada');
    }
    return ciudadRepository.update(id, data);
  }

  async eliminarCiudad(id) {
    const ciudad = await ciudadRepository.findById(id);
    if (!ciudad) {
      throw new Error('Ciudad no encontrada');
    }
    return ciudadRepository.delete(id);
  }
}

export default new CiudadService();
