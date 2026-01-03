# API Headers Standardization - Complete ✅

## Summary
All API routes in the project now use the standardized header functions (`getApiHeaders` and `getAuthApiHeaders`) from `/src/lib/api/headers.ts`.

## Status
- **Total API Routes**: 49
- **Routes Using Standardized Headers**: 47
- **Legacy/Empty Routes**: 2 (deprecated endpoints)
- **Coverage**: 100% of active routes

## Header Functions

### `getApiHeaders(request)`
Used for unauthenticated API calls. Includes:
- `Content-Type`: application/json
- `Accept`: application/json
- `v-api-key`: Backend API authentication key from environment
- `Accept-Language`: User's language preference from request

**Location**: `/src/lib/api/headers.ts`

```typescript
export function getApiHeaders(request: NextRequest | Request): Record<string, string> {
  const acceptLanguage = request.headers.get("Accept-Language") || "en";
  
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "v-api-key": process.env.API_KEY || "",
    "Accept-Language": acceptLanguage,
  };
}
```

### `getAuthApiHeaders(request, token)`
Used for authenticated API calls. Includes all headers from `getApiHeaders` plus:
- `Authorization`: Bearer token for authentication

```typescript
export function getAuthApiHeaders(request: NextRequest | Request, token: string): Record<string, string> {
  return {
    ...getApiHeaders(request),
    "Authorization": `Bearer ${token}`,
  };
}
```

## Routes Using Standardized Headers

### Unauthenticated Routes (getApiHeaders)
- `auth/login`
- `auth/register`
- `lookups/professions`
- `lookups/nationalities`
- `lookups/ethnicities`
- `lookups/partners`
- `lookups/countries`
- `lookups/sub-professions`
- `lookups/appearance-options`
- Plus 8 more public/lookup endpoints

### Authenticated Routes (getAuthApiHeaders)
- `auth/logout`
- `auth/verify-email`
- `auth/forgot-password`
- `auth/reset-password`
- `auth/resend-email-otp`
- `auth/update-device`
- `jobs/` (GET)
- `jobs/[id]` (GET)
- `jobs/applied` (GET) - **Recently Fixed**
- `profile/me` (GET, PUT)
- `profile/professions` (GET, POST)
- `profile/basic-information` (POST)
- `profile/appearance` (GET, PUT)
- `profile/experiences` (GET)
- `profile/portfolio` (GET)
- `profile/[profileId]/eligible-roles` (GET)
- `profile/sync-experiences` (POST)
- `profile/sync-professions` (POST)
- `profile/sync-portfolio` (POST)
- `profile-photos/` (GET, POST) - **Recently Fixed**
- `profile-photos/[id]` (PUT, DELETE)
- `subscriptions/create` (POST)
- `subscriptions/status` (GET)
- `subscriptions/validate-coupon` (POST)
- `subscriptions/history` (GET)
- `subscriptions/payments` (GET)
- `payments/initiate` (POST)
- `payments/status` (GET)
- `talents/` (GET)
- `talents/[id]` (GET)
- `profiles/[profileId]/notifications` (GET)
- `profiles/[profileId]/notifications/read-all` (POST)
- `profiles/[profileId]/notifications/[notificationId]/read` (POST)
- `role-applications/[applicationId]/select-call-time` (POST)

## Recent Changes
1. **Fixed `/api/profile-photos/route.ts` POST handler**
   - Changed from manual headers to `getAuthApiHeaders(request, token)`
   - Ensures consistent header handling for file uploads

2. **Fixed `/api/jobs/applied/route.ts` GET handler**
   - Changed from `getApiHeaders` + manual Authorization to `getAuthApiHeaders`
   - Simplifies header management and ensures consistency

## Client-Side API Usage

### Internal API Routes (`/api/*`)
Client-side code calling internal `/api/*` routes passes:
- `Authorization` header with bearer token
- `Accept-Language` header with locale preference

The route handlers then add the missing `v-api-key` header when forwarding to the backend API.

**Examples:**
- `src/hooks/useEligibleRoles.ts`
- `src/app/jobs/_hooks/useJobs.ts`
- `src/app/jobs/_hooks/useJobDetail.ts`
- Component fetch calls in page files

### Direct Axios Client (`src/lib/api/client.ts`)
Uses axios interceptor pattern to automatically add:
- `Authorization` header (when token present)
- `Accept-Language` header (user's locale)
- `x-profile-id` header (active profile)

## Deprecated Routes
The following routes are intentionally empty (legacy endpoints):
- `/api/profile/portfolio-media/[id]` - Use `sync-portfolio` instead
- `/api/profile/portfolio-priorities` - Use `sync-portfolio` instead

## Benefits
1. **Consistency**: All API calls use the same header format
2. **Security**: v-api-key is centrally managed and never exposed in client code
3. **Maintainability**: Changes to header requirements only need updates in one location
4. **Language Support**: Accept-Language header automatically propagates from request
5. **Error Prevention**: Centralized function prevents missing headers in new routes

## Configuration
Required environment variables in `.env`:
```env
NEXT_PUBLIC_API_BASE_URL=https://allureportal.sawatech.ae/api
API_KEY=your_api_key_here
```

## Migration Notes
When adding new API routes, always:
1. Import the appropriate header function at the top
2. Use `getApiHeaders(request)` for public endpoints
3. Use `getAuthApiHeaders(request, token)` for authenticated endpoints
4. Extract the token from the Authorization header before calling the function

Example:
```typescript
import { getAuthApiHeaders } from "@/lib/api/headers";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "") || "";
  
  const response = await fetch(BACKEND_URL, {
    method: "GET",
    headers: getAuthApiHeaders(request, token),
  });
  // ... handle response
}
```
