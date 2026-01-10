# Language Switching Centralization - Implementation Guide

## Overview

This document explains the centralized language switching system implemented to ensure all API requests properly handle language changes across the application.

## Problem Statement

Before this implementation, language-dependent API calls were scattered across multiple components with inconsistent patterns:

1. **Manual locale dependencies**: Components used `useEffect(..., [locale])` with manual refetch logic
2. **Inconsistent header passing**: Some APIs received `locale` parameter, others relied on `Accept-Language` header
3. **Race conditions**: When switching languages, multiple components would refetch simultaneously without coordination
4. **Duplicate code**: Similar refetch patterns repeated in ~15+ components

## Solution Architecture

### Core Components

#### 1. Language Switch Handler (`/src/lib/api/language-switch-handler.ts`)
- **Purpose**: Singleton service managing language state and change notifications
- **Key Features**:
  - Single source of truth for current locale
  - Callback registration system for components
  - Async callback support for API refetches
  - Automatic localStorage synchronization

#### 2. useLanguageSwitch Hook (`/src/hooks/useLanguageSwitch.ts`)
- **Purpose**: React hook for registering language change callbacks
- **Key Features**:
  - Automatic registration/unregistration on mount/unmount
  - Ref-based callback to avoid re-registrations
  - Type-safe callback signatures

#### 3. Enhanced API Client (`/src/lib/api/client.ts`)
- **Changes**: Now uses `languageSwitchHandler.getLocale()` as single source of truth
- **Benefit**: All API requests automatically use the correct locale

#### 4. Enhanced I18nContext (`/src/contexts/I18nContext.tsx`)
- **Changes**: Integrated with `languageSwitchHandler` to trigger callbacks
- **Benefit**: When user switches language, all registered components refetch automatically

## How It Works

### Flow Diagram

```
User clicks language switcher
    ↓
I18nContext.setLocale(newLocale)
    ↓
languageSwitchHandler.switchLocale(newLocale)
    ↓
Updates localStorage
    ↓
Notifies all registered callbacks (in parallel)
    ↓
Each component refetches its data with new locale
    ↓
API requests use new locale from languageSwitchHandler
```

## Components Needing Updates

### Current Pattern (Before)
```tsx
function MyComponent() {
  const { locale } = useI18n();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await apiClient.get(`/endpoint?lang=${locale}`);
      setData(response.data);
    };
    fetchData();
  }, [locale]); // Refetches when locale changes
  
  return <div>{/* render */}</div>;
}
```

### New Pattern (After)
```tsx
import { useLanguageSwitch } from '@/hooks/useLanguageSwitch';

function MyComponent() {
  const { locale } = useI18n();
  const [data, setData] = useState([]);
  
  const fetchData = useCallback(async () => {
    const response = await apiClient.get('/endpoint'); // No manual locale param
    setData(response.data);
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  // Auto-refetch on language change
  useLanguageSwitch(fetchData);
  
  return <div>{/* render */}</div>;
}
```

### Benefits of New Pattern

1. **Separation of Concerns**: Refetch logic separated from locale dependency
2. **No manual locale passing**: API client handles it automatically
3. **Cleaner dependencies**: No need to track locale in every useEffect
4. **Centralized control**: Language switch handler coordinates all refetches

## Components That Need Migration

### High Priority (Language-dependent lookups)

1. **JobFilterBar** (`/src/components/jobs/filters/JobFilterBar.tsx`)
   - Fetches: countries, professions, nationalities
   - Current: `useEffect(..., [locale])`
   - Impact: HIGH - used on jobs page

2. **TalentFilterBar** (`/src/components/talent/TalentFilterBar.tsx`)
   - Fetches: countries, nationalities, ethnicities, professions, appearance options
   - Current: `useEffect(..., [locale])`
   - Impact: HIGH - used on talents page

3. **HeroBanner** (`/src/components/home/HeroBanner.tsx`)
   - Fetches: banners
   - Current: `useEffect(..., [locale])`
   - Impact: MEDIUM - home page only

4. **PackagesPage** (`/src/app/packages/page.tsx`)
   - Fetches: subscription packages
   - Current: `useEffect` with `loadPackages` callback dependent on locale
   - Impact: HIGH - affects purchasing flow

5. **HomePage** (`/src/app/page.tsx`)
   - Fetches: professions, partners, jobs, talents
   - Current: Multiple `useEffect` with `[locale]` dependency
   - Impact: HIGH - main landing page

6. **TalentsPage** (`/src/app/talents/page.tsx`)
   - Fetches: talents list
   - Current: `fetchTalents` callback includes locale
   - Impact: HIGH - main talents directory

7. **AppliedJobsPage** (`/src/app/jobs/applied/page.tsx`)
   - Fetches: applied jobs with manual Accept-Language header
   - Current: Manual header passing
   - Impact: MEDIUM

8. **TalentDetailPage** (`/src/app/talents/[id]/page.tsx`)
   - Fetches: single talent details
   - Current: `useEffect(..., [params.id, locale])`
   - Impact: MEDIUM

9. **BillingPage** (`/src/app/account/billing/page.tsx`)
   - Fetches: subscription packages
   - Current: `loadData` callback with locale dependency
   - Impact: HIGH - affects billing

### Medium Priority (Using useLookupData hook)

The following components already use `useLookupData` hook which internally handles locale changes:
- **BasicInformationContent** - ✅ Already handles locale via useLookupData
- **AppearanceContent** - ✅ Already handles locale via useLookupData

**Action**: Verify `useLookupData` hook properly reacts to language switch handler

### Low Priority (No language-dependent data)

These components fetch data but it's not language-dependent:
- Profile data endpoints
- Job applications
- Notifications (though messages may be translated)

## Implementation Steps

### Step 1: Update useLookupData Hook ✅ (Completed)

The `useLookupData` hook already has the correct pattern - it watches locale and refetches:

```tsx
// Current implementation in /src/hooks/useLookupData.ts
useEffect(() => {
  const fetchLookups = async () => {
    // Fetch with locale
  };
  fetchLookups();
}, [locale, mergedOptions]);
```

**Enhancement**: Can optionally integrate with useLanguageSwitch for consistency, but current implementation works.

### Step 2: Update Filter Bars

#### JobFilterBar
```tsx
// Add at top
import { useLanguageSwitch } from '@/hooks/useLanguageSwitch';

// Inside component
const fetchLookups = useCallback(async () => {
  // existing fetch logic
}, []);

// Replace useEffect(..., [locale]) with:
useEffect(() => {
  fetchLookups();
}, [fetchLookups]);

useLanguageSwitch(fetchLookups);
```

#### TalentFilterBar
Same pattern as JobFilterBar

### Step 3: Update Pages

#### HomePage
```tsx
import { useLanguageSwitch } from '@/hooks/useLanguageSwitch';

// Convert each useEffect with locale dependency
const fetchProfessions = useCallback(async () => {
  // existing logic without locale in deps
}, [t]); // Only include non-locale deps

useEffect(() => {
  fetchProfessions();
}, [fetchProfessions]);

useLanguageSwitch(fetchProfessions);

// Repeat for fetchPartners, fetchJobs, fetchTalents
```

#### PackagesPage
```tsx
import { useLanguageSwitch } from '@/hooks/useLanguageSwitch';

const loadPackages = useCallback(async () => {
  // Remove locale from dependencies
  const response = await getSubscriptionPackages(); // No locale param
  // ...
}, []); // Remove locale from deps

useLanguageSwitch(loadPackages);
```

### Step 4: Update API Functions

Remove explicit `locale` parameters from functions that already use apiClient:

**Before**:
```tsx
export async function getBanners(locale?: string): Promise<BannersResponse> {
  const response = await apiClient.get("/banners", {
    headers: locale ? { 'Accept-Language': locale } : {},
  });
  return response.data;
}
```

**After**:
```tsx
export async function getBanners(): Promise<BannersResponse> {
  const response = await apiClient.get("/banners");
  // apiClient automatically adds Accept-Language header
  return response.data;
}
```

**Files to update**:
- `/src/lib/api/banners.ts` - Remove locale parameter
- `/src/lib/api/subscriptions.ts` - Remove locale parameter from getSubscriptionPackages

### Step 5: Testing Checklist

- [ ] Switch language on homepage - verify professions, partners, jobs, talents refetch
- [ ] Switch language on jobs page - verify filter dropdowns update
- [ ] Switch language on talents page - verify filter dropdowns and results update
- [ ] Switch language on packages page - verify packages refetch
- [ ] Switch language on billing page - verify subscription data updates
- [ ] Verify no console errors during language switch
- [ ] Verify no duplicate API requests
- [ ] Test with network throttling to ensure proper loading states

## API Function Migration Guide

### Functions That Should NOT Accept Locale Parameter

These should rely on apiClient's automatic header injection:

1. `getBanners()` - Already uses apiClient
2. `getSubscriptionPackages()` - Already uses apiClient
3. Any function using `apiClient.get/post/put/delete`

### Functions That Should Accept Locale Parameter

These are typically used in:
- API route handlers (server-side) where locale comes from request headers
- Direct fetch calls (not using apiClient)

Examples:
- `useLookupData` internal calls (uses apiClient, so already works)
- Server-side API routes (they extract locale from request headers)

## Rollout Strategy

### Phase 1: Foundation (Completed ✅)
- Create language-switch-handler.ts
- Create useLanguageSwitch hook
- Update API client
- Update I18nContext

### Phase 2: Critical Paths
1. Update HomePage (affects all users)
2. Update JobFilterBar (affects job seekers)
3. Update TalentFilterBar (affects employers)
4. Update PackagesPage (affects purchasing)

### Phase 3: Secondary Pages
5. Update TalentsPage
6. Update BillingPage
7. Update HeroBanner
8. Update AppliedJobsPage
9. Update TalentDetailPage

### Phase 4: API Cleanup
10. Remove locale parameters from API functions
11. Update all call sites

### Phase 5: Verification
12. End-to-end testing
13. Performance monitoring
14. User acceptance testing

## Backward Compatibility

- ✅ Old pattern still works (components with `useEffect(..., [locale])`)
- ✅ New pattern adds capability without breaking existing code
- ✅ Can migrate components incrementally
- ✅ No breaking changes to API contracts

## Performance Considerations

### Before
- Each component independently fetches on locale change
- No coordination between components
- Potential for race conditions

### After
- Centralized handler coordinates all refetches
- Callbacks run in parallel via Promise.all
- Single localStorage write
- Clear execution order

## Monitoring & Debugging

### Debug Language Switches

```tsx
// In any component
useLanguageSwitch((newLocale) => {
  console.log('Component X refetching for locale:', newLocale);
});
```

### Check Registered Callbacks

```tsx
// In console
import { languageSwitchHandler } from '@/lib/api/language-switch-handler';
console.log('Active callbacks:', languageSwitchHandler['callbacks'].size);
```

### Force Refresh

```tsx
// Useful for testing
languageSwitchHandler.triggerRefresh();
```

## Future Enhancements

1. **Loading State Coordination**: Track when all callbacks complete
2. **Error Handling**: Centralized error reporting for failed refetches
3. **Caching**: Cache API responses per locale to avoid refetching
4. **Preloading**: Prefetch data for other locale in background
5. **Analytics**: Track language switch frequency and performance

## Questions & Answers

**Q: Why not just use React Context for callbacks?**
A: Context re-renders all consumers. Our handler allows targeted callbacks without unnecessary re-renders.

**Q: What if a component needs to refetch for other reasons too?**
A: Keep the existing useEffect. The language switch hook is additive.

**Q: Do I need to update all components at once?**
A: No! The system is backward compatible. Migrate incrementally.

**Q: What about server-side rendering?**
A: Language switch handler only runs on client. Server-side locale comes from request headers (already working).

## Summary

This centralized system provides:
✅ Single source of truth for locale
✅ Coordinated refetching across components
✅ Cleaner component code
✅ Better performance
✅ Easier debugging
✅ Backward compatible migration path

Next steps: Follow Phase 2 implementation plan to update critical components.
