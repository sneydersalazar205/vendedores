import { prisma } from '../src/models/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes
  console.log('🧹 Limpiando datos existentes...');
  await prisma.usuario.deleteMany();
  await prisma.sede.deleteMany();
  await prisma.ciudad.deleteMany();
  await prisma.region.deleteMany();
  await prisma.rol.deleteMany();

  // Crear roles
  console.log('👥 Creando roles...');
  const rolAdmin = await prisma.rol.create({
    data: {
      Nombre: 'Administrador',
      Descripcion: 'Acceso total al sistema',
    },
  });

  const rolVendedor = await prisma.rol.create({
    data: {
      Nombre: 'Vendedor',
      Descripcion: 'Acceso para realizar ventas',
    },
  });

  const rolSupervisor = await prisma.rol.create({
    data: {
      Nombre: 'Supervisor',
      Descripcion: 'Acceso para supervisar vendedores',
    },
  });

  // Crear regiones
  console.log('🌍 Creando regiones...');
  const region1 = await prisma.region.create({
    data: {
      Nombre: 'Región Andina',
      Codigo: 'AND',
      Descripcion: 'Región que comprende los departamentos de Nariño, Cauca, Huila',
      Estado: 'Activo',
    },
  });

  const region2 = await prisma.region.create({
    data: {
      Nombre: 'Región Caribe',
      Codigo: 'CAR',
      Descripcion: 'Región costera del Caribe',
      Estado: 'Activo',
    },
  });

  const region3 = await prisma.region.create({
    data: {
      Nombre: 'Región Pacífica',
      Codigo: 'PAC',
      Descripcion: 'Región costera del Pacífico',
      Estado: 'Activo',
    },
  });

  // Crear ciudades
  console.log('🏙️ Creando ciudades...');
  const ciudad1 = await prisma.ciudad.create({
    data: {
      Nombre: 'Pasto',
      Codigo: 'PST',
      Descripcion: 'Capital de Nariño',
      Estado: 'Activo',
      region: { connect: { IdRegion: region1.IdRegion } },
    },
  });

  const ciudad2 = await prisma.ciudad.create({
    data: {
      Nombre: 'Popayán',
      Codigo: 'POY',
      Descripcion: 'Capital de Cauca',
      Estado: 'Activo',
      region: { connect: { IdRegion: region1.IdRegion } },
    },
  });

  const ciudad3 = await prisma.ciudad.create({
    data: {
      Nombre: 'Barranquilla',
      Codigo: 'BAQ',
      Descripcion: 'Capital del Atlántico',
      Estado: 'Activo',
      region: { connect: { IdRegion: region2.IdRegion } },
    },
  });

  const ciudad4 = await prisma.ciudad.create({
    data: {
      Nombre: 'Cartagena',
      Codigo: 'CTG',
      Descripcion: 'Ciudad amurallada',
      Estado: 'Activo',
      region: { connect: { IdRegion: region2.IdRegion } },
    },
  });

  const ciudad5 = await prisma.ciudad.create({
    data: {
      Nombre: 'Cali',
      Codigo: 'CLI',
      Descripcion: 'Capital del Valle del Cauca',
      Estado: 'Activo',
      region: { connect: { IdRegion: region3.IdRegion } },
    },
  });

  // Crear sedes
  console.log('🏢 Creando sedes...');
  const sede1 = await prisma.sede.create({
    data: {
      Nombre: 'Sede Pasto Centro',
      Codigo: 'PST-01',
      Descripcion: 'Oficina principal en Pasto',
      Estado: 'Activo',
      ciudad: { connect: { IdCiudad: ciudad1.IdCiudad } },
    },
  });

  const sede2 = await prisma.sede.create({
    data: {
      Nombre: 'Sede Pasto Sur',
      Codigo: 'PST-02',
      Descripcion: 'Sucursal sur de Pasto',
      Estado: 'Activo',
      ciudad: { connect: { IdCiudad: ciudad1.IdCiudad } },
    },
  });

  const sede3 = await prisma.sede.create({
    data: {
      Nombre: 'Sede Popayán',
      Codigo: 'POY-01',
      Descripcion: 'Oficina en Popayán',
      Estado: 'Activo',
      ciudad: { connect: { IdCiudad: ciudad2.IdCiudad } },
    },
  });

  const sede4 = await prisma.sede.create({
    data: {
      Nombre: 'Sede Barranquilla',
      Codigo: 'BAQ-01',
      Descripcion: 'Oficina en Barranquilla',
      Estado: 'Activo',
      ciudad: { connect: { IdCiudad: ciudad3.IdCiudad } },
    },
  });

  const sede5 = await prisma.sede.create({
    data: {
      Nombre: 'Sede Cartagena',
      Codigo: 'CTG-01',
      Descripcion: 'Oficina en Cartagena',
      Estado: 'Activo',
      ciudad: { connect: { IdCiudad: ciudad4.IdCiudad } },
    },
  });

  const sede6 = await prisma.sede.create({
    data: {
      Nombre: 'Sede Cali',
      Codigo: 'CLI-01',
      Descripcion: 'Oficina en Cali',
      Estado: 'Activo',
      ciudad: { connect: { IdCiudad: ciudad5.IdCiudad } },
    },
  });

  // Crear usuarios
  console.log('👤 Creando usuarios...');
  const hashedPassword = await bcrypt.hash('Admin123*', 10);
  const hashedPassword2 = await bcrypt.hash('Vendedor123*', 10);

  const usuario1 = await prisma.usuario.create({
    data: {
      Email: 'admin@rutasmart.com',
      Contrasena: hashedPassword,
      Nombre: 'Juan Carlos',
      Apellido: 'Pérez López',
      Cedula: '1234567890',
      Telefono: '3001112233',
      Direccion: 'Calle 100 #15-20',
      Estado: 'Activo',
      rol: { connect: { IdRol: rolAdmin.IdRol } },
      sede: { connect: { IdSede: sede1.IdSede } },
    },
  });

  const usuario2 = await prisma.usuario.create({
    data: {
      Email: 'vendedor1@rutasmart.com',
      Contrasena: hashedPassword2,
      Nombre: 'María',
      Apellido: 'García Rodríguez',
      Cedula: '1234567891',
      Telefono: '3002223344',
      Direccion: 'Carrera 50 #40-30',
      Estado: 'Activo',
      rol: { connect: { IdRol: rolVendedor.IdRol } },
      sede: { connect: { IdSede: sede1.IdSede } },
    },
  });

  const usuario3 = await prisma.usuario.create({
    data: {
      Email: 'vendedor2@rutasmart.com',
      Contrasena: hashedPassword2,
      Nombre: 'Carlos',
      Apellido: 'Martínez Gómez',
      Cedula: '1234567892',
      Telefono: '3003334455',
      Direccion: 'Calle 25 #12-40',
      Estado: 'Activo',
      rol: { connect: { IdRol: rolVendedor.IdRol } },
      sede: { connect: { IdSede: sede2.IdSede } },
    },
  });

  const usuario4 = await prisma.usuario.create({
    data: {
      Email: 'supervisor@rutasmart.com',
      Contrasena: hashedPassword2,
      Nombre: 'Sandra',
      Apellido: 'López Hernández',
      Cedula: '1234567893',
      Telefono: '3004445566',
      Direccion: 'Diagonal 30 #18-25',
      Estado: 'Activo',
      rol: { connect: { IdRol: rolSupervisor.IdRol } },
      sede: { connect: { IdSede: sede3.IdSede } },
    },
  });

  const usuario5 = await prisma.usuario.create({
    data: {
      Email: 'vendedor3@rutasmart.com',
      Contrasena: hashedPassword2,
      Nombre: 'Roberto',
      Apellido: 'Sánchez Díaz',
      Cedula: '1234567894',
      Telefono: '3005556677',
      Direccion: 'Cra 10 #30-50',
      Estado: 'Activo',
      rol: { connect: { IdRol: rolVendedor.IdRol } },
      sede: { connect: { IdSede: sede4.IdSede } },
    },
  });

  const usuario6 = await prisma.usuario.create({
    data: {
      Email: 'vendedor4@rutasmart.com',
      Contrasena: hashedPassword2,
      Nombre: 'Lorena',
      Apellido: 'Vargas Cruz',
      Cedula: '1234567895',
      Telefono: '3006667788',
      Direccion: 'Calle 35 #5-20',
      Estado: 'Activo',
      rol: { connect: { IdRol: rolSupervisor.IdRol } },
      sede: { connect: { IdSede: sede5.IdSede } },
    },
  });

  console.log('✅ Seed completado exitosamente!');
  console.log('\n📋 Datos creados:');
  console.log(`  ✓ 3 Roles`);
  console.log(`  ✓ 3 Regiones`);
  console.log(`  ✓ 5 Ciudades`);
  console.log(`  ✓ 6 Sedes`);
  console.log(`  ✓ 6 Usuarios`);
  console.log('\n🔑 Credenciales de prueba:');
  console.log('  Admin: admin@rutasmart.com / Admin123*');
  console.log('  Vendedor: vendedor1@rutasmart.com / Vendedor123*');
  console.log('  Supervisor: supervisor@rutasmart.com / Vendedor123*');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
