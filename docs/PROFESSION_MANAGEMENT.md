# Profession Management System - New Implementation

## Overview

This document describes the updated profession management flow that uses the new `POST /api/profile/sync-professions` endpoint. The system has been completely rebuilt from scratch to provide a modern, streamlined experience with better file handling and data synchronization.

## Key Changes

### 1. **Single File Per Media Type**
- Only ONE file allowed per media type (photo, video, audio)
- Upload controls prevent multi-file selection
- Cleaner UI and simpler data management

### 2. **New API Structure**
- All professions synced in a single API call
- Uses `POST /api/profile/sync-professions` with multipart/form-data
- Includes profession ID when editing existing records
- Supports languages with optional voice samples
- Supports social media links with follower counts

### 3. **Enhanced UI Components**
- **MediaUploader**: Drag-and-drop with progress bars and previews
- **LanguageManager**: Manage multiple languages with voice samples
- **SocialManager**: Manage social media links with follower metrics
- **ProfessionEntryForm**: Complete profession entry with all features

## Architecture

### Type Definitions (`src/types/profession.ts`)

```typescript
// Language with optional voice file
export interface ProfessionLanguage {
  code: string;
  voice?: File | string; // File for new, string URL for existing
}

// Social media link
export interface ProfessionSocial {
  platform: string;
  url: string;
  followers?: number;
}

// Complete profession entry
export interface ProfessionEntry {
  id?: number; // Backend ID for editing
  professionId: number;
  subProfessionId: number | null;
  photo?: File | string;
  video?: File | string;
  audio?: File | string;
  languages: ProfessionLanguage[];
  socials: ProfessionSocial[];
}
```

### API Layer (`src/lib/api/professions.ts`)

**Key Functions:**

1. `buildSyncProfessionsPayload(professions, profileId)` - Builds FormData with all entries
2. `syncProfessions(professions)` - Syncs all professions to backend
3. `fetchSavedProfessions()` - Fetches and maps saved professions
4. `mapApiResponseToEntries(apiData)` - Converts API response to UI state

**FormData Structure:**
```
profile_id: <profile_id>
professions[0][id]: <id> (optional, for editing)
professions[0][profession_id]: <profession_id>
professions[0][sub_profession_id]: <sub_profession_id>
professions[0][photo]: <File>
professions[0][video]: <File>
professions[0][audio]: <File>
professions[0][languages][0][code]: "en"
professions[0][languages][0][voice]: <File>
professions[0][socials][0][platform]: "instagram"
professions[0][socials][0][url]: "https://..."
professions[0][socials][0][followers]: 1000
```

## UI Components

### 1. MediaUploader (`src/components/ui/MediaUploader.tsx`)

**Features:**
- Drag-and-drop upload with visual feedback
- Upload progress animation
- Image/video previews
- Audio player for audio files
- File validation (type, size)
- Single file enforcement

**Props:**
```typescript
type: 'photo' | 'video' | 'audio'
value?: File | string
onChange: (file: File | null) => void
required?: boolean
disabled?: boolean
maxSize?: number
```

**Usage:**
```tsx
<MediaUploader
  type="photo"
  value={entry.photo}
  onChange={(file) => onChange({ ...entry, photo: file || undefined })}
  maxSize={5 * 1024 * 1024}
/>
```

### 2. LanguageManager (`src/components/professional/LanguageManager.tsx`)

**Features:**
- Add/remove languages
- Optional voice sample per language
- Visual indicators for languages with voice samples
- Dropdown to add new languages

**Props:**
```typescript
languages: ProfessionLanguage[]
onChange: (languages: ProfessionLanguage[]) => void
disabled?: boolean
```

### 3. SocialManager (`src/components/professional/SocialManager.tsx`)

**Features:**
- Add/remove social media links
- Platform selector (Instagram, Facebook, Twitter, etc.)
- URL input with validation
- Optional follower count

**Props:**
```typescript
socials: ProfessionSocial[]
onChange: (socials: ProfessionSocial[]) => void
disabled?: boolean
```

### 4. ProfessionEntryForm (`src/components/professional/ProfessionEntryForm.tsx`)

**Features:**
- Complete profession entry management
- Dynamic requirements based on profession/sub-profession
- Integrated media uploads
- Language and social management
- Visual requirement badges

**Props:**
```typescript
professions: Profession[]
entry: ProfessionEntry
onChange: (entry: ProfessionEntry) => void
onRemove: () => void
disabled?: boolean
```

### 5. ProfessionContentNew (`src/app/dashboard/account/profile/ProfessionContentNew.tsx`)

**Main Features:**
- Manages array of profession entries
- Add/remove entries dynamically
- Validation before submission
- Single API call to sync all professions
- Loading and error states

## Workflow

### 1. Initial Load
```
User opens profession page
  ↓
Fetch profession types from /lookups/professions
  ↓
Fetch saved professions from /profile/professions
  ↓
Map API response to ProfessionEntry[] with preview URLs
  ↓
Render forms with existing data
```

### 2. User Interaction
```
User adds/edits profession entries
  ↓
Upload media files (drag-and-drop or click)
  ↓
Add languages with optional voice samples
  ↓
Add social media links
  ↓
Form validates in real-time
```

### 3. Save Process
```
User clicks "Save & Continue"
  ↓
Validate all entries (required media, languages, etc.)
  ↓
Build FormData payload with all professions
  ↓
POST /api/profile/sync-professions
  ↓
Success: Show toast, refresh profile, navigate next
  ↓
Error: Show error message, allow retry
```

## Validation Rules

### Required Fields
- At least one profession must be added
- Valid profession_id required for each entry
- Media files required based on profession requirements:
  - Photo: if `requires_photo = true`
  - Video: if `requires_video = true`
  - Audio: if `requires_audio = true`
  - Languages: if `requires_languages = true` (at least one)

### File Constraints
- **Photo**: JPG, PNG, WEBP up to 5MB
- **Video**: MP4, MOV, AVI up to 50MB
- **Audio**: MP3, WAV, OGG up to 10MB
- **Voice samples**: Same as audio constraints

### Single File Rule
- Only ONE file per media type per profession
- Upload controls configured with `multiple={false}`
- UI prevents multi-file selection

## Media URL Handling

### Upload (File → Backend)
```typescript
// New file
photo: File

// FormData
formData.append('professions[0][photo]', photoFile)
```

### Display (Backend → UI)
```typescript
// Backend returns relative path
photo: "professions/photo_123.jpg"

// Convert to full URL
const fullUrl = `https://allureportal.sawatech.ae/storage/${photo}`

// Display in UI
<img src={fullUrl} />
```

### Edit (Existing → FormData)
```typescript
// If unchanged (string URL)
if (typeof photo === 'string') {
  // Don't include in FormData, backend keeps existing
}

// If changed (new File)
if (photo instanceof File) {
  formData.append('professions[0][photo]', photo)
}
```

## Error Handling

### Network Errors
- Toast notification with error message
- Form remains editable for retry
- No data loss on failed submission

### Validation Errors
- Inline error messages
- Highlighted invalid fields
- Scroll to first error

### File Upload Errors
- File size exceeded
- Invalid file type
- Upload interrupted

## Migration from Old System

### Old Approach
- Separate POST for each profession
- Multiple API calls
- Array-based media storage
- No social links support

### New Approach
- Single POST for all professions
- One API call total
- Single file per type
- Full social links integration

### Breaking Changes
1. `ProfessionEntry` structure changed
2. Media arrays → single files
3. New API endpoint required
4. Different FormData structure

## Testing Checklist

- [ ] Add single profession with all media
- [ ] Add multiple professions
- [ ] Edit existing profession
- [ ] Remove profession
- [ ] Upload photo (drag-and-drop)
- [ ] Upload video (click to select)
- [ ] Upload audio with preview
- [ ] Add language without voice
- [ ] Add language with voice sample
- [ ] Add social media links
- [ ] Validate required fields
- [ ] Validate file size limits
- [ ] Validate file types
- [ ] Test form submission
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test RTL layout
- [ ] Test dark mode
- [ ] Test mobile responsiveness

## Future Enhancements

1. **Image Cropping**: Allow users to crop photos before upload
2. **Video Trimming**: Trim videos to specific duration
3. **Bulk Upload**: Upload multiple professions from CSV
4. **Templates**: Save profession configurations as templates
5. **Analytics**: Track social media follower growth
6. **Verification**: Verify social media links ownership
7. **Portfolio**: Link to external portfolio sites
8. **Recommendations**: AI-powered profession suggestions

## Support

For issues or questions:
- Check console for detailed error logs
- Verify API endpoint is configured
- Ensure backend accepts multipart/form-data
- Check file size limits on server
- Verify user has active profile_id

## Code Organization

```
src/
├── types/
│   └── profession.ts               # Type definitions
├── lib/
│   └── api/
│       └── professions.ts          # API functions
├── components/
│   ├── ui/
│   │   └── MediaUploader.tsx       # Reusable media upload
│   └── professional/
│       ├── LanguageManager.tsx     # Language management
│       ├── SocialManager.tsx       # Social links management
│       ├── ProfessionEntryForm.tsx # Single entry form
│       └── index.ts                # Exports
└── app/
    └── dashboard/
        └── account/
            └── profile/
                └── ProfessionContentNew.tsx  # Main page
```

## Performance Considerations

- **Lazy Loading**: Components load on demand
- **Memoization**: Prevent unnecessary re-renders
- **Debouncing**: Form inputs debounced for performance
- **Optimistic Updates**: UI updates before API confirmation
- **Image Optimization**: Compress images before upload
- **Progress Indicators**: Visual feedback during operations

## Security

- **File Validation**: Client-side + server-side validation
- **CSRF Protection**: Token included in requests
- **XSS Prevention**: Sanitize user inputs
- **Authorization**: Bearer token required
- **Rate Limiting**: Prevent abuse
- **File Scanning**: Server-side malware scanning recommended

---

**Version**: 1.0.0  
**Last Updated**: 2025-11-15  
**Author**: Development Team
