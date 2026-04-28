#!/bin/bash

# 🧪 Script de Pruebas de API - RutaSmart
# Uso: ./test-api.sh

set -e

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

# Colores para terminal
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir títulos
print_header() {
    echo -e "\n${BLUE}==================== $1 ====================${NC}"
}

# Función para prueba exitosa
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para prueba fallida
print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Función para información
print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Verificar si el servidor está corriendo
echo -e "${BLUE}🚀 Iniciando pruebas de API...${NC}\n"

if ! curl -s "$BASE_URL" > /dev/null 2>&1; then
    print_error "El servidor no está corriendo en $BASE_URL"
    echo "Inicia el servidor con: npm run dev"
    exit 1
fi

print_success "Servidor disponible"

# ============== PRUEBAS ==============

# 1. VERIFICAR SERVIDOR
print_header "1. VERIFICAR SERVIDOR"
RESPONSE=$(curl -s "$BASE_URL")
if echo "$RESPONSE" | grep -q "API de Gestión"; then
    print_success "Servidor respondiendo correctamente"
    echo "Mensaje: $(echo "$RESPONSE" | jq -r '.message')"
else
    print_error "Servidor no responde como se esperaba"
fi

# 2. USUARIOS
print_header "2. USUARIOS"

print_info "Listando usuarios..."
USUARIOS=$(curl -s -X GET "$API_URL/usuarios")
USUARIO_COUNT=$(echo "$USUARIOS" | jq '.data | length' 2>/dev/null || echo "0")
print_success "Usuarios encontrados: $USUARIO_COUNT"

if [ "$USUARIO_COUNT" -gt 0 ]; then
    FIRST_USER=$(echo "$USUARIOS" | jq '.data[0]' 2>/dev/null)
    echo "Primer usuario: $(echo "$FIRST_USER" | jq '.nombre' 2>/dev/null)"
fi

# 3. CLIENTES
print_header "3. CLIENTES"

print_info "Listando clientes..."
CLIENTES=$(curl -s -X GET "$API_URL/clientes")
CLIENTE_COUNT=$(echo "$CLIENTES" | jq '.data | length' 2>/dev/null || echo "0")
print_success "Clientes encontrados: $CLIENTE_COUNT"

if [ "$CLIENTE_COUNT" -gt 0 ]; then
    FIRST_CLIENT=$(echo "$CLIENTES" | jq '.data[0]' 2>/dev/null)
    echo "Primer cliente: $(echo "$FIRST_CLIENT" | jq '.nombre' 2>/dev/null)"
fi

# 4. PRODUCTOS
print_header "4. PRODUCTOS"

print_info "Listando productos..."
PRODUCTOS=$(curl -s -X GET "$API_URL/productos")
PRODUCTO_COUNT=$(echo "$PRODUCTOS" | jq '.data | length' 2>/dev/null || echo "0")
print_success "Productos encontrados: $PRODUCTO_COUNT"

if [ "$PRODUCTO_COUNT" -gt 0 ]; then
    FIRST_PRODUCT=$(echo "$PRODUCTOS" | jq '.data[0]' 2>/dev/null)
    echo "Primer producto: $(echo "$FIRST_PRODUCT" | jq '.nombre' 2>/dev/null)"
fi

# 5. PEDIDOS
print_header "5. PEDIDOS"

print_info "Listando pedidos..."
PEDIDOS=$(curl -s -X GET "$API_URL/pedidos")
PEDIDO_COUNT=$(echo "$PEDIDOS" | jq '.data | length' 2>/dev/null || echo "0")
print_success "Pedidos encontrados: $PEDIDO_COUNT"

# 6. RUTAS
print_header "6. RUTAS"

print_info "Listando rutas..."
RUTAS=$(curl -s -X GET "$API_URL/rutas")
RUTA_COUNT=$(echo "$RUTAS" | jq '.data | length' 2>/dev/null || echo "0")
print_success "Rutas encontradas: $RUTA_COUNT"

# 7. VISITAS
print_header "7. VISITAS"

print_info "Listando visitas..."
VISITAS=$(curl -s -X GET "$API_URL/visitas")
VISITA_COUNT=$(echo "$VISITAS" | jq '.data | length' 2>/dev/null || echo "0")
print_success "Visitas encontradas: $VISITA_COUNT"

# 8. COMISIONES
print_header "8. COMISIONES"

print_info "Listando comisiones..."
COMISIONES=$(curl -s -X GET "$API_URL/comisiones")
COMISION_COUNT=$(echo "$COMISIONES" | jq '.data | length' 2>/dev/null || echo "0")
print_success "Comisiones encontradas: $COMISION_COUNT"

# ============== RESUMEN ==============
print_header "RESUMEN DE PRUEBAS"

echo ""
echo "📊 Estadísticas:"
echo "  - Usuarios: $USUARIO_COUNT"
echo "  - Clientes: $CLIENTE_COUNT"
echo "  - Productos: $PRODUCTO_COUNT"
echo "  - Pedidos: $PEDIDO_COUNT"
echo "  - Rutas: $RUTA_COUNT"
echo "  - Visitas: $VISITA_COUNT"
echo "  - Comisiones: $COMISION_COUNT"
echo ""

print_success "Pruebas completadas exitosamente ✨"
echo ""
echo "Para pruebas más detalladas, ver PRUEBAS_API.md"
