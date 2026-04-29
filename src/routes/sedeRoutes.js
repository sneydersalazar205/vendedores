import express from 'express';
import sedeController from '../controllers/sedeController.js';

const router = express.Router();

// Rutas de sede
router.get('/', (req, res) => sedeController.listar(req, res));
router.post('/', (req, res) => sedeController.crear(req, res));
router.get('/ciudad/:ciudadId', (req, res) => sedeController.obtenerPorCiudad(req, res));
router.get('/:id', (req, res) => sedeController.obtener(req, res));
router.put('/:id', (req, res) => sedeController.actualizar(req, res));
router.delete('/:id', (req, res) => sedeController.eliminar(req, res));

export default router;
