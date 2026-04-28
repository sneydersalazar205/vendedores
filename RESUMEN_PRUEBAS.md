# ✅ Resumen de Pruebas de API - RutaSmart

## 📊 Estado Actual

✅ **Servidor**: Corriendo en `http://localhost:3000`
✅ **Base de datos**: Conectada a PostgreSQL (Supabase)
✅ **Endpoints**: 7 módulos principales activos
✅ **Datos**: Servidor con 5 usuarios, 7 clientes, 20 productos, 5 rutas

---

## 🚀 Cómo Empezar

### Terminal 1: Iniciar servidor
```bash
cd /mnt/datos/proyectos/prisma
npm run dev
```

### Terminal 2: Ejecutar pruebas

#### Opción A: Pruebas rápidas
```bash
./test-api.sh
```
**Duración**: ~5 segundos  
**Verifica**: Conectividad y conteo de registros

#### Opción B: Pruebas completas CRUD
```bash
chmod +x test-crud.sh
./test-crud.sh
```
**Duración**: ~15 segundos  
**Verifica**: Crear, leer, actualizar, eliminar en todos los módulos

#### Opción C: Pruebas manuales
```bash
# Ver todos los usuarios
curl -s http://localhost:3000/api/usuarios | jq

# Ver primer cliente
curl -s http://localhost:3000/api/clientes/1 | jq '.data'

# Ver productos
curl -s http://localhost:3000/api/productos | jq '.data | length'
```

---

## 📁 Archivos de Referencia Disponibles

| Archivo | Descripción | Uso |
|---------|-------------|-----|
| `PRUEBAS_API.md` | Catálogo completo de endpoints | Copiar-pegar curl |
| `GUIA_PRUEBAS.md` | Guía paso a paso por módulo | Aprender a probar |
| `test-api.sh` | Script de pruebas rápidas | `./test-api.sh` |
| `test-crud.sh` | Script de CRUD completo | `./test-crud.sh` |

---

## 🧪 Módulos Disponibles

### 1. **USUARIOS** (5 disponibles)
- ✅ Listar usuarios
- ✅ Obtener usuario
- ✅ Registrar usuario
- ✅ Actualizar usuario
- ✅ Cambiar contraseña
- ✅ Activar/Desactivar

### 2. **CLIENTES** (7 disponibles)
- ✅ Listar clientes
- ✅ Obtener cliente
- ✅ Crear cliente
- ✅ Actualizar cliente
- ✅ Cambiar estado
- ✅ Eliminar cliente

### 3. **PRODUCTOS** (20 disponibles)
- ✅ Listar productos
- ✅ Obtener producto
- ✅ Crear producto
- ✅ Actualizar producto
- ✅ Stock bajo
- ✅ Incrementar stock
- ✅ Decrementar stock
- ✅ Eliminar producto

### 4. **PEDIDOS** (0 iniciales)
- ✅ Listar pedidos
- ✅ Crear pedido
- ✅ Obtener pedido
- ✅ Por cliente
- ✅ Cancelar

### 5. **RUTAS** (5 disponibles)
- ✅ Listar rutas
- ✅ Crear ruta
- ✅ Obtener ruta
- ✅ Rutas activas
- ✅ Actualizar ruta
- ✅ Eliminar ruta

### 6. **VISITAS** (0 iniciales)
- ✅ Listar visitas
- ✅ Crear visita
- ✅ Obtener visita
- ✅ Visitas válidas
- ✅ Completar visita

### 7. **COMISIONES** (0 iniciales)
- ✅ Listar comisiones
- ✅ Calcular comisión
- ✅ Obtener comisión
- ✅ Pagar comisión
- ✅ Rechazar comisión

---

## 📋 Ejemplos Rápidos

### Prueba 1: Listar Usuarios
```bash
curl -s http://localhost:3000/api/usuarios | jq '.data[0]'
```

### Prueba 2: Crear Cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Mi Empresa",
    "telefono": "3001234567",
    "email": "empresa@example.com",
    "nit": "900123456-1",
    "direccion": "Calle 1 #1-1",
    "ciudad": "Bogotá",
    "idEstadoCliente": 1
  }' | jq '.data.IdCliente'
```

### Prueba 3: Incrementar Stock
```bash
curl -X POST http://localhost:3000/api/productos/1/incrementar-stock \
  -H "Content-Type: application/json" \
  -d '{"cantidad": 50}' | jq '.data.stock'
```

### Prueba 4: Crear Pedido
```bash
curl -X POST http://localhost:3000/api/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "idCliente": 1,
    "items": [
      {"idProducto": 1, "cantidad": 2, "precioUnitario": 15000}
    ]
  }' | jq '.data | {id: .IdPedido, total: .Total}'
```

---

## 🔍 Estructura de Respuestas

### Respuesta Exitosa (200, 201)
```json
{
  "success": true,
  "message": "Operación completada",
  "data": {
    "IdUsuario": 1,
    "nombre": "Carlos",
    ...
  }
}
```

### Respuesta con Error (400, 500)
```json
{
  "success": false,
  "message": "Error: campo requerido faltante",
  "data": null
}
```

---

## 🎯 Flujo de Prueba Recomendado

```
1. Verificar servidor
   ↓
2. Listar Usuarios (GET)
   ↓
3. Listar Clientes (GET)
   ↓
4. Crear Cliente (POST) → Guardar ID
   ↓
5. Obtener Cliente (GET) → Verificar datos
   ↓
6. Actualizar Cliente (PUT)
   ↓
7. Crear Pedido (POST) → Usa cliente del paso 4
   ↓
8. Listar Productos (GET)
   ↓
9. Incrementar Stock (POST)
   ↓
10. Eliminar Cliente (DELETE)
    ↓
✅ Pruebas completadas
```

---

## 🛠️ Herramientas Recomendadas

### Terminal
```bash
# Ver respuesta con colores
curl -s URL | jq '.'

# Ver solo status HTTP
curl -w "\nStatus: %{http_code}\n" URL

# Guardar respuesta en archivo
curl -s URL > response.json
```

### UI (Alternativas)
- **Postman**: https://www.postman.com/
- **Thunder Client**: VSCode Extension
- **Insomnia**: https://insomnia.rest/

---

## ✨ Características Disponibles

✅ Autenticación (JWT)
✅ Validación de datos
✅ Manejo de errores
✅ Paginación
✅ Búsqueda
✅ Filtros
✅ Relaciones (JOIN)
✅ Transacciones

---

## 🆘 Ayuda Rápida

### ¿El servidor no está corriendo?
```bash
npm run dev
# Espera mensaje: 🚀 Servidor ejecutándose en http://localhost:3000
```

### ¿Los datos no se guardan?
Verifica en `.env`:
```bash
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
```

### ¿Necesitas resetear datos?
```bash
npx prisma migrate reset
# (⚠️ Borra toda la BD)
```

### ¿Ver logs del servidor?
En terminal donde corre `npm run dev`, verás todos los logs

---

## 📈 Próximos Pasos

1. **Conectar Frontend**: Los archivos están en `/public/`
2. **Integrar con Postman**: Importar colección
3. **Crear CI/CD**: Usar scripts de prueba
4. **Documentar API**: Considerar Swagger/OpenAPI
5. **Optimizar**: Profile de queries lentas

---

## 📞 Información Útil

**Base URL**: `http://localhost:3000`  
**API URL**: `http://localhost:3000/api`  
**Puerto**: `3000`  
**Base de datos**: PostgreSQL (Supabase)  
**Framework**: Express.js  
**ORM**: Prisma  

---

**🎉 ¡Listo para probar!**

Comienza con:
```bash
./test-api.sh
```

Luego continúa con:
```bash
./test-crud.sh
```

¡Diviértete probando! 🚀
