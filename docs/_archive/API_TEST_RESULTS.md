# API Test Results

## Summary
Comprehensive testing of all API endpoints using curl commands. Focus on authentication and profile setup flows.

## ✅ Working Endpoints

### Authentication Endpoints

#### 1. POST /api/auth/register
**Status:** ✅ Working  
**Requirements:** `password_confirmation` field must match `password`  
**Test:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newtest@test.com",
    "password": "password123",
    "password_confirmation": "password123",
    "first_name": "New",
    "last_name": "Test",
    "phone": "+1234567890",
    "role": "talent"
  }'
```
**Response:**
```json
{
  "status": "success",
  "message": "Registration completed. Please verify your email to continue.",
  "data": {
    "email": "newtest@test.com",
    "expires_at": "2025-11-17T04:07:52.000000Z",
    "otp": "401192"
  }
}
```

#### 2. POST /api/auth/login
**Status:** ✅ Working  
**Test:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "a@a.a", "password": "password"}'
```
**Response:**
```json
{
  "status": "success",
  "message": "Login successful.",
  "data": {
    "token": "91|r44RCbzA9Lw72GYC7j4SfFGev1shbK6ETsed49oh9834ef4c",
    "token_type": "Bearer",
    "user": {
      "id": 3,
      "name": "Abdalhalim AlSayasenah",
      "email": "a@a.a"
    },
    "talent": {
      "primary_profile_id": 2,
      "profiles": [...]
    }
  }
}
```

#### 3. GET /api/profile/me
**Status:** ✅ Working  
**Requirements:** Bearer token + `profile_id` query parameter  
**Test:**
```bash
curl -X GET "http://localhost:3000/api/profile/me?profile_id=2" \
  -H "Authorization: Bearer 91|r44RCbzA9Lw72GYC7j4SfFGev1shbK6ETsed49oh9834ef4c"
```
**Response:**
```json
{
  "status": "success",
  "message": "Profile retrieved successfully.",
  "data": {
    "profile": {
      "id": 2,
      "first_name": "Abdalhalim",
      "last_name": "AlSayasenah",
      "progress_step": "appearance",
      "country": {...},
      "nationalities": [...],
      "ethnicities": [...],
      "experiences": []
    }
  }
}
```

### Lookup Endpoints

#### 4. GET /api/lookups/countries
**Status:** ✅ Working  
**Count:** 245 countries  
**Test:**
```bash
curl -X GET "http://localhost:3000/api/lookups/countries" -H "Accept-Language: en"
```

#### 5. GET /api/lookups/nationalities
**Status:** ✅ Working  
**Count:** 245 nationalities  

#### 6. GET /api/lookups/ethnicities
**Status:** ✅ Working  
**Count:** 34 ethnicities  

#### 7. GET /api/lookups/professions
**Status:** ✅ Working  
**Count:** 11 professions  

#### 8. GET /api/lookups/appearance-options
**Status:** ✅ Working  
**Keys:** `eye_colors`, `hair_colors`, `hair_lengths`, `hair_types`  
**Test:**
```bash
curl -X GET "http://localhost:3000/api/lookups/appearance-options" -H "Accept-Language: en"
```
**Response Structure:**
```json
{
  "status": "success",
  "data": {
    "hair_colors": [...],
    "eye_colors": [...],
    "hair_lengths": [...],
    "hair_types": [...]
  }
}
```

### Jobs Endpoints

#### 9. GET /api/jobs
**Status:** ✅ Working  
**Features:** Pagination with `page`, `per_page` parameters  
**Test:**
```bash
curl -X GET "http://localhost:3000/api/jobs?page=1&per_page=2"
```
**Response Structure:**
```json
{
  "status": "success",
  "message": "Jobs retrieved successfully.",
  "data": [
    {
      "id": 1,
      "title": "Casting Call #1",
      "description": "...",
      "skills": "...",
      "shooting_date": "2025-11-24",
      "expiration_date": "2025-12-08",
      "roles_count": 3,
      "countries": [...],
      "professions": [...],
      "roles": [...]
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 2,
    "total": 10,
    "last_page": 5
  }
}
```

#### 10. GET /api/jobs/:id
**Status:** ✅ Working  
**Test:**
```bash
curl -X GET "http://localhost:3000/api/jobs/1"
```

### Talents Endpoints

#### 11. GET /api/talents
**Status:** ✅ Working  
**Features:** Pagination, 15+ filter parameters (gender, age, height, professions, countries, etc.)  
**Test:**
```bash
curl -X GET "http://localhost:3000/api/talents?page=1&per_page=2&gender=male"
```
**Response Structure:**
```json
{
  "status": "success",
  "data": [...],
  "meta": {
    "current_page": 1,
    "per_page": 2,
    "total": 3,
    "last_page": 2
  }
}
```

## 📋 Profile Setup Endpoints

### Available Routes
Based on file search, these profile setup routes exist:
- ✅ `/api/profile/me` (GET)
- `/api/profile/basic-information` (POST - needs testing)
- `/api/profile/appearance` (needs testing)
- `/api/profile/professions` (needs testing)
- `/api/profile/experiences` (needs testing)
- `/api/profile/portfolio` (needs testing)
- `/api/profile/portfolio-media` (needs testing)
- `/api/profile/sync-professions` (needs testing)
- `/api/profile/sync-experiences` (needs testing)
- `/api/profile/sync-portfolio` (needs testing)

### Notes
- `basic-information` route uses POST method, not PUT
- Profile routes require Bearer token authentication
- Some routes may require `profile_id` parameter

## 🔍 Findings

### 1. Registration Validation
- Backend requires `password_confirmation` field
- Must match the `password` field exactly
- Returns 422 validation error if missing or mismatched

### 2. Profile/Me Query Parameter
- Requires `profile_id` as query parameter or `x-profile-id` header
- Fixed in earlier session by updating `AuthContext.tsx`

### 3. Lookup API Structure
- `appearance-options` returns nested object with 4 keys
- Replaced separate `/hair-colors` and `/eye-colors` endpoints (which don't exist)

### 4. Jobs and Talents Pagination
- Both use `meta` object with `current_page`, `per_page`, `total`, `last_page`
- Jobs return array in `data` field
- Talents also return array in `data` field

### 5. Backend Talents Detail
- Direct backend endpoint `/api/talents/:id` requires authentication
- Returns 401 Unauthorized without token
- Frontend route `/talents/[id]` fetches via Next.js API route

## ✅ Completed Testing
1. ✅ Registration endpoint
2. ✅ Login endpoint  
3. ✅ Profile/me endpoint
4. ✅ All lookup endpoints (countries, nationalities, ethnicities, professions, appearance-options)
5. ✅ Jobs list and detail endpoints
6. ✅ Talents list endpoint

## 🔄 Pending Testing
- Profile setup endpoints (basic-information, appearance, experiences, etc.)
- Portfolio management endpoints
- Profile sync endpoints

## 📝 Recommendations
1. Consider standardizing endpoint naming (basic-information vs basic-info)
2. Document required vs optional fields for each endpoint
3. Add API documentation with request/response examples
4. Consider adding rate limiting headers to responses
