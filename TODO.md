# TODO - Panel Admin Frontend Integration

## Estado Actual del Proyecto
- Backend: API REST con Express + Prisma + PostgreSQL
- Endpoints: usuarios, clientes, productos, pedidos, rutas, visitas, comisiones
- Frontend actual: `public/index.html` con CSS incrustado + `public/js/admin.js` con conexión básica a APIs
- El usuario proporcionó un HTML de referencia con diseño mejorado y datos mock

## Plan de Trabajo

### Paso 1: Separar CSS del HTML
- [ ] Extraer todo el CSS de `public/index.html` → `public/css/admin.css`
- [ ] Limpiar `public/index.html` para que solo tenga el markup y referencie el CSS externo

### Paso 2: Actualizar `public/index.html`
- [ ] Mantener la estructura del sidebar con todas las secciones del backend (Dashboard, Usuarios, Clientes, Productos, Pedidos, Rutas, Comisiones)
- [ ] Agregar las secciones faltantes que el usuario mostró en su HTML (Regiones, Ciudades, Sedes) pero marcándolas como "próximamente" o con datos mock
- [ ] Referenciar `admin.css` y los scripts correctamente

### Paso 3: Actualizar `public/js/admin.js`
- [ ] Implementar renderizado completo de todas las secciones:
  - Dashboard (con estadísticas reales de la API)
  - Usuarios (listar, crear, editar, activar/desactivar)
  - Clientes (listar, crear, editar, eliminar, cambiar estado)
  - Productos (listar, crear, editar, eliminar, incrementar/decrementar stock)
  - Pedidos (listar, crear, cancelar, ver detalle)
  - Rutas (listar, crear, editar, eliminar)
  - Comisiones (listar, calcular, pagar, rechazar)
- [ ] Agregar modales para crear/editar registros
- [ ] Implementar acciones CRUD conectadas a las APIs reales
- [ ] Manejar errores y mostrar notificaciones
- [ ] Implementar búsqueda y filtros

### Paso 4: Actualizar `public/js/api.js`
- [ ] Asegurar que todos los endpoints mapeen correctamente a las rutas del backend
- [ ] Agregar métodos faltantes si es necesario

### Paso 5: Probar integración
- [ ] Verificar que el servidor sirva correctamente los archivos estáticos
- [ ] Verificar que las llamadas a la API funcionen

## Dependencias
- No se requieren nuevas dependencias npm
- El servidor debe estar corriendo para probar las APIs

