import regionService from '../services/regionService.js';

export class RegionController {
  async listar(req, res) {
    try {
      const regiones = await regionService.listarRegiones();
      res.status(200).json({
        success: true,
        data: regiones,
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
      const region = await regionService.obtenerRegion(id);
      res.status(200).json({
        success: true,
        data: region,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async crear(req, res) {
    try {
      const region = await regionService.crearRegion(req.body);
      res.status(201).json({
        success: true,
        message: 'Región creada exitosamente',
        data: region,
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
      const region = await regionService.actualizarRegion(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Región actualizada exitosamente',
        data: region,
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
      await regionService.eliminarRegion(id);
      res.status(200).json({
        success: true,
        message: 'Región eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new RegionController();
