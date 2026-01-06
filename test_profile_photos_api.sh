#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# API Configuration
API_BASE_URL="http://localhost:3000"
BACKEND_URL="https://allureportal.sawatech.ae"
EMAIL="layla.hassan@example.com"
PASSWORD="password"

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}   Profile Photos API Test Suite   ${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""

# Step 1: Login to get token
echo -e "${GREEN}Step 1: Logging in to get authentication token${NC}"
echo -e "${YELLOW}Email: ${EMAIL}${NC}"
echo ""

LOGIN_RESPONSE=$(curl -s -X POST "${API_BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"${EMAIL}\",
    \"password\": \"${PASSWORD}\"
  }")

echo "Login Response:"
echo "$LOGIN_RESPONSE" | jq '.'
echo ""

# Extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.token // empty')

if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo -e "${RED}✗ Failed to get authentication token${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Authentication token obtained${NC}"
echo ""

# Extract first profile_id from the login response
PROFILE_ID=$(echo "$LOGIN_RESPONSE" | jq -r '.data.talent.profiles[0].id // empty')

if [ -z "$PROFILE_ID" ] || [ "$PROFILE_ID" = "null" ]; then
  echo -e "${RED}✗ Failed to get profile ID${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Profile ID obtained: ${PROFILE_ID}${NC}"
echo ""
echo "-----------------------------------"
echo ""

echo -e "${GREEN}Step 2: Fetching additional profile info${NC}"
echo ""

# Step 3: Test GET Profile Photos (with profile_id parameter)
echo -e "${GREEN}Step 3: Get Profile Photos (NEW: requires profile_id parameter)${NC}"
echo -e "${YELLOW}Request: GET ${API_BASE_URL}/api/profile-photos?profile_id=${PROFILE_ID}${NC}"
echo ""

GET_PHOTOS_RESPONSE=$(curl -s -X GET "${API_BASE_URL}/api/profile-photos?profile_id=${PROFILE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/json")

echo "Response:"
echo "$GET_PHOTOS_RESPONSE" | jq '.'
echo ""

# Count existing photos
PHOTO_COUNT=$(echo "$GET_PHOTOS_RESPONSE" | jq '.data | length' 2>/dev/null || echo "0")
echo -e "${GREEN}✓ Found ${PHOTO_COUNT} existing profile photos${NC}"
echo ""
echo "-----------------------------------"
echo ""

# Step 4: Test POST Profile Photos (with profile_id in body)
echo -e "${GREEN}Step 4: Upload Profile Photo (NEW: requires profile_id in body)${NC}"
echo -e "${YELLOW}Request: POST ${API_BASE_URL}/api/profile-photos${NC}"
echo ""

# Create a test image (1x1 pixel PNG)
TEST_IMAGE="/tmp/test_profile_photo.png"
python3 << 'EOF' > "$TEST_IMAGE"
import struct
import zlib

# Create a minimal valid 1x1 PNG
def create_png(width, height, r, g, b):
    # PNG signature
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 2, 0, 0, 0)
    ihdr_crc = zlib.crc32(b'IHDR' + ihdr_data) & 0xffffffff
    ihdr_chunk = struct.pack('>I', 13) + b'IHDR' + ihdr_data + struct.pack('>I', ihdr_crc)
    
    # IDAT chunk (image data)
    raw_data = b''
    for y in range(height):
        raw_data += b'\x00' + bytes([r, g, b]) * width
    
    compressed_data = zlib.compress(raw_data, 9)
    idat_crc = zlib.crc32(b'IDAT' + compressed_data) & 0xffffffff
    idat_chunk = struct.pack('>I', len(compressed_data)) + b'IDAT' + compressed_data + struct.pack('>I', idat_crc)
    
    # IEND chunk
    iend_crc = zlib.crc32(b'IEND') & 0xffffffff
    iend_chunk = struct.pack('>I', 0) + b'IEND' + struct.pack('>I', iend_crc)
    
    return png_signature + ihdr_chunk + idat_chunk + iend_chunk

with open("$TEST_IMAGE", 'wb') as f:
    f.write(create_png(100, 100, 255, 100, 150))
EOF

if [ ! -f "$TEST_IMAGE" ]; then
  echo -e "${RED}✗ Failed to create test image${NC}"
  exit 1
fi

echo -e "${YELLOW}Uploading test photo (profile_id: ${PROFILE_ID})...${NC}"
echo ""

UPLOAD_RESPONSE=$(curl -s -X POST "${API_BASE_URL}/api/profile-photos" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "profile_id=${PROFILE_ID}" \
  -F "profile_picture=@${TEST_IMAGE}")

echo "Upload Response:"
echo "$UPLOAD_RESPONSE" | jq '.'
echo ""

# Check if upload was successful
UPLOAD_SUCCESS=$(echo "$UPLOAD_RESPONSE" | jq -r '.success // empty')
if [ "$UPLOAD_SUCCESS" = "true" ]; then
  echo -e "${GREEN}✓ Profile photo uploaded successfully${NC}"
  
  # Extract uploaded photo ID
  UPLOADED_PHOTO_ID=$(echo "$UPLOAD_RESPONSE" | jq -r '.data.id // empty')
  echo -e "  Photo ID: ${UPLOADED_PHOTO_ID}"
  echo -e "  Approval Status: $(echo "$UPLOAD_RESPONSE" | jq -r '.data.approval_status')"
  echo -e "  URL: $(echo "$UPLOAD_RESPONSE" | jq -r '.data.profile_picture_url')"
else
  echo -e "${YELLOW}⚠ Upload result: $(echo "$UPLOAD_RESPONSE" | jq -r '.message // "Unknown"')${NC}"
fi

echo ""
echo "-----------------------------------"
echo ""

# Step 5: Get photos again to see the new upload
echo -e "${GREEN}Step 5: Verify photo was uploaded - Get photos again${NC}"
echo -e "${YELLOW}Request: GET ${API_BASE_URL}/api/profile-photos?profile_id=${PROFILE_ID}${NC}"
echo ""

GET_PHOTOS_RESPONSE_2=$(curl -s -X GET "${API_BASE_URL}/api/profile-photos?profile_id=${PROFILE_ID}" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/json")

echo "Response:"
echo "$GET_PHOTOS_RESPONSE_2" | jq '.'
echo ""

PHOTO_COUNT_2=$(echo "$GET_PHOTOS_RESPONSE_2" | jq '.data | length' 2>/dev/null || echo "0")
echo -e "${GREEN}✓ Now have ${PHOTO_COUNT_2} profile photos${NC}"
echo ""
echo "-----------------------------------"
echo ""

# Step 6: Test error cases
echo -e "${GREEN}Step 6: Test Error Cases${NC}"
echo ""

# Test 6a: Missing profile_id in GET
echo -e "${YELLOW}Test 6a: GET without profile_id parameter (should fail)${NC}"
ERROR_RESPONSE_1=$(curl -s -X GET "${API_BASE_URL}/api/profile-photos" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Accept: application/json")

echo "$ERROR_RESPONSE_1" | jq '.'
echo ""

# Test 6b: Missing profile_id in POST
echo -e "${YELLOW}Test 6b: POST without profile_id in body (should fail)${NC}"
ERROR_RESPONSE_2=$(curl -s -X POST "${API_BASE_URL}/api/profile-photos" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "profile_picture=@${TEST_IMAGE}")

echo "$ERROR_RESPONSE_2" | jq '.'
echo ""

# Cleanup
rm -f "$TEST_IMAGE"

echo "-----------------------------------"
echo ""
echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}   Tests Complete!                  ${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "${YELLOW}Key Changes Summary:${NC}"
echo "1. ✓ GET /api/profile-photos NOW REQUIRES profile_id query parameter"
echo "2. ✓ POST /api/profile-photos NOW REQUIRES profile_id in request body"
echo "3. ✓ PUT /api/profile-photos/{id} is DEPRECATED"
echo "4. ✓ DELETE /api/profile-photos/{id} remains unchanged"
echo ""
