import { prisma } from '../src/models/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed...');

  // Limpiar datos existentes (orden: hijos primero)
  console.log('🧹 Limpiando datos existentes...');
  await prisma.comision.deleteMany();
  await prisma.visitaspedido.deleteMany();
  await prisma.visita.deleteMany();
  await prisma.devoluciones.deleteMany();
  await prisma.detallepedido.deleteMany();
  await prisma.pedido.deleteMany();
  await prisma.rutausuario.deleteMany();
  await prisma.rutadetalle.deleteMany();
  await prisma.ruta.deleteMany();
  await prisma.movimientostock.deleteMany();
  await prisma.producto.deleteMany();
  await prisma.categoriaproducto.deleteMany();
  await prisma.estadoproducto.deleteMany();
  await prisma.direccion.deleteMany();
  await prisma.cliente.deleteMany();
  await prisma.estadocliente.deleteMany();
  await prisma.sedecliente.deleteMany();
  await prisma.estadovisita.deleteMany();
  await prisma.metodopago.deleteMany();
  await prisma.iva.deleteMany();
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

  // ── Tablas de referencia ──────────────────────────────────────────────
  console.log('📋 Creando tablas de referencia...');

  const estadoClienteActivo = await prisma.estadocliente.create({
    data: { Nombre: 'Activo', Descripcion: 'Cliente activo' },
  });

  const sedeClienteCasa = await prisma.sedecliente.create({ data: { Nombre: 'Casa' } });
  const sedeClienteLocal = await prisma.sedecliente.create({ data: { Nombre: 'Local comercial' } });

  const estadoVisitado     = await prisma.estadovisita.create({ data: { Nombre: 'Visitado',       Descripcion: 'Visita realizada exitosamente' } });
  const estadoNoEncontrado = await prisma.estadovisita.create({ data: { Nombre: 'No Encontrado',  Descripcion: 'Cliente no se encontraba' } });
  const estadoVenta        = await prisma.estadovisita.create({ data: { Nombre: 'Venta Realizada', Descripcion: 'Se realizó una venta' } });

  const catAbarrotes = await prisma.categoriaproducto.create({ data: { Nombre: 'Abarrotes',  Descripcion: 'Productos de abarrotes' } });
  const catBebidas   = await prisma.categoriaproducto.create({ data: { Nombre: 'Bebidas',    Descripcion: 'Bebidas y refrescos' } });

  const estadoProdActivo = await prisma.estadoproducto.create({ data: { Nombre: 'Activo', Descripcion: 'Producto disponible' } });

  await prisma.metodopago.createMany({ data: [{ Nombre: 'Efectivo' }, { Nombre: 'Transferencia' }, { Nombre: 'Tarjeta' }] });
  await prisma.iva.createMany({ data: [{ Valor: 0, Nombre: 'Sin IVA' }, { Valor: 19, Nombre: 'IVA 19%' }] });

  // ── Productos ─────────────────────────────────────────────────────────
  console.log('📦 Creando productos...');

  const prod1 = await prisma.producto.create({
    data: { Codigo: 'P001', Nombre: 'Arroz Diana 500g',    Precio: 3200,  Stock: 100, Estado: 'Activo', categoriaproducto: { connect: { IdCategoria: catAbarrotes.IdCategoria } }, estadoproducto: { connect: { IdEstadoProducto: estadoProdActivo.IdEstadoProducto } } },
  });
  const prod2 = await prisma.producto.create({
    data: { Codigo: 'P002', Nombre: 'Aceite 1 litro',      Precio: 9500,  Stock: 60,  Estado: 'Activo', categoriaproducto: { connect: { IdCategoria: catAbarrotes.IdCategoria } }, estadoproducto: { connect: { IdEstadoProducto: estadoProdActivo.IdEstadoProducto } } },
  });
  const prod3 = await prisma.producto.create({
    data: { Codigo: 'P003', Nombre: 'Gaseosa Cola 600ml',  Precio: 2500,  Stock: 200, Estado: 'Activo', categoriaproducto: { connect: { IdCategoria: catBebidas.IdCategoria } },   estadoproducto: { connect: { IdEstadoProducto: estadoProdActivo.IdEstadoProducto } } },
  });
  const prod4 = await prisma.producto.create({
    data: { Codigo: 'P004', Nombre: 'Agua cristal 600ml',  Precio: 1500,  Stock: 300, Estado: 'Activo', categoriaproducto: { connect: { IdCategoria: catBebidas.IdCategoria } },   estadoproducto: { connect: { IdEstadoProducto: estadoProdActivo.IdEstadoProducto } } },
  });
  const prod5 = await prisma.producto.create({
    data: { Codigo: 'P005', Nombre: 'Azúcar x500g',        Precio: 4000,  Stock: 80,  Estado: 'Activo', categoriaproducto: { connect: { IdCategoria: catAbarrotes.IdCategoria } }, estadoproducto: { connect: { IdEstadoProducto: estadoProdActivo.IdEstadoProducto } } },
  });

  // ── Clientes y direcciones (Pasto) ────────────────────────────────────
  console.log('👥 Creando clientes...');

  const cliente1 = await prisma.cliente.create({
    data: {
      PrimerNombre: 'Ana', PrimerApellido: 'Torres', Telefono: '3101234567',
      Email: 'ana.torres@gmail.com', Cedula: '52001100',
      estadocliente: { connect: { IdEstadoCliente: estadoClienteActivo.IdEstadoCliente } },
    },
  });
  const cliente2 = await prisma.cliente.create({
    data: {
      PrimerNombre: 'Luis', PrimerApellido: 'Muñoz', Telefono: '3119876543',
      Email: 'luis.munoz@gmail.com', Cedula: '98765432',
      estadocliente: { connect: { IdEstadoCliente: estadoClienteActivo.IdEstadoCliente } },
    },
  });
  const cliente3 = await prisma.cliente.create({
    data: {
      PrimerNombre: 'Patricia', PrimerApellido: 'Ruiz', Telefono: '3205556677',
      Email: 'patricia.ruiz@gmail.com', Cedula: '30445566',
      estadocliente: { connect: { IdEstadoCliente: estadoClienteActivo.IdEstadoCliente } },
    },
  });

  // Coordenadas reales en Pasto, Nariño
  const dir1 = await prisma.direccion.create({
    data: {
      Direccion: 'Calle 18 # 25-40, Pasto Centro',
      Latitud: 1.21411, Longitud: -77.27949,
      DireccionPrincipal: true, Estado: 'Activo',
      cliente: { connect: { IdCliente: cliente1.IdCliente } },
      sedecliente: { connect: { IdSedesCliente: sedeClienteCasa.IdSedesCliente } },
      sede: { connect: { IdSede: sede1.IdSede } },
    },
  });
  const dir2 = await prisma.direccion.create({
    data: {
      Direccion: 'Carrera 27 # 18-15, Barrio Colsag',
      Latitud: 1.21801, Longitud: -77.27552,
      DireccionPrincipal: true, Estado: 'Activo',
      cliente: { connect: { IdCliente: cliente2.IdCliente } },
      sedecliente: { connect: { IdSedesCliente: sedeClienteLocal.IdSedesCliente } },
      sede: { connect: { IdSede: sede1.IdSede } },
    },
  });
  const dir3 = await prisma.direccion.create({
    data: {
      Direccion: 'Av. Panamericana # 50-10, Pasto',
      Latitud: 1.20965, Longitud: -77.28303,
      DireccionPrincipal: true, Estado: 'Activo',
      cliente: { connect: { IdCliente: cliente3.IdCliente } },
      sedecliente: { connect: { IdSedesCliente: sedeClienteCasa.IdSedesCliente } },
      sede: { connect: { IdSede: sede1.IdSede } },
    },
  });

  // ── Ruta para vendedor1 ───────────────────────────────────────────────
  console.log('🗺️  Creando ruta y asignación...');

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const ruta1 = await prisma.ruta.create({
    data: {
      Nombre: 'Ruta Pasto Centro',
      Fecha: hoy,
      Estado: 1,
      origen_lat: 1.21411,
      origen_lng: -77.27949,
    },
  });

  // Puntos de visita (rutadetalle)
  await prisma.rutadetalle.createMany({
    data: [
      { IdRuta: ruta1.IdRuta, IdDireccion: dir1.IdDireccion, OrdenVisita: 1, EstadoVisita: 'Pendiente', Latitud: dir1.Latitud, Longitud: dir1.Longitud },
      { IdRuta: ruta1.IdRuta, IdDireccion: dir2.IdDireccion, OrdenVisita: 2, EstadoVisita: 'Pendiente', Latitud: dir2.Latitud, Longitud: dir2.Longitud },
      { IdRuta: ruta1.IdRuta, IdDireccion: dir3.IdDireccion, OrdenVisita: 3, EstadoVisita: 'Pendiente', Latitud: dir3.Latitud, Longitud: dir3.Longitud },
    ],
  });

  // Asignar ruta a vendedor1
  await prisma.rutausuario.create({
    data: {
      ruta:    { connect: { IdRuta: ruta1.IdRuta } },
      usuario: { connect: { IdUsuario: usuario2.IdUsuario } },
      FechaAsignacion: new Date(),
      Estado: 'activa',
    },
  });

  console.log('✅ Seed completado exitosamente!');
  console.log('\n📋 Datos creados:');
  console.log(`  ✓ 3 Roles`);
  console.log(`  ✓ 3 Regiones`);
  console.log(`  ✓ 5 Ciudades`);
  console.log(`  ✓ 6 Sedes`);
  console.log(`  ✓ 6 Usuarios`);
  console.log(`  ✓ 3 Estados de visita (Visitado, No Encontrado, Venta Realizada)`);
  console.log(`  ✓ 5 Productos`);
  console.log(`  ✓ 3 Clientes con direcciones en Pasto`);
  console.log(`  ✓ 1 Ruta asignada a vendedor1 con 3 puntos de visita`);
  console.log('\n🔑 Credenciales de prueba:');
  console.log('  Admin:    admin@rutasmart.com  / Admin123*');
  console.log('  Vendedor: vendedor1@rutasmart.com / Vendedor123*');
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
