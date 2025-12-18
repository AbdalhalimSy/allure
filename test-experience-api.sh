#!/bin/bash

# Experience API Testing Script
# Test the updated experience API with the correct fields

BASE_URL="http://localhost:3000"
EMAIL="layla.hassan@example.com"
PASSWORD="password"
PROFILE_ID="28"

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Experience API Testing Script ===${NC}\n"

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
    echo $LOGIN_RESPONSE | jq .
    exit 1
fi

echo ""

# Step 2: Get existing experiences
echo -e "${YELLOW}Step 2: Get existing experiences${NC}"
GET_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/profile/experiences?profile_id=${PROFILE_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

echo $GET_RESPONSE | jq .
EXPERIENCES=$(echo $GET_RESPONSE | jq -r '.data | length')
echo -e "${GREEN}✓ Found ${EXPERIENCES} experiences${NC}"

echo ""

# Step 3: Test adding experience with dates
echo -e "${YELLOW}Step 3: Add experience with dates${NC}"
ADD_RESPONSE=$(curl -s -X POST "${BASE_URL}/api/profile/sync-experiences" \
  -H "Authorization: Bearer ${TOKEN}" \
  -F "profile_id=${PROFILE_ID}" \
  -F "experiences[0][title]=Senior Photographer" \
  -F "experiences[0][start_date]=2018-03-15" \
  -F "experiences[0][end_date]=2022-08-30" \
  -F "experiences[0][is_current]=0" \
  -F "experiences[0][description]=Led photography projects for major brands" \
  -F "experiences[1][title]=Creative Director" \
  -F "experiences[1][start_date]=2022-09-01" \
  -F "experiences[1][is_current]=1" \
  -F "experiences[1][description]=Leading creative team at Allure")

if echo $ADD_RESPONSE | jq -e '.status == "success"' > /dev/null; then
    echo -e "${GREEN}✓ Experiences added successfully${NC}"
    echo $ADD_RESPONSE | jq '.data'
else
    ERROR=$(echo $ADD_RESPONSE | jq -r '.error // .message')
    echo -e "${RED}✗ Failed: ${ERROR}${NC}"
    echo $ADD_RESPONSE | jq .
fi

echo ""

# Step 4: Verify the experiences were saved
echo -e "${YELLOW}Step 4: Verify experiences${NC}"
VERIFY_RESPONSE=$(curl -s -X GET "${BASE_URL}/api/profile/experiences?profile_id=${PROFILE_ID}" \
  -H "Authorization: Bearer ${TOKEN}")

echo $VERIFY_RESPONSE | jq '.data[] | {title, start_date, end_date, is_current}'
echo -e "${GREEN}✓ Verification complete${NC}"

echo ""
echo -e "${YELLOW}=== Testing Complete ===${NC}"
