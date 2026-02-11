# Razorpay Payment Debugging Guide

## Current Issue Analysis

**Error:** Razorpay API returning `400 Bad Request` when trying to initialize payment

**Affected Endpoint:** `api.razorpay.com/v1/standard_checkout/payments/create/ajax`

---

## Step 1: Verify Razorpay Credentials

### Test the Connection

1. **Restart Backend Server:**
   ```bash
   cd d:\shopez\backend
   npm run dev
   ```

2. **Open Browser & Test:**
   ```
   http://localhost:5000/api/test/test-razorpay
   ```

3. **Expected Response (Success):**
   ```json
   {
     "success": true,
     "message": "Razorpay connection working",
     "order": {
       "id": "order_xxxxx",
       "amount": 10000,
       "status": "created"
     },
     "keyId": "rzp_test_xxxxxx"
   }
   ```

4. **If Response is Error:**
   ```json
   {
     "success": false,
     "message": "Razorpay connection failed",
     "error": "Invalid X-Razorpay-Key header value",
     "code": "INVALID-HEADER"
   }
   ```

### What Each Error Means

| Error | Cause | Solution |
|-------|-------|----------|
| `Invalid X-Razorpay-Key header` | Key ID is invalid/expired | Update `.env` with correct key |
| `Unauthorized` | Secret key is wrong | Verify `RAZORPAY_KEY_SECRET` in `.env` |
| `Bad Request` | Amount format is wrong | Ensure amount is positive integer |
| `Not Found` | API endpoint changed | Check Razorpay documentation |

---

## Step 2: Check Environment Variables

1. **Open `.env` file:**
   ```bash
   cat d:\shopez\backend\.env | grep RAZORPAY
   ```

2. **Should show:**
   ```
   RAZORPAY_KEY_ID=rzp_test_SDZuVJeLueHBta
   RAZORPAY_KEY_SECRET=QsaSZIf4yl2G6gHM1i0LlKSB
   ```

3. **If missing or empty:**
   - Add to `.env` file
   - Restart backend: `npm run dev`
   - Try test endpoint again

---

## Step 3: Check Backend Logs

When you try to create a Razorpay order, the backend console should show:

### Success Logs:
```
🔍 RAZORPAY ORDER CREATION START
Raw amount received: 1000 number
Currency: INR
Items count: 3
Amount in paise: 100000
📦 Razorpay options: {"amount":100000,"currency":"INR","receipt":"receipt_...","payment_capture":1}
✅ Razorpay order created successfully
Order ID: order_ABCxxx
Order amount: 100000
Order status: created
```

### Error Logs:
```
❌ Razorpay order creation error: Invalid X-Razorpay-Key header value
Error code: INVALID-HEADER
Error details: Invalid X-Razorpay-Key header value
```

---

## Step 4: Check Frontend Logs

Open browser DevTools (F12) and check console for:

### Success Flow:
```
Creating Razorpay order with data: {amount: 1000, currency: "INR", itemsCount: 3}
Razorpay order response: {success: true, razorpayOrderId: "order_xxxx", ...}
Payment details prepared: {razorpayOrderId: "order_xxxx", key: "rzp_test_xxxx", ...}
Opening Razorpay with options: {key: "rzp_test_xxxx", amount: 100000, ...}
```

### Error Flow:
```
ERROR Error creating Razorpay order:
Error details: {message: "Failed to create Razorpay order", response: {success: false, message: "..."}
```

---

## Step 5: Common Issues & Solutions

### Issue 1: Test Credentials Expired
**Symptom:** `"Invalid X-Razorpay-Key header value"` error

**Solution:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com)
2. Login with your Razorpay account
3. Go to Settings → API Keys
4. Generate new test keys
5. Update `.env` file with new credentials
6. Restart backend

### Issue 2: Amount Format Wrong
**Symptom:** `"400 Bad Request"` from Razorpay API

**Solution:**
1. Check amount is being sent correctly
2. Backend converts to paise: multiply by 100
3. Verify amount is > 0
4. Check in backend logs: `Amount in paise: xxxxx`

### Issue 3: Wrong Payment Method
**Symptom:** Razorpay modal doesn't open properly

**Solution:**
1. Verify payment method is "card" or "razorpay"
2. Check `razorpayLoaded` state is `true`
3. Check Razorpay script loaded (DevTools Network tab)

### Issue 4: CORS Issues
**Symptom:** `"Refused to get unsafe header"` in console

**Solution:**
1. This is normal for some Razorpay headers
2. Not blocking the payment flow
3. Can be safely ignored

---

## Step 6: Network Tab Debugging

1. **Open DevTools → Network tab**
2. **Filter for "razorpay" or "api"**
3. **Look for requests:**

   - **POST `/api/payment/create-razorpay-order`**
     - Status: 201 (success) or 500 (error)
     - Response body shows order ID or error

   - **POST to `api.razorpay.com`**
     - Status: Various
     - This is Razorpay's internal request
     - May show 400 if there's an issue

---

## Step 7: Test Payment Flow

### When Everything is Working:

1. **Add products to cart**
   - See cart icon update

2. **Go to checkout**
   - Fill address form (valid data)
   - Select payment method (Razorpay)

3. **Click "Place Order"**
   - Backend creates Razorpay order
   - Frontend receives order ID
   - Razorpay modal opens

4. **In Razorpay Modal:**
   - Select payment method (Card, UPI, etc.)
   - Use test credentials (see below)
   - Click Pay / Submit

5. **After Payment:**
   - Payment handler called with response
   - Backend verifies signature
   - Order created in database
   - Redirected to confirmation page

---

## Test Credentials

### Test Card (Success)
```
Number: 4111 1111 1111 1111
Expiry: 12/25 (any future date)
CVV: 123 (any 3 digits)
Name: Any
```

### Test UPI (Success)
```
UPI ID: success@razorpay
```

### Test Card (Failure - for testing error flow)
```
Number: 4000 0000 0000 0002
Expiry: 12/25
CVV: 123
```

---

## Manual Testing Checklist

- [ ] Test Razorpay connection: `http://localhost:5000/api/test/test-razorpay`
- [ ] Check `.env` file has correct credentials
- [ ] Backend shows successful order creation logs
- [ ] Frontend shows "Opening Razorpay with options"
- [ ] Razorpay modal appears
- [ ] Can select payment method in modal
- [ ] Test payment with card/UPI succeeds
- [ ] Backend shows payment verification logs
- [ ] Order appears in database
- [ ] Redirected to confirmation page

---

## Browser DevTools Debugging

### Console Tab
```javascript
// Paste this to check Razorpay is loaded
window.Razorpay
// Should return: ƒ Razorpay(options) { ... }
// If undefined, script didn't load

// Check configuration
localStorage.getItem('userEmail')
// Should return your email or null
```

### Network Tab
1. Filter: "xhr" (XHR requests)
2. Look for:
   - `create-razorpay-order` - POST request
   - `verify-razorpay` - POST request
3. Check response:
   - Status: 200-201 (success) or 400-500 (error)
   - Body: Contains error message or order details

### Sources Tab
1. Add breakpoint in Checkout.jsx
2. Line 134: `const razorpayDetails = await initiateRazorpayPayment(...)`
3. Step through to see:
   - What data is being sent
   - What response is received
   - Where it's failing

---

## Getting Help

If still facing issues:

1. **Check all steps above**
2. **Gather logs:**
   - Backend console output
   - Browser DevTools console
   - Network tab requests/responses
3. **Verify:**
   - `.env` file has correct keys
   - Backend is running on port 5000
   - Frontend is running on port 5173
   - MongoDB is connected
4. **Try test endpoint:**
   - `http://localhost:5000/api/test/test-razorpay`
   - This will tell you if credentials are valid

---

## Quick Restart

If making changes, restart servers:

```bash
# Stop all servers (Ctrl+C in terminals)

# Clear cache (optional)
cd d:\shopez\backend
rm -r node_modules package-lock.json
npm install

# Restart backend
npm run dev

# In another terminal, restart frontend
cd d:\shopez\frontend
npm run dev
```

---

## Support Resources

- **Razorpay Docs:** https://razorpay.com/docs/
- **Test Credentials:** https://razorpay.com/docs/payments/test-card/
- **API Reference:** https://razorpay.com/docs/api/
- **Status:** https://razorpay.com/status

---

**Last Updated:** February 11, 2026
