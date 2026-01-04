# Account Sidebar - Developer Reference Card

Quick reference for developers working with the new Account Sidebar.

## Component Structure

### AccountSidebar
```typescript
type AccountSidebarProps = {
  navItems: NavItem[];
  currentApprovalStatus?: "approved" | "pending" | "rejected";
};

// Usage
<AccountSidebar 
  navItems={navItems}
  currentApprovalStatus={approvalStatus}
/>
```

### NavItem Type
```typescript
type NavItem = {
  id: string;              // Unique identifier
  label: string | ReactNode; // Display label
  labelKey?: string;       // Translation key
  icon: ReactNode;         // Icon component
  completion?: number;     // 0-100 progress percentage
  section?: string;        // "profile" | "professional" | "account"
};
```

## File Locations

```
Core Files:
├── src/components/account/AccountSidebar.tsx    (New component)
├── src/components/account/AccountLayout.tsx     (Updated)
└── src/lib/utils/accountNavItems.tsx            (Updated)

Documentation:
├── docs/ACCOUNT_SIDEBAR_REBUILD.md              (Technical)
├── docs/ACCOUNT_SIDEBAR_VISUAL_GUIDE.md         (Design)
├── docs/ACCOUNT_SIDEBAR_CHECKLIST.md            (Testing)
├── docs/ACCOUNT_SIDEBAR_SUMMARY.md              (Complete)
└── docs/ACCOUNT_SIDEBAR_QUICKSTART.md           (Quick start)
```

## Key Features

### Desktop
- `w-64` (256px) fixed width
- `sticky top-6` positioning
- Rounded borders: `rounded-2xl`
- Shadow: `shadow-sm`
- Border: `border border-gray-200`

### Mobile
- Menu button: `TbMenu2` icon
- Close button: `TbX` icon
- Slides down from top
- Max height with scrolling
- Auto-closes on nav click

### Sections
- **Profile**: Basic Info, Appearance
- **Professional**: Professions, Experience, Portfolio, Photos
- **Account**: Security & Privacy, Billing & Plans

### Progress Indicators
```javascript
// 100% Complete
<TbCircleCheck size={18} /> // Green checkmark

// 0-99%
<div>{completion}%</div>    // Numeric display

// Color coding
0-49%:   Orange (#f97316)
50-74%:  Amber (#f59e0b)
75-99%:  Blue (#3b82f6)
100%:    Green (#22c55e)
```

## Common Operations

### Adding a New Navigation Item

```typescript
// In accountNavItems.tsx
{
  id: "notifications",
  label: "Notifications",
  labelKey: "accountSettings.account.nav.notifications",
  icon: <TbBell />,
  section: "account",
  completion: 100, // Optional
}
```

### Creating a New Account Page

```tsx
// src/app/account/notifications/page.tsx
"use client";

import { useMemo } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AccountLayout from "@/components/account/AccountLayout";
import { useAuth } from "@/contexts/AuthContext";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

export default function NotificationsPage() {
  const { user } = useAuth();
  const navItems = useMemo(
    () => getAccountNavItems(user?.profile),
    [user?.profile?.progress_step]
  );

  return (
    <ProtectedRoute>
      <AccountLayout navItems={navItems}>
        {/* Your content here */}
      </AccountLayout>
    </ProtectedRoute>
  );
}
```

### Updating Section Name

```typescript
// In accountNavItems.tsx
section: "my-custom-section" // Any string works
```

Then add translation:
```json
{
  "accountSettings.sidebar.section.my-custom-section": "My Section"
}
```

## Styling Reference

### Colors
```typescript
// Primary
primary: "#c49a47"
primaryLight: "#d4af57"

// Status
success: "#22c55e"    // 100%
warning: "#3b82f6"    // 75%+
amber: "#f59e0b"      // 50-75%
orange: "#f97316"     // <50%

// Neutrals
white: "#ffffff"
gray50: "#f9fafb"
gray200: "#e5e7eb"
gray600: "#6b7280"
gray900: "#111827"
```

### Spacing (Tailwind)
```typescript
px-4, py-3  // Nav items
p-2         // Container padding
px-4, py-3  // Sidebar padding
gap-3       // Icon + label gap
space-y-1   // Item spacing
```

### Border Radius
```typescript
rounded-lg    // 8px  (buttons)
rounded-xl    // 12px (containers)
rounded-2xl   // 16px (sidebar)
rounded-full  // 9999px (badges)
```

### Transitions
```typescript
transition-all duration-200 ease-out  // Smooth
transition-colors                      // Color only
transition-transform                   // Scale/move
```

## Responsive Breakpoints

```typescript
// Mobile first
<1024px:   Drawer + menu button
>=1024px:  Sticky sidebar (visible)

// Specific breakpoints
sm: 640px   // Tablets
md: 768px   // Large tablets
lg: 1024px  // Desktop (sidebar appears)
xl: 1280px  // Large desktop
2xl: 1536px // Extra large
```

## Accessibility Checklist

```typescript
✅ Semantic HTML
   <nav role="navigation">
   <aside role="complementary">
   <main> for content

✅ ARIA Labels
   aria-label="Account settings navigation"
   aria-current="page" (active item)
   aria-expanded={isOpen} (drawer)

✅ Keyboard Navigation
   Tab: Move through items
   Enter: Activate item

✅ Screen Readers
   Aria-labels for all actions
   Status announcements
   Semantic structure
```

## Animation Timing

```typescript
// Default transition
200ms ease-out  // Standard
300ms ease      // Smooth scroll

// Properties
transform       // GPU accelerated
opacity         // GPU accelerated
color           // Safe
background      // Safe
```

## TypeScript Types

```typescript
// Props
type AccountSidebarProps = {
  navItems: NavItem[];
  currentApprovalStatus?: "approved" | "pending" | "rejected";
};

// Navigation Item
type NavItem = {
  id: string;
  label: string | ReactNode;
  labelKey?: string;
  icon: ReactNode;
  completion?: number;
  section?: string;
};

// Grouped Items
type GroupedNavItems = {
  [key: string]: NavItem[];
};
```

## Common Patterns

### Pattern 1: Basic Page Setup
```tsx
import AccountLayout from "@/components/account/AccountLayout";
import { getAccountNavItems } from "@/lib/utils/accountNavItems";

export default function Page() {
  const { user } = useAuth();
  const navItems = useMemo(
    () => getAccountNavItems(user?.profile),
    [user?.profile?.progress_step]
  );

  return (
    <ProtectedRoute>
      <AccountLayout navItems={navItems}>
        {/* Content */}
      </AccountLayout>
    </ProtectedRoute>
  );
}
```

### Pattern 2: Conditional Items
```typescript
// In accountNavItems.tsx
const items = [];

if (isProfileComplete) {
  items.push(...profileItems);
}

if (hasSubscription) {
  items.push(...subscriptionItems);
}

return items;
```

### Pattern 3: Progress Calculation
```typescript
const completion = Math.round(
  (filledFields / totalFields) * 100
);

return {
  ...item,
  completion,
};
```

## Debugging Tips

### Issue: Sidebar not showing
```
1. Check screen width >= 1024px (desktop)
2. Verify navItems array is not empty
3. Check browser console for errors
4. Inspect with DevTools
```

### Issue: Mobile drawer not opening
```
1. Check screen width < 1024px
2. Verify mobileDrawerOpen state
3. Check onClick handler is wired
4. Test with console.log()
```

### Issue: Progress indicators wrong
```
1. Verify completion prop is 0-100
2. Check calculation function
3. Test with fixed value
4. Inspect color values
```

### Issue: Animations laggy
```
1. Check FPS in DevTools
2. Avoid transform + layout changes
3. Use will-change sparingly
4. Profile with Performance tab
```

## Performance Tips

### Do's
```javascript
✅ Use CSS animations (GPU accelerated)
✅ Memoize expensive calculations
✅ Lazy load mobile drawer
✅ Use transform for positioning
✅ Batch DOM updates
```

### Don'ts
```javascript
❌ Don't animate width/height
❌ Don't recalculate on every render
❌ Don't force reflow unnecessarily
❌ Don't use expensive selectors
❌ Don't animate color on every frame
```

## Testing Utilities

### Manual Testing Script
```typescript
// Test in browser console
document.querySelector('nav[role="navigation"]')  // Verify HTML
document.querySelector('[aria-current="page"]')   // Find active
localStorage.getItem('auth-token')                // Check auth
window.innerWidth                                 // Check responsive
```

### Quick Checks
```bash
# Build
npm run build  # Should pass

# Type check
npx tsc --noEmit  # Should pass

# Lint
npx eslint src/components/account/  # Should pass
```

## Browser DevTools

### Inspect Sidebar
```
Right-click sidebar → Inspect
Look for:
- <nav role="navigation">
- <aside role="complementary">
- <a aria-current="page">
```

### Check Animations
```
DevTools → Performance → Record
Scroll sidebar
Check for 60fps (green line)
No red "Rendering" bars
```

### Test Responsiveness
```
DevTools → Device Toolbar
Choose device or custom size
Test at: 375px (mobile), 768px (tablet), 1024px (desktop)
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Sidebar hidden | Check screen width ≥ 1024px |
| Menu button missing | Check screen width < 1024px |
| Active state not showing | Verify route matches nav item ID |
| Progress color wrong | Check completion value 0-100 |
| Animation jerky | Check DevTools Performance |
| Icons not rendering | Verify icon imports |
| Text not translating | Check translation key in i18n files |

## Reference Links

- [AccountSidebar Source](../src/components/account/AccountSidebar.tsx)
- [AccountLayout Source](../src/components/account/AccountLayout.tsx)
- [Navigation Items](../src/lib/utils/accountNavItems.tsx)
- [Full Documentation](./ACCOUNT_SIDEBAR_REBUILD.md)
- [Visual Guide](./ACCOUNT_SIDEBAR_VISUAL_GUIDE.md)
- [Testing Checklist](./ACCOUNT_SIDEBAR_CHECKLIST.md)

## Version Info

```
Version: 1.0.0
Created: January 3, 2026
Status: Production Ready
Build: ✅ Passing
Tests: ✅ Ready
Docs: ✅ Complete
```

---

**Quick Links**:
- Need details? → [ACCOUNT_SIDEBAR_REBUILD.md](./ACCOUNT_SIDEBAR_REBUILD.md)
- Need visuals? → [ACCOUNT_SIDEBAR_VISUAL_GUIDE.md](./ACCOUNT_SIDEBAR_VISUAL_GUIDE.md)
- Need to test? → [ACCOUNT_SIDEBAR_CHECKLIST.md](./ACCOUNT_SIDEBAR_CHECKLIST.md)
- Need overview? → [ACCOUNT_SIDEBAR_SUMMARY.md](./ACCOUNT_SIDEBAR_SUMMARY.md)
