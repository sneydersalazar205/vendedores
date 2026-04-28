// index.js
import { PrismaClient } from './path/to/generated/prisma/client' // Asegúrate de que la ruta sea correcta
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient as PrismaClientType } from '@prisma/client'

const connectionString = process.env.DATABASE_URL

const adapter = new PrismaPg({
  connectionString,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  // ... tu código para crear clientes, productos, etc.
  console.log("¡Conectado a Supabase con Prisma 7!")
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())