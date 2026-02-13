# Complete Testing Guide - All User Types

## 📋 Overview

This guide explains how to use the comprehensive testing setup for ShopEz. With the scripts and API endpoints provided, you can:

- ✅ Create test users for all roles
- ✅ Login and authenticate all user types
- ✅ Test role-based access control
- ✅ Test specific features for each user type

---

## 🚀 Step 1: Create Test Users

### Run the test user creation script

```bash
# In backend folder
node create-test-users.js
```

**What gets created:**

- 1️⃣ **Super Admin**
  - Email: `superadmin@test.com`
  - Password: `superadmin123`
  - Full platform access

- 2️⃣ **2 Regular Admins**
  - admin1@test.com / admin123
  - admin2@test.com / admin456
  - Limited permissions (configurable)

- 3️⃣ **3 Vendors**
  - vendor1@test.com / vendor123
  - vendor2@test.com / vendor456
  - vendor3@test.com / vendor789
  - Each with store setup

- 4️⃣ **4 Customers**
  - customer1@test.com / customer123
  - customer2@test.com / customer456
  - customer3@test.com / customer789
  - customer4@test.com / customer999
  - Each with shipping addresses

---

## 🔐 Step 2: Authentication - Login for Any User Type

### Using the test login endpoint

**Endpoint:** `POST /api/test/login`

**Body:**
```json
{
  "email": "customer1@test.com",
  "password": "customer123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "customer logged in successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "65abc123...",
    "email": "customer1@test.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "customer",
    "userType": "customer"
  }
}
```

### Use the token for subsequent requests

Add token to headers:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 👥 CUSTOMER TESTING

### 1. Get Customer Profile
```bash
GET /api/test/customer/profile
Authorization: Bearer {customer_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "John",
    "lastName": "Doe",
    "email": "customer1@test.com",
    "phone": "9111222333",
    "shippingAddresses": [...],
    "isActive": true
  }
}
```

### 2. Update Customer Profile
```bash
PUT /api/test/customer/profile
Authorization: Bearer {customer_token}

Body:
{
  "firstName": "John Updated",
  "lastName": "Doe",
  "phone": "9999999999"
}
```

### 3. Get Customer Orders
```bash
GET /api/test/customer/orders
Authorization: Bearer {customer_token}
```

**Response:**
```json
{
  "success": true,
  "totalOrders": 5,
  "orders": [
    {
      "_id": "...",
      "orderNumber": "ORD-001",
      "totalAmount": 5000,
      "items": [
        {
          "product": {...},
          "vendor": {
            "storeName": "Tech Store"
          },
          "quantity": 2,
          "price": 2500
        }
      ],
      "status": "delivered"
    }
  ]
}
```

---

## 🏪 VENDOR TESTING

### 1. Get Vendor Profile
```bash
GET /api/test/vendor/profile
Authorization: Bearer {vendor_token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "firstName": "Vendor",
    "lastName": "One",
    "email": "vendor1@test.com",
    "storeName": "Tech Store",
    "storeDescription": "Premium Electronics and Gadgets",
    "businessType": "Retail",
    "isVerified": true,
    "verificationStatus": "approved"
  }
}
```

### 2. Get Vendor Products
```bash
GET /api/test/vendor/products
Authorization: Bearer {vendor_token}
```

**Response:**
```json
{
  "success": true,
  "totalProducts": 12,
  "products": [
    {
      "_id": "...",
      "name": "Laptop",
      "price": 50000,
      "stock": 5,
      "vendor": "vendor_id"
    }
  ]
}
```

### 3. Get Vendor Orders/Sales
```bash
GET /api/test/vendor/orders
Authorization: Bearer {vendor_token}
```

**Response:**
```json
{
  "success": true,
  "totalOrders": 8,
  "orders": [
    {
      "_id": "...",
      "orderNumber": "ORD-001",
      "customer": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "customer1@test.com"
      },
      "items": [
        {
          "product": {
            "name": "USB Cable",
            "price": 500
          },
          "quantity": 2
        }
      ]
    }
  ]
}
```

### 4. Update Vendor Store Info
```bash
PUT /api/test/vendor/profile
Authorization: Bearer {vendor_token}

Body:
{
  "storeName": "Tech Store Updated",
  "storeDescription": "Premium Electronics Updated",
  "businessType": "Retail"
}
```

---

## 👨‍💼 ADMIN TESTING

### 1. Get Admin Dashboard
```bash
GET /api/test/admin/dashboard
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "totalCustomers": 150,
    "totalVendors": 25,
    "totalProducts": 500,
    "totalOrders": 300,
    "totalAdmins": 3,
    "adminLevel": "admin"
  }
}
```

### 2. Get All Customers (with pagination)
```bash
GET /api/test/admin/customers?page=1&limit=10
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "total": 150,
  "page": 1,
  "limit": 10,
  "customers": [...]
}
```

### 3. Get All Vendors (with pagination)
```bash
GET /api/test/admin/vendors?page=1&limit=10
Authorization: Bearer {admin_token}
```

### 4. Get System Statistics
```bash
GET /api/test/admin/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "users": {
      "customers": 148,
      "vendors": 24,
      "admins": 3
    },
    "status": {
      "activeCustomers": 145,
      "suspendedCustomers": 3,
      "verifiedVendors": 20,
      "unverifiedVendors": 4
    },
    "orders": {
      "total": 300,
      "pending": 15,
      "completed": 285
    },
    "products": {
      "total": 500
    }
  }
}
```

### 5. Suspend a Customer
```bash
PUT /api/test/admin/customer/CUSTOMER_ID/suspend
Authorization: Bearer {admin_token}
```

### 6. Verify a Vendor
```bash
PUT /api/test/admin/vendor/VENDOR_ID/verify
Authorization: Bearer {admin_token}
```

---

## 🔐 SUPER ADMIN TESTING

### 1. Get All Admins
```bash
GET /api/test/superadmin/admins
Authorization: Bearer {superadmin_token}
```

**Response:**
```json
{
  "success": true,
  "total": 3,
  "admins": [
    {
      "_id": "...",
      "firstName": "Super",
      "lastName": "Admin",
      "email": "superadmin@test.com",
      "adminLevel": "super_admin",
      "permissions": {
        "canManageUsers": true,
        "canDeleteUsers": true,
        ...
      }
    }
  ]
}
```

### 2. Update Admin Permissions
```bash
PUT /api/test/superadmin/admin/ADMIN_ID/permissions
Authorization: Bearer {superadmin_token}

Body:
{
  "permissions": {
    "canManageUsers": true,
    "canDeleteUsers": false,
    "canManageVendors": true,
    "canViewFinancials": true
  }
}
```

---

## 🔑 GENERAL / GET CURRENT USER

### Get Current Logged-in User Info
```bash
GET /api/test/me
Authorization: Bearer {any_token}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "_id": "...",
    "email": "user@test.com",
    "role": "customer",
    "adminLevel": null,
    "userType": "customer"
  }
}
```

---

## 📞 REFERENCE ENDPOINTS

### Get All Test Users (No auth required)
```bash
GET /api/test/users
```

Shows sample of customers, vendors, and admins for quick reference.

---

## 🧪 POSTMAN COLLECTION

### Sample cURL Commands

#### Login as Customer
```bash
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"customer123"}'
```

#### Get Customer Profile (with token)
```bash
curl -X GET http://localhost:5000/api/test/customer/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Get Admin Dashboard (with token)
```bash
curl -X GET http://localhost:5000/api/test/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Verify Vendor
```bash
curl -X PUT http://localhost:5000/api/test/admin/vendor/VENDOR_ID/verify \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json"
```

---

## 📊 Test Credentials Summary

### Super Admin
```
Email:    superadmin@test.com
Password: superadmin123
Role:     admin (super_admin level)
Access:   Full system access
```

### Admin 1
```
Email:    admin1@test.com
Password: admin123
Role:     admin (admin level)
Access:   Limited permissions (User Management)
```

### Admin 2
```
Email:    admin2@test.com
Password: admin456
Role:     admin (admin level)
Access:   Limited permissions (Vendor Management)
```

### Vendor 1
```
Email:    vendor1@test.com
Password: vendor123
Store:    Tech Store
Status:   Verified
```

### Vendor 2
```
Email:    vendor2@test.com
Password: vendor456
Store:    Fashion Boutique
Status:   Verified
```

### Vendor 3
```
Email:    vendor3@test.com
Password: vendor789
Store:    Home Essentials
Status:   Verified
```

### Customer 1
```
Email:    customer1@test.com
Password: customer123
Name:     John Doe
```

### Customer 2
```
Email:    customer2@test.com
Password: customer456
Name:     Jane Smith
```

### Customer 3
```
Email:    customer3@test.com
Password: customer789
Name:     Robert Johnson
```

### Customer 4
```
Email:    customer4@test.com
Password: customer999
Name:     Sarah Williams
```

---

## 🔒 Security Notes

1. ⚠️ Test credentials should NEVER be used in production
2. ⚠️ All test endpoints are protected with proper authentication
3. ⚠️ Admin/Super Admin endpoints require role verification
4. ✅ Passwords are hashed in database
5. ✅ JWT tokens have 24-hour expiration

---

## 🐛 Troubleshooting

### "authorize is not a function" error
- Solution: Ensure auth middleware has the `authorize` function exported

### "Invalid credentials" on login
- Check email and password are correct
- Verify user exists (use GET /api/test/users)
- Ensure database is connected

### "Token is not valid" error
- Token may have expired (create new login)
- Token may be malformed (copy exactly)
- Authorization header format: `Bearer TOKEN`

### Customer can't access /admin routes
- Make sure customer token is being used (not admin token)
- Admin routes require admin role
- Check adminLevel for super admin permissions

---

## 📝 Next Steps

1. Run `node create-test-users.js` to setup test users
2. Use `/api/test/login` to authenticate
3. Test endpoints using provided credentials
4. Use response data to build frontend components
5. Verify role-based access control works

