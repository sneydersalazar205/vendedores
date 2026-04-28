import express from 'express';
import rutaController from '../controllers/rutaController.js';

const router = express.Router();

// Rutas de ruta
router.post('/', (req, res) => rutaController.crear(req, res));
router.get('/', (req, res) => rutaController.listar(req, res));
router.get('/activas', (req, res) => rutaController.obtenerActivas(req, res));
router.get('/:id', (req, res) => rutaController.obtener(req, res));
router.get('/usuario/:usuarioId', (req, res) => rutaController.obtenerPorUsuario(req, res));
router.put('/:id', (req, res) => rutaController.actualizar(req, res));
router.delete('/:id', (req, res) => rutaController.eliminar(req, res));

export default router;
