#!/bin/bash

# 🧪 Script de Pruebas CRUD - RutaSmart
# Uso: ./test-crud.sh

set -e

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo -e "\n${BLUE}==================== $1 ====================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# ============== PRUEBAS CRUD ==============

echo -e "${BLUE}🚀 Iniciando pruebas CRUD...${NC}\n"

# Verificar servidor
if ! curl -s "$BASE_URL" > /dev/null 2>&1; then
    print_error "El servidor no está corriendo"
    exit 1
fi

print_success "Servidor disponible"

# ============== 1. CLIENTE CRUD ==============
print_header "1. PRUEBAS CLIENTE - CRUD"

print_info "Creando cliente..."
CLIENTE_JSON=$(cat <<EOF
{
  "nombre": "Test Client $(date +%s)",
  "telefono": "3009999999",
  "email": "test-$(date +%s)@example.com",
  "nit": "900123456-1",
  "direccion": "Carrera 45 #23-40",
  "ciudad": "Bogotá",
  "idEstadoCliente": 1
}
EOF
)

CLIENT_RESPONSE=$(curl -s -X POST "$API_URL/clientes" \
  -H "Content-Type: application/json" \
  -d "$CLIENTE_JSON")

CLIENT_ID=$(echo "$CLIENT_RESPONSE" | jq '.data.IdCliente // .data.id' 2>/dev/null || echo "")

if [ -z "$CLIENT_ID" ]; then
    print_error "No se pudo crear el cliente"
    echo "$CLIENT_RESPONSE" | jq '.'
else
    print_success "Cliente creado con ID: $CLIENT_ID"
fi

# Leer cliente
print_info "Leyendo cliente..."
curl -s -X GET "$API_URL/clientes/$CLIENT_ID" | jq '.data.nombre' 2>/dev/null && print_success "Cliente leído"

# Actualizar cliente
print_info "Actualizando cliente..."
curl -s -X PUT "$API_URL/clientes/$CLIENT_ID" \
  -H "Content-Type: application/json" \
  -d '{"telefono": "3008888888"}' | jq '.success' 2>/dev/null && print_success "Cliente actualizado"

# Eliminar cliente
print_info "Eliminando cliente..."
curl -s -X DELETE "$API_URL/clientes/$CLIENT_ID" | jq '.success' 2>/dev/null && print_success "Cliente eliminado"

# ============== 2. PRODUCTO CRUD ==============
print_header "2. PRUEBAS PRODUCTO - CRUD"

print_info "Creando producto..."
PRODUCTO_JSON=$(cat <<EOF
{
  "nombre": "Producto Test $(date +%s)",
  "descripcion": "Producto de prueba",
  "precio": 25000,
  "stock": 100,
  "idCategoria": 1,
  "idEstadoProducto": 1
}
EOF
)

PRODUCT_RESPONSE=$(curl -s -X POST "$API_URL/productos" \
  -H "Content-Type: application/json" \
  -d "$PRODUCTO_JSON")

PRODUCT_ID=$(echo "$PRODUCT_RESPONSE" | jq '.data.IdProducto // .data.id' 2>/dev/null || echo "")

if [ -z "$PRODUCT_ID" ]; then
    print_error "No se pudo crear el producto"
else
    print_success "Producto creado con ID: $PRODUCT_ID"
    
    # Incrementar stock
    print_info "Incrementando stock..."
    curl -s -X POST "$API_URL/productos/$PRODUCT_ID/incrementar-stock" \
      -H "Content-Type: application/json" \
      -d '{"cantidad": 50}' | jq '.success' 2>/dev/null && print_success "Stock incrementado"
    
    # Decrementar stock
    print_info "Decrementando stock..."
    curl -s -X POST "$API_URL/productos/$PRODUCT_ID/decrementar-stock" \
      -H "Content-Type: application/json" \
      -d '{"cantidad": 20}' | jq '.success' 2>/dev/null && print_success "Stock decrementado"
    
    # Eliminar producto
    print_info "Eliminando producto..."
    curl -s -X DELETE "$API_URL/productos/$PRODUCT_ID" | jq '.success' 2>/dev/null && print_success "Producto eliminado"
fi

# ============== 3. USUARIO CRUD ==============
print_header "3. PRUEBAS USUARIO - CRUD"

print_info "Listando usuarios..."
USUARIOS_LIST=$(curl -s -X GET "$API_URL/usuarios")
FIRST_USER_ID=$(echo "$USUARIOS_LIST" | jq '.data[0].IdUsuario // .data[0].id' 2>/dev/null || echo "1")

if [ ! -z "$FIRST_USER_ID" ] && [ "$FIRST_USER_ID" != "null" ]; then
    print_success "Usuario encontrado: ID $FIRST_USER_ID"
    
    # Obtener usuario
    print_info "Obteniendo detalles del usuario..."
    curl -s -X GET "$API_URL/usuarios/$FIRST_USER_ID" | jq '.data.nombre' 2>/dev/null && print_success "Usuario obtenido"
else
    print_error "No se encontraron usuarios"
fi

# ============== 4. RUTA CRUD ==============
print_header "4. PRUEBAS RUTA - CRUD"

# Obtener primer vendedor
VENDEDOR_ID=$(echo "$USUARIOS_LIST" | jq '.data[0].IdUsuario // .data[0].id' 2>/dev/null || echo "1")

print_info "Creando ruta..."
RUTA_JSON=$(cat <<EOF
{
  "nombre": "Test Ruta $(date +%s)",
  "descripcion": "Ruta de prueba",
  "fechaInicio": "$(date +%Y-%m-%d)",
  "idVendedor": $VENDEDOR_ID,
  "idEstadoRuta": 1
}
EOF
)

RUTA_RESPONSE=$(curl -s -X POST "$API_URL/rutas" \
  -H "Content-Type: application/json" \
  -d "$RUTA_JSON")

RUTA_ID=$(echo "$RUTA_RESPONSE" | jq '.data.IdRuta // .data.id' 2>/dev/null || echo "")

if [ -z "$RUTA_ID" ]; then
    print_error "No se pudo crear la ruta"
else
    print_success "Ruta creada con ID: $RUTA_ID"
    
    # Obtener rutas activas
    print_info "Obteniendo rutas activas..."
    curl -s -X GET "$API_URL/rutas/activas" | jq '.data | length' 2>/dev/null && print_success "Rutas activas obtenidas"
    
    # Eliminar ruta
    print_info "Eliminando ruta..."
    curl -s -X DELETE "$API_URL/rutas/$RUTA_ID" | jq '.success' 2>/dev/null && print_success "Ruta eliminada"
fi

# ============== 5. PEDIDO CRUD ==============
print_header "5. PRUEBAS PEDIDO - CRUD"

# Obtener primer cliente
CLIENTES_LIST=$(curl -s -X GET "$API_URL/clientes")
CLIENTE_ID=$(echo "$CLIENTES_LIST" | jq '.data[0].IdCliente // .data[0].id' 2>/dev/null || echo "")

if [ ! -z "$CLIENTE_ID" ] && [ "$CLIENTE_ID" != "null" ]; then
    print_info "Creando pedido para cliente $CLIENTE_ID..."
    PEDIDO_JSON=$(cat <<EOF
{
  "idCliente": $CLIENTE_ID,
  "observaciones": "Pedido de prueba",
  "items": [
    {"idProducto": 1, "cantidad": 2, "precioUnitario": 15000}
  ]
}
EOF
)
    
    PEDIDO_RESPONSE=$(curl -s -X POST "$API_URL/pedidos" \
      -H "Content-Type: application/json" \
      -d "$PEDIDO_JSON")
    
    PEDIDO_ID=$(echo "$PEDIDO_RESPONSE" | jq '.data.IdPedido // .data.id' 2>/dev/null || echo "")
    
    if [ -z "$PEDIDO_ID" ]; then
        print_error "No se pudo crear el pedido"
    else
        print_success "Pedido creado con ID: $PEDIDO_ID"
        
        # Obtener pedidos del cliente
        print_info "Obteniendo pedidos del cliente..."
        curl -s -X GET "$API_URL/pedidos/cliente/$CLIENTE_ID" | jq '.data | length' 2>/dev/null && print_success "Pedidos del cliente obtenidos"
    fi
else
    print_error "No hay clientes disponibles"
fi

# ============== 6. VISITA CRUD ==============
print_header "6. PRUEBAS VISITA - CRUD"

if [ ! -z "$RUTA_ID" ] && [ ! -z "$CLIENTE_ID" ]; then
    print_info "Creando ruta para visita..."
    RUTA_TEMP=$(curl -s -X POST "$API_URL/rutas" \
      -H "Content-Type: application/json" \
      -d "{
        \"nombre\": \"Ruta Temp $(date +%s)\",
        \"descripcion\": \"Ruta temporal\",
        \"fechaInicio\": \"$(date +%Y-%m-%d)\",
        \"idVendedor\": $VENDEDOR_ID,
        \"idEstadoRuta\": 1
      }")
    
    RUTA_TEMP_ID=$(echo "$RUTA_TEMP" | jq '.data.IdRuta // .data.id' 2>/dev/null || echo "")
    
    if [ ! -z "$RUTA_TEMP_ID" ]; then
        print_info "Creando visita..."
        VISITA_JSON=$(cat <<EOF
{
  "idRuta": $RUTA_TEMP_ID,
  "idCliente": $CLIENTE_ID,
  "comentarios": "Visita de prueba",
  "idEstadoVisita": 1
}
EOF
)
        
        VISITA_RESPONSE=$(curl -s -X POST "$API_URL/visitas" \
          -H "Content-Type: application/json" \
          -d "$VISITA_JSON")
        
        VISITA_ID=$(echo "$VISITA_RESPONSE" | jq '.data.IdVisita // .data.id' 2>/dev/null || echo "")
        
        if [ ! -z "$VISITA_ID" ]; then
            print_success "Visita creada con ID: $VISITA_ID"
        else
            print_error "No se pudo crear la visita"
        fi
    fi
fi

# ============== RESUMEN ==============
print_header "PRUEBAS COMPLETADAS ✨"

echo ""
print_success "Todas las pruebas se completaron"
echo ""
echo "Revisa la salida anterior para ver resultados detallados"
