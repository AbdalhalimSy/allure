# Profile Switching Feature Implementation

## Overview
Implemented multi-profile (sub-accounts) support allowing users to manage and switch between multiple talent profiles under a single account.

## Architecture

### 1. **API Client Updates** (`src/lib/api/client.ts`)
- Added `getActiveProfileId()` - Retrieves current profile ID from localStorage
- Added `setActiveProfileId(profileId)` - Stores profile ID in localStorage
- Updated request interceptor to automatically append `profile_id` query parameter to all API requests

### 2. **Type Definitions** (`src/contexts/AuthContext.tsx`)
```typescript
// New types
export type TalentProfile = {
  id: number;
  full_name: string;
  featured_image_url: string;
  is_primary: boolean;
  created_at: string;
};

export type TalentData = {
  primary_profile_id: number;
  profiles: TalentProfile[];
};

// Updated User type
type User = {
  id?: number;
  name?: string;
  email?: string;
  avatarUrl?: string;
  profile?: ProfileData;
  talent?: TalentData;  // New field
};
```

### 3. **Auth Context Enhancements** (`src/contexts/AuthContext.tsx`)
**New State:**
- `activeProfileId: number | null` - Tracks currently selected profile

**New Methods:**
- `switchProfile(profileId)` - Switches to a different profile and refetches data
  - Updates localStorage
  - Triggers profile data refresh
  - All subsequent API calls use new profile_id

**Updated Methods:**
- `fetchProfile()` - Now handles talent data from new API response structure
  - Sets primary profile ID on first load
  - Stores talent profiles array

### 4. **Login Flow Updates** (`src/app/login/page.tsx`)
**New Login Response Handling:**
```typescript
// API returns new structure
{
  token: string;
  user: { id, name, email };
  talent: { 
    primary_profile_id: number;
    profiles: TalentProfile[];
  };
}
```

**Implementation:**
- Extracts and stores `primary_profile_id` on login
- Sets initial user with talent data
- Subsequent profile fetch uses stored profile_id

### 5. **Header Component** (`src/components/layout/Header.tsx`)
**New Features:**
- Profile switcher dropdown in user menu
- Shows current active profile with avatar
- Lists other available profiles with:
  - Profile avatar
  - Full name
  - Primary badge (if applicable)
  - Active checkmark indicator
- Smooth profile switching with loading state
- Toast notifications for success/failure

**UI Structure:**
```
User Menu
├── Current Profile Info (with status badge)
├── Switch Profile Button (if multiple profiles)
│   └── Sub-profiles List (expandable)
│       ├── Profile 1 (with avatar, name, primary indicator)
│       ├── Profile 2
│       └── Active indicator (checkmark icon)
├── Manage Account Link
└── Logout Button
```

## Data Flow

### 1. **Login Flow:**
```
Login Request
  → Receive token + user + talent data
  → Store token in localStorage
  → Store primary_profile_id in localStorage
  → Set user with talent data in context
  → Fetch profile data with profile_id
  → Render dashboard
```

### 2. **Profile Switch Flow:**
```
Click Profile in Dropdown
  → Call switchProfile(profileId)
  → Update localStorage with new profile_id
  → Fetch profile data (automatic profile_id appended)
  → Update user context with new profile data
  → Show success toast
  → Refresh page
```

### 3. **API Request Flow:**
```
Any API Call
  → Request Interceptor
  → Get profile_id from localStorage
  → Append ?profile_id=X to URL
  → Backend processes request for specific profile
```

## Translation Keys Added

### English (`src/locales/en/common.json`)
```json
{
  "auth": {
    "loggedOut": "Logged out successfully",
    "logoutFailed": "Failed to logout",
    "loading": "Loading..."
  },
  "profile": {
    "switchProfile": "Switch Profile",
    "switched": "Profile switched successfully",
    "switchFailed": "Failed to switch profile",
    "primary": "Primary"
  }
}
```

### Arabic (`src/locales/ar/common.json`)
```json
{
  "auth": {
    "loggedOut": "تم تسجيل الخروج بنجاح",
    "logoutFailed": "فشل تسجيل الخروج",
    "loading": "جارٍ التحميل..."
  },
  "profile": {
    "switchProfile": "تبديل الملف الشخصي",
    "switched": "تم تبديل الملف الشخصي بنجاح",
    "switchFailed": "فشل تبديل الملف الشخصي",
    "primary": "الأساسي"
  }
}
```

## Backend Requirements

The backend must:
1. Accept `profile_id` as a query parameter on all authenticated endpoints
2. Return profile data specific to the requested `profile_id`
3. Validate that the authenticated user has access to the requested profile
4. Support the new login response structure with talent data

## Usage Example

```typescript
// Get current active profile
import { getActiveProfileId } from '@/lib/api/client';
const profileId = getActiveProfileId(); // Returns "28" or null

// Switch to different profile
import { useAuth } from '@/contexts/AuthContext';
const { switchProfile } = useAuth();
await switchProfile(29); // Switches to profile ID 29

// Make API request (profile_id automatically appended)
import apiClient from '@/lib/api/client';
const response = await apiClient.get('/profile/me');
// Actual request: GET /api/profile/me?profile_id=28
```

## Testing Checklist

- [ ] Login with account that has multiple profiles
- [ ] Verify primary profile is selected by default
- [ ] Click "Switch Profile" to see dropdown
- [ ] Switch to another profile
- [ ] Verify profile data updates across the application
- [ ] Verify all API calls include correct profile_id parameter
- [ ] Test with account that has only one profile (no switcher shown)
- [ ] Verify profile_id persists across page refreshes
- [ ] Test logout and login with different account
- [ ] Verify translations work in both English and Arabic

## Clean Code Principles Applied

1. **Single Responsibility:** Each function/component has one clear purpose
2. **DRY:** Reusable functions for profile ID management
3. **Separation of Concerns:** API logic, state management, and UI are properly separated
4. **Type Safety:** Full TypeScript types for all new structures
5. **Error Handling:** Try-catch blocks with user-friendly error messages
6. **User Feedback:** Toast notifications for all actions
7. **Accessibility:** Proper ARIA labels and semantic HTML
8. **Internationalization:** All text uses translation keys
9. **State Management:** Centralized in AuthContext
10. **Clean API:** Simple, intuitive public interface

## Future Enhancements

- [ ] Add profile search/filter for accounts with many profiles
- [ ] Profile creation/management UI
- [ ] Profile-specific settings
- [ ] Quick profile switcher in sidebar
- [ ] Profile usage analytics
