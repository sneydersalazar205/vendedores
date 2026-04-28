import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({ 
  adapter,
  log: ['query', 'info', 'warn', 'error'], // Opcional: para debugging
});

// Manejo de desconexión
process.on('SIGINT', async () => {
  console.log('Desconectando de Prisma...');
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
