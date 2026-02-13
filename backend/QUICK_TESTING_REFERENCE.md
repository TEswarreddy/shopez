# Quick Testing Reference

## 🚀 Quick Start

### 1. Create Test Users
```bash
# Terminal 1: Backend folder
node create-test-users.js
```

### 2. Start Backend Server
```bash
# Terminal 2: Backend folder
npm start
# or: node server.js
```

### 3. Test API Endpoints

---

## 📋 API Testing Examples

### Authentication

#### Login as Customer
```bash
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"customer123"}'
```

#### Login as Vendor
```bash
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor1@test.com","password":"vendor123"}'
```

#### Login as Admin
```bash
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin1@test.com","password":"admin123"}'
```

#### Login as Super Admin
```bash
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@test.com","password":"superadmin123"}'
```

---

### Get All Test Users (Reference)
```bash
curl -X GET http://localhost:5000/api/test/users
```

Returns sample of all user types for reference.

---

## 👥 CUSTOMER APIs

### Get Profile
```bash
curl -X GET http://localhost:5000/api/test/customer/profile \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Get Orders
```bash
curl -X GET http://localhost:5000/api/test/customer/orders \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Update Profile
```bash
curl -X PUT http://localhost:5000/api/test/customer/profile \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John Updated",
    "lastName": "Doe",
    "phone": "9999999999"
  }'
```

---

## 🏪 VENDOR APIs

### Get Profile
```bash
curl -X GET http://localhost:5000/api/test/vendor/profile \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Get Products
```bash
curl -X GET http://localhost:5000/api/test/vendor/products \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Get Orders/Sales
```bash
curl -X GET http://localhost:5000/api/test/vendor/orders \
  -H "Authorization: Bearer TOKEN_HERE"
```

### Update Store Info
```bash
curl -X PUT http://localhost:5000/api/test/vendor/profile \
  -H "Authorization: Bearer TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "storeName": "Tech Store Updated",
    "storeDescription": "Premium Electronics",
    "businessType": "Retail"
  }'
```

---

## 👨‍💼 ADMIN APIs

### Get Dashboard
```bash
curl -X GET http://localhost:5000/api/test/admin/dashboard \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get All Customers
```bash
curl -X GET "http://localhost:5000/api/test/admin/customers?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get All Vendors
```bash
curl -X GET "http://localhost:5000/api/test/admin/vendors?page=1&limit=10" \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Get Stats
```bash
curl -X GET http://localhost:5000/api/test/admin/stats \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Suspend Customer
```bash
curl -X PUT http://localhost:5000/api/test/admin/customer/CUSTOMER_ID/suspend \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Verify Vendor
```bash
curl -X PUT http://localhost:5000/api/test/admin/vendor/VENDOR_ID/verify \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

---

## 🔐 SUPER ADMIN APIs

### Get All Admins
```bash
curl -X GET http://localhost:5000/api/test/superadmin/admins \
  -H "Authorization: Bearer SUPERADMIN_TOKEN"
```

### Update Admin Permissions
```bash
curl -X PUT http://localhost:5000/api/test/superadmin/admin/ADMIN_ID/permissions \
  -H "Authorization: Bearer SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": {
      "canManageUsers": true,
      "canDeleteUsers": false,
      "canManageVendors": true,
      "canViewFinancials": true
    }
  }'
```

---

## 🔑 General

### Get Current User Info
```bash
curl -X GET http://localhost:5000/api/test/me \
  -H "Authorization: Bearer TOKEN_HERE"
```

---

## 🔄 Testing Workflow

### 1. Get Test Users List
```bash
# No auth needed
GET /api/test/users
```

### 2. Copy Email and Password
```
From response, get:
- email: customer1@test.com
- password: customer123
```

### 3. Login
```bash
POST /api/test/login
Body: { "email": "customer1@test.com", "password": "customer123" }

Response will have:
- token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- user: { _id, email, firstName, lastName, role, userType }
```

### 4. Use Token for Subsequent Requests
```bash
# Add token to headers
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Call protected endpoints based on role
GET /api/test/customer/profile        (for customers)
GET /api/test/vendor/products         (for vendors)
GET /api/test/admin/dashboard         (for admins)
```

---

## 📊 Test User Credentials

| Type | Email | Password | Role |
|------|-------|----------|------|
| Super Admin | superadmin@test.com | superadmin123 | admin (super_admin) |
| Admin 1 | admin1@test.com | admin123 | admin (admin) |
| Admin 2 | admin2@test.com | admin456 | admin (admin) |
| Vendor 1 | vendor1@test.com | vendor123 | vendor |
| Vendor 2 | vendor2@test.com | vendor456 | vendor |
| Vendor 3 | vendor3@test.com | vendor789 | vendor |
| Customer 1 | customer1@test.com | customer123 | customer |
| Customer 2 | customer2@test.com | customer456 | customer |
| Customer 3 | customer3@test.com | customer789 | customer |
| Customer 4 | customer4@test.com | customer999 | customer |

---

## 🧪 Testing Flow (Step-by-Step)

### Test Customer Flow
```bash
# 1. Login
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"customer123"}'
# Copy TOKEN from response

# 2. Get profile
curl -X GET http://localhost:5000/api/test/customer/profile \
  -H "Authorization: Bearer TOKEN"

# 3. Get orders
curl -X GET http://localhost:5000/api/test/customer/orders \
  -H "Authorization: Bearer TOKEN"

# 4. Update profile
curl -X PUT http://localhost:5000/api/test/customer/profile \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John Updated","lastName":"Doe","phone":"9999999999"}'
```

### Test Vendor Flow
```bash
# 1. Login
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor1@test.com","password":"vendor123"}'
# Copy TOKEN

# 2. Get profile
curl -X GET http://localhost:5000/api/test/vendor/profile \
  -H "Authorization: Bearer TOKEN"

# 3. Get products
curl -X GET http://localhost:5000/api/test/vendor/products \
  -H "Authorization: Bearer TOKEN"

# 4. Get orders
curl -X GET http://localhost:5000/api/test/vendor/orders \
  -H "Authorization: Bearer TOKEN"
```

### Test Admin Flow
```bash
# 1. Login
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin1@test.com","password":"admin123"}'
# Copy TOKEN

# 2. Get dashboard
curl -X GET http://localhost:5000/api/test/admin/dashboard \
  -H "Authorization: Bearer TOKEN"

# 3. Get stats
curl -X GET http://localhost:5000/api/test/admin/stats \
  -H "Authorization: Bearer TOKEN"

# 4. Get customers list
curl -X GET "http://localhost:5000/api/test/admin/customers?page=1&limit=5" \
  -H "Authorization: Bearer TOKEN"
```

### Test Super Admin Flow
```bash
# 1. Login
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@test.com","password":"superadmin123"}'
# Copy TOKEN

# 2. Get all admins
curl -X GET http://localhost:5000/api/test/superadmin/admins \
  -H "Authorization: Bearer TOKEN"

# 3. Update admin permissions
curl -X PUT http://localhost:5000/api/test/superadmin/admin/ADMIN_ID/permissions \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"permissions":{"canManageUsers":true,"canDeleteUsers":false}}'
```

---

## 💡 Tips

1. **Copy Token** - After login, copy entire token value (no "Bearer" prefix)
2. **Paste in Header** - Use format: `Authorization: Bearer TOKEN`
3. **Use Postman** - For easier testing, import these as requests
4. **Check Console** - Server logs show request/response details
5. **Verify Role** - Each endpoint checks user role/permissions

---

## ✅ Success Indicators

- ✅ Login returns token and user data
- ✅ Customer can access  /customer routes
- ✅ Vendor can access /vendor routes
- ✅ Admin can access /admin routes
- ✅ Super Admin can access /superadmin routes
- ✅ Wrong role gets 403 Forbidden error
- ✅ Expired token gets 401 Unauthorized

