# Job Detail Page - Curl Testing Commands Reference

Quick reference for testing the job detail page API endpoints.

## 1. Authentication Test

### Login with Credentials
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "layla.hassan@example.com",
    "password": "password"
  }' | jq '.'
```

**Expected Response**:
```json
{
  "status": "success",
  "message": "Login successful.",
  "data": {
    "token": "...",
    "token_type": "Bearer",
    "user": {...},
    "talent": {...}
  }
}
```

---

## 2. Job Discovery Tests

### Get All Available Jobs
```bash
curl http://localhost:3000/api/public/jobs \
  -H "Accept-Language: en" \
  -H "Content-Type: application/json" | jq '.'
```

### Get Job List with Filtering
```bash
curl http://localhost:3000/api/public/jobs?page=1&per_page=10 \
  -H "Accept-Language: en" | jq '.data[] | {id, title}'
```

---

## 3. Job Detail Tests

### Public Job Detail (No Authentication)
```bash
curl http://localhost:3000/api/public/jobs/45 \
  -H "Accept-Language: en" | jq '.'
```

### Extract Job Information
```bash
curl http://localhost:3000/api/public/jobs/45 \
  -H "Accept-Language: en" | jq '{
    id: .data.id,
    title: .data.title,
    description: .data.description,
    roles_count: (.data.roles | length),
    expiration_date: .data.expiration_date,
    allow_multiple: .data.allow_multiple_role_applications
  }'
```

### Authenticated Job Detail
```bash
TOKEN="your_token_here"
PROFILE_ID=28

curl "http://localhost:3000/api/jobs/45?profile_id=$PROFILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: en" | jq '.'
```

---

## 4. Role Information Tests

### Get First Role Details
```bash
curl http://localhost:3000/api/public/jobs/45 \
  -H "Accept-Language: en" | jq '.data.roles[0]'
```

### Extract Role Requirements
```bash
curl http://localhost:3000/api/public/jobs/45 \
  -H "Accept-Language: en" | jq '.data.roles[0] | {
    id: .id,
    name: .name,
    age_range: "\(.start_age)-\(.end_age)",
    gender: .gender,
    professions: .professions,
    can_apply: .can_apply,
    eligibility_score: .eligibility_score
  }'
```

### Get Physical Requirements
```bash
curl http://localhost:3000/api/public/jobs/45 \
  -H "Accept-Language: en" | jq '.data.roles[0].meta_conditions[0]'
```

### Get Application Conditions
```bash
curl http://localhost:3000/api/public/jobs/45 \
  -H "Accept-Language: en" | jq '.data.roles[0].conditions'
```

---

## 5. Call Time Scheduling Tests

### Check if Call Time is Enabled
```bash
curl http://localhost:3000/api/public/jobs/45 \
  -H "Accept-Language: en" | jq '.data.roles[0].call_time_enabled'
```

### Get Call Time Availability
```bash
TOKEN="your_token_here"
PROFILE_ID=28

curl "http://localhost:3000/api/jobs/45?profile_id=$PROFILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: en" | jq '.data.roles[0].call_time_slots'
```

### Get Available Time Slots
```bash
TOKEN="your_token_here"
PROFILE_ID=28

curl "http://localhost:3000/api/jobs/45?profile_id=$PROFILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: en" | jq '.data.roles[0].call_time_slots[0].slots[0].available_times'
```

---

## 6. User Profile Tests

### Get User Profile Information
```bash
TOKEN="your_token_here"

curl "http://localhost:3000/api/user/profile" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: en" | jq '.'
```

### Get User's Primary Profile
```bash
TOKEN="your_token_here"

curl http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "layla.hassan@example.com",
    "password": "password"
  }' | jq '.data.talent.primary_profile_id'
```

---

## 7. Eligibility Tests

### Check Eligibility for a Role
```bash
curl http://localhost:3000/api/public/jobs/45 \
  -H "Accept-Language: en" | jq '.data.roles[0] | {
    name: .name,
    can_apply: .can_apply,
    eligibility_score: .eligibility_score,
    reasons: .reasons
  }'
```

### Get All Eligibility Information
```bash
curl http://localhost:3000/api/public/jobs/45 \
  -H "Accept-Language: en" | jq '.data.roles | map({
    role_name: .name,
    can_apply: .can_apply,
    score: .eligibility_score,
    applied: .has_applied
  })'
```

---

## 8. Multiple Job Tests

### Test Multiple Job IDs
```bash
for JOB_ID in 45 46 47 48 49; do
  echo "Testing Job ID: $JOB_ID"
  curl http://localhost:3000/api/public/jobs/$JOB_ID \
    -H "Accept-Language: en" | jq '{
      id: .data.id,
      title: .data.title,
      roles: (.data.roles | length)
    }'
  echo ""
done
```

---

## 9. Complete Workflow Test

### Full Test Workflow
```bash
#!/bin/bash

# 1. Login
echo "Step 1: Logging in..."
LOGIN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "layla.hassan@example.com",
    "password": "password"
  }')

TOKEN=$(echo $LOGIN | jq -r '.data.token')
PROFILE_ID=$(echo $LOGIN | jq -r '.data.talent.primary_profile_id')
echo "✓ Logged in. Token: $TOKEN, Profile: $PROFILE_ID"
echo ""

# 2. Get Job List
echo "Step 2: Fetching job list..."
JOBS=$(curl -s http://localhost:3000/api/public/jobs \
  -H "Accept-Language: en")
JOB_ID=$(echo $JOBS | jq -r '.data[0].id')
echo "✓ Job found: $JOB_ID"
echo ""

# 3. Get Public Job Details
echo "Step 3: Getting public job details..."
JOB=$(curl -s http://localhost:3000/api/public/jobs/$JOB_ID \
  -H "Accept-Language: en")
TITLE=$(echo $JOB | jq -r '.data.title')
ROLES=$(echo $JOB | jq '.data.roles | length')
echo "✓ Job: $TITLE ($ROLES roles)"
echo ""

# 4. Get Authenticated Job Details
echo "Step 4: Getting authenticated job details..."
AUTH_JOB=$(curl -s "http://localhost:3000/api/jobs/$JOB_ID?profile_id=$PROFILE_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept-Language: en")
CAN_APPLY=$(echo $AUTH_JOB | jq -r '.data.roles[0].can_apply')
echo "✓ Can apply: $CAN_APPLY"
echo ""

# 5. Check Call Time
echo "Step 5: Checking call time availability..."
CALL_TIME=$(echo $AUTH_JOB | jq -r '.data.roles[0].call_time_enabled')
if [ "$CALL_TIME" == "true" ]; then
  SLOTS=$(echo $AUTH_JOB | jq '.data.roles[0].call_time_slots[0].slots[0].available_times | length')
  echo "✓ Call time enabled with $SLOTS available slots"
else
  echo "✓ Call time not required for this role"
fi
echo ""

echo "✓ All tests completed successfully!"
```

---

## 10. Error Testing

### Test with Invalid Job ID
```bash
curl http://localhost:3000/api/public/jobs/99999 \
  -H "Accept-Language: en"
```

**Expected Response**:
```json
{
  "message": "No query results for model [App\\Models\\Job] 99999"
}
```

### Test without Authentication
```bash
curl "http://localhost:3000/api/jobs/45?profile_id=28"
```

**Expected Response**: Redirects to login or returns 401 Unauthorized

### Test with Invalid Token
```bash
curl "http://localhost:3000/api/jobs/45?profile_id=28" \
  -H "Authorization: Bearer invalid_token"
```

**Expected Response**: 401 Unauthorized

---

## Quick Command Aliases

Save these in your `.bashrc` or `.zshrc` for quick testing:

```bash
# Login
alias test-login='curl -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d "{\"email\": \"layla.hassan@example.com\", \"password\": \"password\"}" | jq "."'

# Job list
alias test-jobs='curl http://localhost:3000/api/public/jobs -H "Accept-Language: en" | jq ".data | map({id, title})"'

# Test specific job (requires JOB_ID variable)
test-job() {
  curl http://localhost:3000/api/public/jobs/$1 -H "Accept-Language: en" | jq ".data | {id, title, roles: (.roles | length)}"
}

# Test job details
test-job 45
test-job 46
test-job 47
```

---

## Common Issues & Solutions

### Issue: `jq: command not found`
**Solution**: Install jq
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq
```

### Issue: `curl: command not found`
**Solution**: Install curl
```bash
# macOS
brew install curl

# Ubuntu/Debian
sudo apt-get install curl
```

### Issue: Connection Refused
**Solution**: Ensure the API server is running
```bash
# Check if server is running on port 3000
lsof -i :3000
```

### Issue: Invalid Token
**Solution**: Get a fresh token by logging in again
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "layla.hassan@example.com", "password": "password"}'
```

---

## Performance Tips

1. **Use jq for filtering** to reduce output size
2. **Use `-s` flag** to run curl silently
3. **Use `-I` flag** for headers only (faster checks)
4. **Combine multiple requests** in a shell script
5. **Use pagination** for large datasets

```bash
# Fast header check
curl -s -I http://localhost:3000/api/public/jobs/45

# Silent mode
curl -s http://localhost:3000/api/public/jobs/45 | jq '.'

# Get only status
curl -s http://localhost:3000/api/public/jobs/45 | jq '.status'
```

---

## Documentation Links

- API Documentation: `/docs/API_DOCUMENTATION.md`
- Test Report: `/docs/JOB_DETAIL_PAGE_TEST_REPORT.md`
- Testing Complete: `/docs/JOB_DETAIL_TESTING_COMPLETE.md`
- Test Script: `/test-job-detail-api.sh`

---

*Last Updated: December 31, 2025*
