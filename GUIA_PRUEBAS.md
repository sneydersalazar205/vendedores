# 🧪 Guía de Pruebas de API - RutaSmart

## 📋 Contenido
1. [Verificación Inicial](#verificación-inicial)
2. [Pruebas por Módulo](#pruebas-por-módulo)
3. [Ejemplos de Curl](#ejemplos-de-curl)
4. [Scripts Disponibles](#scripts-disponibles)

---

## Verificación Inicial

### Paso 1: Verificar que el servidor está corriendo

```bash
# En una terminal
cd /mnt/datos/proyectos/prisma
npm run dev

# Debería ver: 🚀 Servidor ejecutándose en http://localhost:3000
```

### Paso 2: Verificar conectividad

```bash
curl -s http://localhost:3000 | jq
```

**Respuesta esperada**:
```json
{
  "success": true,
  "message": "API de Gestión de Rutas y Ventas",
  "version": "1.0.0",
  "endpoints": {
    "usuarios": "/api/usuarios",
    "clientes": "/api/clientes",
    ...
  }
}
```

---

## Pruebas por Módulo

### 📝 USUARIOS

#### 1. Listar todos los usuarios
```bash
curl -X GET http://localhost:3000/api/usuarios | jq
```

**Esperado**: Array de usuarios con sus datos

#### 2. Obtener usuario específico
```bash
# Reemplaza 1 con un ID real
curl -X GET http://localhost:3000/api/usuarios/1 | jq '.data'
```

**Campos esperados**:
- `IdUsuario` o `id`
- `nombre`, `apellido`
- `email`, `cedula`
- `estado`

#### 3. Registrar nuevo usuario
```bash
curl -X POST http://localhost:3000/api/usuarios/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos",
    "apellido": "Mendoza",
    "email": "carlos@example.com",
    "cedula": "1234567890",
    "telefono": "3001234567",
    "password": "miPassword123",
    "idRol": 2
  }' | jq
```

**Respuesta esperada**:
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "IdUsuario": 10,
    "nombre": "Carlos",
    ...
  }
}
```

#### 4. Cambiar contraseña
```bash
curl -X POST http://localhost:3000/api/usuarios/1/cambiar-contrasena \
  -H "Content-Type: application/json" \
  -d '{
    "contrasenaAntigua": "miPassword123",
    "contrasenaNueva": "newPassword456"
  }' | jq
```

#### 5. Activar/Desactivar usuario
```bash
# Desactivar
curl -X PATCH http://localhost:3000/api/usuarios/1/desactivar | jq

# Activar
curl -X PATCH http://localhost:3000/api/usuarios/1/activar | jq
```

---

### 👥 CLIENTES

#### 1. Listar clientes
```bash
curl -X GET http://localhost:3000/api/clientes | jq '.data | length'
```

**Mostrará**: Número total de clientes

#### 2. Crear cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Empresa XYZ",
    "telefono": "3105555555",
    "email": "info@xyz.com",
    "nit": "900123456-1",
    "direccion": "Carrera 45 #23-40",
    "ciudad": "Bogotá",
    "idEstadoCliente": 1
  }' | jq '.data.IdCliente'
```

**Guarda el ID** para pruebas posteriores

#### 3. Obtener cliente por ID
```bash
# Usa el ID obtenido en paso anterior
curl -X GET http://localhost:3000/api/clientes/1 | jq '.data'
```

#### 4. Actualizar cliente
```bash
curl -X PUT http://localhost:3000/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Empresa XYZ Actualizada",
    "telefono": "3105555556"
  }' | jq '.success'
```

#### 5. Cambiar estado del cliente
```bash
# Estados disponibles: 1 (Activo), 2 (Inactivo), etc.
curl -X PATCH http://localhost:3000/api/clientes/1/cambiar-estado \
  -H "Content-Type: application/json" \
  -d '{"estadoId": 2}' | jq
```

#### 6. Eliminar cliente
```bash
curl -X DELETE http://localhost:3000/api/clientes/1 | jq '.success'
```

---

### 📦 PRODUCTOS

#### 1. Listar productos
```bash
curl -X GET http://localhost:3000/api/productos | jq '.data | length'
```

#### 2. Crear producto
```bash
PRODUCT_RESPONSE=$(curl -s -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop XPS 15",
    "descripcion": "Laptop profesional de alta gama",
    "precio": 2500000,
    "stock": 10,
    "idCategoria": 1,
    "idEstadoProducto": 1
  }')

echo "$PRODUCT_RESPONSE" | jq '.data.IdProducto'
```

#### 3. Productos con stock bajo
```bash
curl -X GET "http://localhost:3000/api/productos/stock-bajo?minStock=5" | jq '.data | length'
```

#### 4. Incrementar stock
```bash
curl -X POST http://localhost:3000/api/productos/1/incrementar-stock \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 50}' | jq '.data.stock'
```

#### 5. Decrementar stock
```bash
curl -X POST http://localhost:3000/api/productos/1/decrementar-stock \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 5}' | jq '.data.stock'
```

---

### 🛒 PEDIDOS

#### 1. Listar pedidos
```bash
curl -X GET http://localhost:3000/api/pedidos | jq '.data | length'
```

#### 2. Crear pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": 1,
    "observaciones": "Entrega urgente",
    "items": [
      {
        "idProducto": 1,
        "cantidad": 2,
        "precioUnitario": 15000
      }
    ]
  }' | jq '.data.IdPedido'
```

#### 3. Obtener pedidos de un cliente
```bash
curl -X GET http://localhost:3000/api/pedidos/cliente/1 | jq '.data | length'
```

#### 4. Detalles de un pedido
```bash
curl -X GET http://localhost:3000/api/pedidos/1 | jq '.data | {id: .IdPedido, cliente: .cliente.nombre, total: .Total}'
```

---

### 🗺️ RUTAS

#### 1. Listar rutas
```bash
curl -X GET http://localhost:3000/api/rutas | jq '.data | length'
```

#### 2. Crear ruta
```bash
RUTA_RESPONSE=$(curl -s -X POST http://localhost:3000/api/rutas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ruta Centro - Zona 1",
    "descripcion": "Ruta de la zona central de la ciudad",
    "fechaInicio": "2026-04-27",
    "idVendedor": 1,
    "idEstadoRuta": 1
  }')

echo "$RUTA_RESPONSE" | jq '.data.IdRuta'
```

#### 3. Rutas activas
```bash
curl -X GET http://localhost:3000/api/rutas/activas | jq '.data | length'
```

#### 4. Detalles de una ruta
```bash
curl -X GET http://localhost:3000/api/rutas/1 | jq '.data | {nombre, vendedor: .usuario.nombre, estado: .estado}'
```

---

### 📍 VISITAS

#### 1. Listar visitas
```bash
curl -X GET http://localhost:3000/api/visitas | jq '.data | length'
```

#### 2. Crear visita
```bash
curl -X POST http://localhost:3000/api/visitas \
  -H "Content-Type: application/json" \
  -d '{
    "idRuta": 1,
    "idCliente": 1,
    "comentarios": "Cliente satisfecho con la compra",
    "idEstadoVisita": 1
  }' | jq '.data.IdVisita'
```

#### 3. Visitas válidas
```bash
curl -X GET http://localhost:3000/api/visitas/validas | jq '.data | length'
```

---

### 💰 COMISIONES

#### 1. Listar comisiones
```bash
curl -X GET http://localhost:3000/api/comisiones | jq '.data | length'
```

#### 2. Calcular comisión
```bash
curl -X POST http://localhost:3000/api/comisiones/calcular \
  -H "Content-Type: application/json" \
  -d '{
    "visitaPedidoId": 1,
    "porcentaje": 5
  }' | jq '.data.monto'
```

#### 3. Pagar comisión
```bash
curl -X PATCH http://localhost:3000/api/comisiones/1/pagar | jq '.data.estado'
```

---

## Ejemplos de Curl

### Ejemplo 1: Workflow Completo en Bash

```bash
#!/bin/bash

# Variables
BASE="http://localhost:3000/api"
CLIENTE_ID=1
PRODUCTO_ID=1

echo "1. Obteniendo cliente..."
curl -s "$BASE/clientes/$CLIENTE_ID" | jq '.data.nombre'

echo "2. Obteniendo producto..."
curl -s "$BASE/productos/$PRODUCTO_ID" | jq '.data.nombre, .data.precio'

echo "3. Creando pedido..."
PEDIDO=$(curl -s -X POST "$BASE/pedidos" \
  -H "Content-Type: application/json" \
  -d "{
    \"idCliente\": $CLIENTE_ID,
    \"items\": [{\"idProducto\": $PRODUCTO_ID, \"cantidad\": 2, \"precioUnitario\": 15000}]
  }")

PEDIDO_ID=$(echo "$PEDIDO" | jq '.data.IdPedido')
echo "Pedido creado: $PEDIDO_ID"

echo "4. Obteniendo detalles del pedido..."
curl -s "$BASE/pedidos/$PEDIDO_ID" | jq '.data | {cliente: .cliente.nombre, total: .Total}'
```

### Ejemplo 2: Prueba con Jq avanzado

```bash
# Listar todos los usuarios con su rol
curl -s http://localhost:3000/api/usuarios | jq '.data[] | {nombre, email, rol}'

# Contar clientes por estado
curl -s http://localhost:3000/api/clientes | jq 'group_by(.estado) | map({estado: .[0].estado, count: length})'

# Productos con precio > 100000
curl -s http://localhost:3000/api/productos | jq '.data[] | select(.precio > 100000) | {nombre, precio}'
```

---

## Scripts Disponibles

### 1. test-api.sh
**Uso**: Pruebas rápidas de conectividad y conteo de registros

```bash
chmod +x test-api.sh
./test-api.sh
```

**Verifica**:
- Servidor disponible
- Endpoints respondiendo
- Cantidad de registros en cada tabla

### 2. test-crud.sh
**Uso**: Pruebas completas de CREATE, READ, UPDATE, DELETE

```bash
chmod +x test-crud.sh
./test-crud.sh
```

**Prueba**:
- Crear clientes
- Crear productos
- Crear pedidos
- Crear rutas
- Crear visitas

---

## 📊 Checklist de Pruebas

### Para cada módulo:
- [ ] GET (Listar) - ¿Devuelve array?
- [ ] GET by ID - ¿Devuelve un registro?
- [ ] POST (Crear) - ¿Devuelve ID?
- [ ] PUT (Actualizar) - ¿Actualiza correctamente?
- [ ] DELETE (Eliminar) - ¿Se elimina?
- [ ] Validaciones - ¿Rechaza datos inválidos?

### Validaciones:
- [ ] Email válido
- [ ] Teléfono formato correcto
- [ ] NIT formato correcto
- [ ] Fechas válidas
- [ ] Números positivos
- [ ] Campos requeridos

---

## ⚠️ Problemas Comunes

### Problema: `ECONNREFUSED`
**Causa**: Servidor no está corriendo
**Solución**: 
```bash
npm run dev
```

### Problema: `Cannot read property 'data' of null`
**Causa**: Respuesta no es JSON válido
**Solución**: 
```bash
curl -s URL | jq '.'
```

### Problema: `400 Bad Request`
**Causa**: JSON inválido
**Solución**: Validar JSON con https://jsonlint.com/

### Problema: `404 Not Found`
**Causa**: ID no existe
**Solución**: Verificar IDs válidos primero con GET (Listar)

### Problema: `500 Internal Server Error`
**Causa**: Error en la base de datos
**Solución**: Verificar conexión a BD y migración de Prisma

---

## 🔗 Referencias Útiles

- **JQ Manual**: https://stedolan.github.io/jq/
- **Curl Documentation**: https://curl.se/docs/
- **HTTP Status Codes**: https://httpwg.org/specs/rfc7231.html
- **JSON Schema**: https://json-schema.org/

---

## 💡 Tips Importantes

✅ **Siempre usar `-s` con curl** para salida limpia
✅ **Usar `jq` para formatear JSON** y navegarlo
✅ **Guardar IDs en variables** para pruebas encadenadas
✅ **Probar listar ANTES de obtener por ID**
✅ **Verificar status HTTP**: `curl -w "\nHTTP Status: %{http_code}\n" URL`

---

## 🎯 Próximos Pasos

1. Ejecuta `./test-api.sh` para verificar conectividad
2. Ejecuta `./test-crud.sh` para pruebas CRUD
3. Personaliza los scripts para tus necesidades
4. Integra con Postman/Thunder Client para UI
5. Configura CI/CD con estos scripts
