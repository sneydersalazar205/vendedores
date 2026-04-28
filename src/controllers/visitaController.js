import visitaService from '../services/visitaService.js';

export class VisitaController {
  async registrar(req, res) {
    try {
      const visita = await visitaService.registrarVisita(req.body);
      res.status(201).json({
        success: true,
        message: 'Visita registrada exitosamente',
        data: visita,
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
      const visitas = await visitaService.listarVisitas();
      res.status(200).json({
        success: true,
        data: visitas,
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
      const visita = await visitaService.obtenerVisita(id);
      res.status(200).json({
        success: true,
        data: visita,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async validar(req, res) {
    try {
      const { id } = req.params;
      const { latitudReal, longitudReal } = req.body;
      
      const visita = await visitaService.validarVisita(id, latitudReal, longitudReal);
      res.status(200).json({
        success: true,
        message: 'Visita validada',
        data: visita,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerValidas(req, res) {
    try {
      const visitas = await visitaService.obtenerVisitasValidas();
      res.status(200).json({
        success: true,
        data: visitas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerPorRuta(req, res) {
    try {
      const { rutaId } = req.params;
      const visitas = await visitaService.obtenerVisitasPorRuta(rutaId);
      res.status(200).json({
        success: true,
        data: visitas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async agregarObservacion(req, res) {
    try {
      const { id } = req.params;
      const { observacion } = req.body;
      
      const visita = await visitaService.agregarObservacion(id, observacion);
      res.status(200).json({
        success: true,
        message: 'Observación agregada',
        data: visita,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerEstadisticas(req, res) {
    try {
      const { rutaId } = req.params;
      const estadisticas = await visitaService.obtenerEstadisticasVisitas(rutaId);
      res.status(200).json({
        success: true,
        data: estadisticas,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new VisitaController();
