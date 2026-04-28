import { prisma } from '../models/prisma.js';

export class ProductoRepository {
  // Obtener todos los productos
  async findAll(filters = {}) {
    return prisma.producto.findMany({
      where: filters,
      include: {
        categoriaproducto: true,
        estadoproducto: true,
      },
    });
  }

  // Obtener producto por ID
  async findById(id) {
    return prisma.producto.findUnique({
      where: { IdProducto: id },
      include: {
        categoriaproducto: true,
        estadoproducto: true,
        detallepedido: true,
      },
    });
  }

  // Obtener producto por código
  async findByCodigo(codigo) {
    return prisma.producto.findFirst({
      where: { Codigo: codigo },
      include: {
        categoriaproducto: true,
        estadoproducto: true,
      },
    });
  }

  // Crear producto
  async create(data) {
    return prisma.producto.create({
      data,
      include: {
        categoriaproducto: true,
        estadoproducto: true,
      },
    });
  }

  // Actualizar producto
  async update(id, data) {
    return prisma.producto.update({
      where: { IdProducto: id },
      data,
      include: {
        categoriaproducto: true,
        estadoproducto: true,
      },
    });
  }

  // Eliminar producto
  async delete(id) {
    return prisma.producto.delete({
      where: { IdProducto: id },
    });
  }

  // Obtener productos por categoría
  async findByCategoria(categoriaId) {
    return prisma.producto.findMany({
      where: { IdCategoria: categoriaId },
      include: { categoriaproducto: true },
    });
  }

  // Obtener productos en stock bajo
  async findLowStock(minStock = 10) {
    return prisma.producto.findMany({
      where: {
        Stock: {
          lte: minStock,
        },
      },
    });
  }

  // Actualizar stock
  async updateStock(id, cantidad) {
    return prisma.producto.update({
      where: { IdProducto: id },
      data: {
        Stock: {
          increment: cantidad,
        },
      },
    });
  }
}

export default new ProductoRepository();
