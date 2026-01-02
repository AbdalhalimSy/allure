#!/bin/bash

# Comprehensive test script for the empty Job Locations feature

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  EMPTY JOB LOCATIONS & APPLICATION TIPS FEATURE TEST      ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Step 1: Login
echo -e "${BLUE}[1/4] Authenticating...${NC}"
LOGIN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"layla.hassan@example.com","password":"password"}')

TOKEN=$(echo "$LOGIN" | jq -r '.data.token' 2>/dev/null)
if [ -z "$TOKEN" ] || [ "$TOKEN" = "null" ]; then
  echo -e "${RED}✗ Authentication failed${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Authentication successful${NC}"
echo ""

# Step 2: Test Job 45 (Empty locations)
echo -e "${BLUE}[2/4] Testing Job 45 (Empty Job Countries)...${NC}"
JOB_45=$(curl -s "http://localhost:3000/api/jobs/45?profile_id=28" \
  -H "Authorization: Bearer $TOKEN" 2>/dev/null)

TITLE_45=$(echo "$JOB_45" | jq -r '.data.title' 2>/dev/null)
COUNTRIES_45=$(echo "$JOB_45" | jq '.data.job_countries | length' 2>/dev/null)

echo "  Job Title: $TITLE_45"
echo "  Job Countries Count: $COUNTRIES_45"

if [ "$COUNTRIES_45" = "0" ]; then
  echo -e "${GREEN}✓ Job 45 correctly has empty job_countries${NC}"
else
  echo -e "${RED}✗ Job 45 should have empty job_countries${NC}"
fi
echo ""

# Step 3: Verify Translations
echo -e "${BLUE}[3/4] Verifying Translations...${NC}"

EN_FILE="src/lib/locales/en/jobs.json"
AR_FILE="src/lib/locales/ar/jobs.json"

for KEY in "applicationTips" "tipReviewRequirements" "tipUpdatePortfolio" "tipRespondPromptly"; do
  EN_VAL=$(grep -q "\"$KEY\"" "$EN_FILE" && echo "found" || echo "missing")
  AR_VAL=$(grep -q "\"$KEY\"" "$AR_FILE" && echo "found" || echo "missing")
  
  if [ "$EN_VAL" = "found" ] && [ "$AR_VAL" = "found" ]; then
    echo -e "  ${GREEN}✓ $KEY${NC} (EN & AR)"
  else
    echo -e "  ${RED}✗ $KEY${NC} (EN: $EN_VAL, AR: $AR_VAL)"
  fi
done
echo ""

# Step 4: Verify Component Implementation
echo -e "${BLUE}[4/4] Verifying Component Implementation...${NC}"

COMPONENT_FILE="src/app/jobs/[id]/_components/JobDetailSidebar.tsx"

if grep -q "const hasCountries = jobCountries && jobCountries.length > 0;" "$COMPONENT_FILE"; then
  echo -e "  ${GREEN}✓ Conditional rendering check implemented${NC}"
else
  echo -e "  ${RED}✗ Conditional rendering check missing${NC}"
fi

if grep -q "{hasCountries && (" "$COMPONENT_FILE"; then
  echo -e "  ${GREEN}✓ Job Locations box conditionally rendered${NC}"
else
  echo -e "  ${RED}✗ Job Locations box conditional rendering missing${NC}"
fi

if grep -q 't("jobs.jobDetail.applicationTips")' "$COMPONENT_FILE"; then
  echo -e "  ${GREEN}✓ Application Tips uses i18n${NC}"
else
  echo -e "  ${RED}✗ Application Tips i18n missing${NC}"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                    TEST COMPLETE ✓                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Expected Behavior:"
echo "  • Job 45 will NOT show the 'Job Locations' box"
echo "  • All jobs WILL show the 'Application Tips' box"
echo "  • Text displays in user's selected language (EN or AR)"
echo ""
