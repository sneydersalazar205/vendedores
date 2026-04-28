import comisionService from '../services/comisionService.js';

export class ComisionController {
  async calcular(req, res) {
    try {
      const { visitaPedidoId, porcentaje } = req.body;
      const comision = await comisionService.calcularComision(visitaPedidoId, porcentaje);
      res.status(201).json({
        success: true,
        message: 'Comisión calculada exitosamente',
        data: comision,
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
      const comisiones = await comisionService.listarComisiones();
      res.status(200).json({
        success: true,
        data: comisiones,
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
      const comision = await comisionService.obtenerComision(id);
      res.status(200).json({
        success: true,
        data: comision,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerPorPeriodo(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren startDate y endDate',
        });
      }

      const comisiones = await comisionService.obtenerComisionesPorPeriodo(
        new Date(startDate),
        new Date(endDate)
      );

      res.status(200).json({
        success: true,
        data: comisiones,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerReporte(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren startDate y endDate',
        });
      }

      const reporte = await comisionService.obtenerReporteComisiones(
        new Date(startDate),
        new Date(endDate)
      );

      res.status(200).json({
        success: true,
        data: reporte,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async pagar(req, res) {
    try {
      const { id } = req.params;
      const comision = await comisionService.pagarComision(id);
      res.status(200).json({
        success: true,
        message: 'Comisión pagada exitosamente',
        data: comision,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async rechazar(req, res) {
    try {
      const { id } = req.params;
      const comision = await comisionService.rechazarComision(id);
      res.status(200).json({
        success: true,
        message: 'Comisión rechazada',
        data: comision,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ComisionController();
