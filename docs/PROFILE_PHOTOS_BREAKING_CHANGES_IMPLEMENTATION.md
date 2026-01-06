# Profile Photos API - Breaking Changes Implementation Summary

## Overview
Implemented breaking API changes for the profile photos module to support the multi-profile system. All profile photo operations now require explicit `profile_id` parameter.

## Changes Made

### 1. **Service Layer Updates** - `src/lib/api/profile-photos.ts`

#### Function Signature Changes:

**getProfilePhotos()**
- **Before:** `getProfilePhotos(token: string)`
- **After:** `getProfilePhotos(profileId: number, token: string)`
- **Reason:** Backend now requires profile_id to specify which profile's photos to retrieve
- **Implementation:** Passes profileId as query parameter: `/api/profile-photos?profile_id=${profileId}`

**uploadProfilePhoto()**
- **Before:** `uploadProfilePhoto(file: File, token: string)`
- **After:** `uploadProfilePhoto(file: File, profileId: number, token: string)`
- **Reason:** New photos must be associated with a specific profile
- **Implementation:** Appends profile_id to FormData: `formData.append('profile_id', profileId.toString())`

**markAsProfilePicture()** (DEPRECATED)
- **Status:** Deprecated - now throws error with migration instructions
- **Reason:** Backend workflow changed - new photos automatically replace old ones when approved
- **Alternative:** Use `uploadProfilePhoto()` to upload new photo; admin approval handles the rest

### 2. **Component Updates** - `src/components/account/ProfilePhotosManager.tsx`

#### Updated Function Calls:
- **fetchPhotos():** Now passes `activeProfileId` to `getProfilePhotos(activeProfileId, token)`
- **handleUpload():** Now passes `activeProfileId` to `uploadProfilePhoto(file, activeProfileId, token)`
- **Dependency:** Added `activeProfileId` to useEffect dependency array to refetch when profile changes

#### Validation:
- Added checks to ensure `activeProfileId` exists before making API calls
- Graceful error handling: "No active profile selected" message if activeProfileId is null

### 3. **API Route - Already Working**
- `src/app/api/profile-photos/route.ts` - Already updated to forward query parameters correctly
- GET endpoint: Properly forwards `profile_id` query parameter
- POST endpoint: Correctly accepts `profile_id` in form data

## Test Results

### Test Script: `test_profile_photos_breaking_changes.sh`

#### Verification Tests:
✅ **Authentication:** Login and token extraction
✅ **GET Multi-Profile:** Fetches photos for Profile 1 (ID: 28) - 2 photos found
✅ **GET Multi-Profile:** Fetches photos for Profile 2 (ID: 29) - 0 photos
✅ **GET Validation:** Missing profile_id returns error: "The profile id field is required."
✅ **POST Upload:** Successfully uploads test image with profile_id - returns status "pending"
✅ **DELETE:** Successfully deletes uploaded photo
✅ **POST Validation:** Missing profile_id returns validation error

#### Sample Test Output:
```
Authentication successful
Token: 475|zcSLZBdRnqa5vZ5Z...
First Profile ID: 28
Second Profile ID: 29

GET Profile 1 Photos: 2 photos returned
GET Profile 2 Photos: 0 photos returned
POST Upload: ✅ Success (Photo ID: 16, Status: pending)
DELETE: ✅ Success
```

## API Documentation

### GET /api/profile-photos
```bash
curl -X GET "http://localhost:3000/api/profile-photos?profile_id=28" \
  -H "Authorization: Bearer {token}"

# Response
{
  "success": true,
  "data": [
    {
      "id": 4,
      "profile_picture": "https://...",
      "approval_status": "pending",
      "is_profile_picture": false,
      "created_at": "2026-01-02T16:12:40.000000Z"
    }
  ]
}
```

### POST /api/profile-photos
```bash
curl -X POST "http://localhost:3000/api/profile-photos" \
  -H "Authorization: Bearer {token}" \
  -F "profile_picture=@image.jpg" \
  -F "profile_id=28"

# Response
{
  "success": true,
  "data": {
    "id": 16,
    "profile_picture": "https://...",
    "approval_status": "pending",
    "is_profile_picture": false
  }
}
```

## Photo Approval Workflow

1. **User uploads new photo** → Status: `pending`
2. **Admin reviews photo** → Status: `approved` OR `rejected`
3. **Once approved** → Photo automatically becomes profile picture
4. **Old photo** → Automatically deleted when new is approved
5. **Multiple profiles** → Each profile has independent photo management

## Breaking Changes Summary

| Endpoint | Before | After | Required Change |
|----------|--------|-------|-----------------|
| GET /api/profile-photos | Auto-detected from token | Requires `profile_id` query param | Add profileId to function calls |
| POST /api/profile-photos | No profile_id needed | Requires `profile_id` in form data | Add profileId to uploadProfilePhoto() |
| PUT /api/profile-photos/{id} | Worked (deprecated) | DEPRECATED | Use POST uploadProfilePhoto() instead |
| DELETE /api/profile-photos/{id} | Unchanged | Unchanged | No changes required |

## Migration Guide for Developers

### Old Code:
```typescript
const photos = await getProfilePhotos(token);
const response = await uploadProfilePhoto(file, token);
```

### New Code:
```typescript
const activeProfileId = 28; // From context or props
const photos = await getProfilePhotos(activeProfileId, token);
const response = await uploadProfilePhoto(file, activeProfileId, token);
```

## Files Modified

1. ✅ `src/lib/api/profile-photos.ts` - Service layer updated
2. ✅ `src/components/account/ProfilePhotosManager.tsx` - Component updated to pass profile_id
3. ✅ `src/app/api/profile-photos/route.ts` - Already working correctly
4. ✅ `test_profile_photos_breaking_changes.sh` - Comprehensive test suite

## Build Status

✅ **TypeScript Compilation:** Successful
✅ **Next.js Build:** Successful  
✅ **Test Suite:** All tests passing
✅ **No Warnings:** All unused parameters handled

## Next Steps

1. Deploy to production
2. Notify frontend team of breaking changes
3. Update documentation for new multi-profile workflow
4. Monitor for any integration issues with other profile-related features

## Notes

- The component properly handles the case where `activeProfileId` is null/undefined
- Photos are automatically managed per profile, allowing users to have different photos for different profiles
- The approval workflow ensures quality control with admin review before photos become visible
