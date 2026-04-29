import ciudadService from '../services/ciudadService.js';

export class CiudadController {
  async listar(req, res) {
    try {
      const ciudades = await ciudadService.listarCiudades();
      res.status(200).json({
        success: true,
        data: ciudades,
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
      const ciudad = await ciudadService.obtenerCiudad(id);
      res.status(200).json({
        success: true,
        data: ciudad,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerPorRegion(req, res) {
    try {
      const { regionId } = req.params;
      const ciudades = await ciudadService.obtenerCiudadesPorRegion(regionId);
      res.status(200).json({
        success: true,
        data: ciudades,
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
      const ciudad = await ciudadService.crearCiudad(req.body);
      res.status(201).json({
        success: true,
        message: 'Ciudad creada exitosamente',
        data: ciudad,
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
      const ciudad = await ciudadService.actualizarCiudad(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Ciudad actualizada exitosamente',
        data: ciudad,
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
      await ciudadService.eliminarCiudad(id);
      res.status(200).json({
        success: true,
        message: 'Ciudad eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new CiudadController();
