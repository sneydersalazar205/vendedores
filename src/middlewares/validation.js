import { z } from 'zod';

// Validador genérico con Zod
export const validate = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: error.errors,
        });
      }
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  };
};

// Esquemas de validación
export const usuarioSchema = z.object({
  Contrasena: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  Email: z.string().email('Email inválido'),
  Nombre: z.string().optional(),
  Apellido: z.string().optional(),
  Cedula: z.string().optional(),
  Telefono: z.string().optional(),
  IdRol: z.number().optional(),
  IdSede: z.number().optional(),
});

export const clienteSchema = z.object({
  Cedula: z.string(),
  PrimerNombre: z.string(),
  SegundoNombre: z.string().optional(),
  PrimerApellido: z.string(),
  Telefono: z.string().optional(),
  Email: z.string().email().optional(),
  IdEstadoCliente: z.number().optional(),
});

export const productoSchema = z.object({
  Codigo: z.string().optional(),
  Nombre: z.string(),
  Descripcion: z.string().optional(),
  Precio: z.number().positive(),
  Stock: z.number().int().default(0),
  IdCategoria: z.number().optional(),
  IdEstadoProducto: z.number().optional(),
});

export const pedidoSchema = z.object({
  clienteId: z.number(),
  items: z.array(z.object({
    IdProducto: z.number(),
    Cantidad: z.number().positive(),
  })),
  observaciones: z.string().optional(),
});

export const rutaSchema = z.object({
  Nombre: z.string().optional(),
  Fecha: z.string().datetime().optional(),
  origen_lat: z.number().optional(),
  origen_lng: z.number().optional(),
  Estado: z.number().optional(),
});

export const visitaSchema = z.object({
  IdRutaDetalle: z.number(),
  IdRutaUsuario: z.number(),
  Latitud: z.number(),
  Longitud: z.number(),
  Observacion: z.string().optional(),
});

export const comisionSchema = z.object({
  visitaPedidoId: z.number(),
  porcentaje: z.number().min(0).max(100),
});
