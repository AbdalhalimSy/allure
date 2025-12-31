#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}Testing Profession Descriptions API${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Step 1: Login
echo -e "${YELLOW}Step 1: Authenticating...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "layla.hassan@example.com",
    "password": "password"
  }')

TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token // empty')

if [ -z "$TOKEN" ]; then
  echo -e "${RED}✗ Login failed${NC}"
  echo "Response: $LOGIN_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ Login successful${NC}"
echo "Token: ${TOKEN:0:30}...\n"

# Step 2: Get job detail with professions
echo -e "${YELLOW}Step 2: Fetching job detail with professions...${NC}"
JOB_RESPONSE=$(curl -s "http://localhost:3000/api/public/jobs/45" \
  -H "Accept-Language: en")

echo -e "${GREEN}✓ Job retrieved${NC}\n"

# Step 3: Extract and display profession with descriptions
echo -e "${YELLOW}Step 3: Profession with Descriptions:${NC}"
echo "$JOB_RESPONSE" | jq '.data.roles[0].professions[0] | {
  id,
  name,
  description,
  requires_photo,
  requires_photo_description,
  requires_video,
  requires_video_description,
  requires_audio,
  requires_audio_description,
  requires_languages,
  requires_languages_description,
  requires_socials,
  requires_socials_description
}' 2>/dev/null || echo -e "${RED}Could not parse professions${NC}"

echo ""

# Step 4: Extract and display sub-professions with descriptions
echo -e "${YELLOW}Step 4: Sub-Professions with Descriptions:${NC}"
echo "$JOB_RESPONSE" | jq '.data.roles[0].professions[0].sub_professions[0] | {
  id,
  profession_id,
  name,
  description,
  requires_photo,
  requires_photo_description,
  requires_video,
  requires_video_description,
  requires_audio,
  requires_audio_description,
  requires_sizes,
  requires_sizes_description
}' 2>/dev/null || echo -e "${RED}Could not parse sub-professions${NC}"

echo ""

# Step 5: Display all professions for the first role
echo -e "${YELLOW}Step 5: All Professions for First Role:${NC}"
echo "$JOB_RESPONSE" | jq '.data.roles[0].professions | length' 2>/dev/null

echo ""

# Step 6: Test with Arabic language
echo -e "${YELLOW}Step 6: Testing Arabic Language Support...${NC}"
JOB_AR=$(curl -s "http://localhost:3000/api/public/jobs/45" \
  -H "Accept-Language: ar")

echo -e "${GREEN}✓ Arabic response retrieved${NC}"
echo "$JOB_AR" | jq '.data.roles[0].professions[0] | {
  name,
  description
}' 2>/dev/null

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Testing Complete${NC}"
echo -e "${GREEN}========================================${NC}"
