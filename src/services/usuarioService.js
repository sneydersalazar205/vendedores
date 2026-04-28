import usuarioRepository from '../repositories/usuarioRepository.js';
import bcrypt from 'bcryptjs';

export class UsuarioService {
  // Registrar usuario
  async registrarUsuario(data) {
    // Validar que el email no exista
    const existeEmail = await usuarioRepository.findByEmail(data.Email);
    if (existeEmail) {
      throw new Error('El email ya está registrado');
    }

    // Validar que la cédula no exista
    if (data.Cedula) {
      const existeCedula = await usuarioRepository.findByCedula(data.Cedula);
      if (existeCedula) {
        throw new Error('La cédula ya está registrada');
      }
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(data.Contrasena, 10);

    // Crear usuario
    return usuarioRepository.create({
      ...data,
      Contrasena: hashedPassword,
    });
  }

  // Validar contraseña
  async validarContrasena(usuarioId, contrasena) {
    const usuario = await usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return await bcrypt.compare(contrasena, usuario.Contrasena);
  }

  // Cambiar contraseña
  async cambiarContrasena(usuarioId, contrasenaAntigua, contrasenaNueva) {
    const esValida = await this.validarContrasena(usuarioId, contrasenaAntigua);
    if (!esValida) {
      throw new Error('Contraseña actual incorrecta');
    }

    const hashedPassword = await bcrypt.hash(contrasenaNueva, 10);
    return usuarioRepository.update(usuarioId, {
      Contrasena: hashedPassword,
    });
  }

  // Obtener perfil de usuario
  async obtenerPerfil(usuarioId) {
    const usuario = await usuarioRepository.findById(usuarioId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // No retornar contraseña
    const { Contrasena, ...usuarioSinContrasena } = usuario;
    return usuarioSinContrasena;
  }

  // Listar usuarios
  async listarUsuarios(filters = {}) {
    return usuarioRepository.findAll(filters);
  }

  // Actualizar usuario
  async actualizarUsuario(usuarioId, data) {
    // No permitir cambiar contraseña aquí
    if (data.Contrasena) {
      throw new Error('Use cambiarContrasena para actualizar la contraseña');
    }

    return usuarioRepository.update(usuarioId, data);
  }

  // Desactivar usuario
  async desactivarUsuario(usuarioId) {
    return usuarioRepository.update(usuarioId, { Estado: 'inactivo' });
  }

  // Activar usuario
  async activarUsuario(usuarioId) {
    return usuarioRepository.update(usuarioId, { Estado: 'activo' });
  }
}

export default new UsuarioService();
