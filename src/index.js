import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './models/prisma.js';
import { errorHandler, requestLogger, validateJSON } from './middlewares/errorHandler.js';
import { corsMiddleware, securityHeaders, rateLimiter } from './middlewares/security.js';

// Importar rutas
import usuarioRoutes from './routes/usuarioRoutes.js';
import clienteRoutes from './routes/clienteRoutes.js';
import productoRoutes from './routes/productoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import rutaRoutes from './routes/rutaRoutes.js';
import visitaRoutes from './routes/visitaRoutes.js';
import comisionRoutes from './routes/comisionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ==================== MIDDLEWARES ====================
// Seguridad
app.use(corsMiddleware);
app.use(securityHeaders);
app.use(rateLimiter);

// Servir archivos estáticos (FRONTEND)
app.use(express.static('public'));

// Parseo de datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger
app.use(requestLogger);

// Manejo de errores JSON
app.use(validateJSON);

// ==================== RUTAS ====================
// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Gestión de Rutas y Ventas',
    version: '1.0.0',
    endpoints: {
      usuarios: '/api/usuarios',
      clientes: '/api/clientes',
      productos: '/api/productos',
      pedidos: '/api/pedidos',
      rutas: '/api/rutas',
      visitas: '/api/visitas',
      comisiones: '/api/comisiones',
    },
  });
});

// Rutas API
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/pedidos', pedidoRoutes);
app.use('/api/rutas', rutaRoutes);
app.use('/api/visitas', visitaRoutes);
app.use('/api/comisiones', comisionRoutes);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint no encontrado',
  });
});

// ==================== MANEJO DE ERRORES ====================
app.use(errorHandler);

// ==================== INICIO DEL SERVIDOR ====================
app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
  console.log(`📊 Base de datos: ${process.env.DATABASE_URL ? 'Conectada' : 'No configurada'}`);
  console.log('📦 Capas: Models → Repositories → Services → Controllers → Routes');
});

// Manejo de desconexión graciosa
process.on('SIGTERM', async () => {
  console.log('SIGTERM señal recibida: cerrando servidor HTTP');
  await prisma.$disconnect();
  process.exit(0);
});

export default app;
