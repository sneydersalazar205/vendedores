import usuarioService from '../services/usuarioService.js';
import { generateToken } from '../middlewares/auth.js';

export class UsuarioController {
  async registrar(req, res) {
    try {
      const usuario = await usuarioService.registrarUsuario(req.body);
      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: usuario,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async login(req, res) {
    try {
      const { Email, Contrasena, email, password } = req.body;
      const usuarioEmail = Email || email;
      const usuarioPassword = Contrasena || password;

      const usuario = await usuarioService.loginUsuario(usuarioEmail, usuarioPassword);
      const token = generateToken(usuario.IdUsuario, usuario.Email, usuario.IdRol);

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        token,
        data: {
          IdUsuario: usuario.IdUsuario,
          Email: usuario.Email,
          Nombre: usuario.Nombre,
          Apellido: usuario.Apellido,
          IdRol: usuario.IdRol,
        },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getProfile(req, res) {
    try {
      const usuarioId = req.user?.usuarioId || req.params.id;
      if (!usuarioId) {
        throw new Error('ID de usuario no proporcionado');
      }

      const usuario = await usuarioService.obtenerPerfil(usuarioId);
      res.status(200).json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async listar(req, res) {
    try {
      const usuarios = await usuarioService.listarUsuarios();
      res.status(200).json({
        success: true,
        data: usuarios,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async obtenerPerfil(req, res) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.obtenerPerfil(id);
      res.status(200).json({
        success: true,
        data: usuario,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
    }
  }

  async actualizar(req, res) {
    try {
      const { id } = req.params;
      const usuario = await usuarioService.actualizarUsuario(id, req.body);
      res.status(200).json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: usuario,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async cambiarContrasena(req, res) {
    try {
      const { id } = req.params;
      const { contrasenaAntigua, contrasenaNueva } = req.body;
      
      await usuarioService.cambiarContrasena(id, contrasenaAntigua, contrasenaNueva);
      res.status(200).json({
        success: true,
        message: 'Contraseña cambiada exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async desactivar(req, res) {
    try {
      const { id } = req.params;
      await usuarioService.desactivarUsuario(id);
      res.status(200).json({
        success: true,
        message: 'Usuario desactivado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  async activar(req, res) {
    try {
      const { id } = req.params;
      await usuarioService.activarUsuario(id);
      res.status(200).json({
        success: true,
        message: 'Usuario activado exitosamente',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}

export default new UsuarioController();
