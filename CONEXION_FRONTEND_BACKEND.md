# 🔗 Guía de Conexión Frontend - Backend

## ✅ Cambios Realizados

### Backend (src/)

#### 1. Nuevos Endpoints de Autenticación en `usuarioController.js`
- **POST /api/usuarios/login** - Autentica usuario y retorna JWT token
- **GET /api/usuarios/profile** - Obtiene perfil del usuario autenticado

#### 2. Servicio de Login en `usuarioService.js`
```javascript
async loginUsuario(email, password) {
  // Busca usuario por email
  // Valida contraseña con bcrypt
  // Retorna usuario completo
}
```

#### 3. Rutas Reordenadas en `usuarioRoutes.js`
```javascript
// Rutas específicas ANTES de dinámicas para evitar conflictos
router.post('/registrar', ...);
router.post('/login', ...);        // ✅ NUEVA
router.get('/profile', ...);       // ✅ NUEVA
router.get('/:id', ...);           // Dinámico
```

#### 4. Corrección de Rutas en otros módulos
- **productoRoutes.js**: `/stock-bajo` antes de `/:id`
- **pedidoRoutes.js**: `/reporte/ventas` y `/cliente/:clienteId` antes de `/:id`
- **rutaRoutes.js**: `/activas` y `/usuario/:usuarioId` antes de `/:id`
- **visitaRoutes.js**: `/validas` y `/ruta/:rutaId/*` antes de `/:id`
- **comisionRoutes.js**: `/reporte` y `/periodo` antes de `/:id`

---

## 🎯 Frontend (public/)

### APIClient (api.js)
```javascript
class APIClient {
  constructor() {
    this.baseURL = 'http://localhost:3000/api';
    this.token = localStorage.getItem('token') || null;
  }

  // Métodos principales
  async login(email, password)        // Retorna { token, data }
  async getProfile()                  // Retorna { data: usuario }
  async logout()                      // Limpia token
}
```

### Login Page (login.html)
```html
<!-- Flow: Email/Pass → API Login → Guarda token → Redirige a /index.html -->
```

### Admin Panel (admin.html + admin.js)
```javascript
// Al cargar:
1. Verifica si hay token (si no → redirige a /login.html)
2. Llama a api.getProfile() para mostrar datos del usuario
3. Maneja menú de navegación (dashboard, usuarios, rutas, etc.)
```

### Vendor Panel (vendedor.html + vendedor.js)
```javascript
// Al cargar:
1. Carga info del usuario desde localStorage
2. Muestra ruta del vendedor
3. Permite crear clientes
```

---

## 📝 Nombres de Campos en Backend (PascalCase)

### Usuario
```javascript
{
  IdUsuario: number,
  Email: string,
  Contrasena: string,
  Nombre: string,
  Apellido: string,
  Cedula: string,
  Telefono: string,
  IdRol: number,
  IdSede: number,
  Estado: string,
  fechaCreacion: date
}
```

### Cliente
```javascript
{
  IdCliente: number,
  PrimerNombre: string,
  SegundoNombre: string,
  PrimerApellido: string,
  Email: string,
  Cedula: string,
  Telefono: string,
  IdEstadoCliente: number
}
```

### Producto
```javascript
{
  IdProducto: number,
  Codigo: string,
  Nombre: string,
  Precio: number,
  Stock: number
}
```

---

## 🚀 Flujo de Autenticación

```
1. Usuario abre /login.html
   ↓
2. Ingresa Email + Password
   ↓
3. Frontend: api.login(email, password)
   ↓
4. Backend: POST /api/usuarios/login
   ├─ Busca usuario por email
   ├─ Valida contraseña con bcrypt
   ├─ Genera JWT token
   └─ Retorna { token, data: {...usuario} }
   ↓
5. Frontend: localStorage.setItem('token', token)
   ↓
6. Redirige a /index.html
   ↓
7. Admin/Vendedor panel carga
   ├─ api.getProfile() obtiene datos del usuario
   ├─ Muestra nombre en navbar
   └─ Activa acceso a endpoints autenticados
```

---

## 🔑 Variables de Autenticación

### Frontend (localStorage)
```javascript
localStorage.getItem('token')        // JWT token
localStorage.getItem('userName')     // Nombre del usuario
```

### Backend (Headers)
```javascript
Authorization: Bearer {token}        // Enviado en cada request
```

---

## 🧪 Pruebas Rápidas

### 1. Test de Login (Postman)
```
POST http://localhost:3000/api/usuarios/login
Content-Type: application/json

{
  "Email": "usuario@example.com",
  "Contrasena": "password123"
}

Respuesta:
{
  "success": true,
  "token": "eyJhbGc...",
  "data": { IdUsuario, Email, Nombre, ... }
}
```

### 2. Test de Profile (Postman)
```
GET http://localhost:3000/api/usuarios/profile
Authorization: Bearer {token}

Respuesta:
{
  "success": true,
  "data": { IdUsuario, Email, Nombre, ... }
}
```

### 3. Desde Frontend (Console)
```javascript
const api = new APIClient();
const res = await api.login('usuario@example.com', 'password123');
console.log(res); // Debe tener { success: true, token, data }
```

---

## ⚙️ Configuración Necesaria

### .env
```
DATABASE_URL=tu_conexion_db
JWT_SECRET=tu_clave_secreta
PORT=3000
```

### package.json
```json
{
  "type": "module",
  "scripts": {
    "dev": "node --watch src/index.js",
    "start": "node src/index.js"
  },
  "dependencies": {
    "express": "^4.x",
    "prisma": "^5.x",
    "@prisma/client": "^5.x",
    "bcryptjs": "^2.x",
    "jsonwebtoken": "^9.x",
    "cors": "^2.x"
  }
}
```

---

## 🐛 Problemas Comunes y Soluciones

### Error: "Invalid value provided. Expected Int, provided String"
**Causa**: Pasando string en lugar de número para IDs
**Solución**: Usar `parseInt()` en el frontend antes de enviar

```javascript
// ❌ Mal
const id = "123";
api.obtenerCliente(id);

// ✅ Bien
const id = parseInt("123");
api.obtenerCliente(id);
```

### Error: "No token provided"
**Causa**: Token no se está enviando en headers
**Solución**: Verificar que APIClient agrega `Authorization: Bearer {token}`

```javascript
// En api.js, método request()
if (this.token) {
  headers['Authorization'] = `Bearer ${this.token}`;
}
```

### Error: "Email already registered"
**Causa**: Intentando crear usuario con email duplicado
**Solución**: Usar email único o validar antes

### Página blanca después de login
**Causa**: admin.html no existe o rutas de navegación mal configuradas
**Solución**: Verificar que admin.html y vendedor.html existen en /public

---

## 📚 Endpoints Principales Conectados

### Autenticación
- ✅ POST `/api/usuarios/login`
- ✅ GET `/api/usuarios/profile`
- ✅ POST `/api/usuarios/registrar`

### Usuarios
- ✅ GET `/api/usuarios`
- ✅ GET `/api/usuarios/:id`
- ✅ PUT `/api/usuarios/:id`
- ✅ POST `/api/usuarios/:id/cambiar-contrasena`
- ✅ PATCH `/api/usuarios/:id/desactivar`
- ✅ PATCH `/api/usuarios/:id/activar`

### Clientes
- ✅ POST `/api/clientes`
- ✅ GET `/api/clientes`
- ✅ GET `/api/clientes/:id`
- ✅ PUT `/api/clientes/:id`
- ✅ DELETE `/api/clientes/:id`
- ✅ PATCH `/api/clientes/:id/cambiar-estado`

### Productos
- ✅ POST `/api/productos`
- ✅ GET `/api/productos`
- ✅ GET `/api/productos/stock-bajo`
- ✅ GET `/api/productos/:id`
- ✅ PUT `/api/productos/:id`
- ✅ DELETE `/api/productos/:id`
- ✅ POST `/api/productos/:id/incrementar-stock`
- ✅ POST `/api/productos/:id/decrementar-stock`

### Pedidos
- ✅ POST `/api/pedidos`
- ✅ GET `/api/pedidos`
- ✅ GET `/api/pedidos/reporte/ventas`
- ✅ GET `/api/pedidos/:id`
- ✅ GET `/api/pedidos/cliente/:clienteId`
- ✅ PATCH `/api/pedidos/:id/cancelar`

### Rutas
- ✅ POST `/api/rutas`
- ✅ GET `/api/rutas`
- ✅ GET `/api/rutas/activas`
- ✅ GET `/api/rutas/:id`
- ✅ GET `/api/rutas/usuario/:usuarioId`
- ✅ PUT `/api/rutas/:id`
- ✅ DELETE `/api/rutas/:id`

### Visitas
- ✅ POST `/api/visitas`
- ✅ GET `/api/visitas`
- ✅ GET `/api/visitas/validas`
- ✅ GET `/api/visitas/:id`
- ✅ GET `/api/visitas/ruta/:rutaId`
- ✅ GET `/api/visitas/ruta/:rutaId/estadisticas`
- ✅ POST `/api/visitas/:id/validar`
- ✅ POST `/api/visitas/:id/observacion`

### Comisiones
- ✅ POST `/api/comisiones`
- ✅ GET `/api/comisiones`
- ✅ GET `/api/comisiones/reporte`
- ✅ GET `/api/comisiones/periodo`
- ✅ GET `/api/comisiones/:id`
- ✅ PATCH `/api/comisiones/:id/pagar`
- ✅ PATCH `/api/comisiones/:id/rechazar`

---

## ✨ Next Steps

1. **Iniciar servidor**: `npm run dev`
2. **Pruebas en Postman**: Importar [Postman_Collection.json](Postman_Collection.json)
3. **Registrar usuario prueba** (si no existe):
   ```
   POST /api/usuarios/registrar
   {
     "Email": "admin@test.com",
     "Contrasena": "Admin123*",
     "Nombre": "Admin",
     "Apellido": "Test",
     "IdRol": 1
   }
   ```
4. **Login desde frontend**: Abrir http://localhost:3000/login.html
5. **Validar panel admin**: Debe mostrar dashboard con datos

---

**Última actualización**: 28 de Abril, 2026
**Autor**: Sistema de Gestión RutaSmart
