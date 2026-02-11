# Razorpay 400 Bad Request - Troubleshooting Guide

## Current Status
✅ **Backend Order Creation:** Working  
✅ **Razorpay Test Endpoint:** Working (`/api/test/test-razorpay`)  
❌ **Razorpay Checkout Modal:** Returning 400 Bad Request  

---

## Root Cause
The 400 error from `api.razorpay.com/v1/standard_checkout/payments/create/ajax` means your Razorpay account needs **email verification** to use the test keys in checkout mode.

---

## Solution: Complete Razorpay Account Setup

### Step 1: Verify Your Email
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Login with your credentials
3. Look for **"Verify Email"** notification at the top
4. Click the verification link sent to your email
5. Wait 5-10 minutes for propagation

### Step 2: Check API Keys
1. Go to **Dashboard → Settings → API Keys**
2. Copy your **Test Key ID** (starts with `rzp_test_`)
3. Copy your **Test Key Secret**
4. Compare with `.env` file:
   ```bash
   RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
   RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
   ```

### Step 3: Enable Test Mode in Account
1. Dashboard → Settings → Account & Billing
2. Ensure you're in **"Test Mode"** (not Live Mode)
3. You should see a blue "TEST MODE" badge

### Step 4: Test Razorpay Connection Again
```bash
# Stop servers
# Press Ctrl+C in both terminal windows

# Restart backend
cd d:\shopez\backend
node server.js

# Test endpoint
http://localhost:5000/api/test/test-razorpay
```

Should return:
```json
{
  "success": true,
  "message": "Razorpay connection working",
  "order": { ... }
}
```

### Step 5: Clear Browser Cache & Try Again
1. **Hard refresh** frontend: `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac)
2. Open DevTools: `F12`
3. Go to **Application → Cookies** → Delete all localhost cookies
4. Try payment flow again

---

## If Still Getting 400 Error

### Option A: Check Network Request Details
1. Open DevTools: `F12`
2. Go to **Network** tab
3. Click on the request: `payments/create/ajax`
4. Check **Response** tab for error message
5. Share the error details

### Option B: Regenerate Keys
1. Dashboard → Settings → API Keys
2. Click **"Regenerate"** button
3. Update `.env` with new keys
4. Restart backend server

### Option C: Contact Razorpay Support
- Email: support@razorpay.com
- Issue: "Test mode checkout returning 400 Bad Request"
- Include your Razorpay Account ID (found in Dashboard)

---

## Expected Flow When Working
```
✅ Razorpay script loaded
✅ Order created successfully
✅ Razorpay details received
✅ Razorpay modal opens (CURRENTLY FAILS HERE)
✅ Payment method selected
✅ Payment successful
```

---

## Quick Test Checklist
- [ ] Email verified in Razorpay
- [ ] Account in Test Mode
- [ ] Keys match between Razorpay Dashboard and .env
- [ ] Backend restarted after .env changes
- [ ] Browser cache cleared
- [ ] `/api/test/test-razorpay` returns success
- [ ] Try payment flow again

---

## Alternative: Use Mock Payment (For Development)
If you want to test without Razorpay verification, you can add a test payment option:

**Add to Checkout.jsx:**
```jsx
// Add this button in payment method section
{paymentMethod === "test" && (
  <button onClick={handleTestPayment} className="btn btn-success">
    Process Test Payment
  </button>
)}
```

This allows development without waiting for Razorpay verification.

---

## Test Card Details (Once Account Verified)
- Card Number: `4111 1111 1111 1111`
- Expiry: `12/25`
- CVV: `123`
- Name: Any name
- Email: Any email

---

**Note:** Test mode is only for development. Once ready for production, switch to Live Mode and use real keys.
