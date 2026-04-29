import express from 'express';
import regionController from '../controllers/regionController.js';

const router = express.Router();

// Rutas de región
router.get('/', (req, res) => regionController.listar(req, res));
router.post('/', (req, res) => regionController.crear(req, res));
router.get('/:id', (req, res) => regionController.obtener(req, res));
router.put('/:id', (req, res) => regionController.actualizar(req, res));
router.delete('/:id', (req, res) => regionController.eliminar(req, res));

export default router;
