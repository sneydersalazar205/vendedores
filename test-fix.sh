#!/bin/bash

# 🧪 Script para probar crear cliente después del fix

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"

echo "🧪 Probando POST /api/clientes con MAPPER..."

# Datos de prueba con nombres simples (como vendría del frontend)
CLIENTE_DATA='{
  "nombre": "Juan Carlos Pérez López",
  "telefono": "3009999999",
  "email": "juan-'$(date +%s)'@example.com",
  "nit": "900123456-1",
  "idEstadoCliente": 1
}'

echo "📤 Enviando:"
echo "$CLIENTE_DATA" | jq '.'

echo -e "\n🔄 Respuesta del servidor:"
RESPUESTA=$(curl -s -X POST "$API_URL/clientes" \
  -H "Content-Type: application/json" \
  -d "$CLIENTE_DATA" -w "\nHTTP:%{http_code}")

# Separar respuesta de status code
HTTP_CODE=$(echo "$RESPUESTA" | tail -1 | sed 's/HTTP://')
BODY=$(echo "$RESPUESTA" | sed '$d')

echo "$BODY" | jq '.'
echo -e "\n📊 Status HTTP: $HTTP_CODE"

# Extraer ID
ID=$(echo "$BODY" | jq '.data.IdCliente' 2>/dev/null)

if [ "$ID" != "null" ] && [ ! -z "$ID" ]; then
    echo -e "\n✅ Cliente creado exitosamente con ID: $ID"
    
    # Verificar que se guardó
    echo -e "\n🔍 Verificando..."
    curl -s -X GET "$API_URL/clientes/$ID" | jq '.data | {IdCliente, PrimerNombre, Email, Telefono}'
else
    echo -e "\n❌ Error al crear cliente"
    echo "ID extraído: $ID"
fi
