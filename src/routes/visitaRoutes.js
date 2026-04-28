import express from 'express';
import visitaController from '../controllers/visitaController.js';

const router = express.Router();

// Rutas de visita
router.post('/', (req, res) => visitaController.registrar(req, res));
router.get('/', (req, res) => visitaController.listar(req, res));
router.get('/validas', (req, res) => visitaController.obtenerValidas(req, res));
router.get('/:id', (req, res) => visitaController.obtener(req, res));
router.get('/ruta/:rutaId', (req, res) => visitaController.obtenerPorRuta(req, res));
router.get('/ruta/:rutaId/estadisticas', (req, res) => visitaController.obtenerEstadisticas(req, res));
router.post('/:id/validar', (req, res) => visitaController.validar(req, res));
router.post('/:id/observacion', (req, res) => visitaController.agregarObservacion(req, res));

export default router;
