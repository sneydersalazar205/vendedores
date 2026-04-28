# 📦 Arquitectura Modular del Proyecto - Guía Completa

## 🏗️ Estructura de Capas

Tu proyecto está organizado en una arquitectura de capas que separa responsabilidades:

```
src/
├── models/              # 🗄️ Conexión a base de datos
│   └── prisma.js        # Instancia única de Prisma Client
├── repositories/        # 📚 Acceso a datos
│   ├── usuarioRepository.js
│   ├── clienteRepository.js
│   ├── productoRepository.js
│   ├── pedidoRepository.js
│   ├── rutaRepository.js
│   ├── visitaRepository.js
│   └── comisionRepository.js
├── services/            # ⚙️ Lógica de negocio
│   ├── usuarioService.js
│   ├── clienteService.js
│   ├── productoService.js
│   ├── pedidoService.js
│   ├── rutaService.js
│   ├── visitaService.js
│   └── comisionService.js
├── controllers/         # 🎮 Controladores HTTP
│   ├── usuarioController.js
│   ├── clienteController.js
│   ├── productoController.js
│   ├── pedidoController.js
│   ├── rutaController.js
│   ├── visitaController.js
│   └── comisionController.js
├── routes/              # 🛣️ Definición de rutas
│   ├── usuarioRoutes.js
│   ├── clienteRoutes.js
│   ├── productoRoutes.js
│   ├── pedidoRoutes.js
│   ├── rutaRoutes.js
│   ├── visitaRoutes.js
│   └── comisionRoutes.js
├── middlewares/         # 🚦 Middlewares
│   ├── errorHandler.js  # Manejo global de errores
│   ├── validation.js    # Validación con Zod
│   ├── auth.js          # Autenticación y JWT
│   └── security.js      # CORS, rate limiting, headers
├── validators/          # ✅ Esquemas de validación
├── utils/               # 🛠️ Utilidades
├── index.js             # 🚀 Punto de entrada
├── prisma/
│   └── schema.prisma    # Esquema de BD
└── .env.example         # Plantilla de variables de entorno
```

---

## 🎯 Responsabilidades de Cada Capa

### 1️⃣ **Models** (`src/models/`)
- **Función**: Define la conexión a la base de datos
- **Qué hace**: Crea una instancia única de Prisma Client
- **Qué NO hace**: ❌ NUNCA lógica de negocio
- **Archivos**:
  - `prisma.js` - Instancia de Prisma con manejo de conexión

### 2️⃣ **Repositories** (`src/repositories/`)
- **Función**: Acceso a datos (capa de persistencia)
- **Qué hace**: 
  - Consultas Prisma (`findMany`, `create`, `update`, `delete`)
  - Un repositorio por entidad
  - Métodos reutilizables
- **Qué NO hace**: ❌ Lógica de negocio, validaciones complejas
- **Archivos**: `usuarioRepository.js`, `clienteRepository.js`, etc.

**Ejemplo**:
```javascript
// No hacer en Repository:
async registrarUsuario(data) {
  // Validar, hashear, lógica de negocio ❌
}

// Sí hacer en Repository:
async create(data) {
  return prisma.usuario.create({ data });
}
```

### 3️⃣ **Services** (`src/services/`)
- **Función**: Lógica de negocio
- **Qué hace**:
  - Validaciones
  - Transformaciones de datos
  - Orquestación entre repositorios
  - Reglas de negocio
- **Qué NO hace**: ❌ Manejo de peticiones HTTP
- **Archivos**: `usuarioService.js`, `clienteService.js`, etc.

**Ejemplo**:
```javascript
// En Service:
async registrarUsuario(data) {
  // ✅ Validar email único
  // ✅ Validar contraseña fuerte
  // ✅ Hashear contraseña
  // ✅ Llamar al repositorio
}
```

### 4️⃣ **Controllers** (`src/controllers/`)
- **Función**: Manejo de peticiones HTTP
- **Qué hace**:
  - Recibir `req` y enviar `res`
  - Llamar al servicio
  - Formatear respuestas
  - Manejo básico de errores HTTP
- **Qué NO hace**: ❌ Lógica de negocio
- **Archivos**: `usuarioController.js`, `clienteController.js`, etc.

**Ejemplo**:
```javascript
// En Controller:
async registrar(req, res) {
  try {
    const usuario = await usuarioService.registrarUsuario(req.body);
    res.status(201).json({ success: true, data: usuario });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
```

### 5️⃣ **Routes** (`src/routes/`)
- **Función**: Definición de rutas HTTP
- **Qué hace**:
  - Mapear rutas a controladores
  - Aplicar middlewares específicos
  - Definir métodos HTTP
- **Archivos**: `usuarioRoutes.js`, `clienteRoutes.js`, etc.

**Ejemplo**:
```javascript
router.post('/registrar', usuarioController.registrar);
router.get('/:id', usuarioController.obtenerPerfil);
```

### 6️⃣ **Middlewares** (`src/middlewares/`)
- **Función**: Interceptores de peticiones
- **Tipos**:
  - **errorHandler.js** - Manejo global de errores
  - **validation.js** - Validación con Zod
  - **auth.js** - Autenticación JWT, autorización
  - **security.js** - CORS, rate limiting, headers de seguridad

---

## 📊 Flujo de una Petición HTTP

```
1. Cliente: POST /api/usuarios/registrar
    ↓
2. Express.js recibe la petición
    ↓
3. Middlewares (seguridad, validación, autenticación)
    ↓
4. Route (/api/usuarios) → Controller.registrar()
    ↓
5. Controller llama a Service.registrarUsuario()
    ↓
6. Service valida, ejecuta lógica de negocio
    ↓
7. Service llama a Repository.create()
    ↓
8. Repository ejecuta consulta Prisma
    ↓
9. Base de datos retorna datos
    ↓
10. Respuesta fluye hacia arriba con transformaciones
    ↓
11. Controller formatea respuesta JSON
    ↓
12. Cliente recibe: { success: true, data: usuario }
```

---

## 🚀 Cómo Usar

### 1. Instalación
```bash
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Editar .env con tus credenciales de BD
```

### 3. Ejecutar migraciones
```bash
npm run prisma:migrate
```

### 4. Iniciar el servidor
```bash
# Desarrollo (con hot reload)
npm run dev

# Producción
npm start
```

---

## 📝 Rutas Disponibles

### Usuarios
```
POST   /api/usuarios/registrar                    # Registrar usuario
GET    /api/usuarios                               # Listar usuarios
GET    /api/usuarios/:id                           # Obtener perfil
PUT    /api/usuarios/:id                           # Actualizar usuario
POST   /api/usuarios/:id/cambiar-contrasena       # Cambiar contraseña
PATCH  /api/usuarios/:id/desactivar               # Desactivar usuario
PATCH  /api/usuarios/:id/activar                  # Activar usuario
```

### Clientes
```
POST   /api/clientes                               # Crear cliente
GET    /api/clientes                               # Listar clientes
GET    /api/clientes/:id                           # Obtener cliente
PUT    /api/clientes/:id                           # Actualizar cliente
DELETE /api/clientes/:id                           # Eliminar cliente
PATCH  /api/clientes/:id/cambiar-estado           # Cambiar estado
```

### Productos
```
POST   /api/productos                              # Crear producto
GET    /api/productos                              # Listar productos
GET    /api/productos/stock-bajo                   # Stock bajo
GET    /api/productos/:id                          # Obtener producto
PUT    /api/productos/:id                          # Actualizar producto
DELETE /api/productos/:id                          # Eliminar producto
POST   /api/productos/:id/incrementar-stock        # Incrementar stock
POST   /api/productos/:id/decrementar-stock        # Decrementar stock
```

### Pedidos
```
POST   /api/pedidos                                # Crear pedido
GET    /api/pedidos                                # Listar pedidos
GET    /api/pedidos/:id                            # Obtener pedido
GET    /api/pedidos/cliente/:clienteId             # Pedidos del cliente
GET    /api/pedidos/reporte/ventas                 # Reporte de ventas
PATCH  /api/pedidos/:id/cancelar                   # Cancelar pedido
```

### Rutas
```
POST   /api/rutas                                  # Crear ruta
GET    /api/rutas                                  # Listar rutas
GET    /api/rutas/activas                          # Rutas activas
GET    /api/rutas/:id                              # Obtener ruta
GET    /api/rutas/usuario/:usuarioId               # Rutas del usuario
PUT    /api/rutas/:id                              # Actualizar ruta
DELETE /api/rutas/:id                              # Eliminar ruta
```

### Visitas
```
POST   /api/visitas                                # Registrar visita
GET    /api/visitas                                # Listar visitas
GET    /api/visitas/validas                        # Visitas válidas
GET    /api/visitas/:id                            # Obtener visita
GET    /api/visitas/ruta/:rutaId                   # Visitas por ruta
GET    /api/visitas/ruta/:rutaId/estadisticas     # Estadísticas
POST   /api/visitas/:id/validar                    # Validar visita
POST   /api/visitas/:id/observacion                # Agregar observación
```

### Comisiones
```
POST   /api/comisiones                             # Calcular comisión
GET    /api/comisiones                             # Listar comisiones
GET    /api/comisiones/:id                         # Obtener comisión
GET    /api/comisiones/reporte                     # Reporte de comisiones
GET    /api/comisiones/periodo                     # Comisiones por período
PATCH  /api/comisiones/:id/pagar                   # Pagar comisión
PATCH  /api/comisiones/:id/rechazar                # Rechazar comisión
```

---

## 💡 Buenas Prácticas

### ✅ DO's
- ✅ Una responsabilidad por capa
- ✅ Reutilizar métodos del repositorio
- ✅ Validar en el servicio
- ✅ Formatear respuestas en el controlador
- ✅ Usar middlewares para funcionalidad transversal
- ✅ Manejar errores apropiadamente

### ❌ DON'Ts
- ❌ No poner lógica de negocio en controller
- ❌ No hacer consultas directas en el controller
- ❌ No validar en el modelo
- ❌ No guardar conexión global sin singleton
- ❌ No mezclar responsabilidades

---

## 🔐 Seguridad

El proyecto incluye:
- ✅ Validación con Zod
- ✅ Autenticación JWT
- ✅ Rate limiting
- ✅ Headers de seguridad
- ✅ CORS configurado
- ✅ Manejo global de errores
- ✅ Encriptación de contraseñas con bcrypt

---

## 📦 Dependencias Principales

- **express** - Framework HTTP
- **@prisma/client** - ORM para BD
- **zod** - Validación de datos
- **jsonwebtoken** - Autenticación JWT
- **bcryptjs** - Encriptación de contraseñas
- **dotenv** - Gestión de variables de entorno

---

## 🎓 Conclusión

Esta arquitectura modular te permite:
- 🔄 Cambiar implementaciones fácilmente
- 🧪 Escribir tests más fácilmente
- 📈 Escalar la aplicación
- 👥 Colaborar en equipo más eficientemente
- 🐛 Debuggear problemas rápidamente

¡Felicidades! Tu proyecto está estructurado profesionalmente. 🎉
