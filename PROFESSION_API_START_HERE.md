# 🎯 Profession API - START HERE

## ⚡ The Problem (You Already Solved It!)

You were getting this error when uploading photos:
```
"The professions.0.photo field must be a file of type: image/jpeg, image/png, image/jpg."
```

## ✅ The Solution (One Line Change)

When using `curl` to upload files, add the MIME type:

```bash
# ❌ BEFORE (Fails)
-F "professions[0][photo]=@file.jpg"

# ✅ AFTER (Works!)
# Profession API - Quick Start Guide

## Issue Fixed ✅

**Problem:** Frontend was accepting WEBP images, but backend only accepts JPEG, PNG, and JPG.

**Solution:** Updated `src/components/ui/MediaUploader.tsx` to match backend validation rules.

## Test Commands

### 1. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"layla.hassan@example.com","password":"password"}' | jq
```

Save the token from the response for use in subsequent requests.

### 2. Get Professions
```bash
curl -X GET "http://localhost:3000/api/profile/professions?profile_id=28" \
  -H "Authorization: Bearer YOUR_TOKEN" | jq
```

### 3. Add Profession with Photo (Valid - JPG)
```bash
curl -X POST "http://localhost:3000/api/profile/sync-professions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profile_id=28" \
  -F "professions[0][profession_id]=1" \
  -F "professions[0][sub_profession_id]=3" \
  -F "professions[0][photo]=@public/test/testing-image2.jpg" | jq
```

### 4. Add Profession with Photo (Invalid - WEBP)
```bash
curl -X POST "http://localhost:3000/api/profile/sync-professions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profile_id=28" \
  -F "professions[0][profession_id]=4" \
  -F "professions[0][photo]=@public/test/testing-image1.webp" | jq
```
**Expected:** Error message about invalid file type

### 5. Add Profession with Photo and Video
```bash
curl -X POST "http://localhost:3000/api/profile/sync-professions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profile_id=28" \
  -F "professions[0][profession_id]=2" \
  -F "professions[0][sub_profession_id]=210" \
  -F "professions[0][photo]=@public/test/testing-image2.jpg" \
  -F "professions[0][video]=@public/test/test-video.mp4" | jq
```

### 6. Add Multiple Professions
```bash
curl -X POST "http://localhost:3000/api/profile/sync-professions" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "profile_id=28" \
  -F "professions[0][profession_id]=1" \
  -F "professions[0][sub_profession_id]=3" \
  -F "professions[0][photo]=@public/test/testing-image2.jpg" \
  -F "professions[1][profession_id]=2" \
  -F "professions[1][sub_profession_id]=210" \
  -F "professions[1][photo]=@public/test/testing-image2.jpg" \
  -F "professions[1][video]=@public/test/test-video.mp4" | jq
```

## Automated Test Script

Run all tests automatically:
```bash
./test-profession-api.sh
```

## Test Files Location

- `public/test/testing-image1.webp` - ❌ Invalid format
- `public/test/testing-image2.jpg` - ✅ Valid format
- `public/test/test-video.mp4` - ✅ Valid format

## Accepted File Formats

| Media Type | Accepted Formats | Max Size |
|-----------|------------------|----------|
| Photo | JPEG, JPG, PNG | 5 MB |
| Video | MP4, MOV, AVI | 50 MB |
| Audio | MP3, WAV, OGG | 10 MB |

## API Endpoints

- `GET /api/profile/professions` - Get professions for a profile
- `POST /api/profile/sync-professions` - Create/update professions with media

## Common Profession Requirements

| Profession ID | Name | Photo | Video | Audio |
|--------------|------|-------|-------|-------|
| 1 | Model | ✅ | ❌ | ❌ |
| 2 | Actor | ✅ | ✅ | ❌ |
| 3 | Sport | ❌ | ❌ | ❌ |
| 4 | Musician | ✅ | ✅ | ✅ |
| 5 | Voice Over | ❌ | ❌ | ✅ |

## Test User Credentials

- **Email:** layla.hassan@example.com
- **Password:** password
- **Profile ID:** 28

## Expected Results

✅ All scenarios tested and working:
- Login
- Get professions
- Add profession with valid image (JPG/PNG)
- Reject invalid image format (WEBP)
- Add profession with photo and video
- Add multiple professions
- Validate required fields
- Error handling

## Files Modified

1. `src/components/ui/MediaUploader.tsx` - Removed webp from accepted photo formats

## Documentation Files

- `PROFESSION_API_TESTING_RESULTS.md` - Detailed test results
- `PROFESSION_API_START_HERE.md` - Quick start guide (this file)
- `test-profession-api.sh` - Automated test script
**Status:** ✅ RESOLVED

**The Fix:** Use `;type=image/jpeg` in your curl `-F` flags

**Documentation:** See the files above for complete details

**Frontend:** No issues (uses proper FormData API)

**Production:** Works correctly

---

**Questions?** Check [PROFESSION_API_TESTING.md](PROFESSION_API_TESTING.md) for the complete index of all documentation.
