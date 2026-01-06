#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# API URLs
BACKEND_URL="${BACKEND_URL:-https://allureportal.sawatech.ae}"
NEXTJS_URL="${NEXTJS_URL:-http://localhost:3000}"

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}   Main Banners API Test Suite      ${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "${YELLOW}Backend URL: ${BACKEND_URL}${NC}"
echo -e "${YELLOW}Next.js URL: ${NEXTJS_URL}${NC}"
echo ""

# Test 1: Get banners through Next.js proxy (English)
echo -e "${GREEN}Test 1: Fetching banners via Next.js proxy (English)${NC}"
echo -e "${YELLOW}Request: GET ${NEXTJS_URL}/api/banners${NC}"
RESPONSE=$(curl -X GET "${NEXTJS_URL}/api/banners" \
  -H "Accept: application/json" \
  -H "Accept-Language: en" \
  -w "\nHTTP_STATUS:%{http_code}" \
  -s)

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_STATUS:[0-9]*" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTP_STATUS:[0-9]*$//')

echo "$BODY" | jq '.'
echo -e "HTTP Status: ${HTTP_CODE}\n"
echo "-----------------------------------"
echo ""

# Test 2: Get banners through Next.js proxy (Arabic)
echo -e "${GREEN}Test 2: Fetching banners via Next.js proxy (Arabic)${NC}"
echo -e "${YELLOW}Request: GET ${NEXTJS_URL}/api/banners with Accept-Language: ar${NC}"
RESPONSE=$(curl -X GET "${NEXTJS_URL}/api/banners" \
  -H "Accept: application/json" \
  -H "Accept-Language: ar" \
  -w "\nHTTP_STATUS:%{http_code}" \
  -s)

HTTP_CODE=$(echo "$RESPONSE" | grep -o "HTTP_STATUS:[0-9]*" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTP_STATUS:[0-9]*$//')

echo "$BODY" | jq '.'
echo -e "HTTP Status: ${HTTP_CODE}\n"
echo "-----------------------------------"
echo ""

# Test 3: Verify response structure
echo -e "${GREEN}Test 3: Verify response structure${NC}"
echo -e "${YELLOW}Checking for required fields: success, data, id, title, media_url, media_type, sort_order${NC}"
RESPONSE=$(curl -X GET "${NEXTJS_URL}/api/banners" \
  -H "Accept: application/json" \
  -s)

echo "$RESPONSE" | jq '.'

# Check if response has success field
if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ 'success' field exists${NC}"
else
  echo -e "${RED}✗ 'success' field missing${NC}"
fi

# Check if response has data array
if echo "$RESPONSE" | jq -e '.data | type == "array"' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ 'data' is an array${NC}"
else
  echo -e "${RED}✗ 'data' is not an array${NC}"
fi

# Check banner fields
BANNER_COUNT=$(echo "$RESPONSE" | jq '.data | length' 2>/dev/null || echo "0")
if [ "$BANNER_COUNT" -gt 0 ]; then
  echo -e "${GREEN}✓ Found $BANNER_COUNT banner(s)${NC}"
  
  # Check first banner structure
  HAS_ID=$(echo "$RESPONSE" | jq -e '.data[0].id' > /dev/null 2>&1 && echo "yes" || echo "no")
  HAS_TITLE=$(echo "$RESPONSE" | jq -e '.data[0] | has("title")' > /dev/null 2>&1 && echo "yes" || echo "no")
  HAS_MEDIA_URL=$(echo "$RESPONSE" | jq -e '.data[0].media_url' > /dev/null 2>&1 && echo "yes" || echo "no")
  HAS_MEDIA_TYPE=$(echo "$RESPONSE" | jq -e '.data[0].media_type' > /dev/null 2>&1 && echo "yes" || echo "no")
  HAS_SORT_ORDER=$(echo "$RESPONSE" | jq -e '.data[0] | has("sort_order")' > /dev/null 2>&1 && echo "yes" || echo "no")
  
  [ "$HAS_ID" = "yes" ] && echo -e "${GREEN}✓ 'id' field exists${NC}" || echo -e "${RED}✗ 'id' field missing${NC}"
  [ "$HAS_TITLE" = "yes" ] && echo -e "${GREEN}✓ 'title' field exists${NC}" || echo -e "${RED}✗ 'title' field missing${NC}"
  [ "$HAS_MEDIA_URL" = "yes" ] && echo -e "${GREEN}✓ 'media_url' field exists${NC}" || echo -e "${RED}✗ 'media_url' field missing${NC}"
  [ "$HAS_MEDIA_TYPE" = "yes" ] && echo -e "${GREEN}✓ 'media_type' field exists${NC}" || echo -e "${RED}✗ 'media_type' field missing${NC}"
  [ "$HAS_SORT_ORDER" = "yes" ] && echo -e "${GREEN}✓ 'sort_order' field exists${NC}" || echo -e "${RED}✗ 'sort_order' field missing${NC}"
  
  # Display media types
  echo ""
  echo -e "${BLUE}Media types found:${NC}"
  echo "$RESPONSE" | jq -r '.data[] | "  - \(.media_type): \(.media_url | split("/") | last)"'
  
  # Display titles
  echo ""
  echo -e "${BLUE}Banner titles:${NC}"
  echo "$RESPONSE" | jq -r '.data[] | "  - \(.title // "No title")"'
else
  echo -e "${YELLOW}⚠ No banners found (might be expected if none are active)${NC}"
fi

echo ""
echo "-----------------------------------"
echo ""

# Test 4: Test performance
echo -e "${GREEN}Test 4: Response time check${NC}"
echo -e "${YELLOW}Measuring API response time...${NC}"
TIME_OUTPUT=$(curl -X GET "${NEXTJS_URL}/api/banners" \
  -H "Accept: application/json" \
  -w "\nTime Total: %{time_total}s\nTime Connect: %{time_connect}s\n" \
  -s -o /dev/null)
echo "$TIME_OUTPUT"
echo ""

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}   Tests Complete!                   ${NC}"
echo -e "${BLUE}=====================================${NC}"
echo ""
echo -e "${YELLOW}Notes:${NC}"
echo "1. Tests are run against the Next.js proxy at ${NEXTJS_URL}/api/banners"
echo "2. The proxy forwards requests to the backend with proper API keys"
echo "3. Banners are filtered to show only active banners"
echo "4. Results are sorted by sort_order (asc) then created_at (desc)"
echo "5. Titles are localized based on Accept-Language header"
echo "6. If no banners are returned, check the backend database"
echo ""
echo -e "${YELLOW}To run this test:${NC}"
echo "1. Start the Next.js dev server: npm run dev"
echo "2. Run this script: ./test_banners_api.sh"
echo "3. (Optional) Specify custom URLs: NEXTJS_URL=http://localhost:3000 ./test_banners_api.sh"
echo ""
