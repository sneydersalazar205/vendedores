#!/bin/bash

# 🔍 Script de Diagnóstico - RutaSmart
# Investiga problemas con respuestas de API

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 DIAGNÓSTICO DE API - RutaSmart${NC}\n"

# ============== 1. VERIFICACIÓN DE SERVIDOR ==============
echo -e "${BLUE}[1/5] Verificando servidor...${NC}"

if curl -s "$BASE_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Servidor disponible${NC}"
else
    echo -e "${RED}❌ Servidor NO disponible${NC}"
    exit 1
fi

# ============== 2. PROBAR ENDPOINT /usuarios ==============
echo -e "\n${BLUE}[2/5] Probando GET /api/usuarios...${NC}"

USUARIOS=$(curl -s -X GET "$API_URL/usuarios")
echo "Respuesta completa:"
echo "$USUARIOS" | jq '.'

# ============== 3. CREAR CLIENTE - DEBUG ==============
echo -e "\n${BLUE}[3/5] Probando POST /api/clientes (CREATE)...${NC}"

CLIENTE_DATA='{
  "nombre": "TestClient-'$(date +%s)'",
  "telefono": "3009999999",
  "email": "test-'$(date +%s)'@example.com",
  "nit": "900123456-1",
  "direccion": "Carrera 45 #23-40",
  "ciudad": "Bogotá",
  "idEstadoCliente": 1
}'

echo "Enviando JSON:"
echo "$CLIENTE_DATA" | jq '.'

echo -e "\nRespuesta del servidor:"
CLIENTE_RESPONSE=$(curl -s -X POST "$API_URL/clientes" \
  -H "Content-Type: application/json" \
  -d "$CLIENTE_DATA")

echo "$CLIENTE_RESPONSE" | jq '.'

# Intentar extraer ID con diferentes claves posibles
ID=$(echo "$CLIENTE_RESPONSE" | jq -r '.data.IdCliente // .data.id // .data.clienteId // .data.cliente_id // empty' 2>/dev/null)
echo -e "\nID extraído: '${ID}' (vacío si no se encontró)"

# ============== 4. LISTAR CLIENTES ==============
echo -e "\n${BLUE}[4/5] Probando GET /api/clientes (LIST)...${NC}"

CLIENTES=$(curl -s -X GET "$API_URL/clientes")
echo "Respuesta completa:"
echo "$CLIENTES" | jq '.' | head -50

CLIENTES_COUNT=$(echo "$CLIENTES" | jq '.data | length' 2>/dev/null || echo "error")
echo -e "\nTotal de clientes: $CLIENTES_COUNT"

# ============== 5. STATUS HTTP ==============
echo -e "\n${BLUE}[5/5] Verificando status HTTP...${NC}"

echo "GET /api/usuarios:"
curl -s -w "Status: %{http_code}\n\n" -o /dev/null "$API_URL/usuarios"

echo "GET /api/clientes:"
curl -s -w "Status: %{http_code}\n\n" -o /dev/null "$API_URL/clientes"

echo "POST /api/clientes:"
curl -s -w "Status: %{http_code}\n\n" -o /dev/null -X POST "$API_URL/clientes" \
  -H "Content-Type: application/json" \
  -d "$CLIENTE_DATA"

# ============== RESUMEN ==============
echo -e "\n${YELLOW}📋 RESUMEN DEL DIAGNÓSTICO${NC}"
echo "Revisa la salida anterior para encontrar problemas"
echo "Problemas comunes:"
echo "1. IDs son 'null' → Revisa el schema de Prisma"
echo "2. Status 500 → Error en el servidor"
echo "3. Status 400 → JSON inválido"
echo "4. Respuesta vacía → Middleware middleware issue"
