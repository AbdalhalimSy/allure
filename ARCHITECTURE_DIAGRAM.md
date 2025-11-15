# Profession Management Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         ProfessionContentNew (Main Page)               │   │
│  │  - Manages array of ProfessionEntry[]                  │   │
│  │  - Add/Remove entries                                  │   │
│  │  - Validation logic                                    │   │
│  │  - Single save operation                               │   │
│  └─────────────────┬──────────────────────────────────────┘   │
│                    │                                            │
│         ┌──────────┼──────────┐                                │
│         ▼          ▼          ▼                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐                       │
│  │  Entry 1 │ │  Entry 2 │ │  Entry N │                       │
│  │          │ │          │ │          │                       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘                       │
│       │            │            │                              │
│       └────────────┼────────────┘                              │
│                    ▼                                            │
│  ┌────────────────────────────────────────────────────────┐   │
│  │       ProfessionEntryForm (Single Entry)               │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │  Profession & Sub-Profession Selectors         │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │  MediaUploader (Photo/Video/Audio)             │   │   │
│  │  │  - Drag & drop                                 │   │   │
│  │  │  - Progress indicator                          │   │   │
│  │  │  - Preview                                     │   │   │
│  │  │  - Single file enforcement                     │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │  LanguageManager                               │   │   │
│  │  │  - Add/remove languages                        │   │   │
│  │  │  - Voice sample upload                         │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │  SocialManager                                 │   │   │
│  │  │  - Platform selection                          │   │   │
│  │  │  - URL input                                   │   │   │
│  │  │  - Follower count                              │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Save Action
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API LAYER                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  src/lib/api/professions.ts                            │   │
│  │                                                         │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │  buildSyncProfessionsPayload()                 │   │   │
│  │  │  - Builds FormData from ProfessionEntry[]      │   │   │
│  │  │  - Handles files and nested arrays            │   │   │
│  │  └────────────────┬───────────────────────────────┘   │   │
│  │                   │                                    │   │
│  │                   ▼                                    │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │  syncProfessions()                             │   │   │
│  │  │  - POST /api/profile/sync-professions          │   │   │
│  │  │  - multipart/form-data                         │   │   │
│  │  │  - Authorization header                        │   │   │
│  │  └────────────────┬───────────────────────────────┘   │   │
│  │                   │                                    │   │
│  │                   ▼                                    │   │
│  │  ┌────────────────────────────────────────────────┐   │   │
│  │  │  fetchSavedProfessions()                       │   │   │
│  │  │  - GET /api/profile/professions                │   │   │
│  │  │  - Maps response to ProfessionEntry[]          │   │   │
│  │  └────────────────────────────────────────────────┘   │   │
│  │                                                         │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP Request
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  POST /api/profile/sync-professions                            │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Request Headers:                                       │   │
│  │  - Authorization: Bearer <token>                        │   │
│  │  - Content-Type: multipart/form-data                    │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  FormData Payload:                                      │   │
│  │  - profile_id                                           │   │
│  │  - professions[N][id]               (optional)          │   │
│  │  - professions[N][profession_id]                        │   │
│  │  - professions[N][sub_profession_id]                    │   │
│  │  - professions[N][photo]            (File)              │   │
│  │  - professions[N][video]            (File)              │   │
│  │  - professions[N][audio]            (File)              │   │
│  │  - professions[N][languages][K][code]                   │   │
│  │  - professions[N][languages][K][voice]  (File)          │   │
│  │  - professions[N][socials][K][platform]                 │   │
│  │  - professions[N][socials][K][url]                      │   │
│  │  - professions[N][socials][K][followers]                │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  GET /api/profile/professions                                  │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Response:                                              │   │
│  │  {                                                      │   │
│  │    "data": [                                            │   │
│  │      {                                                  │   │
│  │        "id": 1,                                         │   │
│  │        "profession_id": 10,                             │   │
│  │        "sub_profession_id": 15,                         │   │
│  │        "photo": "professions/photo_123.jpg",            │   │
│  │        "video": "professions/video_123.mp4",            │   │
│  │        "audio": "professions/audio_123.mp3",            │   │
│  │        "languages": [                                   │   │
│  │          { "code": "en", "voice": "path/to/voice.mp3" }│   │
│  │        ],                                               │   │
│  │        "socials": [                                     │   │
│  │          {                                              │   │
│  │            "platform": "instagram",                     │   │
│  │            "url": "https://...",                        │   │
│  │            "followers": 5000                            │   │
│  │          }                                              │   │
│  │        ]                                                │   │
│  │      }                                                  │   │
│  │    ]                                                    │   │
│  │  }                                                      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ Store
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATABASE & STORAGE                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Database Tables                                        │   │
│  │  - profile_professions                                  │   │
│  │  - profession_languages                                 │   │
│  │  - profession_socials                                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  File Storage                                           │   │
│  │  https://allureportal.sawatech.ae/storage/              │   │
│  │  - professions/photos/                                  │   │
│  │  - professions/videos/                                  │   │
│  │  - professions/audios/                                  │   │
│  │  - professions/voices/                                  │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Loading Flow (Fetch Saved Professions)

```
User Opens Page
     │
     ├─→ GET /lookups/professions → Profession types
     │
     ├─→ GET /profile/professions → Saved professions
     │
     └─→ mapApiResponseToEntries()
         │
         ├─→ Convert relative paths to full URLs
         │   (professions/photo.jpg → https://.../storage/professions/photo.jpg)
         │
         ├─→ Map languages array
         │
         ├─→ Map socials array
         │
         └─→ Set state with ProfessionEntry[]
             │
             └─→ Render forms with data
```

### 2. Saving Flow (Sync Professions)

```
User Clicks Save
     │
     ├─→ Validate entries
     │   ├─→ Check required professions
     │   ├─→ Check required media
     │   └─→ Check required languages
     │
     ├─→ buildSyncProfessionsPayload()
     │   ├─→ Create FormData
     │   ├─→ Add profile_id
     │   ├─→ Loop through entries
     │   │   ├─→ Add profession_id
     │   │   ├─→ Add sub_profession_id
     │   │   ├─→ Add media files (if File, not string)
     │   │   ├─→ Add languages with voice files
     │   │   └─→ Add socials with followers
     │   └─→ Return FormData
     │
     ├─→ POST /api/profile/sync-professions
     │   ├─→ Headers: Authorization, Content-Type
     │   └─→ Body: FormData
     │
     └─→ On Success
         ├─→ Show toast notification
         ├─→ Refresh user profile
         └─→ Navigate to next step
```

### 3. Upload Flow (Single File)

```
User Selects/Drops File
     │
     ├─→ Validate file
     │   ├─→ Check file type
     │   └─→ Check file size
     │
     ├─→ Show progress animation
     │   └─→ 0% → 100% with gradient bar
     │
     ├─→ Generate preview
     │   ├─→ Image: URL.createObjectURL()
     │   ├─→ Video: URL.createObjectURL()
     │   └─→ Audio: <audio> player
     │
     └─→ Store File in state
         └─→ Will be sent in FormData on save
```

## Component Hierarchy

```
ProfessionContentNew
│
├─── ProfessionEntryForm (Entry 1)
│    │
│    ├─── Select (Profession)
│    ├─── Select (Sub-Profession)
│    │
│    ├─── MediaUploader (Photo)
│    │    └─── FileInput (hidden)
│    │
│    ├─── MediaUploader (Video)
│    │    └─── FileInput (hidden)
│    │
│    ├─── MediaUploader (Audio)
│    │    └─── FileInput (hidden)
│    │
│    ├─── LanguageManager
│    │    ├─── Select (Add Language)
│    │    └─── LanguagePills[]
│    │         └─── MediaUploader (Voice)
│    │
│    └─── SocialManager
│         ├─── SocialLinkCard[]
│         │    ├─── Select (Platform)
│         │    ├─── Input (URL)
│         │    └─── Input (Followers)
│         └─── Add Button
│
├─── ProfessionEntryForm (Entry 2)
│    └─── ...
│
├─── Add Entry Button
│
└─── Action Buttons
     ├─── Back Button
     └─── Save & Continue Button
```

## State Management

```typescript
// Main page state
const [professions, setProfessions] = useState<Profession[]>([]);
const [entries, setEntries] = useState<ProfessionEntry[]>([]);
const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

// Each entry contains
interface ProfessionEntry {
  id?: number;                    // Backend ID
  professionId: number;           // Selected profession
  subProfessionId: number | null; // Selected sub-profession
  photo?: File | string;          // Single photo
  video?: File | string;          // Single video
  audio?: File | string;          // Single audio
  languages: Array<{              // Multiple languages
    code: string;
    voice?: File | string;
  }>;
  socials: Array<{                // Multiple social links
    platform: string;
    url: string;
    followers?: number;
  }>;
}
```

## File Type Handling

```typescript
// During edit/load from backend
photo: "professions/photo_123.jpg"  // String URL
  ↓
Display: <img src="https://allureportal.sawatech.ae/storage/professions/photo_123.jpg" />

// During upload
photo: File {name: "profile.jpg", size: 123456, type: "image/jpeg"}
  ↓
Preview: <img src="blob:http://localhost:3000/abc-123" />
  ↓
Save: FormData.append("professions[0][photo]", File)

// Backend receives File, stores it, returns new path
Response: { photo: "professions/photo_456.jpg" }
```

## Validation Flow

```
Submit Triggered
     │
     ├─→ Check: entries.length > 0
     │   └─→ Fail: "Add at least one profession"
     │
     ├─→ For each entry:
     │   │
     │   ├─→ Get requirements from profession/sub-profession
     │   │
     │   ├─→ If requires_photo && !entry.photo
     │   │   └─→ Fail: "Photo required for [profession]"
     │   │
     │   ├─→ If requires_video && !entry.video
     │   │   └─→ Fail: "Video required for [profession]"
     │   │
     │   ├─→ If requires_audio && !entry.audio
     │   │   └─→ Fail: "Audio required for [profession]"
     │   │
     │   └─→ If requires_languages && entry.languages.length === 0
     │       └─→ Fail: "Language required for [profession]"
     │
     └─→ All valid: Proceed to save
```

---

**Legend**:
- `─→` : Flow direction
- `├─→` : Branch/Multiple paths
- `└─→` : Final path/End branch
- `▼` : Vertical flow continuation
- `│` : Connection line
