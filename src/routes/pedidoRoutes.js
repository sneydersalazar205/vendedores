import express from 'express';
import pedidoController from '../controllers/pedidoController.js';

const router = express.Router();

// Rutas de pedido
router.post('/', (req, res) => pedidoController.crear(req, res));
router.get('/', (req, res) => pedidoController.listar(req, res));
router.get('/reporte/ventas', (req, res) => pedidoController.obtenerReporteVentas(req, res));
router.get('/:id', (req, res) => pedidoController.obtener(req, res));
router.get('/cliente/:clienteId', (req, res) => pedidoController.obtenerPorCliente(req, res));
router.patch('/:id/cancelar', (req, res) => pedidoController.cancelar(req, res));

export default router;
