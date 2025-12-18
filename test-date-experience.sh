#!/bin/bash

# Login and get token
echo "=== Logging in ==="
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "layla.hassan@example.com",
    "password": "password"
  }' | jq -r '.data.token')

echo "Token: $TOKEN"

# Test 1: Add experience with dates
echo ""
echo "=== Test 1: Adding experience with dates ==="
RESPONSE=$(curl -s -X POST http://localhost:3000/api/profile/sync-experiences \
  -H "Authorization: Bearer $TOKEN" \
  -F "profile_id=28" \
  -F "experiences[0][title]=Test Software Engineer" \
  -F "experiences[0][start_date]=2020-06-15" \
  -F "experiences[0][end_date]=2023-12-31" \
  -F "experiences[0][is_current]=0" \
  -F "experiences[0][description]=Testing date persistence")

echo "$RESPONSE" | jq .

# Extract what was saved
echo ""
echo "=== What was actually saved (from response): ==="
echo "$RESPONSE" | jq '.data[0] | {title, start_date, end_date, is_current}'

# Test 2: Fetch experiences to verify persistence
echo ""
echo "=== Test 2: Fetching experiences to verify dates persisted ==="
FETCH=$(curl -s -X GET "http://localhost:3000/api/profile/experiences?profile_id=28" \
  -H "Authorization: Bearer $TOKEN")

echo "$FETCH" | jq '.data[] | select(.title=="Test Software Engineer") | {title, start_date, end_date, is_current}'
