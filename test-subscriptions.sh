#!/bin/bash

# Subscription API Testing Script
# This script tests all subscription endpoints with the provided credentials

# Configuration
BASE_URL="https://allureportal.sawatech.ae/api"
EMAIL="layla.hassan@example.com"
PASSWORD="password"
API_KEY="${API_KEY:-51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d}"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "======================================"
echo "Subscription API Testing"
echo "======================================"
echo ""

# Step 1: Login to get token
echo -e "${YELLOW}Step 1: Logging in...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "v-api-key: $API_KEY" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "Login Response: $LOGIN_RESPONSE"
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token // .token // empty')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Failed to login. Please check credentials and API key.${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Login successful!${NC}"
echo "Token: ${TOKEN:0:20}..."
echo ""

# Get profile ID from login response
PROFILE_ID=$(echo $LOGIN_RESPONSE | jq -r '.data.user.talent.profiles[0].id // .user.talent.profiles[0].id // empty')

if [ -z "$PROFILE_ID" ]; then
  echo -e "${RED}❌ No profile found for user${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Profile ID: $PROFILE_ID${NC}"
echo ""

# Step 2: Get available packages (public endpoint)
echo -e "${YELLOW}Step 2: Fetching available packages...${NC}"
PACKAGES_RESPONSE=$(curl -s -X GET "$BASE_URL/subscriptions/packages" \
  -H "Accept: application/json" \
  -H "v-api-key: $API_KEY")

echo "Packages Response:"
echo $PACKAGES_RESPONSE | jq '.'
echo ""

PACKAGE_ID=$(echo $PACKAGES_RESPONSE | jq -r '.data.packages[0].id // empty')
PACKAGE_NAME=$(echo $PACKAGES_RESPONSE | jq -r '.data.packages[0].name // empty')

if [ -z "$PACKAGE_ID" ]; then
  echo -e "${RED}❌ No packages available${NC}"
  exit 1
fi

echo -e "${GREEN}✓ Found packages. Using: $PACKAGE_NAME (ID: $PACKAGE_ID)${NC}"
echo ""

# Step 3: Check subscription status
echo -e "${YELLOW}Step 3: Checking subscription status...${NC}"
STATUS_RESPONSE=$(curl -s -X GET "$BASE_URL/subscriptions/status?profile_id=$PROFILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "v-api-key: $API_KEY")

echo "Status Response:"
echo $STATUS_RESPONSE | jq '.'
echo ""

# Step 4: Validate coupon (optional - will fail if no valid coupon)
echo -e "${YELLOW}Step 4: Testing coupon validation (optional)...${NC}"
COUPON_RESPONSE=$(curl -s -X POST "$BASE_URL/subscriptions/validate-coupon" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "v-api-key: $API_KEY" \
  -d "{
    \"profile_id\": $PROFILE_ID,
    \"code\": \"SUMMER2024\",
    \"package_id\": $PACKAGE_ID
  }")

echo "Coupon Response:"
echo $COUPON_RESPONSE | jq '.'
echo ""

# Step 5: Create subscription
echo -e "${YELLOW}Step 5: Creating subscription...${NC}"
PAYMENT_REF="PAY_TEST_$(date +%s)_$(openssl rand -hex 4 | tr '[:lower:]' '[:upper:]')"
PACKAGE_PRICE=$(echo $PACKAGES_RESPONSE | jq -r '.data.packages[0].price // 99.00')

CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/subscriptions/create" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "v-api-key: $API_KEY" \
  -d "{
    \"profile_id\": $PROFILE_ID,
    \"package_id\": $PACKAGE_ID,
    \"payment_reference\": \"$PAYMENT_REF\",
    \"payment_method\": \"credit_card\",
    \"amount_paid\": $PACKAGE_PRICE
  }")

echo "Create Subscription Response:"
echo $CREATE_RESPONSE | jq '.'
echo ""

if echo $CREATE_RESPONSE | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Subscription created successfully!${NC}"
else
  echo -e "${YELLOW}⚠ Subscription creation may have failed. Check response above.${NC}"
fi
echo ""

# Step 6: Get subscription history
echo -e "${YELLOW}Step 6: Fetching subscription history...${NC}"
HISTORY_RESPONSE=$(curl -s -X GET "$BASE_URL/subscriptions/history?profile_id=$PROFILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "v-api-key: $API_KEY")

echo "History Response:"
echo $HISTORY_RESPONSE | jq '.'
echo ""

# Step 7: Get payment history
echo -e "${YELLOW}Step 7: Fetching payment history...${NC}"
PAYMENTS_RESPONSE=$(curl -s -X GET "$BASE_URL/subscriptions/payments?profile_id=$PROFILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" \
  -H "v-api-key: $API_KEY")

echo "Payment History Response:"
echo $PAYMENTS_RESPONSE | jq '.'
echo ""

echo "======================================"
echo -e "${GREEN}Testing Complete!${NC}"
echo "======================================"
