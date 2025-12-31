#!/bin/bash

# First, login to get auth token
echo "=== LOGGING IN ==="
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "layla.hassan@example.com",
    "password": "password"
  }')

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // .token' 2>/dev/null)
echo ""
echo "Token: $TOKEN"
echo ""

# Test public job endpoint
echo "=== PUBLIC JOB DETAIL (No Auth) ==="
curl -s http://localhost:3000/api/public/jobs/1 \
  -H "Accept-Language: en" | jq '.' 2>/dev/null | head -100

echo ""
echo ""
echo "=== AUTHENTICATED JOB DETAIL ==="
if [ ! -z "$TOKEN" ] && [ "$TOKEN" != "null" ]; then
  curl -s "http://localhost:3000/api/jobs/1?profile_id=1" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept-Language: en" | jq '.' 2>/dev/null | head -150
else
  echo "Could not get token, trying public endpoint..."
  curl -s http://localhost:3000/api/public/jobs/1 \
    -H "Accept-Language: en" | jq '.' 2>/dev/null | head -150
fi
