# Lookup APIs Implementation Guide

This document outlines the lookup API endpoints implemented for filtering talents and jobs, similar to the talent filter implementation.

## Overview

All lookup endpoints follow the same pattern used in the talent filter system. They are implemented as Next.js API routes that proxy requests to the backend API with proper authentication.

## API Endpoints

### 1. Countries API
**Endpoint:** `/api/lookups/countries?lang=en`

**Response Structure:**
```json
{
  "status": "success",
  "message": "Countries retrieved successfully.",
  "data": [
    {
      "id": 15,
      "name": "Åland Islands",
      "iso_alpha_2": "AX",
      "iso_alpha_3": "ALA"
    }
  ]
}
```

**Total Records:** 245 countries

**Backend URL:** `https://allureportal.sawatech.ae/api/lookups/countries`

**Test with curl:**
```bash
curl -s "https://allureportal.sawatech.ae/api/lookups/countries" \
  -H "v-api-key: YOUR_API_KEY" | jq '.'
```

---

### 2. Nationalities API
**Endpoint:** `/api/lookups/nationalities?lang=en`

**Response Structure:**
```json
{
  "status": "success",
  "message": "Nationalities retrieved successfully.",
  "data": [
    {
      "id": 1,
      "code": "AF",
      "name": "Afghan"
    }
  ]
}
```

**Total Records:** 245 nationalities

**Backend URL:** `https://allureportal.sawatech.ae/api/lookups/nationalities`

**Test with curl:**
```bash
curl -s "https://allureportal.sawatech.ae/api/lookups/nationalities" \
  -H "v-api-key: YOUR_API_KEY" | jq '.'
```

---

### 3. Ethnicities API
**Endpoint:** `/api/lookups/ethnicities?lang=en`

**Response Structure:**
```json
{
  "status": "success",
  "message": "Ethnicities retrieved successfully.",
  "data": [
    {
      "id": 1,
      "code": "arab",
      "name": "Arab"
    }
  ]
}
```

**Total Records:** 34 ethnicities

**Backend URL:** `https://allureportal.sawatech.ae/api/lookups/ethnicities`

**Test with curl:**
```bash
curl -s "https://allureportal.sawatech.ae/api/lookups/ethnicities" \
  -H "v-api-key: YOUR_API_KEY" | jq '.'
```

---

### 4. Professions API
**Endpoint:** `/api/lookups/professions?lang=en`

**Response Structure:**
```json
{
  "status": "success",
  "message": "Professions retrieved successfully.",
  "data": [
    {
      "id": 1,
      "name": "Model",
      "requires_photo": true,
      "requires_video": false,
      "requires_audio": false,
      "requires_languages": false,
      "requires_socials": false,
      "sub_professions": [
        {
          "id": 1,
          "profession_id": 1,
          "name": "Commercial",
          "requires_photo": false,
          "requires_video": false,
          "requires_audio": false,
          "requires_sizes": false
        }
      ]
    }
  ]
}
```

**Total Records:** 11 professions (with nested sub-professions)

**Backend URL:** `https://allureportal.sawatech.ae/api/lookups/professions`

**Test with curl:**
```bash
curl -s "https://allureportal.sawatech.ae/api/lookups/professions" \
  -H "v-api-key: YOUR_API_KEY" | jq '.'
```

---

### 5. Sub-Professions API (NEW)
**Endpoint:** `/api/lookups/sub-professions?profession_id=11&lang=en`

**Query Parameters:**
- `profession_id` (optional): Filter sub-professions by profession ID

**Response Structure:**
```json
{
  "status": "success",
  "message": "Sub professions retrieved successfully.",
  "data": [
    {
      "id": 216,
      "profession_id": 11,
      "name": "Contemporary Dancer",
      "requires_photo": true,
      "requires_video": true,
      "requires_audio": false,
      "requires_sizes": true
    }
  ]
}
```

**Total Records:** 217 sub-professions (all), 1 for profession_id=11

**Backend URL:** `https://allureportal.sawatech.ae/api/lookups/sub-professions?profession_id=11`

**Test with curl:**
```bash
# Get all sub-professions
curl -s "https://allureportal.sawatech.ae/api/lookups/sub-professions" \
  -H "v-api-key: YOUR_API_KEY" | jq '.'

# Get sub-professions for a specific profession
curl -s "https://allureportal.sawatech.ae/api/lookups/sub-professions?profession_id=11" \
  -H "v-api-key: YOUR_API_KEY" | jq '.'
```

**Route Implementation:**
Created at: `src/app/api/lookups/sub-professions/route.ts`

---

### 6. Appearance Options API
**Endpoint:** `/api/lookups/appearance-options?lang=en`

**Response Structure:**
```json
{
  "status": "success",
  "message": "Appearance options retrieved successfully.",
  "data": {
    "hair_colors": [
      {
        "id": 2,
        "slug": "black",
        "name": "Black",
        "is_active": true
      }
    ],
    "eye_colors": [
      {
        "id": 2,
        "slug": "black",
        "name": "Black",
        "is_active": true
      }
    ],
    "hair_lengths": [...],
    "hair_types": [...]
  }
}
```

**Data Categories:**
- `hair_colors`: List of hair color options
- `eye_colors`: List of eye color options
- `hair_lengths`: List of hair length options
- `hair_types`: List of hair type options

**Backend URL:** `https://allureportal.sawatech.ae/api/lookups/appearance-options`

**Test with curl:**
```bash
curl -s "https://allureportal.sawatech.ae/api/lookups/appearance-options" \
  -H "v-api-key: YOUR_API_KEY" | jq '.'
```

---

## Implementation Pattern

All lookup endpoints follow this pattern:

### 1. Next.js API Route
Located in: `src/app/api/lookups/{endpoint}/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { getApiHeaders } from "@/lib/api/headers";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://allureportal.sawatech.ae/api";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/lookups/{endpoint}`, {
      method: "GET",
      headers: getApiHeaders(request),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.message || "Failed to fetch {endpoint}" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching {endpoint}:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
```

### 2. API Headers Helper
Located in: `src/lib/api/headers.ts`

The `getApiHeaders` function adds:
- `v-api-key`: Backend API authentication key
- `Accept-Language`: User's language preference
- `Content-Type`: application/json
- `Accept`: application/json

### 3. Frontend Integration
Used in components like `TalentFilterBar.tsx` and `JobFilterBar.tsx`:

```typescript
const [countries, setCountries] = useState<LookupOption[]>([]);
const [nationalities, setNationalities] = useState<LookupOption[]>([]);
// ... other state

useEffect(() => {
  const fetchLookups = async () => {
    try {
      setLoadingLookups(true);
      const [countriesRes, nationalitiesRes, ...] = await Promise.all([
        apiClient.get(`/lookups/countries?lang=${locale}`),
        apiClient.get(`/lookups/nationalities?lang=${locale}`),
        // ... other endpoints
      ]);

      if (countriesRes.data.status === "success") {
        setCountries(countriesRes.data.data);
      }
      // ... process other responses
    } catch (error) {
      console.error("❌ Failed to fetch lookups:", error);
    } finally {
      setLoadingLookups(false);
    }
  };

  fetchLookups();
}, [locale]);
```

## Job Filter Integration

The `JobFilterBar` component uses all these lookups for filtering jobs:

### Demographics Section
- Age Range (min/max input fields)
- Height Range (min/max input fields)
- Sort By (dropdown with options)

### Professional Section
- **Professions** (MultiSelect using `/lookups/professions`)
- **Sub Professions** (MultiSelect using `/lookups/sub-professions`)
- **Ethnicities** (MultiSelect using `/lookups/ethnicities`)

### Location & Origin Section
- **Job Countries** (MultiSelect using `/lookups/countries`)
- **Talent Residence Countries** (MultiSelect using `/lookups/countries`)
- **Nationalities** (MultiSelect using `/lookups/nationalities`)

### Appearance Section
- **Hair Colors** (MultiSelect using `/lookups/appearance-options` - hair_colors)
- **Eye Colors** (MultiSelect using `/lookups/appearance-options` - eye_colors)

## Testing

### Local Development Testing
With the dev server running (`npm run dev`):

```bash
# Countries
curl -s "http://localhost:3000/api/lookups/countries?lang=en" | jq '.'

# Nationalities
curl -s "http://localhost:3000/api/lookups/nationalities?lang=en" | jq '.'

# Ethnicities
curl -s "http://localhost:3000/api/lookups/ethnicities?lang=en" | jq '.'

# Professions
curl -s "http://localhost:3000/api/lookups/professions?lang=en" | jq '.'

# Sub-Professions (all)
curl -s "http://localhost:3000/api/lookups/sub-professions?lang=en" | jq '.'

# Sub-Professions (filtered by profession)
curl -s "http://localhost:3000/api/lookups/sub-professions?profession_id=11&lang=en" | jq '.'

# Appearance Options
curl -s "http://localhost:3000/api/lookups/appearance-options?lang=en" | jq '.'
```

### Production Testing
Replace `http://localhost:3000` with your production URL.

## Environment Configuration

Required environment variables in `.env`:

```env
NEXT_PUBLIC_API_BASE_URL=https://allureportal.sawatech.ae/api
API_KEY=your_api_key_here
```

The `v-api-key` header is automatically added by the `getApiHeaders` function using the `API_KEY` environment variable.

## Summary

✅ **Implemented Endpoints:**
1. `/api/lookups/countries` - 245 countries
2. `/api/lookups/nationalities` - 245 nationalities
3. `/api/lookups/ethnicities` - 34 ethnicities
4. `/api/lookups/professions` - 11 professions with nested sub-professions
5. `/api/lookups/sub-professions` - 217 sub-professions (NEW - created)
6. `/api/lookups/appearance-options` - Hair colors, eye colors, hair lengths, hair types

✅ **Integration Status:**
- All endpoints working correctly
- Used in `TalentFilterBar.tsx` for talent filtering
- Used in `JobFilterBar.tsx` for job filtering
- Proper error handling and loading states
- Multi-language support via `lang` query parameter

✅ **Testing:**
- All endpoints tested with curl against backend API
- Local Next.js API routes verified
- Frontend integration confirmed
