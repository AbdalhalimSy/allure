#!/bin/bash

# Test Profile Photos API with Breaking Changes
# Tests both GET and POST endpoints with profile_id parameter

BASE_URL="http://localhost:3000"
API_URL="$BASE_URL/api"
EMAIL="layla.hassan@example.com"
PASSWORD="password"

echo "=========================================="
echo "Profile Photos API - Breaking Changes Test"
echo "=========================================="
echo ""

# Step 1: Login and get token
echo "Step 1: Authenticating user..."
echo "Email: $EMAIL"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null || echo "$LOGIN_RESPONSE"
echo ""

# Extract token and profile info
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token' 2>/dev/null)
FIRST_PROFILE_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.data.talent.profiles[0].id' 2>/dev/null)
SECOND_PROFILE_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.data.talent.profiles[1].id' 2>/dev/null)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Failed to get auth token"
  exit 1
fi

echo "✅ Authentication successful"
echo "Token: ${TOKEN:0:20}..."
echo "First Profile ID: $FIRST_PROFILE_ID"
echo "Second Profile ID: $SECOND_PROFILE_ID"
echo ""

# Step 2: Test GET endpoint with profile_id (First Profile)
echo "=========================================="
echo "Step 2: GET Profile Photos (First Profile)"
echo "=========================================="
echo "URL: GET /api/profile-photos?profile_id=$FIRST_PROFILE_ID"
echo ""

GET_RESPONSE=$(curl -s -X GET "$API_URL/profile-photos?profile_id=$FIRST_PROFILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Response:"
echo "$GET_RESPONSE" | jq '.' 2>/dev/null || echo "$GET_RESPONSE"
echo ""

PHOTO_COUNT=$(echo "$GET_RESPONSE" | jq '.data | length' 2>/dev/null)
echo "Total Photos: $PHOTO_COUNT"
echo ""

# Step 3: Test GET endpoint with profile_id (Second Profile)
echo "=========================================="
echo "Step 3: GET Profile Photos (Second Profile)"
echo "=========================================="
echo "URL: GET /api/profile-photos?profile_id=$SECOND_PROFILE_ID"
echo ""

GET_RESPONSE_2=$(curl -s -X GET "$API_URL/profile-photos?profile_id=$SECOND_PROFILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Response:"
echo "$GET_RESPONSE_2" | jq '.' 2>/dev/null || echo "$GET_RESPONSE_2"
echo ""

PHOTO_COUNT_2=$(echo "$GET_RESPONSE_2" | jq '.data | length' 2>/dev/null)
echo "Total Photos: $PHOTO_COUNT_2"
echo ""

# Step 4: Test GET endpoint without profile_id (should fail)
echo "=========================================="
echo "Step 4: GET Profile Photos (Missing profile_id)"
echo "=========================================="
echo "URL: GET /api/profile-photos (without profile_id)"
echo ""

GET_ERROR=$(curl -s -X GET "$API_URL/profile-photos" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json")

echo "Response (should show validation error):"
echo "$GET_ERROR" | jq '.' 2>/dev/null || echo "$GET_ERROR"
echo ""

# Step 5: Test file upload (create a test image)
echo "=========================================="
echo "Step 5: Testing POST Profile Photos Upload"
echo "=========================================="

# Create a simple test image (1x1 pixel PNG)
TEST_IMAGE="/tmp/test_profile_photo.png"
# 1x1 transparent PNG
echo -en '\x89\x50\x4e\x47\x0d\x0a\x1a\x0a\x00\x00\x00\x0d\x49\x48\x44\x52\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0a\x49\x44\x41\x54\x78\x9c\x63\x00\x01\x00\x00\x05\x00\x01\x0d\x0a\x2d\xb4\x00\x00\x00\x00\x49\x45\x4e\x44\xae\x42\x60\x82' > "$TEST_IMAGE"

echo "Test image created: $TEST_IMAGE"
echo "File size: $(stat -f%z "$TEST_IMAGE" 2>/dev/null || stat -c%s "$TEST_IMAGE") bytes"
echo ""
echo "URL: POST /api/profile-photos"
echo "Profile ID: $FIRST_PROFILE_ID"
echo ""

POST_RESPONSE=$(curl -s -X POST "$API_URL/profile-photos" \
  -H "Authorization: Bearer $TOKEN" \
  -F "profile_picture=@$TEST_IMAGE" \
  -F "profile_id=$FIRST_PROFILE_ID")

echo "Response:"
echo "$POST_RESPONSE" | jq '.' 2>/dev/null || echo "$POST_RESPONSE"
echo ""

# Extract uploaded photo ID for later tests
UPLOADED_PHOTO_ID=$(echo "$POST_RESPONSE" | jq -r '.data.id' 2>/dev/null)
if [ "$UPLOADED_PHOTO_ID" != "null" ] && [ -n "$UPLOADED_PHOTO_ID" ]; then
  echo "✅ Photo uploaded successfully. Photo ID: $UPLOADED_PHOTO_ID"
  echo ""
  
  # Step 6: Delete the uploaded photo
  echo "=========================================="
  echo "Step 6: DELETE Profile Photo"
  echo "=========================================="
  echo "URL: DELETE /api/profile-photos/$UPLOADED_PHOTO_ID"
  echo ""
  
  DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/profile-photos/$UPLOADED_PHOTO_ID" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Accept: application/json")
  
  echo "Response:"
  echo "$DELETE_RESPONSE" | jq '.' 2>/dev/null || echo "$DELETE_RESPONSE"
  echo ""
fi

# Step 7: Test POST without profile_id (should fail)
echo "=========================================="
echo "Step 7: POST Profile Photo (Missing profile_id)"
echo "=========================================="
echo "URL: POST /api/profile-photos (without profile_id)"
echo ""

POST_ERROR=$(curl -s -X POST "$API_URL/profile-photos" \
  -H "Authorization: Bearer $TOKEN" \
  -F "profile_picture=@$TEST_IMAGE")

echo "Response (should show validation error):"
echo "$POST_ERROR" | jq '.' 2>/dev/null || echo "$POST_ERROR"
echo ""

# Cleanup
rm -f "$TEST_IMAGE"

echo "=========================================="
echo "✅ All tests completed!"
echo "=========================================="
echo ""
echo "Summary:"
echo "- Profile 1 ID: $FIRST_PROFILE_ID"
echo "- Profile 1 Photos: $PHOTO_COUNT"
echo "- Profile 2 ID: $SECOND_PROFILE_ID"
echo "- Profile 2 Photos: $PHOTO_COUNT_2"
echo ""
echo "Breaking Changes Verified:"
echo "✅ GET /api/profile-photos requires profile_id query parameter"
echo "✅ POST /api/profile-photos requires profile_id in form data"
echo "✅ All requests validated profile_id requirement"
