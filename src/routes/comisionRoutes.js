import express from 'express';
import comisionController from '../controllers/comisionController.js';

const router = express.Router();

// Rutas de comisión
router.post('/', (req, res) => comisionController.calcular(req, res));
router.get('/', (req, res) => comisionController.listar(req, res));
router.get('/reporte', (req, res) => comisionController.obtenerReporte(req, res));
router.get('/periodo', (req, res) => comisionController.obtenerPorPeriodo(req, res));
router.get('/:id', (req, res) => comisionController.obtener(req, res));
router.patch('/:id/pagar', (req, res) => comisionController.pagar(req, res));
router.patch('/:id/rechazar', (req, res) => comisionController.rechazar(req, res));

export default router;
