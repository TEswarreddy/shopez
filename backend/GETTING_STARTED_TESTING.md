# 🚀 Getting Started: ShopEz Backend Testing

Complete guide to immediately start testing the ShopEz backend API.

---

## ⚡ Quick Start (5 Minutes)

### Step 1: Ensure Backend is Running
```bash
cd backend
npm start
```
**Expected Output:**
```
✓ MongoDB connected
✓ Server running on port 5000
```

### Step 2: Create Test Users
```bash
node create-test-users.js
```
**Expected Output:**
```
✓ Superadmin created: superadmin@test.com
✓ Admins created: admin1@test.com, admin2@test.com
✓ Vendors created: vendor1@test.com, vendor2@test.com, vendor3@test.com
✓ Customers created: customer1@test.com, customer2@test.com, customer3@test.com, customer4@test.com
```

### Step 3: Open Postman
1. Import collection: `ShopEz_Testing_Collection.postman_collection.json`
2. Go to "🔐 Authentication" folder
3. Run "Login - Customer"
4. Copy token from response
5. Set it to `{{customer_token}}` variable
6. Repeat for vendor, admin, and super admin

### Step 4: Start Testing
- Run any endpoint from the collection
- All endpoints should return 200 status with valid data

---

## 📚 Available Testing Files

| File | Purpose | How to Use |
|------|---------|-----------|
| `ShopEz_Testing_Collection.postman_collection.json` | Postman collection with all tests | Import in Postman, use variables for auth |
| `TESTING_CHECKLIST.md` | Step-by-step 34-test verification | Follow each test, mark checkbox when complete |
| `QUICK_TESTING_REFERENCE.md` | Fast cURL commands for CLI testing | Copy-paste commands in terminal |
| `TESTING_GUIDE.md` | Comprehensive API documentation | Reference for all endpoints, parameters, responses |
| `create-test-users.js` | Script to generate 10 test users | Run once to populate database |
| `PAYMENT_MODEL_GUIDE.md` | Payment tracking & revenue API | Understand commission splitting, analytics |
| `FRONTEND_INTEGRATION_GUIDE.md` | React/Vue component examples | Integrate with frontend application |

---

## 🧪 Testing Methods (Choose One)

### Method 1: Postman (GUI - Recommended for Beginners)
**Pros**: Intuitive UI, easy variable management, request history, team collaboration  
**Cons**: Requires Postman desktop app (or web version)

**Setup**:
1. Import `ShopEz_Testing_Collection.postman_collection.json`
2. Set up environment variables (or use collection variables)
3. Click "Send" on any request

**Example**:
```
GET http://localhost:5000/api/test/users
```
*Click Send → Get 10 test users in response*

---

### Method 2: cURL (CLI - Fastest)
**Pros**: No GUI needed, quick testing, good for scripting  
**Cons**: Manual token management, string escaping

**Setup**:
```bash
# Get all users
curl http://localhost:5000/api/test/users

# Login as customer
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"customer123"}'

# Copy token from response and use in next request
curl http://localhost:5000/api/test/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

See `QUICK_TESTING_REFERENCE.md` for all cURL commands.

---

### Method 3: VS Code REST Client Extension
**Pros**: No external tools, integrated with editor, good for developers  
**Cons**: Requires VS Code extension installation

**Setup**:
1. Install extension: "REST Client" by Huachao Mao
2. Create file: `test.http` in backend directory
3. Write requests in special format:
```http
### Get all users
GET http://localhost:5000/api/test/users

### Login as customer (save token from response)
POST http://localhost:5000/api/test/login
Content-Type: application/json

{"email":"customer1@test.com","password":"customer123"}

### Get current user
GET http://localhost:5000/api/test/me
Authorization: Bearer {{token}}
```

---

## 🎯 Test User Credentials

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Super Admin | superadmin@test.com | superadmin123 | Full system access, manage admins |
| Admin 1 | admin1@test.com | admin123 | Manage users, vendors, view analytics |
| Admin 2 | admin2@test.com | admin456 | Alternative admin account |
| Vendor 1 | vendor1@test.com | vendor123 | Manage products, view sales |
| Vendor 2 | vendor2@test.com | vendor456 | Alternative vendor account |
| Vendor 3 | vendor3@test.com | vendor789 | Third vendor for multi-vendor testing |
| Customer 1 | customer1@test.com | customer123 | Place orders, manage profile |
| Customer 2 | customer2@test.com | customer456 | Alternative customer account |
| Customer 3 | customer3@test.com | customer789 | Third customer for testing |
| Customer 4 | customer4@test.com | customer000 | Fourth customer for testing |

---

## 🔑 Getting Authentication Token

### Option A: Via Postman
1. Open "🔐 Authentication" → "Login - Customer"
2. Click "Send"
3. In response body, find: `"token":"eyJhbGc..."`
4. Copy the entire token value
5. In Postman, click "Variables" (top right)
6. Set `customer_token` to token value

### Option B: Via cURL
```bash
# Login
TOKEN=$(curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"customer123"}' \
  | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

echo $TOKEN  # Display token

# Use token in next request
curl http://localhost:5000/api/test/me \
  -H "Authorization: Bearer $TOKEN"
```

### Token Format
- Format: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- Duration: Valid for 24 hours
- Use in header: `Authorization: Bearer {token_value}`
- No quotes needed if using in header

---

## 📊 API Response Format

### Success Response (Status 200-201)
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "_id": "64f5e3c2b4a1d8e9f2g3h4i5",
    "email": "customer1@test.com",
    "role": "customer",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### Error Response (Status 400/401/403/500)
```json
{
  "success": false,
  "message": "Authentication failed",
  "error": "Invalid token"
}
```

---

## 🚨 Common Issues & Solutions

### Issue 1: "Server not running"
```bash
# Check if backend is running
curl http://localhost:5000/api/test/users

# If error: Start backend
cd backend && npm start
```

### Issue 2: "Token is invalid or expired"
```bash
# Solution: Get fresh token
curl -X POST http://localhost:5000/api/test/login \
  -H "Content-Type: application/json" \
  -d '{"email":"customer1@test.com","password":"customer123"}'

# Use new token in Authorization header
```

### Issue 3: "MongoDB connection failed"
```bash
# Check MongoDB status
mongo --version

# If not installed: Install MongoDB or use MongoDB Atlas

# If installed: Start MongoDB
# Windows: mongod (if added to PATH)
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Issue 4: "Postman variables not working"
```bash
# In Postman:
# 1. Click "No Environment" dropdown (top-right)
# 2. Select or create environment
# 3. Add variable: Key=customer_token, Value=<paste_token>
# 4. In requests, use {{customer_token}} in Authorization header
```

### Issue 5: "CORS error or 'Origin' issues"
```
✓ This is normal for local development
✓ CORS is disabled for development (see app.js)
✓ Should work fine in browser and Postman
✓ Use production CORS settings when deploying
```

---

## ✅ Verification Checklist

Before considering testing complete:

- [ ] Backend starts without errors
- [ ] MongoDB connection successful
- [ ] `create-test-users.js` runs and creates 10 users
- [ ] Can login with all 4 user roles (customer, vendor, admin, superadmin)
- [ ] Customer can access `/api/test/customer/*` endpoints
- [ ] Vendor can access `/api/test/vendor/*` endpoints
- [ ] Admin can access `/api/test/admin/*` endpoints
- [ ] Super admin can access `/api/test/superadmin/*` endpoints
- [ ] Authorization working (non-admin cannot access admin endpoints)
- [ ] Responses contain expected data fields

---

## 🎓 Next Steps

### 1. Understand the API
- Read: `TESTING_GUIDE.md` (detailed all endpoints)
- Read: `PAYMENT_MODEL_GUIDE.md` (revenue & analytics)
- Read: `API_DOCUMENTATION.md` (full system API)

### 2. Test Edge Cases
- Login with wrong password → Should fail (401)
- Access admin endpoint with customer token → Should fail (403)
- Omit Authorization header → Should fail (401)
- Update another user's profile → Should fail (403)

### 3. Load Test Data
- Create sample products in database
- Create sample orders
- Test analytics endpoints (`/api/analytics/*`)
- Verify revenue calculations

### 4. Frontend Integration
- See: `FRONTEND_INTEGRATION_GUIDE.md`
- Example React components provided
- Ready-to-use authentication hooks
- Sample API integration code

### 5. Deployment
- Update MongoDB connection (production URL)
- Update JWT secret (use environment variable)
- Enable CORS for production domains
- Add rate limiting
- Use HTTPS in production

---

## 💡 Pro Tips

1. **Save Token in Environment**
   ```
   After login, token valid for 24 hours
   No need to re-login for every request
   Set once in Postman environment variables
   ```

2. **Use Postman Collections for Workflows**
   ```
   Create folder for each user type
   Organize related endpoints
   Share with team for consistent testing
   ```

3. **Monitor Backend Console**
   ```
   Watch terminal running `npm start`
   See "GET /api/test/users" requests logged
   Helps debug issues
   ```

4. **Test Authorization Thoroughly**
   ```
   Try each endpoint with different roles
   Verify 403 errors for unauthorized access
   Security depends on proper role checking
   ```

5. **Keep Test Users**
   ```
   Don't delete test users during development
   Recreate only if needed with create-test-users.js
   Use these consistently across testing
   ```

---

## 📞 Support Information

### Getting Help
1. Check backend console for error messages
2. Verify MongoDB is running
3. Ensure port 5000 is available
4. Check `TESTING_GUIDE.md` for detailed endpoint info
5. Review error in response JSON

### File References
- **Database Config**: `backend/src/config/db.js`
- **Auth Middleware**: `backend/src/middlewares/auth.js`
- **Test Routes**: `backend/src/routes/testRoutes.js`
- **Test Users Script**: `backend/create-test-users.js`

---

## 🎉 Ready to Test!

1. ✅ Backend running
2. ✅ Test users created
3. ✅ Postman collection imported
4. ✅ Authentication tokens obtained
5. ✅ Start testing endpoints!

**First test to run**:
```bash
# In Postman: GET http://localhost:5000/api/test/users
# Expected: Array of 10 test users with all roles
```

**Good luck with testing! 🚀**

