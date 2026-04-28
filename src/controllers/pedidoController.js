import pedidoService from '../services/pedidoService.js';

export class PedidoController {
  async crear(req, res) {
    try {
      const { clienteId, items, observaciones } = req.body;
      const pedido = await pedidoService.crearPedido(clienteId, items, observaciones);
      res.status(201).json({
        success: true,
        message: 'Pedido creado exitosamente',
        data: pedido,
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
      const pedidos = await pedidoService.listarPedidos();
      res.status(200).json({
        success: true,
        data: pedidos,
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
      const pedido = await pedidoService.obtenerPedido(id);
      res.status(200).json({
        success: true,
        data: pedido,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerPorCliente(req, res) {
    try {
      const { clienteId } = req.params;
      const pedidos = await pedidoService.obtenerPedidosCliente(clienteId);
      res.status(200).json({
        success: true,
        data: pedidos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerReporteVentas(req, res) {
    try {
      const { startDate, endDate } = req.query;
      
      if (!startDate || !endDate) {
        return res.status(400).json({
          success: false,
          message: 'Se requieren startDate y endDate',
        });
      }

      const reporte = await pedidoService.obtenerReporteVentas(
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

  async cancelar(req, res) {
    try {
      const { id } = req.params;
      await pedidoService.cancelarPedido(id);
      res.status(200).json({
        success: true,
        message: 'Pedido cancelado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new PedidoController();
