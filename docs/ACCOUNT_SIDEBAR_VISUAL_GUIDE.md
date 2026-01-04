# Account Settings Sidebar - Visual Design Guide

## Design System

### Color Palette
```
Primary Color:        #c49a47 (Gold/Amber)
Active Gradient:      #c49a47 → #d4af57
Success/Complete:     #22c55e (Green)
Warning/High:         #3b82f6 (Blue)
Progress/Medium:      #f59e0b (Amber)
Alert/Low:            #f97316 (Orange)

Neutral Grays:
- Surface:            #ffffff (White)
- Hover:              #f9fafb (Gray-50)
- Border:             #e5e7eb (Gray-200)
- Text Primary:       #111827 (Gray-900)
- Text Secondary:     #6b7280 (Gray-600)
- Text Tertiary:      #9ca3af (Gray-400)
```

## Layout Structure

### Desktop Layout (≥1024px)

```
┌─ Container (max-w-7xl) ─────────────────────┐
│                                              │
│  Header Section                              │
│  ┌────────────────────────────────────────┐ │
│  │ Account Settings      [Approval Badge] │ │
│  │ Manage your account settings            │ │
│  └────────────────────────────────────────┘ │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  │  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │   SIDEBAR    │  │  MAIN        │  │ │
│  │  │              │  │  CONTENT     │  │ │
│  │  │  w-64        │  │              │  │ │
│  │  │  sticky      │  │  flex-1      │  │ │
│  │  │  top-6       │  │              │  │ │
│  │  │              │  │              │  │ │
│  │  └──────────────┘  └──────────────┘  │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### Mobile Layout (<1024px)

```
┌─ Container ─────────────────┐
│                              │
│ Header Section               │
│ ┌──────────────────────────┐ │
│ │ Account Settings         │ │
│ │ Manage your account      │ │
│ └──────────────────────────┘ │
│                              │
│ [≡] Menu Button              │
│                              │
│ ┌──────────────────────────┐ │
│ │ Drawer (when open)       │ │
│ │ - Profile                │ │
│ │ - Appearance             │ │
│ │ - Professions            │ │
│ │ - Experience             │ │
│ │ - Portfolio              │ │
│ │ - Photos                 │ │
│ │ - Security               │ │
│ │ - Billing                │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ MAIN CONTENT             │ │
│ │                          │ │
│ └──────────────────────────┘ │
│                              │
└──────────────────────────────┘
```

## Sidebar Component

### Header Section (Desktop)
```
┌─────────────────────────────────┐
│ PROFILE STATUS                  │
│ ┌─────────────────────────────┐ │
│ │ ● Approved    [Success]     │ │
│ │ ● Pending     [Warning]     │ │
│ │ ● Rejected    [Error]       │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### Section: Profile
```
┌─────────────────────────────────┐
│ PROFILE                         │
├─────────────────────────────────┤
│                                 │
│ 👤 Basic Information       [✓]  │
│   • Smooth transition           │
│   • Scale on hover              │
│   • Gradient on active          │
│                                 │
│ ✨ Appearance              75%   │
│   • Progress badge              │
│   • Color-coded                 │
│                                 │
└─────────────────────────────────┘
```

### Section: Professional
```
┌─────────────────────────────────┐
│ PROFESSIONAL                    │
├─────────────────────────────────┤
│                                 │
│ 💼 Professions             50%   │
│ ⭐ Experience              25%   │
│ 📸 Portfolio               90%   │
│ 📷 Profile Photos         [✓]   │
│                                 │
└─────────────────────────────────┘
```

### Section: Account
```
┌─────────────────────────────────┐
│ ACCOUNT                         │
├─────────────────────────────────┤
│                                 │
│ 🔒 Security & Privacy          │
│ 💳 Billing & Plans             │
│                                 │
└─────────────────────────────────┘
```

## Navigation Item States

### Normal State
```
┌─────────────────────────────────────┐
│ 📄 Basic Information                │
│                                     │
│ Appearance: text-gray-700           │
│ Background: transparent             │
│ Border: none                        │
│ Hover: bg-gray-50                   │
│ Active: false                       │
└─────────────────────────────────────┘
```

### Hover State
```
┌─────────────────────────────────────┐
│ 📄 Basic Information                │
│                                     │
│ Appearance: text-gray-700           │
│ Background: bg-gray-50 (soft)       │
│ Transform: Subtle scale up          │
│ Icon: Slightly grows                │
│ Transition: 200ms ease-out          │
└─────────────────────────────────────┘
```

### Active State
```
┌─────────────────────────────────────┐
│ 📄 Basic Information           [✓]  │
│                                     │
│ Appearance: text-white              │
│ Background: gradient (gold)         │
│ Shadow: md (subtle depth)           │
│ Pulse: Soft animated pulse          │
│ Icon: Scaled at 110%                │
└─────────────────────────────────────┘
```

## Progress Indicators

### Completion: 100%
```
┌────────┐
│   ✓    │  • Green background
│        │  • Checkmark icon
│ 100%   │  • White on active
└────────┘
```

### Completion: 75%
```
┌────────┐
│   75   │  • Blue indicator
│   %    │  • Numeric display
│        │  • Color-coded badge
└────────┘
```

### Completion: 50%
```
┌────────┐
│   50   │  • Amber indicator
│   %    │  • Numeric display
│        │  • Orange/Amber color
└────────┘
```

### Completion: < 50%
```
┌────────┐
│   25   │  • Orange indicator
│   %    │  • Numeric display
│        │  • Warm color
└────────┘
```

## Quick Stats Card (Optional Enhancement)

```
┌──────────────────────────┐
│ PROFILE PROGRESS         │
├──────────────────────────┤
│                          │
│ Profile Complete    73%  │
│ ▓▓▓▓▓▓▓░░░░░░░░░░░ ▓▓   │
│                          │
│ Legend:                  │
│ ▓ Completed              │
│ ░ Remaining              │
│                          │
└──────────────────────────┘
```

## Mobile Drawer

### Closed State
```
┌──────────────────────┐
│ [≡] Menu             │  ← Touch target: 40px height
└──────────────────────┘
```

### Open State
```
┌──────────────────────────────┐
│ [✕] Close                    │  ← Easy to dismiss
├──────────────────────────────┤
│                              │
│ PROFILE                      │
│ 👤 Basic Information    [✓]  │
│ ✨ Appearance          75%   │
│                              │
│ PROFESSIONAL                 │
│ 💼 Professions         50%   │
│ ⭐ Experience          25%   │
│ 📸 Portfolio           90%   │
│ 📷 Profile Photos      [✓]  │
│                              │
│ ACCOUNT                      │
│ 🔒 Security & Privacy        │
│ 💳 Billing & Plans           │
│                              │
└──────────────────────────────┘
```

## Animations & Transitions

### State Transitions
- **Duration**: 200ms
- **Easing**: ease-out (smooth deceleration)
- **Properties**: color, background, transform, box-shadow

### Hover Effects
```
Transform: scale(1.05) on icon
Transition: 200ms ease-out
Background: Fade to gray-50
```

### Active Effects
```
Gradient: #c49a47 → #d4af57
Scale: Icon at 110%
Shadow: Medium depth (md)
Pulse: Soft infinite animation
```

### Mobile Drawer
```
Direction: Slides down from top
Duration: 200ms ease-out
Overlay: Optional (implicit focus)
Dismiss: Auto-close on nav click
```

## Accessibility Features

### Semantic Structure
```html
<aside role="complementary">
  <nav role="navigation">
    <section>
      <h3>PROFILE</h3>
      <a role="menuitem" aria-current="page">
        • Icon
        • Label
        • Indicator
      </a>
    </section>
  </nav>
</aside>
```

### ARIA Labels
- `aria-label="Account settings sidebar"`
- `aria-label="Account settings navigation"`
- `aria-current="page"` on active item
- `aria-label="[Label] - [Completion]%"`
- `aria-label="[Label] - Complete"`

### Keyboard Navigation
- **Tab**: Move through nav items
- **Enter/Space**: Activate nav item
- **Mobile**: Menu button accessible via Tab

### Color Independence
- Icons + color for meaning
- No color-only communication
- Text labels alongside icons
- Checkmark + color for completion

## Responsive Breakpoints

### Mobile (< 640px)
```
- Single column layout
- Drawer navigation
- Larger touch targets
- Vertical stacking
- Full-width content
```

### Tablet (640px - 1023px)
```
- Drawer navigation (persistent option)
- Optimized touch targets
- Balanced spacing
- Readable text sizes
```

### Desktop (≥ 1024px)
```
- Sidebar always visible
- Sticky positioning
- Optimized for mouse/trackpad
- Generous spacing
- Full visual hierarchy
```

## Performance Optimizations

### CSS
- Hardware acceleration via `transform` and `opacity`
- Minimal repaints (avoid `left`, `top`, `width`)
- Transition on GPU-safe properties

### JavaScript
- Memoized grouping logic
- Lazy drawer rendering (only when open)
- Event delegation where applicable
- No unnecessary re-renders

### Bundle Size
- ~3KB additional (gzipped)
- No external UI library dependencies
- Leverages existing Tailwind classes
- Icon-only imports

## Dark Mode Support (Future)

```
Light Mode:
- Background: #ffffff
- Text: #111827
- Border: #e5e7eb

Dark Mode:
- Background: #1f2937
- Text: #f3f4f6
- Border: #374151
```

## Design Tokens

```typescript
// Colors
const colors = {
  primary: '#c49a47',
  primaryLight: '#d4af57',
  success: '#22c55e',
  warning: '#3b82f6',
  amber: '#f59e0b',
  orange: '#f97316',
  white: '#ffffff',
  gray50: '#f9fafb',
  gray200: '#e5e7eb',
  gray600: '#6b7280',
  gray900: '#111827',
}

// Transitions
const transitions = {
  fast: '200ms ease-out',
  smooth: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
}

// Spacing
const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  xxl: '32px',
}

// Border Radius
const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
}
```

## Usage Example with Visual Hierarchy

```
┌─────────────────────────────────────────┐
│  Account Settings                       │  ← H1: 32px, Bold
│  Manage your account settings            │  ← Subtext: 14px, Gray
│  [Approval Status Badge]                 │  ← Inline badge
│                                          │
│  ┌────────────────┐  ┌─────────────────┐│
│  │ PROFILE        │  │ Basic Info [✓] ││  ← Section + Items
│  │ Basic Info [✓] │  │ Appearance 75%  ││
│  │ Appearance 75% │  │ Profession 50%  ││
│  │                │  │ Experience 25%  ││
│  │ PROFESSIONAL   │  │ Portfolio 90%   ││
│  │ Profession 50% │  │ Photos [✓]      ││
│  │ Experience 25% │  │                 ││
│  │ Portfolio 90%  │  │ ACCOUNT         ││
│  │ Photos [✓]     │  │ Security        ││
│  │                │  │ Billing         ││
│  │ ACCOUNT        │  └─────────────────┘│
│  │ Security       │                      │
│  │ Billing        │  [Main Content]      │
│  └────────────────┘                      │
│                                          │
└─────────────────────────────────────────┘
```
