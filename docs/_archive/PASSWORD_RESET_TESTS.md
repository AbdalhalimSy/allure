# Password Reset API Test Commands

## Test Email: a@a.a

---

## 1. Forgot Password Tests

### ✅ Test 1: Successful Request
Send reset code to email `a@a.a`:
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{"email":"a@a.a"}' \
  -w "\n\nHTTP Status: %{http_code}\n"
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "A password reset code has been sent to your email.",
  "data": {
    "email": "a@a.a",
    "expires_at": "2025-11-20T06:51:25.000000Z"
  }
}
```

---

### ❌ Test 2: Invalid Email Format
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{"email":"invalid-email"}' \
  -w "\n\nHTTP Status: %{http_code}\n"
```

**Expected Response (422):**
```json
{
  "message": "The email field must be a valid email address.",
  "errors": {
    "email": ["The email field must be a valid email address."]
  }
}
```

---

### ❌ Test 3: Missing Email Field
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{}' \
  -w "\n\nHTTP Status: %{http_code}\n"
```

**Expected Response (422):**
```json
{
  "message": "The email field is required.",
  "errors": {
    "email": ["The email field is required."]
  }
}
```

---

### ❌ Test 4: Non-existent User
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{"email":"nonexistent@test.com"}' \
  -w "\n\nHTTP Status: %{http_code}\n"
```

**Expected Response (422):**
```json
{
  "message": "We could not find a user with that email address.",
  "errors": {
    "email": ["We could not find a user with that email address."]
  }
}
```

---

## 2. Reset Password Tests

### ❌ Test 1: Invalid Reset Code
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{
    "email":"a@a.a",
    "code":"123456",
    "password":"NewPassword123!",
    "password_confirmation":"NewPassword123!"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n"
```

**Expected Response (422):**
```json
{
  "status": "error",
  "message": "The reset code is invalid.",
  "data": null
}
```

---

### ❌ Test 2: Password Mismatch
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{
    "email":"a@a.a",
    "code":"123456",
    "password":"NewPassword123!",
    "password_confirmation":"DifferentPassword123!"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n"
```

**Expected Response (422):**
```json
{
  "message": "The password field confirmation does not match.",
  "errors": {
    "password": ["The password field confirmation does not match."]
  }
}
```

---

### ❌ Test 3: Non-existent User
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{
    "email":"nonexistent@test.com",
    "code":"123456",
    "password":"NewPassword123!",
    "password_confirmation":"NewPassword123!"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n"
```

**Expected Response (422):**
```json
{
  "message": "We could not find a user with that email address.",
  "errors": {
    "email": ["We could not find a user with that email address."]
  }
}
```

---

### ✅ Test 4: Successful Password Reset (with valid code)
**Note:** You need to get the actual code from the email sent after calling forgot-password

```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{
    "email":"a@a.a",
    "code":"XXXXXX",
    "password":"NewPassword123!",
    "password_confirmation":"NewPassword123!"
  }' \
  -w "\n\nHTTP Status: %{http_code}\n"
```

**Expected Response (200):**
```json
{
  "status": "success",
  "message": "Your password has been successfully reset.",
  "data": null
}
```

---

## Complete Test Flow

### Step 1: Request Reset Code
```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{"email":"a@a.a"}'
```

### Step 2: Check Email
Check the email inbox for `a@a.a` and note the 6-digit code.

### Step 3: Reset Password with Code
```bash
curl -X POST http://localhost:3000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{
    "email":"a@a.a",
    "code":"YOUR_CODE_HERE",
    "password":"NewPassword123!",
    "password_confirmation":"NewPassword123!"
  }'
```

### Step 4: Login with New Password
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -H "Accept-Language: en" \
  -d '{
    "email":"a@a.a",
    "password":"NewPassword123!"
  }'
```

---

## UI Testing

### Test in Browser:

1. **Navigate to Login Page:**
   ```
   http://localhost:3000/login
   ```

2. **Click "Forgot Password" Link:**
   - Should redirect to `/forgot-password`

3. **Enter Email and Submit:**
   - Enter: `a@a.a`
   - Click "Send Reset Link"
   - Should see success toast
   - Should auto-redirect to `/reset-password?email=a@a.a`

4. **Enter Reset Code and New Password:**
   - Check email for 6-digit code
   - Enter code, password, and confirmation
   - Click "Reset Password"
   - Should see success toast
   - Should redirect to `/login`

5. **Login with New Password:**
   - Enter `a@a.a` and new password
   - Should successfully log in

---

## Testing Notes

- ✅ All API endpoints are proxied through Next.js API routes
- ✅ Backend validates all inputs and returns proper error codes
- ✅ Reset codes expire in 15 minutes
- ✅ Old codes are invalidated when new ones are requested
- ✅ All user tokens are deleted on successful password reset
- ✅ Email notifications are sent via backend notification system
- ✅ Frontend uses existing UI components (Input, Button, Label, etc.)
- ✅ Toast notifications for all success/error states
- ✅ Automatic redirects for better UX

---

## Error Status Codes

| Code | Description |
|------|-------------|
| 200  | Success |
| 422  | Validation Error (invalid input, wrong code, etc.) |
| 410  | Gone (expired code) |
| 404  | Not Found (user doesn't exist) - may return as 422 in some cases |
| 500  | Server Error |
