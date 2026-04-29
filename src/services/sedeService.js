import sedeRepository from '../repositories/sedeRepository.js';

export class SedeService {
  async listarSedes(filters = {}) {
    return sedeRepository.findAll(filters);
  }

  async obtenerSede(id) {
    const sede = await sedeRepository.findById(id);
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    return sede;
  }

  async obtenerSedesPorCiudad(ciudadId) {
    return sedeRepository.findByCiudad(ciudadId);
  }

  async crearSede(data) {
    if (!data.Nombre) {
      throw new Error('El nombre es requerido');
    }
    if (!data.IdCiudad) {
      throw new Error('El ID de ciudad es requerido');
    }
    return sedeRepository.create(data);
  }

  async actualizarSede(id, data) {
    const sede = await sedeRepository.findById(id);
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    return sedeRepository.update(id, data);
  }

  async eliminarSede(id) {
    const sede = await sedeRepository.findById(id);
    if (!sede) {
      throw new Error('Sede no encontrada');
    }
    return sedeRepository.delete(id);
  }
}

export default new SedeService();
