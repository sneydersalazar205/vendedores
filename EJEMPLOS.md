# 📚 Ejemplos de Uso del API

## 🔐 Autenticación

### Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/usuarios/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "Contrasena": "Password123!",
    "Email": "usuario@example.com",
    "Nombre": "Juan",
    "Apellido": "Pérez",
    "Cedula": "123456789",
    "Telefono": "3001234567"
  }'
```

**Respuesta exitosa (201)**:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "IdUsuario": 1,
    "Contrasena": "$2a$10$hashedpassword...",
    "Email": "usuario@example.com",
    "Nombre": "Juan",
    "Apellido": "Pérez",
    "Cedula": "123456789",
    "Estado": "activo",
    "fechaCreacion": "2026-04-26T10:00:00Z",
    "rol": null,
    "sede": null
  }
}
```

### Cambiar Contraseña
```bash
curl -X POST http://localhost:3000/api/usuarios/1/cambiar-contrasena \
  -H "Content-Type: application/json" \
  -d '{
    "contrasenaAntigua": "Password123!",
    "contrasenaNueva": "NewPassword456!"
  }'
```

---

## 👥 Gestión de Clientes

### Crear Cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "Cedula": "987654321",
    "PrimerNombre": "Carlos",
    "PrimerApellido": "García",
    "Telefono": "3009876543",
    "Email": "carlos@example.com"
  }'
```

**Respuesta**:
```json
{
  "success": true,
  "message": "Cliente creado exitosamente",
  "data": {
    "IdCliente": 1,
    "Cedula": "987654321",
    "PrimerNombre": "Carlos",
    "SegundoNombre": null,
    "PrimerApellido": "García",
    "Telefono": "3009876543",
    "Email": "carlos@example.com",
    "IdEstadoCliente": null,
    "fechaCreacion": "2026-04-26T10:00:00Z",
    "estadocliente": null
  }
}
```

### Listar Clientes
```bash
curl http://localhost:3000/api/clientes
```

### Obtener Cliente Específico
```bash
curl http://localhost:3000/api/clientes/1
```

### Actualizar Cliente
```bash
curl -X PUT http://localhost:3000/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "Telefono": "3001111111",
    "Email": "newemail@example.com"
  }'
```

### Cambiar Estado del Cliente
```bash
curl -X PATCH http://localhost:3000/api/clientes/1/cambiar-estado \
  -H "Content-Type: application/json" \
  -d '{
    "estadoId": 2
  }'
```

---

## 📦 Gestión de Productos

### Crear Producto
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "Codigo": "PROD001",
    "Nombre": "Laptop",
    "Descripcion": "Laptop de alta performance",
    "Precio": 1500.00,
    "Stock": 50,
    "IdCategoria": 1
  }'
```

### Obtener Productos con Stock Bajo
```bash
curl "http://localhost:3000/api/productos/stock-bajo?minStock=20"
```

### Incrementar Stock
```bash
curl -X POST http://localhost:3000/api/productos/1/incrementar-stock \
  -H "Content-Type: application/json" \
  -d '{
    "cantidad": 10
  }'
```

### Decrementar Stock
```bash
curl -X POST http://localhost:3000/api/productos/1/decrementar-stock \
  -H "Content-Type: application/json" \
  -d '{
    "cantidad": 5
  }'
```

---

## 🛒 Gestión de Pedidos

### Crear Pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "clienteId": 1,
    "items": [
      {
        "IdProducto": 1,
        "Cantidad": 2
      },
      {
        "IdProducto": 2,
        "Cantidad": 1
      }
    ],
    "observaciones": "Entregar entre 9-17 horas"
  }'
```

### Obtener Pedidos del Cliente
```bash
curl http://localhost:3000/api/pedidos/cliente/1
```

### Reporte de Ventas por Período
```bash
curl "http://localhost:3000/api/pedidos/reporte/ventas?startDate=2026-01-01&endDate=2026-12-31"
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "totalVentas": 15000.50,
    "cantidadPedidos": 25,
    "promedioVenta": "600.02"
  }
}
```

### Cancelar Pedido
```bash
curl -X PATCH http://localhost:3000/api/pedidos/1/cancelar
```

---

## 🗺️ Gestión de Rutas

### Crear Ruta
```bash
curl -X POST http://localhost:3000/api/rutas \
  -H "Content-Type: application/json" \
  -d '{
    "Nombre": "Ruta Centro",
    "Fecha": "2026-04-27",
    "origen_lat": 4.7110,
    "origen_lng": -74.0721,
    "Estado": 1
  }'
```

### Obtener Rutas Activas
```bash
curl http://localhost:3000/api/rutas/activas
```

### Obtener Rutas de un Usuario
```bash
curl http://localhost:3000/api/rutas/usuario/1
```

### Actualizar Ruta
```bash
curl -X PUT http://localhost:3000/api/rutas/1 \
  -H "Content-Type: application/json" \
  -d '{
    "Nombre": "Ruta Centro Actualizada",
    "Estado": 1
  }'
```

---

## 📍 Gestión de Visitas

### Registrar Visita
```bash
curl -X POST http://localhost:3000/api/visitas \
  -H "Content-Type: application/json" \
  -d '{
    "IdRutaDetalle": 1,
    "IdRutaUsuario": 1,
    "Latitud": 4.7169,
    "Longitud": -74.0723,
    "Observacion": "Cliente no estaba disponible"
  }'
```

### Validar Visita (Geolocalización)
```bash
curl -X POST http://localhost:3000/api/visitas/1/validar \
  -H "Content-Type: application/json" \
  -d '{
    "latitudReal": 4.7170,
    "longitudReal": -74.0724
  }'
```

**Respuesta**:
```json
{
  "success": true,
  "message": "Visita validada",
  "data": {
    "IdVisita": 1,
    "EsValida": true,
    "DistanciaErrorMetros": 12.5,
    "FechaHora": "2026-04-26T10:00:00Z"
  }
}
```

### Obtener Estadísticas de Visitas
```bash
curl http://localhost:3000/api/visitas/ruta/1/estadisticas
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "totalVisitas": 15,
    "visitasValidas": 14,
    "visitasInvalidas": 1,
    "distanciaPromedioError": "8.75"
  }
}
```

### Agregar Observación a Visita
```bash
curl -X POST http://localhost:3000/api/visitas/1/observacion \
  -H "Content-Type: application/json" \
  -d '{
    "observacion": "Cliente solicitó factura"
  }'
```

---

## 💰 Gestión de Comisiones

### Calcular Comisión
```bash
curl -X POST http://localhost:3000/api/comisiones \
  -H "Content-Type: application/json" \
  -d '{
    "visitaPedidoId": 1,
    "porcentaje": 5
  }'
```

### Obtener Comisiones por Período
```bash
curl "http://localhost:3000/api/comisiones/periodo?startDate=2026-01-01&endDate=2026-12-31"
```

### Reporte de Comisiones
```bash
curl "http://localhost:3000/api/comisiones/reporte?startDate=2026-01-01&endDate=2026-12-31"
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "totalComisiones": 5000.50,
    "cantidadComisiones": 50,
    "promedioComision": "100.01"
  }
}
```

### Pagar Comisión
```bash
curl -X PATCH http://localhost:3000/api/comisiones/1/pagar
```

### Rechazar Comisión
```bash
curl -X PATCH http://localhost:3000/api/comisiones/1/rechazar
```

---

## 🔧 Herramientas Recomendadas

### Para Probar APIs:
- **Postman** - GUI completa para testing
- **Insomnia** - Alternativa a Postman
- **Thunder Client** - Extensión VS Code
- **curl** - Terminal (como en los ejemplos)

### Para Desarrollo:
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo (con hot reload)
npm run dev

# Ver logs de consultas a BD
# En prisma.js las consultas están loggadas
```

---

## ⚠️ Errores Comunes

### Error: "Violation of unique constraint"
```json
{
  "success": false,
  "message": "Violation of unique constraint",
  "field": "Email"
}
```
**Solución**: El email ya existe en la BD.

### Error: "Record not found"
```json
{
  "success": false,
  "message": "Record not found"
}
```
**Solución**: El ID no existe. Verifica que sea válido.

### Error: "Too many requests"
```json
{
  "success": false,
  "message": "Too many requests, please try again later"
}
```
**Solución**: Rate limiter activo. Espera 15 minutos.

---

## 📖 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/nombre_db"
PORT=3000
JWT_SECRET="tu_clave_secreta_super_segura_123"
NODE_ENV=development
```

---

¡Listo! Ya puedes empezar a usar tu API modular. 🚀
