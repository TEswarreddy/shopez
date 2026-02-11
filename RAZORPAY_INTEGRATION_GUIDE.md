# Razorpay Payment Integration Guide - ShopEz

## ✅ Status: FULLY IMPLEMENTED

This guide covers the complete Razorpay payment integration in ShopEz e-commerce platform.

## 🔐 Configuration

### Environment Variables
Ensure these are set in `.env`:

```env
RAZORPAY_KEY_ID=rzp_test_SDZuVJeLueHBta
RAZORPAY_KEY_SECRET=QsaSZIf4yl2G6gHM1i0LlKSB
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_here  # Optional
```

## 📦 Implementation Overview

### Frontend Components
1. **razorpayService.js** - Utility functions for Razorpay integration
   - `loadRazorpayScript()` - Loads Razorpay checkout script
   - `initiateRazorpayPayment()` - Creates order and gets Razorpay details
   - `verifyPayment()` - Verifies payment after transaction

2. **Checkout.jsx** - Integration in checkout component
   - Razorpay loaded on component mount
   - Razorpay payment method option added
   - Payment processing with Razorpay modal
   - Automatic order creation after payment verification
   - Loading states for better UX

### Backend Components
1. **paymentController.js** - Payment logic
   - `createRazorpayOrder()` - Create Razorpay order with amount validation
   - `verifyPayment()` - Verify payment signature using HMAC-SHA256
   - `getPaymentDetails()` - Fetch payment info from Razorpay
   - `refundPayment()` - Process refunds
   - `handleWebhook()` - Handle Razorpay events

2. **paymentRoutes.js** - API endpoints
   - `POST /api/payment/create-razorpay-order`
   - `POST /api/payment/verify-razorpay`
   - `GET /api/payment/details/:paymentId`
   - `POST /api/payment/refund`
   - `POST /api/payment/webhook`

3. **Order.js** - Database model updates
   - Added `razorpayOrderId` field
   - Updated `transactionId` for Razorpay payment IDs
   - Enhanced `paymentStatus` tracking

## 🧪 Testing with Test Credentials

### Test Card
```
Card Number:   4111 1111 1111 1111
Expiry Date:   12/25 (any future date)
CVV:           123 (any 3 digits)
Cardholder:    Any name
```

### Test UPI
```
UPI ID: success@razorpay
```

### Test Wallets
- Google Pay
- PhonePe
- Paytm
- Amazon Pay

All available in Razorpay checkout modal.

## 🚀 Payment Flow

### Step 1: User Selects Razorpay
- User chooses "Razorpay Secure Payment" in checkout
- System verifies Razorpay script is loaded

### Step 2: Create Order
- Backend creates Razorpay order with amount in paise
- Returns `razorpayOrderId` and public key to frontend

### Step 3: Show Payment Modal
- Razorpay checkout modal opens
- User selects payment method and enters details
- Razorpay processes payment securely (no data exposure)

### Step 4: Handle Payment Success
- Razorpay returns payment details to frontend
- Frontend verifies payment locally

### Step 5: Backend Verification
``
    "receipt": "receipt_order_123",
    "status": "created"
  },
  "key_id": "rzp_test_xxxxxxxxxxxxx"
}
```

---

### 2. Verify Payment
**Endpoint:** `POST /api/payment/verify`
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "razorpay_order_id": "order_xxxxxxxxxxxxx",
  "razorpay_payment_id": "pay_xxxxxxxxxxxxx",
  "razorpay_signature": "signature_string",
  "orderId": "your_database_order_id"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "payment_id": "pay_xxxxxxxxxxxxx"
}
```

---

### 3. Get Payment Details
**Endpoint:** `GET /api/payment/details/:paymentId`
**Auth Required:** ✅ Yes

**Response:**
```json
{
  "success": true,
  "payment": {
    "id": "pay_xxxxxxxxxxxxx",
    "entity": "payment",
    "amount": 99999,
    "currency": "INR",
    "status": "captured",
    "method": "card",
    "email": "customer@example.com",
    "contact": "+919876543210"
  }
}
```

---

### 4. Refund Payment (Admin Only)
**Endpoint:** `POST /api/payment/refund`
**Auth Required:** ✅ Yes (Admin)

**Request Body:**
```json
{
  "paymentId": "pay_xxxxxxxxxxxxx",
  "amount": 500.00  // Optional, partial refund
}
```

**Response:**
```json
{
  "success": true,
  "message": "Refund processed successfully",
  "refund": {
    "id": "rfnd_xxxxxxxxxxxxx",
    "entity": "refund",
    "amount": 50000,
    "payment_id": "pay_xxxxxxxxxxxxx",
    "status": "processed"
  }
}
```

---

### 5. Webhook Handler
**Endpoint:** `POST /api/payment/webhook`
**Auth Required:** ❌ No (Razorpay signature verified)

This endpoint receives events from Razorpay. Configure in Razorpay Dashboard:
- Go to Settings → Webhooks
- Add webhook URL: `https://your-domain.com/api/payment/webhook`
- Select events: `payment.captured`, `payment.failed`, `refund.created`

---

## 💻 Frontend Integration

### Step 1: Create Order on Backend
```javascript
const createOrder = async (amount) => {
  const response = await fetch('/api/payment/create-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ amount, currency: 'INR' })
  });
  return response.json();
};
```

### Step 2: Add Razorpay Checkout Script
```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### Step 3: Initialize Payment
```javascript
const handlePayment = async () => {
  // Create order
  const orderData = await createOrder(999.99);
  
  const options = {
    key: orderData.key_id,
    amount: orderData.order.amount,
    currency: orderData.order.currency,
    name: 'ShopEz',
    description: 'Order Payment',
    order_id: orderData.order.id,
    handler: async function (response) {
      // Payment successful, verify on backend
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          orderId: 'your_order_id'
        })
      });
      
      const result = await verifyResponse.json();
      if (result.success) {
        alert('Payment successful!');
        // Redirect to order confirmation
      }
    },
    prefill: {
      name: 'Customer Name',
      email: 'customer@example.com',
      contact: '+919876543210'
    },
    theme: {
      color: '#3399cc'
    }
  };
  
  const razorpay = new Razorpay(options);
  razorpay.open();
};
```

---

## 🔄 Complete Checkout Flow

### 1. Customer Places Order
```javascript
// Create order in your database
const orderResponse = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    items: cartItems,
    shippingAddress: address,
    paymentMethod: 'razorpay'
  })
});

const order = await orderResponse.json();
```

### 2. Create Razorpay Order
```javascript
const paymentOrder = await createOrder(order.order.totalAmount);
```

### 3. Show Razorpay Checkout
```javascript
const options = {
  key: paymentOrder.key_id,
  amount: paymentOrder.order.amount,
  order_id: paymentOrder.order.id,
  handler: async function(response) {
    await verifyPayment(response, order.order.id);
  }
};

const razorpay = new Razorpay(options);
razorpay.open();
```

### 4. Verify Payment on Backend
Backend automatically updates order status when payment is verified.

---

## 🧪 Testing

### Test Credentials (Razorpay Test Mode)

**Test Cards:**
- **Success:** 4111 1111 1111 1111
- **Failure:** 4000 0000 0000 0002
- CVV: Any 3 digits
- Expiry: Any future date

**Test UPI ID:**
- Success: success@razorpay
- Failure: failure@razorpay

**Test Netbanking:**
Select any bank, all are available in test mode

### Testing Flow
1. Set test keys in .env
2. Create order with test amount
3. Use test payment methods
4. Verify payment signature
5. Check order status updated

---

## 🔒 Security Best Practices

1. **Never expose Key Secret** - Keep in backend only
2. **Always verify signature** - Don't trust frontend data
3. **Use webhooks** - For payment status updates
4. **Validate amount** - Check amount matches order total
5. **HTTPS only** - All payment flows must use HTTPS in production
6. **Store transaction IDs** - For reconciliation and support

---

## 📊 Payment Status Flow

```
Order Created (paymentStatus: 'pending')
         ↓
Razorpay Order Created
         ↓
Customer Pays
         ↓
Payment Captured (payment.captured webhook)
         ↓
Signature Verified
         ↓
Order Updated (paymentStatus: 'completed', status: 'confirmed')
```

---

## 🆘 Common Issues

### Issue: "Key ID or Key Secret is invalid"
**Solution:** Check .env file has correct credentials without spaces

### Issue: "Signature verification failed"
**Solution:** Ensure Key Secret is correct and signature generated properly

### Issue: "Payment captured but order not updated"
**Solution:** Check webhook is configured and receiving events

### Issue: "Amount mismatch"
**Solution:** Razorpay uses smallest currency unit (paise). Multiply by 100.

---

## 📱 Mobile Integration

Razorpay supports React Native and Flutter:

**React Native:**
```bash
npm install react-native-razorpay
```

**Flutter:**
```bash
flutter pub add razorpay_flutter
```

---

## 🌐 Supported Payment Methods

- ✅ Credit/Debit Cards (Visa, Mastercard, RuPay, Amex)
- ✅ Net Banking (All major banks)
- ✅ UPI (Google Pay, PhonePe, Paytm, etc.)
- ✅ Wallets (Paytm, Mobikwik, Freecharge, etc.)
- ✅ EMI (Credit/Debit card EMI)
- ✅ Pay Later (LazyPay, Simpl, etc.)

---

## 📞 Support

- Razorpay Docs: https://razorpay.com/docs/
- Test Dashboard: https://dashboard.razorpay.com/signin
- Support: support@razorpay.com

---

## 🚀 Going Live

1. Complete KYC verification on Razorpay
2. Get Live API Keys
3. Update .env with live keys
4. Test with small real transaction
5. Configure webhooks with live URL
6. Monitor transactions in dashboard

---

## 💡 Tips

- Use order receipts to track orders
- Enable webhooks for automatic status updates
- Store transaction details for reconciliation
- Handle payment failures gracefully
- Show loading states during payment
- Provide clear error messages to customers

---

Ready to accept payments! 💳
