import pedidoRepository from '../repositories/pedidoRepository.js';
import productoRepository from '../repositories/productoRepository.js';

export class PedidoService {
  // Crear pedido con detalles
  async crearPedido(clienteId, items, observaciones = '') {
    if (!items || items.length === 0) {
      throw new Error('El pedido debe contener al menos un item');
    }

    let total = 0;

    // Validar stock y calcular total
    for (const item of items) {
      const producto = await productoRepository.findById(item.IdProducto);
      if (!producto) {
        throw new Error(`Producto ${item.IdProducto} no encontrado`);
      }

      if (producto.Stock < item.Cantidad) {
        throw new Error(
          `Stock insuficiente para ${producto.Nombre}. Disponible: ${producto.Stock}`
        );
      }

      total += (producto.Precio * item.Cantidad);
    }

    // Crear pedido
    const pedido = await pedidoRepository.create({
      IdCliente: clienteId,
      Total: total,
      Observaciones: observaciones,
    });

    return pedido;
  }

  // Obtener pedido con detalles
  async obtenerPedido(pedidoId) {
    const pedido = await pedidoRepository.findById(pedidoId);
    if (!pedido) {
      throw new Error('Pedido no encontrado');
    }
    return pedido;
  }

  // Listar pedidos
  async listarPedidos(filters = {}) {
    return pedidoRepository.findAll(filters);
  }

  // Obtener pedidos del cliente
  async obtenerPedidosCliente(clienteId) {
    return pedidoRepository.findByCliente(clienteId);
  }

  // Obtener ventas por período
  async obtenerVentasPorPeriodo(startDate, endDate) {
    return pedidoRepository.findByDateRange(startDate, endDate);
  }

  // Obtener reporte de ventas
  async obtenerReporteVentas(startDate, endDate) {
    const stats = await pedidoRepository.getTotalSalesByPeriod(startDate, endDate);
    return {
      totalVentas: stats._sum.Total || 0,
      cantidadPedidos: stats._count || 0,
      promedioVenta: stats._sum.Total && stats._count ? 
        (stats._sum.Total / stats._count).toFixed(2) : 0,
    };
  }

  // Calcular total pedido
  async calcularTotalPedido(pedidoId) {
    const pedido = await this.obtenerPedido(pedidoId);
    let total = 0;

    for (const detalle of pedido.detallepedido) {
      total += detalle.Subtotal || 0;
    }

    // Actualizar total si cambió
    if (total !== pedido.Total) {
      return pedidoRepository.update(pedidoId, { Total: total });
    }

    return pedido;
  }

  // Cancelar pedido
  async cancelarPedido(pedidoId) {
    const pedido = await this.obtenerPedido(pedidoId);
    
    // Aquí podrías devolver stock, crear devolución, etc.
    return pedidoRepository.update(pedidoId, {
      Observaciones: (pedido.Observaciones || '') + ' [CANCELADO]',
    });
  }
}

export default new PedidoService();
