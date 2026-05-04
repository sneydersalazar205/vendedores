# RutaSmart API + Frontend

Proyecto para la gestión de rutas comerciales, visitas y ventas con arquitectura por capas (Node.js + Express + Prisma) y frontend estático.

## 📁 Estructura del proyecto

```bash
public/
├── html/              # Vistas HTML
│   ├── index.html
│   ├── login.html
│   ├── admin.html
│   └── vendedor.html
├── css/               # Estilos
│   ├── admin.css
│   └── vendedor.css
└── js/                # Lógica frontend
    ├── api.js
    ├── admin.js
    └── vendedor.js

src/
├── controllers/       # Manejo HTTP
├── services/          # Lógica de negocio
├── repositories/      # Acceso a datos
├── routes/            # Definición endpoints
├── middlewares/       # Seguridad/errores/validación
├── models/            # Conexiones a BD
└── index.js           # Entrypoint backend
```

## 🧱 Arquitectura (resumen)

Flujo de petición:

1. `Route` recibe endpoint.
2. `Controller` procesa request/response.
3. `Service` aplica reglas de negocio.
4. `Repository` ejecuta consultas a BD.
5. `Model` expone Prisma/Pool.

## ✅ Requisitos

- Node.js 18+
- npm 9+
- Base de datos PostgreSQL/MySQL (según `prisma/schema.prisma`)

## ⚙️ Instalación

```bash
npm install
```

Crear `.env` con tus variables de entorno (base de datos, puerto, JWT, etc.).

## 🗄️ Base de datos

```bash
# Generar cliente Prisma
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) seed
node prisma/seed.js
```

## ▶️ Ejecución

```bash
# Desarrollo
npm run dev

# Producción
npm start
```

Servidor por defecto: `http://localhost:3000`

## 🌐 Frontend

Con `express.static('public')` se sirven los recursos estáticos.

- Inicio: `http://localhost:3000/html/index.html`
- Login: `http://localhost:3000/html/login.html`
- Panel admin: `http://localhost:3000/html/admin.html`
- Panel vendedor: `http://localhost:3000/html/vendedor.html`

## 🔌 Documentación de endpoints (API)

### Utilidades base

- Base URL: `http://localhost:3000`
- Health/API root: `GET /`

### Endpoints generales

- `GET /api/roles`
- `GET /api/estadosvisita`

### Recursos principales

- `/api/regiones`
- `/api/ciudades`
- `/api/sedes`
- `/api/usuarios`
- `/api/clientes`
- `/api/productos`
- `/api/pedidos`
- `/api/rutas`
- `/api/visitas`
- `/api/comisiones`

> Nota: cada recurso incluye operaciones CRUD y/o endpoints específicos según su router en `src/routes/`.

## 🧪 Pruebas de endpoints

### 1) Prueba rápida con scripts incluidos

```bash
bash test-api.sh
bash test-crud.sh
bash test-fix.sh
```

### 2) Prueba manual con cURL

#### API base

```bash
curl -X GET http://localhost:3000/
```

#### Listar roles

```bash
curl -X GET http://localhost:3000/api/roles
```

#### Listar usuarios

```bash
curl -X GET http://localhost:3000/api/usuarios
```

#### Crear cliente (ejemplo)

```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "Nombre": "Cliente Demo",
    "Documento": "12345678",
    "Telefono": "3000000000"
  }'
```

#### Crear producto (ejemplo)

```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "Nombre": "Producto Demo",
    "Precio": 10000,
    "Stock": 20
  }'
```

### 3) Pruebas con Postman

Importar colección:

- `Postman_Collection.json`

Pasos:

1. Abrir Postman.
2. Importar `Postman_Collection.json`.
3. Configurar variable `baseUrl` si aplica (`http://localhost:3000`).
4. Ejecutar la colección completa o por carpetas.

## 🛡️ Middlewares y seguridad

- CORS configurable.
- Headers de seguridad.
- Rate limiting.
- Manejo global de errores.
- Validación de JSON inválido.

## 📚 Archivos de apoyo recomendados

- `PRUEBAS_API.md`
- `GUIA_PRUEBAS.md`
- `QUICK_START.md`
- `ARQUITECTURA.md`
- `CONEXION_FRONTEND_BACKEND.md`

## 👥 Notas de uso

- Si accedes sin autenticación a vistas protegidas, el frontend redirige según lógica en `public/js/`.
- Verifica que la BD esté levantada antes de correr pruebas de endpoints.
