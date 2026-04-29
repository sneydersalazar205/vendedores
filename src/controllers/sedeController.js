import sedeService from '../services/sedeService.js';

export class SedeController {
  async listar(req, res) {
    try {
      const sedes = await sedeService.listarSedes();
      res.status(200).json({
        success: true,
        data: sedes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtener(req, res) {
    try {
      const { id } = req.params;
      const sede = await sedeService.obtenerSede(id);
      res.status(200).json({
        success: true,
        data: sede,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerPorCiudad(req, res) {
    try {
      const { ciudadId } = req.params;
      const sedes = await sedeService.obtenerSedesPorCiudad(ciudadId);
      res.status(200).json({
        success: true,
        data: sedes,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async crear(req, res) {
    try {
      const sede = await sedeService.crearSede(req.body);
      res.status(201).json({
        success: true,
        message: 'Sede creada exitosamente',
        data: sede,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const sede = await sedeService.actualizarSede(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Sede actualizada exitosamente',
        data: sede,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async eliminar(req, res) {
    try {
      const { id } = req.params;
      await sedeService.eliminarSede(id);
      res.status(200).json({
        success: true,
        message: 'Sede eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new SedeController();
