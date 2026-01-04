#!/bin/bash

API_KEY="51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d"
BACKEND_URL="https://allureportal.sawatech.ae/api"

echo "=========================================="
echo "Testing Authentication APIs"
echo "=========================================="
echo ""

# Test 1: Login API
echo "Test 1: Login API (Invalid credentials)"
echo "URL: POST ${BACKEND_URL}/auth/login"
curl -X POST "${BACKEND_URL}/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "v-api-key: ${API_KEY}" \
  -H "Accept-Language: en" \
  -d '{
    "email": "test@example.com",
    "password": "wrongpassword",
    "device_name": "web_browser",
    "platform": "web"
  }' \
  -s | jq '.' 2>/dev/null || echo "Failed to parse JSON"

echo ""
echo "=========================================="
echo ""

# Test 2: Register Single User
echo "Test 2: Register Single User"
EMAIL="testuser$(date +%s)@testmail.com"
echo "Email: ${EMAIL}"
echo "URL: POST ${BACKEND_URL}/auth/register"
curl -X POST "${BACKEND_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "v-api-key: ${API_KEY}" \
  -H "Accept-Language: en" \
  -d "{
    \"first_name\": \"John\",
    \"last_name\": \"Doe\",
    \"email\": \"${EMAIL}\",
    \"password\": \"TestPass123!\",
    \"password_confirmation\": \"TestPass123!\"
  }" \
  -s | jq '.' 2>/dev/null || echo "Failed to parse JSON"

echo ""
echo "=========================================="
echo ""

# Test 3: Register Twins User
echo "Test 3: Register Twins User (with twin name fields)"
EMAIL_TWINS="twinuser$(date +%s)@testmail.com"
echo "Email: ${EMAIL_TWINS}"
echo "URL: POST ${BACKEND_URL}/auth/register"
curl -X POST "${BACKEND_URL}/auth/register" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "v-api-key: ${API_KEY}" \
  -H "Accept-Language: en" \
  -d "{
    \"first_name\": \"Ali & Ahmed\",
    \"last_name\": \"Hassan\",
    \"first_twin_name\": \"Ali\",
    \"second_twin_name\": \"Ahmed\",
    \"email\": \"${EMAIL_TWINS}\",
    \"password\": \"TestPass123!\",
    \"password_confirmation\": \"TestPass123!\"
  }" \
  -s | jq '.' 2>/dev/null || echo "Failed to parse JSON"

echo ""
echo "=========================================="
echo "API Tests Complete"
echo "=========================================="
