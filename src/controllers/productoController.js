import productoService from '../services/productoService.js';

export class ProductoController {
  async crear(req, res) {
    try {
      const producto = await productoService.crearProducto(req.body);
      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: producto,
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
      const productos = await productoService.listarProductos();
      res.status(200).json({
        success: true,
        data: productos,
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
      const producto = await productoService.obtenerProducto(id);
      res.status(200).json({
        success: true,
        data: producto,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const producto = await productoService.actualizarProducto(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Producto actualizado exitosamente',
        data: producto,
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
      await productoService.eliminarProducto(id);
      res.status(200).json({
        success: true,
        message: 'Producto eliminado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerStockBajo(req, res) {
    try {
      const { minStock = 10 } = req.query;
      const productos = await productoService.obtenerProductosStockBajo(parseInt(minStock));
      res.status(200).json({
        success: true,
        data: productos,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async incrementarStock(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;
      
      const producto = await productoService.incrementarStock(id, cantidad);
      res.status(200).json({
        success: true,
        message: 'Stock incrementado exitosamente',
        data: producto,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async decrementarStock(req, res) {
    try {
      const { id } = req.params;
      const { cantidad } = req.body;
      
      const producto = await productoService.decrementarStock(id, cantidad);
      res.status(200).json({
        success: true,
        message: 'Stock decrementado exitosamente',
        data: producto,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ProductoController();
