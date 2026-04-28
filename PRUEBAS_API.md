# 🧪 Pruebas de API - RutaSmart

## ✅ Verificar que el servidor está corriendo

```bash
curl -s http://localhost:3000 | jq
```

**Esperado**: Retorna JSON con endpoints disponibles

---

## 📝 USUARIOS

### Listar todos los usuarios
```bash
curl -X GET http://localhost:3000/api/usuarios | jq
```

### Obtener usuario por ID
```bash
curl -X GET http://localhost:3000/api/usuarios/1 | jq
```

### Registrar nuevo usuario
```bash
curl -X POST http://localhost:3000/api/usuarios/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "cedula": "1234567890",
    "telefono": "3001234567",
    "password": "password123",
    "idRol": 2
  }' | jq
```

### Actualizar usuario
```bash
curl -X PUT http://localhost:3000/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos",
    "apellido": "Pérez García"
  }' | jq
```

### Cambiar contraseña
```bash
curl -X POST http://localhost:3000/api/usuarios/1/cambiar-contrasena \
  -H "Content-Type: application/json" \
  -d '{
    "contrasenaAntigua": "password123",
    "contrasenaNueva": "newpassword456"
  }' | jq
```

### Desactivar usuario
```bash
curl -X PATCH http://localhost:3000/api/usuarios/1/desactivar | jq
```

### Activar usuario
```bash
curl -X PATCH http://localhost:3000/api/usuarios/1/activar | jq
```

---

## 👥 CLIENTES

### Listar todos los clientes
```bash
curl -X GET http://localhost:3000/api/clientes | jq
```

### Obtener cliente por ID
```bash
curl -X GET http://localhost:3000/api/clientes/1 | jq
```

### Crear nuevo cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Empresa XYZ",
    "telefono": "3105555555",
    "email": "info@empresa.com",
    "nit": "900123456-1",
    "direccion": "Carrera 45 #23-40",
    "ciudad": "Bogotá",
    "idEstadoCliente": 1
  }' | jq
```

### Actualizar cliente
```bash
curl -X PUT http://localhost:3000/api/clientes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Empresa XYZ Actualizada",
    "telefono": "3105555556"
  }' | jq
```

### Cambiar estado del cliente
```bash
curl -X PATCH http://localhost:3000/api/clientes/1/cambiar-estado \
  -H "Content-Type: application/json" \
  -d '{"estadoId": 2}' | jq
```

### Eliminar cliente
```bash
curl -X DELETE http://localhost:3000/api/clientes/1 | jq
```

---

## 📦 PRODUCTOS

### Listar todos los productos
```bash
curl -X GET http://localhost:3000/api/productos | jq
```

### Obtener producto por ID
```bash
curl -X GET http://localhost:3000/api/productos/1 | jq
```

### Crear nuevo producto
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto A",
    "descripcion": "Descripción del producto",
    "precio": 15000,
    "stock": 100,
    "idCategoria": 1,
    "idEstado": 1
  }' | jq
```

### Actualizar producto
```bash
curl -X PUT http://localhost:3000/api/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Producto A Actualizado",
    "precio": 16000
  }' | jq
```

### Productos con stock bajo
```bash
curl -X GET "http://localhost:3000/api/productos/stock-bajo?minStock=10" | jq
```

### Incrementar stock
```bash
curl -X POST http://localhost:3000/api/productos/1/incrementar-stock \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 50}' | jq
```

### Decrementar stock
```bash
curl -X POST http://localhost:3000/api/productos/1/decrementar-stock \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 10}' | jq
```

### Eliminar producto
```bash
curl -X DELETE http://localhost:3000/api/productos/1 | jq
```

---

## 🛒 PEDIDOS

### Listar todos los pedidos
```bash
curl -X GET http://localhost:3000/api/pedidos | jq
```

### Obtener pedido por ID
```bash
curl -X GET http://localhost:3000/api/pedidos/1 | jq
```

### Crear nuevo pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": 1,
    "observaciones": "Entrega urgente",
    "items": [
      {"idProducto": 1, "cantidad": 2, "precioUnitario": 15000},
      {"idProducto": 2, "cantidad": 1, "precioUnitario": 20000}
    ]
  }' | jq
```

### Cancelar pedido
```bash
curl -X PATCH http://localhost:3000/api/pedidos/1/cancelar | jq
```

### Pedidos por cliente
```bash
curl -X GET http://localhost:3000/api/pedidos/cliente/1 | jq
```

---

## 🗺️ RUTAS

### Listar todas las rutas
```bash
curl -X GET http://localhost:3000/api/rutas | jq
```

### Obtener ruta por ID
```bash
curl -X GET http://localhost:3000/api/rutas/1 | jq
```

### Crear nueva ruta
```bash
curl -X POST http://localhost:3000/api/rutas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ruta Centro - Zona 1",
    "descripcion": "Ruta de la zona central",
    "fechaInicio": "2026-04-27",
    "idVendedor": 1,
    "idEstado": 1
  }' | jq
```

### Actualizar ruta
```bash
curl -X PUT http://localhost:3000/api/rutas/1 \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Ruta Centro - Zona 1 Actualizada"}' | jq
```

### Obtener rutas activas
```bash
curl -X GET http://localhost:3000/api/rutas/activas | jq
```

### Eliminar ruta
```bash
curl -X DELETE http://localhost:3000/api/rutas/1 | jq
```

---

## 📍 VISITAS

### Listar todas las visitas
```bash
curl -X GET http://localhost:3000/api/visitas | jq
```

### Obtener visita por ID
```bash
curl -X GET http://localhost:3000/api/visitas/1 | jq
```

### Registrar nueva visita
```bash
curl -X POST http://localhost:3000/api/visitas \
  -H "Content-Type: application/json" \
  -d '{
    "idRuta": 1,
    "idCliente": 1,
    "comentarios": "Cliente satisfecho",
    "idEstado": 1
  }' | jq
```

### Obtener visitas válidas
```bash
curl -X GET http://localhost:3000/api/visitas/validas | jq
```

### Completar visita
```bash
curl -X PATCH http://localhost:3000/api/visitas/1/completar | jq
```

---

## 💰 COMISIONES

### Listar todas las comisiones
```bash
curl -X GET http://localhost:3000/api/comisiones | jq
```

### Obtener comisión por ID
```bash
curl -X GET http://localhost:3000/api/comisiones/1 | jq
```

### Calcular comisión
```bash
curl -X POST http://localhost:3000/api/comisiones/calcular \
  -H "Content-Type: application/json" \
  -d '{
    "visitaPedidoId": 1,
    "porcentaje": 5
  }' | jq
```

### Pagar comisión
```bash
curl -X PATCH http://localhost:3000/api/comisiones/1/pagar | jq
```

### Rechazar comisión
```bash
curl -X PATCH http://localhost:3000/api/comisiones/1/rechazar | jq
```

---

## 🔧 Script de Prueba Rápida

Crea un archivo `test-api.sh`:

```bash
#!/bin/bash

echo "🧪 Probando API de RutaSmart..."
echo ""

# Verificar servidor
echo "1️⃣ Verificando servidor..."
curl -s http://localhost:3000 | jq '.message'
echo ""

# Listar usuarios
echo "2️⃣ Listando usuarios..."
curl -s http://localhost:3000/api/usuarios | jq '.data | length'
echo ""

# Listar clientes
echo "3️⃣ Listando clientes..."
curl -s http://localhost:3000/api/clientes | jq '.data | length'
echo ""

# Listar productos
echo "4️⃣ Listando productos..."
curl -s http://localhost:3000/api/productos | jq '.data | length'
echo ""

# Listar rutas
echo "5️⃣ Listando rutas..."
curl -s http://localhost:3000/api/rutas | jq '.data | length'
echo ""

echo "✅ Pruebas completadas"
```

**Ejecutar**:
```bash
chmod +x test-api.sh
./test-api.sh
```

---

## 📊 Prueba con Thunder Client / Postman

1. **Importar colección**:
   - Crear colección en Postman/Thunder Client
   - Crear carpetas: Usuarios, Clientes, Productos, Pedidos, Rutas, Visitas, Comisiones
   - Importar los endpoints anteriores

2. **Configurar variables**:
   - `BASE_URL`: `http://localhost:3000`
   - `API_URL`: `http://localhost:3000/api`

3. **Ejecutar pruebas en orden**:
   - GET (Listar)
   - POST (Crear)
   - PUT (Actualizar)
   - DELETE (Eliminar)

---

## ⚠️ Errores Comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `ECONNREFUSED` | Servidor no está corriendo | Ejecuta `npm run dev` |
| `404 Not Found` | Ruta no existe | Verifica la URL |
| `400 Bad Request` | JSON inválido | Valida el JSON con `jq` |
| `500 Internal Server` | Error en la BD | Verifica `.env` y la conexión |

---

## 📝 Notas

- ✅ Todos los endpoints requieren `Content-Type: application/json`
- ✅ Use `jq` para formatear la salida JSON
- ✅ Copie el `curl` completo en la terminal
- ✅ Ajuste los IDs según los registros en tu BD
