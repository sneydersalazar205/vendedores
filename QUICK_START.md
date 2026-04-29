# 🚀 QUICK START - Pruebas de Frontend + Backend

## ⚡ En 5 Minutos

### 1. Iniciar Backend
```bash
# Terminal 1
cd c:\Users\dball\Documents\ProyectoSneyder\vendedores
npm run dev
```

**Esperado**: 
```
🚀 Servidor ejecutándose en http://localhost:3000
📊 Base de datos: Conectada exitosamente
✏️ Capas: Models → Repositories → Services → Controllers → Routes
```

### 2. Crear Usuario de Prueba (Postman)
**URL**: `POST` http://localhost:3000/api/usuarios/registrar

**Body**:
```json
{
  "Email": "admin@rutas.com",
  "Contrasena": "Admin123*",
  "Nombre": "Administrador",
  "Apellido": "Sistema",
  "Cedula": "1234567890",
  "IdRol": 1
}
```

**Esperado**: 
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": { IdUsuario: 1, Email: "admin@rutas.com", ... }
}
```

### 3. Abrir Página de Login
Abre en el navegador:
```
http://localhost:3000/login.html
```

### 4. Hacer Login
- Email: `admin@rutas.com`
- Contraseña: `Admin123*`

**Esperado**: Redirige automáticamente a http://localhost:3000/index.html

### 5. Ver Panel Admin
```
http://localhost:3000/admin.html
```

**Debe mostrar**:
- ✅ Nombre del usuario en navbar
- ✅ Menú de navegación funcional
- ✅ Botón de logout

---

## 🧪 Pruebas Rápidas

### Test 1: Verificar que el servidor está corriendo
```bash
curl http://localhost:3000/
```

Esperado: Retorna JSON con endpoints disponibles

### Test 2: Listar usuarios
```bash
curl -X GET http://localhost:3000/api/usuarios
```

### Test 3: Login vía API
```bash
curl -X POST http://localhost:3000/api/usuarios/login \
  -H "Content-Type: application/json" \
  -d '{"Email":"admin@rutas.com","Contrasena":"Admin123*"}'
```

Esperado: Retorna token JWT

### Test 4: Obtener perfil (con token)
```bash
# Reemplaza TOKEN por el token del login anterior
curl -X GET http://localhost:3000/api/usuarios/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## ✅ Checklist de Validación

- [ ] Servidor backend levanta sin errores
- [ ] Crear usuario de prueba funciona
- [ ] Login page carga sin errores
- [ ] Login redirige a /index.html
- [ ] Panel admin muestra nombre del usuario
- [ ] Menú de navegación funciona
- [ ] Botón logout funciona
- [ ] Los datos persisten en localStorage

---

## 🐛 Troubleshooting

### "Cannot GET /login.html"
**Solución**: El servidor debe estar en `http://localhost:3000`, no en otra ruta

### "Email already registered"
**Solución**: El email ya existe. Usa otro o borra el usuario anterior en Postman

### "Invalid IdUsuario: Expected Int, provided String"
**Solución**: YA ESTÁ CORREGIDO ✅

### "No token provided"
**Solución**: Asegúrate de tener un token válido. Haz login primero

### Token no se guarda
**Solución**: Verifica que la respuesta de login tenga `{ token: "..." }`

---

## 📁 Archivos Principales

| Archivo | Función |
|---------|---------|
| src/index.js | Servidor Express |
| public/login.html | Página de login |
| public/index.html | Home/Dashboard |
| public/admin.html | Panel admin |
| public/vendedor.html | Panel vendedor |
| public/js/api.js | Cliente API (instancia global `api`) |
| public/js/admin.js | Lógica del panel admin |
| public/js/vendedor.js | Lógica del panel vendedor |

---

## 🔑 Variables Importantes

### Frontend (localStorage)
```javascript
localStorage.getItem('token')        // JWT token
localStorage.getItem('userName')     // Nombre del usuario
```

### Backend (Headers)
```
Authorization: Bearer eyJhbGc...     // Token JWT
Content-Type: application/json       // Tipo de contenido
```

---

## 📝 Tabla de Credenciales de Prueba

Crea estos usuarios para probar diferentes roles:

| Email | Contraseña | Rol | IdRol |
|-------|-----------|-----|-------|
| admin@rutas.com | Admin123* | Admin | 1 |
| vendedor@rutas.com | Vend123* | Vendedor | 2 |
| user@rutas.com | User123* | Usuario | 3 |

---

## 🎯 Endpoints Críticos Testeados

✅ POST `/api/usuarios/login` - Autenticación  
✅ GET `/api/usuarios/profile` - Obtener perfil  
✅ GET `/api/usuarios` - Listar usuarios  
✅ GET `/api/usuarios/:id` - Obtener usuario  
✅ PUT `/api/usuarios/:id` - Actualizar usuario  
✅ GET `/api/clientes` - Listar clientes  
✅ POST `/api/clientes` - Crear cliente  
✅ GET `/api/productos` - Listar productos  
✅ GET `/api/rutas` - Listar rutas  
✅ GET `/api/pedidos` - Listar pedidos  

---

## 📚 Documentación Completa

- [CONEXION_FRONTEND_BACKEND.md](CONEXION_FRONTEND_BACKEND.md) - Guía detallada de conexión
- [RESUMEN_CAMBIOS.md](RESUMEN_CAMBIOS.md) - Todos los cambios realizados
- [Postman_Collection.json](Postman_Collection.json) - Colección de pruebas

---

**¿Problemas?** Revisa [CONEXION_FRONTEND_BACKEND.md](CONEXION_FRONTEND_BACKEND.md) sección "Problemas Comunes"

**Estado**: 🟢 Listo para Testing  
**Última actualización**: 28 de Abril, 2026
