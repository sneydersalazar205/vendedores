import { prisma } from '../models/prisma.js';

export class UsuarioRepository {
  // Obtener todos los usuarios
  async findAll(filters = {}) {
    return prisma.usuario.findMany({
      where: filters,
      include: {
        rol: true,
        sede: true,
      },
    });
  }

  // Obtener usuario por ID
  async findById(id) {
    return prisma.usuario.findUnique({
      where: { IdUsuario: parseInt(id) },
      include: {
        rol: true,
        sede: true,
        rutausuario: true,
      },
    });
  }

  // Obtener usuario por email
  async findByEmail(email) {
    return prisma.usuario.findFirst({
      where: { Email: email },
      include: { rol: true },
    });
  }

  // Obtener usuario por cédula
  async findByCedula(cedula) {
    return prisma.usuario.findFirst({
      where: { Cedula: cedula },
    });
  }

  // Crear usuario
  async create(data) {
    return prisma.usuario.create({
      data,
      include: { rol: true, sede: true },
    });
  }

  // Actualizar usuario
  async update(id, data) {
    return prisma.usuario.update({
      where: { IdUsuario: parseInt(id) },
      data,
      include: { rol: true, sede: true },
    });
  }

  // Eliminar usuario
  async delete(id) {
    await prisma.$executeRaw`DELETE FROM "usuario" WHERE "IdUsuario" = ${parseInt(id)}`;
  }

  // Obtener usuarios por rol
  async findByRole(roleId) {
    return prisma.usuario.findMany({
      where: { IdRol: roleId },
      include: { rol: true, sede: true },
    });
  }

  // Obtener usuarios por sede
  async findBySede(sedeId) {
    return prisma.usuario.findMany({
      where: { IdSede: sedeId },
      include: { rol: true },
    });
  }
}

export default new UsuarioRepository();
