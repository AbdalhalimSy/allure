# Payment API Testing with cURL

## Prerequisites

Make sure your backend server is running on `http://127.0.0.1:8000`

```bash
# Check if backend is running
lsof -i :8000
```

## Testing Credentials

```
Email: layla.hassan@example.com
Password: password

API Key: 51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d
Base URL: http://127.0.0.1:8000/api
```

## Test Card for CCAvenue

```
Card Number: 5123450000000008
Expiry: 01/39
CVV: 100
```

---

## Step 1: Login

First, get an authentication token:

```bash
curl -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "V-API-KEY: 51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d" \
  -d '{
    "email": "layla.hassan@example.com",
    "password": "password"
  }' | jq .
```

**Expected Response:**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGc...",
    "user_id": 1,
    "profile_id": 1
  }
}
```

**Extract the token:**
```bash
TOKEN=$(curl -s -X POST http://127.0.0.1:8000/api/login \
  -H "Content-Type: application/json" \
  -H "V-API-KEY: 51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d" \
  -d '{"email": "layla.hassan@example.com", "password": "password"}' | jq -r '.data.token')

echo "Token: $TOKEN"
```

---

## Step 2: Get Subscription Packages

Get available subscription packages:

```bash
curl -X GET http://127.0.0.1:8000/api/subscriptions/packages \
  -H "Accept: application/json" \
  -H "V-API-KEY: 51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d" | jq .
```

**Expected Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Basic",
      "price": 99.00,
      "duration_in_days": 30
    },
    {
      "id": 2,
      "title": "Premium",
      "price": 299.00,
      "duration_in_days": 30
    }
  ]
}
```

---

## Step 3: Validate Coupon (Optional)

Validate a coupon code:

```bash
curl -X POST http://127.0.0.1:8000/api/subscriptions/validate-coupon \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "V-API-KEY: 51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "profile_id": 1,
    "package_id": 2,
    "coupon_code": "DISCOUNT10"
  }' | jq .
```

---

## Step 4: Check Subscription Status

Check current subscription status:

```bash
curl -X GET http://127.0.0.1:8000/api/subscriptions/status \
  -H "Accept: application/json" \
  -H "V-API-KEY: 51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

---

## Step 5: Initiate Payment

Start a payment transaction:

```bash
curl -X POST http://127.0.0.1:8000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -H "V-API-KEY: 51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "profile_id": 1,
    "package_id": 2,
    "coupon_code": "DISCOUNT10"
  }' | jq .
```

**Expected Response:**
```json
{
  "status": "success",
  "message": "Payment initiated successfully",
  "data": {
    "order_id": "ORD12345678901234",
    "payment_url": "https://secure.ccavenue.com/transaction/...",
    "encrypted_data": "a1b2c3d4e5f6...",
    "access_code": "AVZB05LI16BW29BZWB",
    "form_action": "https://secure.ccavenue.com/transaction/...",
    "amount": "269.10",
    "currency": "AED"
  }
}
```

**Extract Order ID:**
```bash
ORDER_ID=$(curl -s -X POST http://127.0.0.1:8000/api/payments/initiate \
  -H "Content-Type: application/json" \
  -H "V-API-KEY: 51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "profile_id": 1,
    "package_id": 2
  }' | jq -r '.data.order_id')

echo "Order ID: $ORDER_ID"
```

---

## Step 6: Check Payment Status

Check the status of a payment:

```bash
curl -X GET "http://127.0.0.1:8000/api/payments/status?order_id=$ORDER_ID" \
  -H "Accept: application/json" \
  -H "V-API-KEY: 51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

**Expected Response (Pending):**
```json
{
  "status": "success",
  "message": "Payment is pending",
  "data": {
    "status": "pending",
    "order_id": "ORD12345678901234",
    "created_at": "2025-12-16 10:30:00"
  }
}
```

**Expected Response (Completed):**
```json
{
  "status": "success",
  "message": "Payment completed",
  "data": {
    "status": "completed",
    "order_id": "ORD12345678901234",
    "amount": "299.00",
    "paid_at": "2025-12-16 10:35:00"
  }
}
```

---

## Step 7: Poll Payment Status

Poll for payment completion (retry every 2 seconds, max 10 attempts):

```bash
for i in {1..10}; do
  echo "Attempt $i:"
  STATUS=$(curl -s -X GET "http://127.0.0.1:8000/api/payments/status?order_id=$ORDER_ID" \
    -H "V-API-KEY: 51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d" \
    -H "Authorization: Bearer $TOKEN" | jq -r '.data.status')
  
  echo "Status: $STATUS"
  
  if [ "$STATUS" != "pending" ]; then
    echo "Payment status changed to: $STATUS"
    break
  fi
  
  sleep 2
done
```

---

## Complete Test Flow Script

Run this to test all endpoints in sequence:

```bash
#!/bin/bash

API_BASE="http://127.0.0.1:8000/api"
API_KEY="51ccefd30487aef513344d7dff64c6422be3ad7b32c4516efd067eaef17b617d"
EMAIL="layla.hassan@example.com"
PASSWORD="password"

echo "=== Step 1: Login ==="
LOGIN=$(curl -s -X POST "$API_BASE/login" \
  -H "Content-Type: application/json" \
  -H "V-API-KEY: $API_KEY" \
  -d "{\"email\": \"$EMAIL\", \"password\": \"$PASSWORD\"}")

TOKEN=$(echo "$LOGIN" | jq -r '.data.token')
echo "Token: ${TOKEN:0:20}..."

echo -e "\n=== Step 2: Get Packages ==="
curl -s -X GET "$API_BASE/subscriptions/packages" \
  -H "V-API-KEY: $API_KEY" | jq .

echo -e "\n=== Step 3: Initiate Payment ==="
PAYMENT=$(curl -s -X POST "$API_BASE/payments/initiate" \
  -H "Content-Type: application/json" \
  -H "V-API-KEY: $API_KEY" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"profile_id": 1, "package_id": 2}')

ORDER_ID=$(echo "$PAYMENT" | jq -r '.data.order_id')
echo "Order ID: $ORDER_ID"
echo "$PAYMENT" | jq .

echo -e "\n=== Step 4: Check Payment Status ==="
curl -s -X GET "$API_BASE/payments/status?order_id=$ORDER_ID" \
  -H "V-API-KEY: $API_KEY" \
  -H "Authorization: Bearer $TOKEN" | jq .

echo -e "\n=== Test Complete ==="
```

Save this as `test-apis.sh` and run:
```bash
chmod +x test-apis.sh
./test-apis.sh
```

---

## Error Handling

### 401 Unauthorized
```json
{
  "status": "error",
  "message": "Unauthorized"
}
```
**Solution:** Make sure you're sending a valid token in the `Authorization: Bearer` header

### 422 Validation Error
```json
{
  "status": "error",
  "message": "Validation failed",
  "data": {
    "profile_id": ["The profile id field is required."]
  }
}
```
**Solution:** Check that all required fields are provided

### 400 Invalid Coupon
```json
{
  "status": "error",
  "message": "Invalid coupon code"
}
```
**Solution:** Use a valid coupon code or omit the field

### Connection Timeout
```
curl: (28) Operation timeout
```
**Solution:** Make sure backend is running on port 8000

---

## Quick Reference

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/login` | POST | Get auth token | No |
| `/subscriptions/packages` | GET | Get available packages | No |
| `/subscriptions/validate-coupon` | POST | Validate coupon | Yes |
| `/subscriptions/status` | GET | Get current subscription | Yes |
| `/payments/initiate` | POST | Start payment | Yes |
| `/payments/status` | GET | Check payment status | Yes |

---

## Debugging Tips

1. **Pretty print JSON:**
   ```bash
   curl ... | jq .
   ```

2. **See request headers:**
   ```bash
   curl -v ...
   ```

3. **Check response headers only:**
   ```bash
   curl -I ...
   ```

4. **Save response to file:**
   ```bash
   curl ... > response.json
   jq . response.json
   ```

5. **Test with custom timeout:**
   ```bash
   timeout 10 curl ...
   ```

---

## Notes

- All times are in UTC/GMT
- All amounts are in AED
- The test card is only for development/staging
- Payment processing may take a few seconds
- Order IDs are unique per transaction
