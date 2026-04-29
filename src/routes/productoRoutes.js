import express from 'express';
import productoController from '../controllers/productoController.js';

const router = express.Router();

// Rutas de producto
router.post('/', (req, res) => productoController.crear(req, res));
router.get('/', (req, res) => productoController.listar(req, res));
// Rutas específicas ANTES de :id
router.get('/stock-bajo', (req, res) => productoController.obtenerStockBajo(req, res));
// Rutas dinámicas
router.get('/:id', (req, res) => productoController.obtener(req, res));
router.put('/:id', (req, res) => productoController.actualizar(req, res));
router.delete('/:id', (req, res) => productoController.eliminar(req, res));
router.post('/:id/incrementar-stock', (req, res) => productoController.incrementarStock(req, res));
router.post('/:id/decrementar-stock', (req, res) => productoController.decrementarStock(req, res));

export default router;
