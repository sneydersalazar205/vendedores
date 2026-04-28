import express from 'express';
import clienteController from '../controllers/clienteController.js';

const router = express.Router();

// Rutas de cliente
router.post('/', (req, res) => clienteController.crear(req, res));
router.get('/', (req, res) => clienteController.listar(req, res));
router.get('/:id', (req, res) => clienteController.obtener(req, res));
router.put('/:id', (req, res) => clienteController.actualizar(req, res));
router.delete('/:id', (req, res) => clienteController.eliminar(req, res));
router.patch('/:id/cambiar-estado', (req, res) => clienteController.cambiarEstado(req, res));

export default router;
