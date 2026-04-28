# 🏗️ Diagrama de Arquitectura

## Flujo de Datos Completo

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENTE HTTP                                   │
│                    (Postman, navegador, app)                            │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                    POST /api/usuarios
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│                  EXPRESS.JS - ENTRADA DE PETICIÓN                        │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │   CORS      │  │ Rate Limit  │  │  Security   │
   │ Middleware  │  │ Middleware  │  │ Headers     │
   └─────────────┘  └─────────────┘  └─────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │Validation   │  │ Auth JWT    │  │ JSON Parser │
   │ Middleware  │  │ Middleware  │  │ Middleware  │
   └─────────────┘  └─────────────┘  └─────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│                    ROUTES - ENRUTADOR                                    │
│              (/api/usuarios/registrar → Controller)                     │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│              CONTROLLER - MANEJO HTTP                                    │
│        usuarioController.registrar(req, res)                             │
│                                                                          │
│  • Recibe req (body: {email, contraseña, ...})                          │
│  • Llama al servicio: usuarioService.registrar(req.body)               │
│  • Maneja errores y formatea respuesta                                  │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│              SERVICE - LÓGICA DE NEGOCIO                                │
│        usuarioService.registrarUsuario(data)                            │
│                                                                          │
│  ✅ Valida email único                                                  │
│  ✅ Valida cédula única                                                 │
│  ✅ Valida contraseña fuerte                                            │
│  ✅ Hashea contraseña con bcrypt                                        │
│  ✅ Aplica reglas de negocio                                            │
│  ✅ Orquesta llamadas a repositorio                                     │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│            REPOSITORY - ACCESO A DATOS                                  │
│        usuarioRepository.create(usuario)                                │
│                                                                          │
│  • Ejecuta consulta Prisma simple                                       │
│  • NO contiene lógica de negocio                                        │
│  • Solo CRUD operations                                                 │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│              MODEL - CONEXIÓN BD                                         │
│        prisma.usuario.create({data})                                     │
│                                                                          │
│  • Prisma Client genera SQL                                             │
│  • Ejecuta en PostgreSQL                                                │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│              BASE DE DATOS - PostgreSQL                                  │
│                                                                          │
│  INSERT INTO usuario (Email, Contrasena, ...)                          │
│  VALUES ('user@email.com', '$2a$10$hashedpassword', ...)               │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
                    ← Usuario creado ←
                           │
    Los datos fluyen hacia arriba con transformaciones
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│            REPOSITORY - Retorna objeto usuario                           │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│            SERVICE - Retorna usuario (sin contraseña)                   │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│    CONTROLLER - Formatea JSON y envía respuesta HTTP 201                │
└──────────────────────────┬──────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
   │  Response   │  │   Headers   │  │  Status     │
   │   JSON      │  │  (Content   │  │    201      │
   │             │  │  -Type...)  │  │ Created     │
   └─────────────┘  └─────────────┘  └─────────────┘
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────────────┐
│                      CLIENTE HTTP                                        │
│    Recibe: {success: true, data: {IdUsuario: 1, Email: ...}}           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Estructura Modular

```
┌──────────────────────────────────────────────────────────────────────┐
│                         SRC/INDEX.JS                                  │
│                     (Punto de entrada)                                │
└────────────────────┬─────────────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
    ┌────────┐ ┌────────┐ ┌────────────┐
    │ROUTES  │ │MIDDLEWARE
────────── │CONTROLLERS│
    └────────┘ └────────┘ └────────────┘
        │            │            │
        └────────────┼────────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │    SERVICES            │
        │                        │
        │ Lógica de negocio      │
        │ Validaciones           │
        │ Orquestación           │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │  REPOSITORIES          │
        │                        │
        │ CRUD con Prisma        │
        │ Acceso a datos         │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │     MODELS             │
        │                        │
        │ Prisma Client          │
        │ Conexión BD            │
        └────────────┬───────────┘
                     │
                     ▼
        ┌────────────────────────┐
        │   PostgreSQL           │
        │                        │
        │  Base de datos         │
        └────────────────────────┘
```

---

## Separación por Entidad

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USUARIO                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  src/                                                                   │
│  ├── repositories/usuarioRepository.js      # CRUD básico               │
│  ├── services/usuarioService.js             # Lógica (hash, validar)   │
│  ├── controllers/usuarioController.js       # HTTP responses            │
│  ├── routes/usuarioRoutes.js                # Rutas /api/usuarios      │
│  └── middlewares/                           # Auth, validación          │
│                                                                          │
│  FLUJO: POST /api/usuarios/registrar                                   │
│         ↓                                                               │
│    usuarioRoutes.js                                                    │
│         ↓                                                               │
│    usuarioController.registrar()                                       │
│         ↓                                                               │
│    usuarioService.registrarUsuario()                                   │
│         ↓                                                               │
│    usuarioRepository.create()                                          │
│         ↓                                                               │
│    prisma.usuario.create()                                             │
│         ↓                                                               │
│    PostgreSQL → INSERT usuario                                         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          CLIENTE                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  src/                                                                   │
│  ├── repositories/clienteRepository.js      # Queries a cliente        │
│  ├── services/clienteService.js             # Validaciones cliente     │
│  ├── controllers/clienteController.js       # CRUD responses           │
│  ├── routes/clienteRoutes.js                # /api/clientes            │
│                                                                          │
│  MISMA ESTRUCTURA POR CADA ENTIDAD                                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Ciclo de Vida de una Petición

```
ETAPA 1: RECEPCIÓN
────────────────
POST /api/usuarios/registrar
Content-Type: application/json
Body: {email, password, ...}


ETAPA 2: MIDDLEWARES
────────────────
✓ corsMiddleware
✓ securityHeaders
✓ rateLimiter
✓ express.json()
✓ requestLogger
✓ validateJSON
✓ validate(usuarioSchema)  // Zod validation


ETAPA 3: ENRUTAMIENTO
────────────────
Routes busca: POST /api/usuarios/registrar
Encuentra: usuarioRoutes.js
Llama: usuarioController.registrar(req, res)


ETAPA 4: CONTROLADOR
────────────────
usuarioController.registrar() {
  • Extrae req.body
  • Llama usuarioService.registrarUsuario()
  • Maneja errores
  • Responde con JSON
}


ETAPA 5: SERVICIO
────────────────
usuarioService.registrarUsuario() {
  • Valida email único
  • Valida cédula única
  • Hashea contraseña
  • Llama usuarioRepository.create()
  • Retorna usuario creado
}


ETAPA 6: REPOSITORIO
────────────────
usuarioRepository.create(data) {
  • Recibe datos validados
  • Ejecuta prisma.usuario.create()
  • Retorna usuario de BD
}


ETAPA 7: MODELO (PRISMA)
────────────────
prisma.usuario.create({data})
  • Genera SQL: INSERT INTO usuario (...)
  • Ejecuta en PostgreSQL
  • Retorna fila creada


ETAPA 8: BASE DE DATOS
────────────────
INSERT INTO usuario (email, contrasena, nombre, ...)
VALUES ('user@email.com', '$2a$10$hash...', 'Juan', ...)
RETURNING *;


ETAPA 9: RESPUESTA (hacia atrás)
────────────────
Datos fluyen hacia arriba:
  usuario ← repository
  usuario ← service
  res.json({success, data}) ← controller
  HTTP 201 + JSON Body ← Express
  Cliente recibe respuesta


ETAPA 10: CLIENTE
────────────────
Status: 201 Created
Body: {
  success: true,
  message: "Usuario registrado exitosamente",
  data: {
    IdUsuario: 1,
    Email: "user@email.com",
    Nombre: "Juan",
    ...
  }
}
```

---

## Manejo de Errores

```
┌─────────────────────────────────────────────────────────┐
│  Error en cualquier capa                                │
└───────────────┬─────────────────────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
    Service        Repository
    (Validación)   (Prisma)
        │               │
        └───────┬───────┘
                │
        ┌───────▼───────────────┐
        │  Controller.catch()   │
        │  Formatea error       │
        └───────┬───────────────┘
                │
        ┌───────▼───────────────────────────┐
        │  errorHandler Middleware          │
        │                                   │
        │  if (err.code === 'P2002')       │
        │    → 400 Unique constraint        │
        │  if (err.code === 'P2025')       │
        │    → 404 Not found                │
        │  else                            │
        │    → 500 Server error             │
        └───────┬───────────────────────────┘
                │
        ┌───────▼───────────────┐
        │  Cliente recibe JSON: │
        │  {                    │
        │    success: false,    │
        │    message: "...",    │
        │    status: 400|404|500│
        │  }                    │
        └───────────────────────┘
```

---

## Relaciones entre Entidades

```
┌─────────────────────────────────────────────────────────────┐
│  Usuario                Rol                                  │
│  • IdUsuario     ────────────→ • IdRol                       │
│  • Nombre                        • Nombre                    │
│  • Email                         • Descripción               │
│  • IdRol (FK)                                                │
│  • IdSede (FK)                                               │
│  ↓                                                           │
│  Ruta Usuario                                                │
│  • IdRutaUsuario                                             │
│  • IdUsuario (FK)                                            │
│  • IdRuta (FK)                                               │
│    ↓                                                         │
│    Ruta                                                      │
│    • IdRuta                                                  │
│    • Nombre                                                  │
│    • Fecha                                                   │
│    ↓                                                         │
│    Ruta Detalle    ─────→  Dirección                        │
│    • IdRutaDetalle              • IdDireccion               │
│    • IdRuta                     • IdCliente                 │
│    • IdDireccion (FK)           • Latitud/Longitud         │
│    ↓                                                         │
│    Visita    ────────────→ Estado Visita                    │
│    • IdVisita               • IdEstadoVisita                │
│    • IdRutaDetalle          • Nombre (ej: "completada")    │
│    • Latitud/Longitud                                       │
│    • EsValida                                               │
└─────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────┐
    │             Producto                             │
    │  • IdProducto                                    │
    │  • Código (UNIQUE)                               │
    │  • Nombre                                        │
    │  • Precio                                        │
    │  • Stock                                         │
    │  ↓                                               │
    │  Detalle Pedido     Pedido                       │
    │  • IdDetallePedido  • IdPedido                   │
    │  • IdProducto (FK)  • IdCliente (FK)            │
    │  • Cantidad         • Total                      │
    │  • PrecioUnitario   • FechaPedido                │
    │                     ↓                            │
    │              Cliente                             │
    │              • IdCliente                         │
    │              • Nombre                            │
    │              • Email                             │
    │              • Cedula                            │
    │                                                  │
    └──────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────┐
    │           Visita Pedido                          │
    │  • IdVisitaPedido                                │
    │  • IdPedido (FK) ─→ Pedido                       │
    │  • IdVisita (FK) ─→ Visita                       │
    │  • IdCliente (FK) ─→ Cliente                     │
    │  • Total (venta)                                 │
    │  ↓                                               │
    │  Comisión                                        │
    │  • IdComision                                    │
    │  • IdVisitaPedido (FK)                          │
    │  • MontoVenta                                    │
    │  • PorcentajeComision                            │
    │  • MontoComision (calculado)                     │
    │  • Estado (calculada/pagada/rechazada)           │
    └──────────────────────────────────────────────────┘
```

---

## Escalabilidad

La arquitectura permite fácilmente:

```
Agregar nueva entidad (ejemplo: Inventario)

1. Crear: src/repositories/inventarioRepository.js
2. Crear: src/services/inventarioService.js
3. Crear: src/controllers/inventarioController.js
4. Crear: src/routes/inventarioRoutes.js
5. Agregar en: src/index.js
   app.use('/api/inventario', inventarioRoutes);

TODO sin tocar otras entidades ✓
```

---

## Performance Tips

```
OPTIMIZACIONES:
✓ Lazy loading con include selectivo
✓ Pagination en queries grandes
✓ Indexes en campos frecuentes
✓ Connection pooling en producción
✓ Caching en servicios (Redis opcional)
✓ Rate limiting implementado
✓ Validación temprana en middlewares
```

---

¡Tu arquitectura está lista para crecer! 🚀
