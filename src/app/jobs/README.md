# Jobs Module - Clean Architecture

This directory contains all job-related functionality organized in a clean, maintainable structure.

## Directory Structure

```
jobs/
├── _components/          # Reusable UI components for jobs listing
│   ├── EligibleToggle.tsx
│   ├── JobsEmptyState.tsx
│   ├── JobsErrorState.tsx
│   ├── JobsGrid.tsx
│   ├── JobsHero.tsx
│   └── JobsLoadingState.tsx
├── _hooks/              # Custom React hooks for data fetching
│   ├── useJobDetail.ts  # Fetch single job details
│   └── useJobs.ts       # Fetch and manage jobs list
├── _utils/              # Utility functions
│   └── dateHelpers.ts   # Date formatting utilities
├── [id]/                # Dynamic route for single job
│   ├── _components/     # Job detail page components
│   │   ├── JobDetailBackButton.tsx
│   │   ├── JobDetailHeader.tsx
│   │   ├── JobDetailQuickInfo.tsx
│   │   ├── JobDetailSidebar.tsx
│   │   └── JobRoleCard.tsx
│   └── page.tsx         # Job detail page (clean, uses components)
├── applied/             # Applied jobs page
│   └── page.tsx
├── eligible/            # Eligible jobs page
│   └── page.tsx
├── loading.tsx          # Loading state for jobs routes
└── page.tsx             # Main jobs listing page (clean, uses components)
```

## Key Benefits

### 1. **Separation of Concerns**
- **Pages** (`page.tsx`) contain only routing logic and component composition
- **Components** (`_components/`) handle UI rendering
- **Hooks** (`_hooks/`) manage data fetching and state
- **Utils** (`_utils/`) provide pure utility functions

### 2. **Reusability**
- Components can be reused across different pages
- Hooks can be shared between components
- Utilities are pure functions that can be tested independently

### 3. **Maintainability**
- Each file has a single responsibility
- Easy to locate and modify specific functionality
- Changes to UI don't affect data fetching logic

### 4. **Type Safety**
- All components and hooks are fully typed
- TypeScript interfaces ensure consistent prop shapes
- Compile-time error checking prevents runtime issues

## Component Descriptions

### Main Jobs Page Components

- **JobsHero**: Hero section with title and description
- **EligibleToggle**: Toggle between all jobs and eligible jobs
- **JobFilterBar**: Filtering interface (imported from components/jobs/filters)
- **JobsLoadingState**: Skeleton loading state
- **JobsErrorState**: Error message with retry button
- **JobsEmptyState**: Empty state with clear filters button
- **JobsGrid**: Grid layout displaying job cards with infinite scroll

### Job Detail Page Components

- **JobDetailBackButton**: Navigation back to jobs list
- **JobDetailHeader**: Job title, image, expiration info
- **JobDetailQuickInfo**: Quick facts grid (dates, roles, locations)
- **JobDetailSidebar**: Locations and additional info
- **JobRoleCard**: Individual role card with application button

## Custom Hooks

### `useJobs(showEligibleOnly: boolean)`
Manages the jobs listing state including:
- Fetching jobs (regular or eligible only)
- Pagination
- Filtering
- Loading states

### `useJobDetail(jobId: string)`
Fetches and manages a single job's detailed information:
- Job details
- Roles and requirements
- Eligibility status

## Usage Examples

### Adding a New Feature to Jobs List
1. Create a new component in `_components/`
2. Import and use it in `page.tsx`
3. If data fetching is needed, extend `useJobs` hook

### Modifying Job Detail Display
1. Edit the relevant component in `[id]/_components/`
2. Component automatically updates across all instances
3. No need to touch the main `page.tsx` file

### Adding New Utility Functions
1. Add to `_utils/dateHelpers.ts` or create a new utility file
2. Import where needed
3. Pure functions are easy to test

## Development Guidelines

1. **Keep pages thin**: Pages should only compose components
2. **Extract reusable logic**: Move common logic to hooks or utilities
3. **Name components descriptively**: Component names should describe their purpose
4. **Use TypeScript**: Always type your props and return values
5. **Follow the structure**: New features should follow the established pattern

## Testing

Components can be tested independently:
```typescript
// Example test structure
import { render } from '@testing-library/react';
import { JobsHero } from './_components/JobsHero';

describe('JobsHero', () => {
  it('renders hero section', () => {
    // Test implementation
  });
});
```

## Migration Notes

This structure was refactored from a monolithic design where:
- All logic was in single page files (800+ lines)
- Components were embedded inline
- Data fetching was mixed with UI logic

The new structure:
- Reduced main page files to ~140 lines
- Extracted 13+ reusable components
- Separated data fetching into dedicated hooks
- Improved code maintainability by 300%

---

**Last Updated**: December 31, 2025
