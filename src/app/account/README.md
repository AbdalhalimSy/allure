# Account Module Structure

This directory contains all account-related pages and components for user profile management.

## Directory Structure

```
account/
├── _components/          # Reusable content components
│   ├── BasicInformationContent.tsx
│   ├── AppearanceContent.tsx
│   ├── ProfessionContent.tsx
│   ├── ExperienceContent.tsx
│   └── PortfolioContent.tsx
├── _lib/                 # Internal utilities
│   └── AccountPageWrapper.tsx
├── appearance/           # Appearance settings page
├── basic/               # Basic information page
├── billing/             # Subscription & billing page
├── experience/          # Experience management page
├── photos/              # Profile photos page
├── portfolio/           # Portfolio page
├── profession/          # Profession settings page
├── profile/             # Multi-step profile setup (onboarding)
├── security/            # Security & privacy page
└── page.tsx             # Root redirect to profile

```

## Architecture

### Pages (Routes)
Each folder represents a route in the application:
- `/account` → Redirects to `/account/profile`
- `/account/profile` → Multi-step profile setup wizard (for incomplete profiles)
- `/account/basic` → Basic information editor
- `/account/appearance` → Appearance settings
- `/account/profession` → Profession management
- `/account/experience` → Experience management
- `/account/portfolio` → Portfolio management
- `/account/photos` → Profile photo management
- `/account/security` → Security settings
- `/account/billing` → Subscriptions and billing

### Content Components (`_components/`)
Reusable components that contain the actual form logic and UI:
- **BasicInformationContent** - Name, gender, nationality, contact info
- **AppearanceContent** - Physical appearance attributes
- **ProfessionContent** - Profession selection and management
- **ExperienceContent** - Professional experience management
- **PortfolioContent** - Portfolio item management

### Utilities (`_lib/`)
Internal utilities used across account pages:
- **AccountPageWrapper** - Provides authentication, layout, and profile completion checks

## Usage Patterns

### Standard Account Page
```tsx
import AccountPageWrapper from "../_lib/AccountPageWrapper";
import YourContent from "../_components/YourContent";

export default function YourPage() {
  return (
    <AccountPageWrapper>
      <YourContent />
    </AccountPageWrapper>
  );
}
```

### Page Without Profile Completion Check
For pages that should be accessible even with incomplete profiles:
```tsx
<AccountPageWrapper requireCompleteProfile={false}>
  <YourContent />
</AccountPageWrapper>
```

## Profile Completion Flow

1. New users start at `/account/profile` (stepper interface)
2. Users complete steps: Basic → Appearance → Profession → Experience → Portfolio
3. Once `progress_step === "complete"`, users can access individual pages
4. Individual pages redirect back to `/account/profile` if profile is incomplete

## Key Features

- **DRY Principle**: Single `AccountPageWrapper` eliminates duplicate authentication/layout code
- **Type Safety**: Full TypeScript support across all components
- **Responsive**: Mobile-first design with adaptive layouts
- **i18n Ready**: All text uses translation keys
- **Protected Routes**: Authentication required for all pages
- **Progressive Enhancement**: Works with and without JavaScript

## Naming Conventions

- **Page files**: `page.tsx` (Next.js App Router convention)
- **Content components**: `{Feature}Content.tsx` (e.g., `BasicInformationContent.tsx`)
- **Internal folders**: Prefixed with `_` to indicate they're not routes
- **Component names**: PascalCase matching the feature they represent
