# Backend Testing Guide

## 🎯 **Quick Start**

Both servers are running:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5174

---

## ✅ **Test the Full Flow**

### Step 1: Register & Login
1. Go to http://localhost:5174
2. Click **"Get Started"** or **"Sign In"**
3. Create account with email & password
4. Login with credentials

### Step 2: Browse Products
1. View products on homepage
2. Click on any product to see details
3. Add product to cart
4. Check cart page

### Step 3: Test New User Features
1. Click **"Profile"** (top right menu)
2. View and update profile
3. Add multiple shipping addresses
4. Set default address

### Step 4: Complete Checkout
1. Go to cart
2. Click **"Proceed to Checkout"**
3. **Address Step**: Shipping address auto-filled from default
4. **Payment Step**: Choose payment method:
   - ✅ **Cash on Delivery** (Works immediately)
   - ✅ **UPI** (Mock payment)
   - ✅ **Wallet** (Mock payment)
   - ⏳ **Razorpay** (Needs account verification)
5. **Review & Place Order**
6. See order confirmation

### Step 5: Check Orders
1. Go to Profile → Orders
2. See all previous orders
3. Click order to view details

---

## 🧪 **Test Individual Endpoints (Optional)**

If you want to test API endpoints directly using Postman or similar:

### Authentication
```bash
# Register
POST http://localhost:5000/api/auth/signup
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123"
}

# Login (keep token for next calls)
POST http://localhost:5000/api/auth/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

### User Profile (Add Auth Header: Authorization: Bearer TOKEN)
```bash
# Get profile
GET http://localhost:5000/api/users/profile

# Update profile
PUT http://localhost:5000/api/users/profile
{
  "firstName": "Johnny",
  "phone": "9876543210"
}

# Change password
PUT http://localhost:5000/api/users/change-password
{
  "currentPassword": "password123",
  "newPassword": "newpassword123",
  "confirmPassword": "newpassword123"
}
```

### User Addresses (Add Auth Header)
```bash
# Get addresses
GET http://localhost:5000/api/users/addresses

# Add address
POST http://localhost:5000/api/users/addresses
{
  "fullName": "John Doe",
  "phone": "9876543210",
  "street": "123 Main St",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "country": "India"
}

# Update address
PUT http://localhost:5000/api/users/addresses/{ADDRESS_ID}
{
  "street": "456 Oak Avenue"
}

# Set as default
PUT http://localhost:5000/api/users/addresses/{ADDRESS_ID}/default

# Delete address
DELETE http://localhost:5000/api/users/addresses/{ADDRESS_ID}
```

### Cart
```bash
# Get cart
GET http://localhost:5000/api/cart

# Add to cart
POST http://localhost:5000/api/cart/add
{
  "productId": "PRODUCT_ID",
  "quantity": 2
}

# Update cart item
PUT http://localhost:5000/api/cart/update
{
  "productId": "PRODUCT_ID",
  "quantity": 3
}

# Clear cart
DELETE http://localhost:5000/api/cart/clear
```

### Orders
```bash
# Create order
POST http://localhost:5000/api/orders
{
  "items": [
    {
      "product": "PRODUCT_ID",
      "quantity": 2,
      "price": 999
    }
  ],
  "shippingAddress": {
    "fullName": "John Doe",
    "phone": "9876543210",
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "paymentMethod": "cod",
  "totalAmount": 1998
}

# Get my orders
GET http://localhost:5000/api/orders/my-orders

# Get order details
GET http://localhost:5000/api/orders/{ORDER_ID}
```

---

## 🎨 **Feature Testing Checklist**

### User Management
- [ ] Register new account
- [ ] Login with credentials
- [ ] View profile
- [ ] Update first/last name
- [ ] Update email
- [ ] Update phone
- [ ] Change password
- [ ] Upload profile picture

### Address Management
- [ ] Add new address
- [ ] View all addresses
- [ ] Update address
- [ ] Delete address
- [ ] Set default address
- [ ] Create order with address

### Shopping
- [ ] Browse products
- [ ] Search products
- [ ] Filter products by category
- [ ] View product details
- [ ] Add product to cart
- [ ] Update cart quantity
- [ ] Remove from cart
- [ ] View wishlist
- [ ] Add to wishlist

### Orders & Payment
- [ ] Add items to cart
- [ ] Go to checkout
- [ ] Edit shipping address
- [ ] Select COD payment
- [ ] Complete order
- [ ] View order confirmation
- [ ] See order in Orders page
- [ ] View order details

### Razorpay (When Verified)
- [ ] Create Razorpay order
- [ ] Open payment modal
- [ ] Complete test payment
- [ ] Verify payment
- [ ] See order reflected

---

## 🛠️ **Troubleshooting**

### If servers don't start
```powershell
# Kill existing Node processes
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force

# Restart backend
cd d:\shopez\backend
node server.js

# In another terminal, start frontend
cd d:\shopez\frontend
npm run dev
```

### If you get 404 errors
1. Check spelling of endpoint
2. Make sure authorization header is present for protected routes
3. Check that token hasn't expired

### If addresses show empty on checkout
1. Make sure you're logged in
2. Go to profile and add at least one address
3. Set it as default
4. Refresh page

### If payment fails
1. Make sure Razorpay account is verified
2. Check that .env has correct keys
3. Backend should be running (check /api/test/test-razorpay)

---

## 📊 **Expected Results**

### Successful Test Flow
```
✅ Login → Profile → Add Address → Cart → Checkout → Order Created
```

### Backend Logs
When API calls are made, you should see logs like:
```
🔍 RAZORPAY ORDER CREATION START
✅ Razorpay order created successfully

=== ORDER CREATION START ===
Processing item: [product-id]
✅ Order saved successfully
```

---

## 🎉 **You're All Set!**

Everything is implemented and ready to use. 
- Frontend fully mirrors all backend capabilities
- All user management features working
- Address system fully functional
- Orders integration complete
- Razorpay ready (awaiting account verification)

**Start testing now!** → http://localhost:5174
