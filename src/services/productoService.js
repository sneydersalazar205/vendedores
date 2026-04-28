import productoRepository from '../repositories/productoRepository.js';

export class ProductoService {
  // Crear producto
  async crearProducto(data) {
    // Validar que el código sea único
    if (data.Codigo) {
      const existeProducto = await productoRepository.findByCodigo(data.Codigo);
      if (existeProducto) {
        throw new Error('El código de producto ya existe');
      }
    }

    return productoRepository.create(data);
  }

  // Obtener producto
  async obtenerProducto(productoId) {
    const producto = await productoRepository.findById(productoId);
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    return producto;
  }

  // Listar productos
  async listarProductos(filters = {}) {
    return productoRepository.findAll(filters);
  }

  // Actualizar producto
  async actualizarProducto(productoId, data) {
    // Si cambia el código, validar unicidad
    if (data.Codigo) {
      const producto = await productoRepository.findByCodigo(data.Codigo);
      if (producto && producto.IdProducto !== productoId) {
        throw new Error('El código de producto ya existe');
      }
    }

    return productoRepository.update(productoId, data);
  }

  // Eliminar producto
  async eliminarProducto(productoId) {
    return productoRepository.delete(productoId);
  }

  // Obtener productos por categoría
  async obtenerProductosPorCategoria(categoriaId) {
    return productoRepository.findByCategoria(categoriaId);
  }

  // Obtener productos con stock bajo
  async obtenerProductosStockBajo(minStock = 10) {
    return productoRepository.findLowStock(minStock);
  }

  // Incrementar stock
  async incrementarStock(productoId, cantidad) {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    return productoRepository.updateStock(productoId, cantidad);
  }

  // Decrementar stock
  async decrementarStock(productoId, cantidad) {
    if (cantidad <= 0) {
      throw new Error('La cantidad debe ser mayor a 0');
    }

    const producto = await this.obtenerProducto(productoId);
    if (producto.Stock < cantidad) {
      throw new Error('Stock insuficiente');
    }

    return productoRepository.updateStock(productoId, -cantidad);
  }

  // Ajustar stock
  async ajustarStock(productoId, nuevoCantidad) {
    const producto = await this.obtenerProducto(productoId);
    const diferencia = nuevoCantidad - producto.Stock;
    return productoRepository.updateStock(productoId, diferencia);
  }
}

export default new ProductoService();
