# Authentication System Documentation

## Overview
This Next.js application uses a custom authentication system with route protection, token-based authentication, and hydration handling to prevent UI flashing.

## Key Components

### 1. AuthContext (`src/contexts/AuthContext.tsx`)
Central authentication state management.

**Features:**
- `isAuthenticated`: Boolean indicating if user is logged in
- `user`: User object with name, email, avatarUrl
- `setUser()`: Updates user and automatically sets isAuthenticated
- `logout()`: Async logout with API call
- `hydrated`: Boolean to prevent flash of incorrect UI during page load

### 2. ProtectedRoute Component (`src/components/auth/ProtectedRoute.tsx`)
Wrapper component for route protection.

**Usage:**

```tsx
// For pages that require authentication (e.g., dashboard, profile)
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div>Protected dashboard content</div>
    </ProtectedRoute>
  );
}

// For guest-only pages (e.g., login, register)
export default function LoginPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <div>Login form</div>
    </ProtectedRoute>
  );
}
```

**Props:**
- `requireAuth` (boolean, default: true)
  - `true`: Redirects to `/login` if not authenticated
  - `false`: Redirects to `/dashboard` if authenticated (guest-only pages)

### 3. Header Component
Automatically shows/hides login/signup buttons based on authentication state.

**When logged out:**
- Shows "Login" link
- Shows "Sign Up" button

**When logged in:**
- Shows user avatar/initial
- Shows dropdown menu with:
  - User name and email
  - Edit Profile link
  - Logout button with confirmation modal

## Current Route Protection

### Protected Pages (Require Login)
- `/dashboard` - Main dashboard
- Future protected pages can use `<ProtectedRoute requireAuth={true}>`

### Guest-Only Pages (Redirect if Logged In)
- `/login` - Login page
- `/register` - Registration page
- `/forgot-password` - Password reset
- `/verify-email` - Email verification

## Authentication Flow

### Login
1. User enters email/password
2. POST to `/api/auth/login`
3. Receives token from backend
4. Token stored in localStorage
5. User data saved to AuthContext
6. Redirect to `/dashboard`

### Registration
1. User fills Step 1 (single or twins mode)
2. POST to `/api/auth/register`
3. Redirect to Step 2 (OTP verification)
4. User enters OTP code
5. POST to `/api/auth/verify-email`
6. Auto-login via `/api/auth/login`
7. Redirect to `/dashboard`

### Logout
1. User clicks logout button
2. Confirmation modal appears
3. On confirm, POST to `/api/auth/logout`
4. Clear token from localStorage
5. Clear user from AuthContext
6. Redirect to home page

### Email Verification for Unverified Users
1. User tries to login
2. Backend returns "Please verify your email"
3. Redirect to `/verify-email?email=X&password=Y`
4. User enters OTP
5. Verify email
6. Auto-login
7. Redirect to `/dashboard`

## Adding Protection to New Pages

### For Protected Pages (Require Authentication)
```tsx
"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function MyProtectedPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1>Protected Content</h1>
        <p>Only authenticated users can see this.</p>
      </div>
    </ProtectedRoute>
  );
}
```

### For Guest-Only Pages
```tsx
"use client";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function MyGuestPage() {
  return (
    <ProtectedRoute requireAuth={false}>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1>Guest Only</h1>
        <p>Logged in users will be redirected to dashboard.</p>
      </div>
    </ProtectedRoute>
  );
}
```

## Token Management

### Storage
- Token stored in `localStorage.getItem("auth_token")`
- Email stored in `localStorage.getItem("auth_email")`

### API Integration
- Axios interceptor automatically adds `Authorization: Bearer <token>` header
- All API calls to backend include token when authenticated

### Security Notes
- Tokens are stored in localStorage (consider httpOnly cookies for production)
- Password temporarily passed in URL for email verification (consider sessionStorage)
- All API routes use `v-api-key` header for server-to-server auth

## Testing Authentication

1. **Test Login Protection:**
   - Logout if logged in
   - Try to access `/dashboard` → Should redirect to `/login`

2. **Test Guest Protection:**
   - Login with credentials
   - Try to access `/login` or `/register` → Should redirect to `/dashboard`

3. **Test Header UI:**
   - Logout → Should show "Login" and "Sign Up" buttons
   - Login → Should show user avatar and dropdown menu

4. **Test Logout:**
   - Click logout button
   - Confirm in modal
   - Should see success toast and redirect to home

## Future Enhancements

- [ ] Implement refresh token mechanism
- [ ] Add role-based access control (admin, user, talent, etc.)
- [ ] Move tokens to httpOnly cookies
- [ ] Add session timeout
- [ ] Add "Remember Me" functionality
- [ ] Add social login (Google, Facebook)
- [ ] Add two-factor authentication
- [ ] Add password reset via email
