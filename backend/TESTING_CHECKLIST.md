# ShopEz Testing Checklist

Complete testing verification for all user types and API endpoints.

---

## 📋 Pre-Testing Setup

- [ ] Backend running: `npm start` (should show "Server running on port 5000")
- [ ] MongoDB connected: Check console for "MongoDB connected"
- [ ] Test users created: Run `node create-test-users.js`
- [ ] Postman installed or using VS Code REST Client
- [ ] Postman collection imported: `ShopEz_Testing_Collection.postman_collection.json`

---

## 🔐 Authentication Tests

### Test 1: Get All Test Users
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/users`
- [ ] **Expected**: Status 200, array of 10 users (1 superadmin, 2 admins, 3 vendors, 4 customers)
- [ ] **Response Fields**: email, role, password (in documentation format)

### Test 2: Login as Customer
- [ ] **Method**: POST
- [ ] **URL**: `http://localhost:5000/api/test/login`
- [ ] **Body**: `{"email":"customer1@test.com","password":"customer123"}`
- [ ] **Expected**: Status 200, returns JWT token
- [ ] **Save Token**: Copy token for {{customer_token}} variable

### Test 3: Login as Vendor
- [ ] **Method**: POST
- [ ] **URL**: `http://localhost:5000/api/test/login`
- [ ] **Body**: `{"email":"vendor1@test.com","password":"vendor123"}`
- [ ] **Expected**: Status 200, returns JWT token
- [ ] **Save Token**: Copy token for {{vendor_token}} variable

### Test 4: Login as Admin
- [ ] **Method**: POST
- [ ] **URL**: `http://localhost:5000/api/test/login`
- [ ] **Body**: `{"email":"admin1@test.com","password":"admin123"}`
- [ ] **Expected**: Status 200, returns JWT token
- [ ] **Save Token**: Copy token for {{admin_token}} variable

### Test 5: Login as Super Admin
- [ ] **Method**: POST
- [ ] **URL**: `http://localhost:5000/api/test/login`
- [ ] **Body**: `{"email":"superadmin@test.com","password":"superadmin123"}`
- [ ] **Expected**: Status 200, returns JWT token
- [ ] **Save Token**: Copy token for {{superadmin_token}} variable

### Test 6: Get Current User Info (with any token)
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/me`
- [ ] **Header**: `Authorization: Bearer {{token}}`
- [ ] **Expected**: Status 200, user object with email, role, _id fields
- [ ] **Role Check**: Verify role matches logged-in user

---

## 👥 CUSTOMER TESTS

### Test 7: Get Customer Profile
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/customer/profile`
- [ ] **Header**: `Authorization: Bearer {{customer_token}}`
- [ ] **Expected**: Status 200, customer object with firstName, lastName, email, phone, shippingAddress
- [ ] **Auth Only**: Verify non-customer cannot access

### Test 8: Get Customer Orders
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/customer/orders`
- [ ] **Header**: `Authorization: Bearer {{customer_token}}`
- [ ] **Expected**: Status 200, array of orders (may be empty initially)
- [ ] **Fields Check**: Each order should have _id, items, totalAmount, status, createdAt

### Test 9: Update Customer Profile
- [ ] **Method**: PUT
- [ ] **URL**: `http://localhost:5000/api/test/customer/profile`
- [ ] **Header**: `Authorization: Bearer {{customer_token}}`
- [ ] **Body**: `{"firstName":"Jane","lastName":"Smith","phone":"8888888888"}`
- [ ] **Expected**: Status 200, updated customer object
- [ ] **Persistence Check**: Re-run Test 7 to verify changes saved

### Test 10: Customer Access Denied Tests
- [ ] Attempt Test 7 without Authorization header → Should return 401
- [ ] Attempt Test 7 with vendor token → Should return 403 (Forbidden)
- [ ] Attempt Test 7 with invalid token → Should return 401 (Unauthorized)

---

## 🏪 VENDOR TESTS

### Test 11: Get Vendor Profile
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/vendor/profile`
- [ ] **Header**: `Authorization: Bearer {{vendor_token}}`
- [ ] **Expected**: Status 200, vendor object with storeName, storeDescription, businessType, isVerified
- [ ] **Verification Status**: Check isVerified field (set by create-test-users.js)

### Test 12: Get Vendor Products
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/vendor/products`
- [ ] **Header**: `Authorization: Bearer {{vendor_token}}`
- [ ] **Expected**: Status 200, array of products
- [ ] **Fields Check**: Each product should have _id, name, price, vendor, createdAt

### Test 13: Get Vendor Orders/Sales
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/vendor/orders`
- [ ] **Header**: `Authorization: Bearer {{vendor_token}}`
- [ ] **Expected**: Status 200, array of vendor sales/orders (may be empty initially)
- [ ] **Fields Check**: Each order should have _id, items, totalAmount, customerName, status

### Test 14: Update Vendor Store Info
- [ ] **Method**: PUT
- [ ] **URL**: `http://localhost:5000/api/test/vendor/profile`
- [ ] **Header**: `Authorization: Bearer {{vendor_token}}`
- [ ] **Body**: `{"storeName":"Updated Tech Store","storeDescription":"Premium & Affordable"}`
- [ ] **Expected**: Status 200, updated vendor object
- [ ] **Persistence Check**: Re-run Test 11 to verify changes saved

### Test 15: Vendor Authorization Tests
- [ ] Attempt Test 11 with customer token → Should return 403
- [ ] Attempt Test 11 with admin token → Should return 403 (admin role not in vendor auth)
- [ ] Attempt Test 11 without token → Should return 401

---

## 👨‍💼 ADMIN TESTS

### Test 16: Get Admin Dashboard
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/admin/dashboard`
- [ ] **Header**: `Authorization: Bearer {{admin_token}}`
- [ ] **Expected**: Status 200, dashboard stats object
- [ ] **Fields Check**: totalCustomers, totalVendors, totalOrders, totalRevenue, systemStatus

### Test 17: Get All Customers (Paginated)
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/admin/customers?page=1&limit=10`
- [ ] **Header**: `Authorization: Bearer {{admin_token}}`
- [ ] **Expected**: Status 200, paginated customers list
- [ ] **Fields Check**: data array with customer objects, pagination info (page, limit, total)

### Test 18: Get All Vendors (Paginated)
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/admin/vendors?page=1&limit=10`
- [ ] **Header**: `Authorization: Bearer {{admin_token}}`
- [ ] **Expected**: Status 200, paginated vendors list
- [ ] **Fields Check**: data array with vendor objects, isVerified status visible

### Test 19: Get System Statistics
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/admin/stats`
- [ ] **Header**: `Authorization: Bearer {{admin_token}}`
- [ ] **Expected**: Status 200, comprehensive stats object
- [ ] **Fields Check**: activeUsers, totalRevenue, ordersThisMonth, peakHour, suspendedCount

### Test 20: Suspend Customer
- [ ] **Method**: PUT
- [ ] **URL**: `http://localhost:5000/api/test/admin/customer/[CUSTOMER_ID]/suspend`
- [ ] **Header**: `Authorization: Bearer {{admin_token}}`
- [ ] **Note**: Replace [CUSTOMER_ID] with actual customer ID from Test 17
- [ ] **Expected**: Status 200, updated customer with isSuspended: true
- [ ] **Verify**: Customer cannot login after suspension

### Test 21: Verify Vendor
- [ ] **Method**: PUT
- [ ] **URL**: `http://localhost:5000/api/test/admin/vendor/[VENDOR_ID]/verify`
- [ ] **Header**: `Authorization: Bearer {{admin_token}}`
- [ ] **Note**: Replace [VENDOR_ID] with actual vendor ID from Test 18
- [ ] **Expected**: Status 200, updated vendor with isVerified: true
- [ ] **Verify**: Re-run Test 11 to see verification status updated

### Test 22: Admin Authorization Tests
- [ ] Attempt Test 16 with customer token → Should return 403
- [ ] Attempt Test 16 with vendor token → Should return 403
- [ ] Attempt Test 16 with super admin token → Should return 200 (super admin can access admin endpoints)
- [ ] Attempt Test 16 without token → Should return 401

---

## 🔐 SUPER ADMIN TESTS

### Test 23: Get All Admins
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/test/superadmin/admins`
- [ ] **Header**: `Authorization: Bearer {{superadmin_token}}`
- [ ] **Expected**: Status 200, array of admin objects (should have 2 admins from create-test-users.js)
- [ ] **Fields Check**: _id, email, firstName, lastName, permissions object

### Test 24: Update Admin Permissions
- [ ] **Method**: PUT
- [ ] **URL**: `http://localhost:5000/api/test/superadmin/admin/[ADMIN_ID]/permissions`
- [ ] **Header**: `Authorization: Bearer {{superadmin_token}}`
- [ ] **Body**: `{"permissions":{"canManageUsers":true,"canDeleteUsers":false,"canManageVendors":true,"canViewFinancials":true}}`
- [ ] **Note**: Replace [ADMIN_ID] with actual admin ID from Test 23
- [ ] **Expected**: Status 200, updated admin with new permissions
- [ ] **Persistence Check**: Re-run Test 23 to verify permissions updated

### Test 25: Super Admin Authorization Tests
- [ ] Attempt Test 23 with admin token → Should return 403
- [ ] Attempt Test 23 with customer token → Should return 403
- [ ] Attempt Test 23 without token → Should return 401

---

## 📊 Analytics & Revenue Tests (Optional - requires Payment System)

### Test 26: Admin Revenue Dashboard
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/analytics/admin/revenue-dashboard`
- [ ] **Header**: `Authorization: Bearer {{admin_token}}`
- [ ] **Expected**: Status 200, dashboard with commission stats
- [ ] **Fields Check**: totalCommission, topVendors, paymentMethodBreakdown, last7daysRevenue

### Test 27: Admin Revenue Trend
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/analytics/admin/revenue-trend?period=monthly`
- [ ] **Header**: `Authorization: Bearer {{admin_token}}`
- [ ] **Expected**: Status 200, time-series revenue data
- [ ] **Fields Check**: date, revenue, order count for each period

### Test 28: Vendor Revenue Dashboard
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/analytics/vendor/revenue-dashboard`
- [ ] **Header**: `Authorization: Bearer {{vendor_token}}`
- [ ] **Expected**: Status 200, vendor-specific earnings
- [ ] **Fields Check**: totalEarnings, totalOrders, averageOrderValue, thisMonthRevenue

### Test 29: Vendor Revenue Breakdown
- [ ] **Method**: GET
- [ ] **URL**: `http://localhost:5000/api/analytics/vendor/revenue-breakdown?period=daily`
- [ ] **Header**: `Authorization: Bearer {{vendor_token}}`
- [ ] **Expected**: Status 200, vendor time-series earnings
- [ ] **Comparison**: Should show less than admin total (due to commission split)

---

## ❌ Negative Testing

### Test 30: Invalid Token
- [ ] Use token with extra characters
- [ ] **Expected**: Status 401, "Invalid token" message

### Test 31: Expired Token (if applicable)
- [ ] Modify token to expire time in past
- [ ] **Expected**: Status 401, "Token expired" message

### Test 32: Wrong User in URL
- [ ] Admin tries to access `/customer/123` (different ID)
- [ ] **Expected**: Status 403 or return own data only (depends on implementation)

### Test 33: Invalid Role Check
- [ ] Create token with invalid role not in enum
- [ ] **Expected**: Status 403, access denied

### Test 34: Non-Admin Accessing Admin Routes
- [ ] Vendor tries GET `/admin/dashboard`
- [ ] **Expected**: Status 403, "Unauthorized" message

---

## 🔧 Troubleshooting

### Error: "Server not running"
- [ ] Verify backend: `npm start` in backend directory
- [ ] Check port 5000 not in use: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
- [ ] Kill process on 5000: `taskkill /PID [PID] /F`

### Error: "MongoDB connection failed"
- [ ] Verify MongoDB running: `mongod` in separate terminal or MongoDB Desktop
- [ ] Check connection string in `backend/src/config/db.js`
- [ ] Default: `mongodb://localhost:27017/shopez`

### Error: "Token invalid at 'xxx'"
- [ ] Check Authorization header format: `Bearer <token>` (space between Bearer and token)
- [ ] Make sure token from login response is complete (no line breaks)
- [ ] Try re-logging in to get fresh token

### Error: "User not found" after suspension
- [ ] This is expected! Suspended users cannot login
- [ ] To unsuspend: Run GET /admin/customers and update isSuspended to false manually in MongoDB
- [ ] Or restore test data: `npm run seed` (if available)

### Error: "Postman variables undefined"
- [ ] In Postman, click "No Environment" dropdown
- [ ] Click "Edit" next to new environment or create new
- [ ] Add variables: customer_token, vendor_token, admin_token, superadmin_token
- [ ] Paste token values from login responses

### Success: All tests passing
- [ ] ✅ Backend infrastructure verified
- [ ] ✅ Authentication & authorization working
- [ ] ✅ Role-based access control functional
- [ ] ✅ Ready for frontend integration

---

## 📝 Notes for Next Steps

1. **Frontend Integration**
   - Use tokens from login tests to authenticate frontend requests
   - Store token in localStorage/sessionStorage
   - Include Authorization header in all requests

2. **Payment Testing**
   - Once payment routes are implemented, test full checkout flow
   - Verify Payment model records created automatically
   - Check commission splits in analytics

3. **Persistent Data**
   - After initial testing, keep one test user dataset in MongoDB
   - Add sample products, orders for development testing
   - Use analytics to verify revenue calculations

4. **Production Deployment**
   - Update MongoDB connection string for production
   - Use environment variables for sensitive data
   - Enable JWT secret rotation
   - Implement refresh token mechanism

---

## ✅ Sign-Off

- [ ] All 34 tests completed successfully
- [ ] No authentication/authorization failures
- [ ] Role-based access control verified
- [ ] Data persistence confirmed
- [ ] Ready for frontend development
- [ ] Backend infrastructure production-ready

**Completed By**: _______________  
**Date**: _______________  
**Notes**: _______________

