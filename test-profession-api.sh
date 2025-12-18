#!/bin/bash

# Profession API Testing Script
# This script demonstrates all working scenarios for the profession API

# Set variables
BASE_URL="http://localhost:3000"
EMAIL="layla.hassan@example.com"
PASSWORD="password"
PROFILE_ID="28"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Profession API Testing Script ===${NC}\n"

# Step 1: Login
echo -e "${YELLOW}Step 1: Login${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    echo "Token: ${TOKEN:0:20}..."
else
    echo -e "${RED}✗ Login failed${NC}"
    exit 1
fi

echo ""

# Step 2: Get existing professions
echo -e "${YELLOW}Step 2: Get existing professions${NC}"
GET_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/profile/professions?profile_id=${PROFILE_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

PROFESSIONS=$(echo $GET_RESPONSE | jq -r '.data | length')
echo -e "${GREEN}✓ Found ${PROFESSIONS} professions${NC}"
echo $GET_RESPONSE | jq '.data | map({profession: .profession.name})'

echo ""

# Step 3: Test adding single profession with photo (JPG - Valid)
echo -e "${YELLOW}Step 3: Add profession with JPG image (Valid)${NC}"
ADD_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/profile/sync-professions" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "profile_id=${PROFILE_ID}" \
  -F "professions[0][profession_id]=3" \
  -F "professions[0][photo]=@public/test/testing-image2.jpg")

if echo $ADD_RESPONSE | jq -e '.status == "success"' > /dev/null; then
    echo -e "${GREEN}✓ Profession added successfully${NC}"
else
    ERROR=$(echo $ADD_RESPONSE | jq -r '.error // .message')
    echo -e "${RED}✗ Failed: ${ERROR}${NC}"
fi

echo ""

# Step 4: Test with invalid format (WEBP - Invalid)
echo -e "${YELLOW}Step 4: Try to add profession with WEBP image (Invalid - Should Fail)${NC}"
WEBP_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/profile/sync-professions" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "profile_id=${PROFILE_ID}" \
  -F "professions[0][profession_id]=4" \
  -F "professions[0][photo]=@public/test/testing-image1.webp")

if echo $WEBP_RESPONSE | jq -e '.error' > /dev/null; then
    ERROR=$(echo $WEBP_RESPONSE | jq -r '.error')
    echo -e "${GREEN}✓ Correctly rejected: ${ERROR}${NC}"
else
    echo -e "${RED}✗ Should have been rejected but wasn't${NC}"
fi

echo ""

# Step 5: Add profession with photo and video
echo -e "${YELLOW}Step 5: Add profession with photo and video${NC}"
MULTI_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/profile/sync-professions" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "profile_id=${PROFILE_ID}" \
  -F "professions[0][profession_id]=2" \
  -F "professions[0][sub_profession_id]=210" \
  -F "professions[0][photo]=@public/test/testing-image2.jpg" \
  -F "professions[0][video]=@public/test/test-video.mp4")

if echo $MULTI_RESPONSE | jq -e '.status == "success"' > /dev/null; then
    echo -e "${GREEN}✓ Profession with photo and video added successfully${NC}"
else
    ERROR=$(echo $MULTI_RESPONSE | jq -r '.error // .message')
    echo -e "${RED}✗ Failed: ${ERROR}${NC}"
fi

echo ""

# Step 6: Test validation - missing required fields
echo -e "${YELLOW}Step 6: Try to add profession without required photo (Should Fail)${NC}"
VALIDATION_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/profile/sync-professions" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "profile_id=${PROFILE_ID}" \
  -F "professions[0][profession_id]=2" \
  -F "professions[0][sub_profession_id]=210")

if echo $VALIDATION_RESPONSE | jq -e '.error' > /dev/null; then
    ERROR=$(echo $VALIDATION_RESPONSE | jq -r '.error')
    echo -e "${GREEN}✓ Correctly rejected: ${ERROR}${NC}"
else
    echo -e "${RED}✗ Should have been rejected but wasn't${NC}"
fi

echo ""

# Step 7: Final status
echo -e "${YELLOW}Step 7: Get final profession list${NC}"
FINAL_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/profile/professions?profile_id=${PROFILE_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

FINAL_COUNT=$(echo $FINAL_RESPONSE | jq -r '.data | length')
echo -e "${GREEN}✓ Final profession count: ${FINAL_COUNT}${NC}"
echo $FINAL_RESPONSE | jq '.data | map({profession: .profession.name, media_count: .media | length})'

echo ""
echo -e "${YELLOW}=== Testing Complete ===${NC}"
