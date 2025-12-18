# Experience Dates Issue - Investigation Report

## Problem
When users add dates to experience entries and save, the dates fields show empty after refresh.

## Root Cause
**Backend Issue**: The backend API is not persisting the `start_date` and `end_date` fields to the database.

### Evidence
When we send a POST request to sync experiences with dates:
```bash
curl -X POST http://localhost:3000/api/profile/sync-experiences \
  -H "Authorization: Bearer $TOKEN" \
  -F "profile_id=28" \
  -F "experiences[0][title]=Test Software Engineer" \
  -F "experiences[0][start_date]=2020-06-15" \
  -F "experiences[0][end_date]=2023-12-31"
```

The backend returns `null` for both dates:
```json
{
  "status": "success",
  "message": "Experiences synced successfully.",
  "data": [{
    "id": 73,
    "title": "Test Software Engineer",
    "start_date": null,    // ← Should be "2020-06-15"
    "end_date": null,      // ← Should be "2023-12-31"
    "is_current": false
  }]
}
```

## Frontend Implementation (WORKING CORRECTLY)
✅ Dates are correctly sent to API in ISO format (YYYY-MM-DD)
✅ Form displays dates correctly when editing
✅ After save, frontend reloads experiences from API and displays them
✅ Validation prevents invalid dates (future dates, year > 2025, etc.)

## Backend Issues to Fix
The backend `/api/profile/sync-experiences` endpoint needs to:

1. **Check database schema** - Ensure `start_date` and `end_date` columns exist in the experiences table
2. **Handle date fields** - Add code to save `start_date` and `end_date` from the request
3. **Validate dates** - Return errors if dates are invalid
4. **Return saved data** - Return the full experience record with persisted dates in the response

## How to Test Frontend (if backend is fixed)
1. Login with: `layla.hassan@example.com` / `password`
2. Navigate to Experience section
3. Add an experience with dates
4. Save
5. Refresh page - dates should persist and display correctly

## Console Output
The frontend logs what it sends to the API:
```
[Experience 0] Sending start_date: 2020-06-15
[Experience 0] Sending end_date: 2023-12-31
```

Check browser console to verify dates are being sent correctly.
