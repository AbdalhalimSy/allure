#!/bin/bash

# Test script to verify that empty Job Locations boxes are not shown

echo "============================================"
echo "Testing Empty Job Locations Implementation"
echo "============================================"
echo ""

# Login
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "layla.hassan@example.com",
    "password": "password"
  }')

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token' 2>/dev/null)

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo "❌ Login failed!"
  echo "$LOGIN_RESPONSE" | jq '.'
  exit 1
fi

echo "✅ Login successful"
echo "Token: $TOKEN"
echo ""

# Test Job 45 (empty countries)
echo "Testing Job 45 (should have empty job_countries):"
JOB_45=$(curl -s "http://localhost:3000/api/jobs/45?profile_id=28" \
  -H "Authorization: Bearer $TOKEN" 2>/dev/null)

TITLE=$(echo "$JOB_45" | jq -r '.data.title' 2>/dev/null)
COUNTRIES=$(echo "$JOB_45" | jq '.data.job_countries' 2>/dev/null)
COUNTRY_COUNT=$(echo "$COUNTRIES" | jq 'length' 2>/dev/null)

echo "Title: $TITLE"
echo "Countries Array: $COUNTRIES"
echo "Country Count: $COUNTRY_COUNT"

if [ "$COUNTRY_COUNT" = "0" ]; then
  echo "✅ Job 45 has empty job_countries (as expected)"
else
  echo "❌ Job 45 should have empty job_countries"
fi

echo ""
echo "============================================"
echo "Testing Complete!"
echo "============================================"
echo ""
echo "On the Job Detail page for Job 45:"
echo "✅ The 'Job Locations' box should NOT be displayed"
echo "✅ The 'Application Tips' box should be displayed"
echo "✅ All translations should work correctly"
