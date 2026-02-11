# Role-Based Authentication System Guide

## 🎯 Overview

ShopEz now has a complete role-based authentication system with separate registration and login flows for:
- **Customers** - Shop and buy products
- **Vendors** - Sell products and manage inventory
- **Admins** - Platform management and oversight

---

## 📋 Backend Changes

### 1. Enhanced User Model

**File:** `backend/src/models/User.js`

The User model now includes comprehensive vendor-specific fields:

#### Vendor Information Structure
```javascript
vendorInfo: {
  // Basic Business Information
  businessName: String (required for vendors)
  businessType: enum ["individual", "proprietorship", "partnership", "private_limited", "public_limited", "llp"]
  businessDescription: String
  businessCategory: enum ["electronics", "fashion", "home", "beauty", "sports", "books", "food", "other"]
  
  // Business Contact
  businessEmail: String
  businessPhone: String (required for vendors)
  alternatePhone: String
  
  // Business Address
  businessAddress: {
    street: String (required)
    city: String (required)
    state: String (required)
    postalCode: String (required)
    country: String (default: "India")
  }
  
  // Pickup Address (if different)
  pickupAddress: {
    street, city, state, postalCode, country
    isSameAsBusinessAddress: Boolean (default: true)
  }
  
  // Tax Information
  gstNumber: String (format validated: 22AAAAA0000A1Z5)
  panNumber: String (required, format: ABCDE1234F)
  
  // Bank Account Details
  bankDetails: {
    accountHolderName: String (required)
    accountNumber: String (required)
    ifscCode: String (required, format: SBIN0001234)
    bankName: String
    branchName: String
    accountType: enum ["savings", "current"] (default: "current")
  }
  
  // Store Information
  storeName: String
  storeDescription: String
  storeLogo: String
  storeBanner: String
  
  // Verification
  isVerified: Boolean (default: false)
  verificationStatus: enum ["pending", "under_review", "verified", "rejected"]
  verifiedAt: Date
  rejectionReason: String
  
  // Documents
  documents: {
    gstCertificate: String
    panCard: String
    addressProof: String
    cancelledCheque: String
  }
  
  // Business Metrics
  rating: Number (0-5)
  totalSales: Number
  totalOrders: Number
  
  // Store Settings
  storeSettings: {
    isStoreActive: Boolean
    acceptsReturns: Boolean
    returnWindow: Number (days)
    shippingMethods: [String]
    paymentMethods: [String]
  }
  
  // Onboarding
  onboardingCompleted: Boolean
  onboardingStep: Number
}
```

### 2. Auth Controller Updates

**File:** `backend/src/controllers/authController.js`

#### New Endpoints

##### Customer Registration
```javascript
POST /api/auth/customer/signup
Body: {
  firstName: String (required)
  lastName: String (required)
  email: String (required)
  password: String (required, min 6 chars)
  phone: String (optional)
}
```

##### Vendor Registration
```javascript
POST /api/auth/vendor/signup
Body: {
  // Personal Info
  firstName: String (required)
  lastName: String (required)
  email: String (required)
  password: String (required)
  phone: String
  
  // Business Info
  businessName: String (required)
  businessType: String (required)
  businessPhone: String (required)
  
  // Business Address
  businessAddress: {
    street: String (required)
    city: String (required)
    state: String (required)
    postalCode: String (required)
    country: String
  }
  
  // Tax Info
  gstNumber: String (optional, validated)
  panNumber: String (required, validated)
  
  // Bank Details
  bankDetails: {
    accountHolderName: String (required)
    accountNumber: String (required)
    ifscCode: String (required, validated)
    bankName: String
    branchName: String
    accountType: String
  }
}
```

##### Role-Based Login
```javascript
POST /api/auth/login
Body: {
  email: String (required)
  password: String (required)
  role: String (optional: "customer", "vendor", "admin")
}
```

**Role Validation:**
- If role is specified, the endpoint verifies the user has that role
- Returns error if trying to login with wrong role (e.g., vendor login with customer account)
- Without role, allows any user to login

### 3. Auth Routes

**File:** `backend/src/routes/authRoutes.js`

New routes added:
```javascript
POST /api/auth/signup              // Generic (backward compatible)
POST /api/auth/customer/signup     // Customer registration
POST /api/auth/vendor/signup       // Vendor registration
POST /api/auth/login               // Role-based login
```

---

## 🎨 Frontend Changes

### 1. New Pages Created

#### Customer Registration
**File:** `frontend/src/pages/auth/Register.jsx`
- **Route:** `/register`
- Simple form for customer signup
- Fields: First Name, Last Name, Email, Phone, Password
- Links to vendor registration

#### Vendor Registration
**File:** `frontend/src/pages/auth/VendorRegister.jsx`
- **Route:** `/vendor/register`
- Multi-step registration form (4 steps)
- **Step 1:** Personal Information
  - First/Last Name, Email, Phone, Password
- **Step 2:** Business Information
  - Business Name, Type, Category, Phone, Email, Description
- **Step 3:** Address & Tax Details
  - Business Address (Street, City, State, Postal Code)
  - PAN Number (required, validated)
  - GST Number (optional, validated)
- **Step 4:** Bank Account Details
  - Account Holder Name, Account Number, IFSC Code
  - Bank Name, Branch, Account Type

**Features:**
- Progress indicator showing current step
- Step-by-step validation
- Format validation for PAN, GST, IFSC codes
- Back/Next navigation
- Professional UI with Tailwind CSS

#### Vendor Login
**File:** `frontend/src/pages/auth/VendorLogin.jsx`
- **Route:** `/vendor/login`
- Dedicated login page for vendors
- Sends `role: "vendor"` with login request
- Links to vendor registration and customer login
- Info box indicating it's for vendors only

#### Admin Login
**File:** `frontend/src/pages/auth/AdminLogin.jsx`
- **Route:** `/admin/login`
- Secure admin login page
- Dark theme for distinction
- Sends `role: "admin"` with login request
- Warning about restricted access

#### Customer Login
**File:** `frontend/src/pages/auth/Login.jsx`
- **Route:** `/login`
- Updated to be customer-focused
- Sends `role: "customer"` with login request
- Links to vendor and admin logins
- Links to customer registration

### 2. Routing Updates

**File:** `frontend/src/App.jsx`

New routes added:
```javascript
<Route path="/login" element={<Login />} />
<Route path="/register" element={<Register />} />
<Route path="/vendor/login" element={<VendorLogin />} />
<Route path="/vendor/register" element={<VendorRegister />} />
<Route path="/admin/login" element={<AdminLogin />} />
```

---

## 🚀 Testing Guide

### 1. Customer Flow

#### Registration:
1. Go to `http://localhost:5174/register`
2. Fill in:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: 9876543210 (optional)
   - Password: test123
3. Click "Create Account"
4. Should redirect to homepage

#### Login:
1. Go to `http://localhost:5174/login`
2. Enter email and password
3. Click "Login"
4. Redirects to homepage

### 2. Vendor Flow

#### Registration:
1. Go to `http://localhost:5174/vendor/register`
2. **Step 1 - Personal Info:**
   - First Name: Jane
   - Last Name: Smith
   - Email: jane@vendor.com
   - Phone: 9876543210
   - Password: test123
   - Confirm Password: test123
3. **Step 2 - Business Info:**
   - Business Name: Jane's Electronics
   - Business Type: Proprietorship
   - Business Category: Electronics
   - Business Phone: 9876543210
   - Business Email: business@jane.com (optional)
   - Description: Selling quality electronics
4. **Step 3 - Address & Tax:**
   - Street: 123 Main Street
   - City: Mumbai
   - State: Maharashtra
   - Postal Code: 400001
   - PAN Number: ABCDE1234F
   - GST Number: 27AAAAA0000A1Z5 (optional)
5. **Step 4 - Bank Details:**
   - Account Holder: Jane Smith
   - Account Number: 1234567890
   - Confirm Account: 1234567890
   - IFSC Code: SBIN0001234
   - Bank Name: State Bank of India
   - Branch: Mumbai Main
   - Account Type: Current
6. Click "Submit & Register"
7. Redirects to vendor dashboard

#### Login:
1. Go to `http://localhost:5174/vendor/login`
2. Enter vendor email and password
3. Click "Login to Dashboard"
4. Redirects to `/vendor/dashboard`

### 3. Admin Flow

#### Login:
1. Go to `http://localhost:5174/admin/login`
2. Enter admin credentials
3. Click "Access Admin Panel"
4. Redirects to `/admin/dashboard`

---

## 🔒 Security Features

### 1. Password Security
- Minimum 6 characters required
- Hashed using bcrypt before storage
- Never sent in responses

### 2. Role Verification
- Login endpoint validates role matches user's actual role
- Prevents vendors using customer login (and vice versa)
- JWT tokens include role information

### 3. Data Validation

#### Backend Validation:
- Email format validation
- PAN format: `ABCDE1234F` (5 letters, 4 digits, 1 letter)
- GST format: `22AAAAA0000A1Z5` (15 characters)
- IFSC format: `SBIN0001234` (4 letters, 0, 6 alphanumeric)
- Required field validation
- Mongoose schema validation

#### Frontend Validation:
- Real-time format validation
- Step-by-step validation in vendor registration
- Confirmation fields (password, account number)
- Clear error messages

### 4. Access Control
- Protected routes using role checks
- Vendor routes require vendor/admin role
- Admin routes require admin role
- JWT token verification on protected endpoints

---

## 📊 Database Schema Changes

### Before:
```javascript
{
  firstName, lastName, email, password,
  phone, role,
  shop: { shopName, shopDescription, shopImage, verified }
}
```

### After:
```javascript
{
  firstName, lastName, email, password,
  phone, role,
  vendorInfo: {
    // 100+ fields for complete business information
    businessName, businessType, businessAddress,
    gstNumber, panNumber, bankDetails,
    verification status, documents, metrics, etc.
  },
  addresses: [...] // Customer addresses unchanged
}
```

---

## 🎯 API Endpoints Summary

### Authentication
| Endpoint | Method | Purpose | Body |
|----------|--------|---------|------|
| `/api/auth/signup` | POST | Generic signup | firstName, lastName, email, password, role |
| `/api/auth/customer/signup` | POST | Customer registration | firstName, lastName, email, password, phone |
| `/api/auth/vendor/signup` | POST | Vendor registration | Full business details |
| `/api/auth/login` | POST | Role-based login | email, password, role (optional) |
| `/api/auth/profile` | GET | Get profile | - (requires auth token) |
| `/api/auth/profile` | PUT | Update profile | Any user fields |

---

## 🔄 Migration Guide

### For Existing Users:
- Old accounts continue to work
- Generic `/api/auth/signup` still functional
- Generic `/api/auth/login` still works
- Vendor accounts can be upgraded by adding vendorInfo

### For New Development:
- Use role-specific endpoints
- Customer: `/api/auth/customer/signup`
- Vendor: `/api/auth/vendor/signup`
- Login: `/api/auth/login` with role parameter

---

## 🎨 UI/UX Features

### Customer Registration
- ✅ Clean, simple form
- ✅ Optional phone number
- ✅ Links to vendor registration
- ✅ Gradient background

### Vendor Registration
- ✅ 4-step wizard interface
- ✅ Progress indicator
- ✅ Step validation
- ✅ Back/Next navigation
- ✅ Format hints for PAN, GST, IFSC
- ✅ Comprehensive business fields
- ✅ Professional design

### Login Pages
- ✅ Role-specific branding
- ✅ Customer: Blue theme, shopping focus
- ✅ Vendor: Blue theme, business focus
- ✅ Admin: Dark theme, security focus
- ✅ Cross-links between login types
- ✅ Info boxes explaining access

---

## 📝 Validation Rules

### PAN Number
- Format: `ABCDE1234F`
- 5 uppercase letters + 4 digits + 1 uppercase letter
- Total: 10 characters
- Example: `ABCDE1234F`

### GST Number
- Format: `22AAAAA0000A1Z5`
- 2 digits + 10 alphanumeric + 1 letter + 1 digit/letter + 'Z' + 1 digit/letter
- Total: 15 characters
- Example: `27ABCDE1234F1Z5`

### IFSC Code
- Format: `SBIN0001234`
- 4 uppercase letters + '0' + 6 alphanumeric
- Total: 11 characters
- Example: `SBIN0001234`

### Password
- Minimum: 6 characters
- No maximum limit
- Recommended: Include uppercase, lowercase, numbers, special chars

---

## 🚦 Status Indicators

### Vendor Verification Statuses
- **pending**: Just registered, awaiting review
- **under_review**: Admin is reviewing documents
- **verified**: Approved, can sell products
- **rejected**: Not approved, see rejection reason

### Onboarding Steps
1. Registration complete
2. Business details verified
3. Documents uploaded
4. Bank details verified
5. Store setup complete

---

## 🔗 Navigation Flow

```
Homepage
  ├── Login (Customer) → /login
  │     ├── Vendor Login → /vendor/login
  │     └── Admin Login → /admin/login
  │
  ├── Register (Customer) → /register
  │     └── Vendor Register → /vendor/register
  │
  └── Products, Cart, etc.

After Login:
  ├── Customer → / (Homepage)
  ├── Vendor → /vendor/dashboard
  └── Admin → /admin/dashboard
```

---

## 💡 Best Practices

### For Vendors:
1. Complete all registration steps accurately
2. Provide valid PAN number (mandatory)
3. Add GST if registered (recommended)
4. Use business email for official communication
5. Keep bank details up to date
6. Complete verification process
7. Add business documents for faster approval

### For Admins:
1. Verify vendor documents thoroughly
2. Check PAN/GST validity
3. Approve only legitimate businesses
4. Monitor vendor ratings and reviews
5. Handle disputes fairly

### For Developers:
1. Always validate input on both frontend and backend
2. Use role checks in protected routes
3. Return appropriate error messages
4. Log authentication attempts
5. Test all validation rules
6. Handle edge cases (e.g., existing email)

---

## 🐛 Troubleshooting

### Issue: "User already exists"
**Solution:** Email is already registered. Use forgot password or try different email.

### Issue: "Invalid credentials"
**Solution:** Check email/password. Try the correct login page for your role.

### Issue: "This account is not registered as a vendor"
**Solution:** You're using vendor login with a customer account. Use `/login` instead.

### Issue: "PAN number format invalid"
**Solution:** Use format `ABCDE1234F` (5 letters, 4 digits, 1 letter, all uppercase).

### Issue: "IFSC code format invalid"
**Solution:** Use format `SBIN0001234` (4 letters, then 0, then 6 alphanumeric).

### Issue: Registration completes but can't login
**Solution:** Make sure to use the correct login page:
- Customers: `/login`
- Vendors: `/vendor/login`
- Admins: `/admin/login`

---

## 📞 Test Credentials

### Customer
- Email: `customer@test.com`
- Password: `test123`
- Access: Homepage, Cart, Orders

### Vendor
- Email: `vendor@test.com`
- Password: `test123`
- Access: Vendor Dashboard, Products, Orders

### Admin
- Email: `admin@test.com`
- Password: `test123`
- Access: Admin Dashboard, All Management

---

## 🎉 Success!

Your ShopEz platform now has a professional, role-based authentication system that:
- ✅ Separates customer, vendor, and admin flows
- ✅ Collects comprehensive business information from vendors
- ✅ Validates all data formats
- ✅ Provides excellent UX with step-by-step forms
- ✅ Implements proper security measures
- ✅ Follows real-world e-commerce standards

Ready to onboard your vendors! 🚀
