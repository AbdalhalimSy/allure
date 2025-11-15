# Quick Reference - Profession Management

## 🚀 Quick Start

### Using the New Components

```tsx
// Import the main component
import ProfessionContent from '@/app/dashboard/account/profile/ProfessionContentNew';

// Use in your page
<ProfessionContent onNext={handleNext} onBack={handleBack} />
```

### Using Individual Components

```tsx
// Media Upload
import MediaUploader from '@/components/ui/MediaUploader';

<MediaUploader
  type="photo"
  value={photo}
  onChange={(file) => setPhoto(file)}
  maxSize={5 * 1024 * 1024}
/>

// Language Management
import LanguageManager from '@/components/professional/LanguageManager';

<LanguageManager
  languages={languages}
  onChange={setLanguages}
/>

// Social Links
import SocialManager from '@/components/professional/SocialManager';

<SocialManager
  socials={socials}
  onChange={setSocials}
/>
```

## 📦 API Usage

```typescript
import { syncProfessions, fetchSavedProfessions } from '@/lib/api/professions';

// Save professions
await syncProfessions(professionEntries);

// Load professions
const entries = await fetchSavedProfessions();
```

## 🎨 Component Props

### MediaUploader
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | 'photo' \| 'video' \| 'audio' | required | Media type |
| value | File \| string \| undefined | undefined | Current file or URL |
| onChange | (file: File \| null) => void | required | Change handler |
| required | boolean | false | Is required |
| disabled | boolean | false | Is disabled |
| maxSize | number | 50MB | Max file size in bytes |

### LanguageManager
| Prop | Type | Description |
|------|------|-------------|
| languages | ProfessionLanguage[] | Array of languages |
| onChange | (languages: ProfessionLanguage[]) => void | Change handler |
| disabled | boolean | Is disabled |

### SocialManager
| Prop | Type | Description |
|------|------|-------------|
| socials | ProfessionSocial[] | Array of social links |
| onChange | (socials: ProfessionSocial[]) => void | Change handler |
| disabled | boolean | Is disabled |

### ProfessionEntryForm
| Prop | Type | Description |
|------|------|-------------|
| professions | Profession[] | Available professions |
| entry | ProfessionEntry | Current entry data |
| onChange | (entry: ProfessionEntry) => void | Change handler |
| onRemove | () => void | Remove handler |
| disabled | boolean | Is disabled |

## 🔧 Type Definitions

```typescript
// Language with voice
interface ProfessionLanguage {
  code: string;
  voice?: File | string;
}

// Social link
interface ProfessionSocial {
  platform: string;
  url: string;
  followers?: number;
}

// Profession entry
interface ProfessionEntry {
  id?: number;
  professionId: number;
  subProfessionId: number | null;
  photo?: File | string;
  video?: File | string;
  audio?: File | string;
  languages: ProfessionLanguage[];
  socials: ProfessionSocial[];
}
```

## 🔄 FormData Structure

```javascript
// Building payload
const formData = new FormData();
formData.append('profile_id', profileId);

// For each profession
formData.append('professions[0][id]', entryId); // optional
formData.append('professions[0][profession_id]', professionId);
formData.append('professions[0][sub_profession_id]', subProfessionId);
formData.append('professions[0][photo]', photoFile);
formData.append('professions[0][video]', videoFile);
formData.append('professions[0][audio]', audioFile);

// Languages
formData.append('professions[0][languages][0][code]', 'en');
formData.append('professions[0][languages][0][voice]', voiceFile);

// Socials
formData.append('professions[0][socials][0][platform]', 'instagram');
formData.append('professions[0][socials][0][url]', 'https://...');
formData.append('professions[0][socials][0][followers]', '5000');
```

## ✅ Validation Rules

### Required Fields
- ✅ At least one profession
- ✅ Valid profession_id
- ✅ Media based on requirements
- ✅ Languages if required

### File Limits
- 📷 Photo: 5MB (JPG, PNG, WEBP)
- 🎥 Video: 50MB (MP4, MOV, AVI)
- 🎵 Audio: 10MB (MP3, WAV, OGG)

### Constraints
- ⚠️ ONE file per media type
- ⚠️ No multi-file selection
- ⚠️ File type validation
- ⚠️ File size validation

## 🎯 Common Tasks

### Add a Profession
```typescript
const newEntry: ProfessionEntry = {
  professionId: selectedProfessionId,
  subProfessionId: null,
  languages: [],
  socials: [],
};
setEntries([...entries, newEntry]);
```

### Update Media
```typescript
onChange({
  ...entry,
  photo: newPhotoFile,
});
```

### Add Language
```typescript
onChange({
  ...entry,
  languages: [...entry.languages, { code: 'en' }],
});
```

### Add Social Link
```typescript
onChange({
  ...entry,
  socials: [...entry.socials, {
    platform: 'instagram',
    url: '',
    followers: undefined,
  }],
});
```

### Save All Professions
```typescript
await syncProfessions(entries);
toast.success('Saved!');
```

## 🐛 Debugging

### Check FormData Contents
```javascript
for (let [key, value] of formData.entries()) {
  console.log(key, value);
}
```

### Common Issues

**Issue**: Files not uploading
- ✅ Check if File instance (not string)
- ✅ Verify Content-Type: multipart/form-data
- ✅ Check file size limits

**Issue**: Media not showing
- ✅ Verify URL construction
- ✅ Check storage base URL
- ✅ Ensure proper path handling

**Issue**: Validation failing
- ✅ Check requirements for profession/sub-profession
- ✅ Verify all required fields present
- ✅ Check file type/size

## 🎨 Styling Tips

### Custom Colors
```typescript
// Modify gradients in components
className="bg-gradient-to-r from-blue-500 to-purple-500"

// Change accent colors
className="text-blue-600 dark:text-blue-400"
```

### Dark Mode
All components support dark mode via Tailwind's `dark:` prefix.

### RTL Support
All components check `locale === 'ar'` and apply RTL layouts automatically.

## 📱 Responsive Breakpoints

```typescript
// Mobile first approach
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"

// Hide on mobile
className="hidden md:block"

// Stack on mobile
className="flex flex-col md:flex-row"
```

## 🔗 Related Files

- Types: `src/types/profession.ts`
- API: `src/lib/api/professions.ts`
- Components: `src/components/professional/`
- UI: `src/components/ui/MediaUploader.tsx`
- Page: `src/app/dashboard/account/profile/ProfessionContentNew.tsx`

## 📚 Full Documentation

See `PROFESSION_MANAGEMENT.md` for complete documentation.

---

**Quick Links**:
- [Full Documentation](./PROFESSION_MANAGEMENT.md)
- [Implementation Summary](./IMPLEMENTATION_SUMMARY.md)
- [Type Definitions](./src/types/profession.ts)
