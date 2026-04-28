import clienteService from '../services/clienteService.js';

export class ClienteController {
  async crear(req, res) {
    try {
      const cliente = await clienteService.crearCliente(req.body);
      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: cliente,
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
      const clientes = await clienteService.listarClientes();
      res.status(200).json({
        success: true,
        data: clientes,
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
      const cliente = await clienteService.obtenerCliente(id);
      res.status(200).json({
        success: true,
        data: cliente,
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
      const cliente = await clienteService.actualizarCliente(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: cliente,
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
      await clienteService.eliminarCliente(id);
      res.status(200).json({
        success: true,
        message: 'Cliente eliminado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async cambiarEstado(req, res) {
    try {
      const { id } = req.params;
      const { estadoId } = req.body;
      
      const cliente = await clienteService.cambiarEstadoCliente(id, estadoId);
      res.status(200).json({
        success: true,
        message: 'Estado del cliente actualizado',
        data: cliente,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new ClienteController();
