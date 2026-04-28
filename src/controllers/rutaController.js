import rutaService from '../services/rutaService.js';

export class RutaController {
  async crear(req, res) {
    try {
      const ruta = await rutaService.crearRuta(req.body);
      res.status(201).json({
        success: true,
        message: 'Ruta creada exitosamente',
        data: ruta,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async listar(req, res) {
    try {
      const rutas = await rutaService.listarRutas();
      res.status(200).json({
        success: true,
        data: rutas,
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
      const ruta = await rutaService.obtenerRuta(id);
      res.status(200).json({
        success: true,
        data: ruta,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerActivas(req, res) {
    try {
      const rutas = await rutaService.obtenerRutasActivas();
      res.status(200).json({
        success: true,
        data: rutas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerPorUsuario(req, res) {
    try {
      const { usuarioId } = req.params;
      const rutas = await rutaService.obtenerRutasUsuario(usuarioId);
      res.status(200).json({
        success: true,
        data: rutas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const ruta = await rutaService.actualizarRuta(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Ruta actualizada exitosamente',
        data: ruta,
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
      await rutaService.eliminarRuta(id);
      res.status(200).json({
        success: true,
        message: 'Ruta eliminada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new RutaController();
