import express from 'express';
import usuarioController from '../controllers/usuarioController.js';

const router = express.Router();

// Rutas de usuario
router.post('/registrar', (req, res) => usuarioController.registrar(req, res));
router.get('/', (req, res) => usuarioController.listar(req, res));
router.get('/:id', (req, res) => usuarioController.obtenerPerfil(req, res));
router.put('/:id', (req, res) => usuarioController.actualizar(req, res));
router.post('/:id/cambiar-contrasena', (req, res) => usuarioController.cambiarContrasena(req, res));
router.patch('/:id/desactivar', (req, res) => usuarioController.desactivar(req, res));
router.patch('/:id/activar', (req, res) => usuarioController.activar(req, res));

export default router;
