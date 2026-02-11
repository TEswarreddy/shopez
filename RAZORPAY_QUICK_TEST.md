# Razorpay Payment Testing Guide - Quick Start

## ✅ Ready to Test

Your Razorpay payment integration is complete and ready for testing!

## 🚀 Start Testing in 5 Steps

### Step 1: Start the Servers
```bash
# Terminal 1 - Backend
cd d:\shopez\backend
npm run dev

# Terminal 2 - Frontend (wait for backend to start first)
cd d:\shopez\frontend
npm run dev
```

Wait for both servers to be ready:
- Backend: "Server running on http://localhost:5000"
- Frontend: "VITE v5.x.x ready in xxx ms"

### Step 2: Open the Application
```
http://localhost:5173
```

### Step 3: Add Products to Cart
1. Browse home page or search for products
2. Click "Add to Cart" on any product
3. See cart badge update in navbar
4. Add more items if desired

### Step 4: Proceed to Checkout
1. Click cart icon in navbar
2. Review cart items and subtotal
3. Click "Proceed to Checkout"

### Step 5: Complete Checkout

#### Fill Address Form (Step 1)
```
Full Name:    John Doe
Phone:        9876543210
Street:       123 Main Street
City:         Mumbai
State:        Maharashtra
ZIP Code:     400001
Country:      India (auto-filled)
```

Choose "Continue to Payment"

#### Select Payment Method (Step 2)
Look for: **"Razorpay Secure Payment"** option
- Shows purple card icon
- Description: "Card, UPI, Wallets - Secure & Fast"

Select it and click "Review Order"

#### Review Order (Step 3)
Review your:
- Shipping address
- Payment method (should show "Razorpay Secure Payment")
- Order items with prices
- Total amount with tax and shipping

Click "Place Order"

### Testing Payment Modal

The Razorpay checkout modal will open:

#### Option 1: Test with Card
```
Card Type:    Credit/Debit Card
Card Number:  4111 1111 1111 1111
Expiry:       12/25 (or any future date)
CVV:          123 (any 3 digits)
Cardholder:   John Doe (or any name)
Email:        test@example.com (auto-filled)
Phone:        9876543210 (auto-filled)
```

1. Enter card details
2. Click "Pay Now" or submit
3. Confirm OTP (if prompted) - use 123456
4. Payment should succeed

#### Option 2: Test with UPI
```
Select UPI from the modal
UPI ID: success@razorpay
Click Pay Now
Success!
```

#### Option 3: Test Failure (Optional)
Use this card to test failure flow:
```
Card Number: 4000 0000 0000 0002
Same other details as above
```

This will fail payment and let you test retry flow

## ✅ Expected Results

### Success Flow
1. ✅ Razorpay modal opens
2. ✅ Payment processes successfully
3. ✅ Modal closes automatically
4. ✅ Redirected to Order Confirmation page
5. ✅ See:
   - Order number (ORD-xxxxx)
   - Delivery estimate (3-5 business days)
   - Shipping address
   - Confetti animation
   - Order summary with items

### What Happens in Background
1. Order created in database with status: "confirmed"
2. Payment status marked as: "completed"
3. Transaction ID saved from Razorpay
4. Cart automatically cleared
5. User can now checkout again

## 🔍 Verify in Database

### Check Order was Created
```bash
# Connect to MongoDB Compass or Atlas
# Navigate to Database > shopez-db > orders collection
# Should see new order with:
```

**Expected Order Document:**
```json
{
  "_id": "...",
  "orderNumber": "ORD-1705xxxxx",
  "customer": ObjectId("user_id"),
  "items": [...],
  "totalAmount": 1000,
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "street": "123 Main Street",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "paymentMethod": "razorpay",
  "paymentStatus": "completed",    ← This confirms payment was processed
  "transactionId": "pay_xxxxx",    ← Razorpay payment ID
  "razorpayOrderId": "order_xxxxx", ← Razorpay order ID
  "status": "confirmed",           ← Order confirmed after payment
  "createdAt": ISODate("2024-01-10T..."),
  "updatedAt": ISODate("2024-01-10T...")
}
```

## 🐛 Check Logs for Debugging

### Frontend Console (F12 → Console Tab)
Look for success messages:
```
"Loading Razorpay script..."
"Razorpay loaded successfully"
"Initiating Razorpay payment..."
"Payment successful: {payment details}"
"Payment verified: {verification result}"
"Order created successfully: {order details}"
```

### Backend Console
Look for these markers:
```
=== RAZORPAY ORDER CREATION START ===
Amount: 1000
Currency: INR
Items count: 3
Razorpay order created: order_ABC123
=== RAZORPAY ORDER CREATION END ===

=== RAZORPAY PAYMENT VERIFICATION START ===
Order ID: order_ABC123
Payment ID: pay_XYZ789
Signature verified successfully
Order updated with payment confirmation
=== RAZORPAY PAYMENT VERIFICATION END ===
```

## ⚠️ Troubleshooting

### "Razorpay modal doesn't open"
1. Open browser DevTools (F12)
2. Go to Console tab - check for errors
3. Check Network tab - look for checkout.razorpay.com script
4. Clear browser cache and reload
5. Try incognito/private mode

### "Payment verification failed"
1. Check .env has correct RAZORPAY_KEY_SECRET
2. Check backend logs for signature error
3. Verify test credentials are correct
4. Restart backend server

### "Order not created"
1. Check backend console for errors
2. Verify MongoDB connection is active
3. Check Order model has all required fields
4. Review API response in browser Network tab

### "Cart not clearing"
1. Refresh page and try again
2. Check browser console for cart clearing errors
3. Verify clearCart API endpoint is working

## 📊 Test Scenarios

### Scenario 1: Successful Card Payment
- Status: ✅ Most common
- Steps: Follow card payment flow above
- Result: Order created with "completed" payment status
- Time: ~10-15 seconds

### Scenario 2: Failed Payment
- Status: ✅ Test error handling
- Use card: 4000 0000 0000 0002
- Result: Payment fails, modal allows retry
- Check: Order NOT created (payment failed)

### Scenario 3: UPI Payment
- Status: ✅ Alternative payment method
- Use UPI: success@razorpay
- Result: Order created with completed status
- Time: ~5-10 seconds

### Scenario 4: Multiple Payments
- Status: ✅ Verify consistency
- Complete 3-5 payments
- Check: Each order has unique ID and transaction ID
- Verify: All have "completed" status

## 📱 Test on Mobile

Razorpay works great on mobile:
1. On desktop: Open http://localhost:5173 in main browser
2. On mobile: `http://<your-pc-ip>:5173`
   - Find your PC IP: `ipconfig` in PowerShell
   - Example: http://192.168.x.x:5173

## 🎯 Success Criteria

Your implementation is working correctly if:

✅ Razorpay modal opens when "Place Order" is clicked
✅ Test card payment succeeds
✅ Order confirmation page shows order details
✅ Database has order with "completed" payment status
✅ Cart clears after successful payment
✅ Both servers show success logs
✅ Order number is unique and in format "ORD-xxxxx"
✅ Transaction ID from Razorpay is stored in "transactionId" field
✅ Can test multiple payments without errors

## 🔐 Security Notes

- ✅ Your public key (RAZORPAY_KEY_ID) is safe to use in frontend
- ✅ Your secret key (RAZORPAY_KEY_SECRET) stays in backend only
- ✅ All payments are verified using HMAC-SHA256 signature
- ✅ Payment details never expose in frontend code
- ✅ Test credentials are completely safe for testing

## 📞 Need Help?

1. **Check Console Logs First**
   - Frontend: Browser DevTools → Console tab
   - Backend: Terminal output where you ran `npm run dev`

2. **Common Issues**
   - See "Troubleshooting" section above
   - Check RAZORPAY_INTEGRATION_GUIDE.md for more details

3. **Razorpay Resources**
   - Docs: https://razorpay.com/docs/
   - Test Cards: https://razorpay.com/docs/payments/test-card/
   - Support: https://razorpay.com/support

## 🚀 Next After Testing

1. ✅ Test with all payment methods
2. ✅ Verify database orders
3. ✅ Check email notifications (if configured)
4. ✅ Test on mobile device
5. 📈 Switch to live keys for production
6. 🔄 Implement webhook for real-time updates
7. 📊 Add payment analytics

---

**Ready to test? Start with Step 1 above!**

Happy testing! 🎉
