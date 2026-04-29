import express from 'express';
import ciudadController from '../controllers/ciudadController.js';

const router = express.Router();

// Rutas de ciudad
router.get('/', (req, res) => ciudadController.listar(req, res));
router.post('/', (req, res) => ciudadController.crear(req, res));
router.get('/region/:regionId', (req, res) => ciudadController.obtenerPorRegion(req, res));
router.get('/:id', (req, res) => ciudadController.obtener(req, res));
router.put('/:id', (req, res) => ciudadController.actualizar(req, res));
router.delete('/:id', (req, res) => ciudadController.eliminar(req, res));

export default router;
