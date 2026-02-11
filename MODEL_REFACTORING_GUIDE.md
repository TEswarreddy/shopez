# ShopEz Model Refactoring Guide

## 📌 Overview

This guide documents the architectural transformation from an **embedded model structure** to a **separate models architecture** for better scalability and maintainability.

---

## 🏗️ Architecture Changes

### **BEFORE: Embedded Structure**
```javascript
User {
  _id, firstName, lastName, email, password, phone, role,
  vendorInfo: { 100+ embedded fields },
  addresses: [ embedded address objects ]
}
```

**Problems:**
- ❌ Single large document with mixed concerns
- ❌ Difficulty in querying vendor-specific data
- ❌ No proper separation of user authentication and business data
- ❌ Limited flexibility for role-specific features

### **AFTER: Separate Models (✅ Implemented)**
```javascript
User {
  _id, firstName, lastName, email, password,
  phone, role, profileImage, isActive
}
  ↓ (one-to-one relationship via user reference)
Customer { user: ref(User), addresses, loyalty, preferences }
Vendor { user: ref(User), business, tax, bank, store, metrics }
Admin { user: ref(User), permissions, activity, security }
```

**Benefits:**
- ✅ Clean separation of concerns
- ✅ Better data modeling and scalability
- ✅ Role-specific fields in dedicated collections
- ✅ Easier to query and maintain
- ✅ Granular permission system for admins

---

## 📂 New Model Structure

### 1️⃣ **Base User Model** (`User.js`)

**Purpose:** Authentication and core user data only

**Fields:**
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique, validated),
  password: String (required, hashed),
  phone: String,
  role: enum["customer", "vendor", "admin"],
  profileImage: String,
  isActive: Boolean,
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  loginAttempts: Number,
  lockUntil: Date
}
```

**Methods:**
- `comparePassword(enteredPassword)` - Compare hashed password
- `incLoginAttempts()` - Increment failed login attempts and lock account after 5 attempts
- `resetLoginAttempts()` - Reset attempts on successful login

**Virtuals:**
- `isLocked` - Check if account is locked due to failed attempts

---

### 2️⃣ **Customer Model** (`Customer.js`)

**Purpose:** Customer-specific data and preferences

**Fields:**
```javascript
{
  user: ObjectId (ref: User, unique, required),
  
  // Addresses
  addresses: [{
    fullName, phone, street, city, state,
    postalCode, country, isDefault
  }],
  defaultAddressId: ObjectId,
  
  // Profile
  profileImage: String,
  dateOfBirth: Date,
  gender: enum["male", "female", "other", "prefer_not_to_say"],
  
  // Preferences
  preferences: {
    newsletter: Boolean,
    orderUpdates: Boolean,
    promotions: Boolean
  },
  
  // Loyalty & Metrics
  loyaltyPoints: Number (default: 0),
  totalOrders: Number (default: 0),
  totalSpent: Number (default: 0),
  lastOrderDate: Date
}
```

**Use Case:** Track customer orders, addresses, and loyalty points

---

### 3️⃣ **Vendor Model** (`Vendor.js`)

**Purpose:** Comprehensive vendor/seller business data

**Fields:**

**Core Business Information:**
```javascript
{
  user: ObjectId (ref: User, unique, required),
  businessName: String (required),
  businessType: enum["individual", "proprietorship", "partnership", "private_limited", "public_limited", "llp"],
  businessCategory: enum["electronics", "fashion", "home", "beauty", "sports", "books", "food", "other"],
  businessDescription: String
}
```

**Contact & Address:**
```javascript
{
  businessEmail: String (required),
  businessPhone: String (required),
  alternatePhone: String,
  businessAddress: {
    street, city, state, postalCode, country (required)
  },
  pickupAddress: {
    street, city, state, postalCode, country
  }
}
```

**Tax & Compliance:**
```javascript
{
  panNumber: String (required, validated regex),
  gstNumber: String (validated regex),
}
```

**Banking:**
```javascript
{
  bankDetails: {
    accountHolderName: String (required),
    accountNumber: String (required),
    ifscCode: String (required, validated),
    bankName: String,
    branchName: String,
    accountType: enum["savings", "current"]
  }
}
```

**Store/Shop Information:**
```javascript
{
  storeName: String,
  storeDescription: String,
  storeLogo: String (URL),
  storeBanner: String (URL),
  storeSlug: String (unique, auto-generated)
}
```

**Verification:**
```javascript
{
  isVerified: Boolean (default: false),
  verificationStatus: enum["pending", "under_review", "verified", "rejected"],
  verifiedAt: Date,
  verifiedBy: ObjectId (ref: Admin),
  rejectionReason: String
}
```

**Documents:**
```javascript
{
  gstCertificate: String (URL),
  panCard: String (URL),
  addressProof: String (URL),
  cancelledCheque: String (URL),
  businessLicense: String (URL)
}
```

**Metrics & Performance:**
```javascript
{
  rating: Number (0-5),
  totalRatings: Number,
  totalReviews: Number,
  totalSales: Number,
  totalOrders: Number,
  totalRevenue: Number,
  totalProducts: Number,
  
  performanceMetrics: {
    orderFulfillmentRate: Number (0-100),
    averageShippingTime: Number (hours),
    returnRate: Number (0-100),
    responseTime: Number (hours),
    customerSatisfaction: Number (0-100)
  }
}
```

**Store Settings:**
```javascript
{
  storeSettings: {
    isStoreActive: Boolean,
    acceptsReturns: Boolean,
    returnWindow: Number (days),
    shippingMethods: [String],
    paymentMethods: [String],
    minOrderAmount: Number,
    maxOrderAmount: Number,
    deliveryTime: String
  }
}
```

**Commission & Financials:**
```javascript
{
  commissionRate: Number (default: 10),
  pendingPayouts: Number,
  totalPayouts: Number,
  lastPayoutDate: Date
}
```

**Onboarding:**
```javascript
{
  onboardingCompleted: Boolean,
  onboardingStep: Number (1-5)
}
```

**Status:**
```javascript
{
  isActive: Boolean,
  isSuspended: Boolean,
  suspensionReason: String,
  suspendedAt: Date
}
```

**Social Media:**
```javascript
{
  socialMedia: {
    facebook: String,
    instagram: String,
    twitter: String,
    website: String
  }
}
```

**Business Hours:**
```javascript
{
  businessHours: {
    monday: { open: String, close: String, closed: Boolean },
    tuesday: { open: String, close: String, closed: Boolean },
    // ... for all days
  }
}
```

**Pre-save Hook:**
- Auto-generates `storeSlug` from `storeName` (lowercase, hyphenated)

**Methods:**
- `updateRating(newRating)` - Calculate weighted average rating

---

### 4️⃣ **Admin Model** (`Admin.js`)

**Purpose:** Admin users with granular permission system

**Fields:**

**Core:**
```javascript
{
  user: ObjectId (ref: User, unique, required),
  adminLevel: enum["super_admin", "admin", "moderator", "support"],
  department: enum["operations", "customer_support", "finance", "marketing", "technical", "management"],
  employeeId: String,
  designation: String
}
```

**Granular Permissions (20+ flags):**
```javascript
{
  permissions: {
    // User Management
    canManageUsers: Boolean,
    canDeleteUsers: Boolean,
    canSuspendUsers: Boolean,
    
    // Vendor Management
    canManageVendors: Boolean,
    canVerifyVendors: Boolean,
    canSuspendVendors: Boolean,
    canDeleteVendors: Boolean,
    
    // Product Management
    canManageProducts: Boolean,
    canDeleteProducts: Boolean,
    canFeatureProducts: Boolean,
    
    // Order Management
    canManageOrders: Boolean,
    canRefundOrders: Boolean,
    canCancelOrders: Boolean,
    
    // Content Management
    canManageCategories: Boolean,
    canManageBanners: Boolean,
    canManagePromotions: Boolean,
    
    // Financial
    canViewFinancials: Boolean,
    canProcessPayouts: Boolean,
    canManageCommissions: Boolean,
    
    // System
    canManageSettings: Boolean,
    canViewLogs: Boolean,
    canManageAdmins: Boolean
  }
}
```

**Activity Tracking:**
```javascript
{
  lastLogin: Date,
  lastActivity: Date,
  loginCount: Number,
  
  stats: {
    usersManaged: Number,
    vendorsVerified: Number,
    ordersProcessed: Number,
    disputesResolved: Number,
    ticketsHandled: Number
  }
}
```

**Security:**
```javascript
{
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,
  ipWhitelist: [String]
}
```

**Notifications:**
```javascript
{
  notificationSettings: {
    email: Boolean,
    sms: Boolean,
    newOrders: Boolean,
    newVendors: Boolean,
    disputes: Boolean,
    systemAlerts: Boolean
  }
}
```

**Status & Assignment:**
```javascript
{
  isActive: Boolean,
  isOnline: Boolean,
  assignedRegions: [String],
  assignedCategories: [String]
}
```

**Contact & Audit:**
```javascript
{
  workPhone: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  addedBy: ObjectId (ref: Admin),
  notes: String
}
```

**Methods:**
- `updateActivity()` - Update last activity timestamp
- `recordLogin()` - Update last login and increment count
- `hasPermission(permission)` - Check if admin has permission (super_admin always returns true)

---

## 🔄 Updated Authentication Controllers

### **Customer Signup** (`POST /api/auth/customer/signup`)

**Flow:**
1. Validate input (firstName, lastName, email, password)
2. Check if user exists
3. Create **User** record with `role: "customer"`
4. Create **Customer** record with user reference
5. Generate JWT token
6. Return user + customer data

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer",
    "customer": {
      "id": "customer_id",
      "loyaltyPoints": 0
    }
  }
}
```

---

### **Vendor Signup** (`POST /api/auth/vendor/signup`)

**Flow:**
1. Validate input (all business details)
2. Check if user exists
3. Create **User** record with `role: "vendor"`
4. Create **Vendor** record with all business data
5. Generate JWT token
6. Return user + vendor data

**Request Body:**
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@business.com",
  "password": "securepass123",
  "phone": "+919876543210",
  "businessName": "Jane's Electronics",
  "businessType": "proprietorship",
  "businessCategory": "electronics",
  "businessPhone": "+919876543210",
  "businessEmail": "business@jane.com",
  "businessAddress": {
    "street": "123 Market St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "postalCode": "400001",
    "country": "India"
  },
  "panNumber": "ABCDE1234F",
  "gstNumber": "27ABCDE1234F1Z5",
  "bankDetails": {
    "accountHolderName": "Jane Smith",
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "accountType": "current"
  },
  "storeName": "Jane's Electronics Store"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@business.com",
    "role": "vendor",
    "vendor": {
      "id": "vendor_id",
      "businessName": "Jane's Electronics",
      "verificationStatus": "pending",
      "onboardingStep": 1,
      "storeSlug": "janes-electronics"
    }
  },
  "message": "Vendor account created. Verification is pending."
}
```

---

### **Login** (`POST /api/auth/login`)

**Flow:**
1. Validate email and password
2. Find user and verify account status
3. Check if account is locked (5 failed attempts = 2 hour lock)
4. Verify role matches if specified
5. Verify password
6. Reset login attempts on success
7. Populate role-specific data (Customer/Vendor/Admin)
8. Generate JWT token
9. Return user + role-specific data

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "customer"  // Optional: customer, vendor, admin
}
```

**Response (Customer):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "customer",
    "profileImage": null,
    "isEmailVerified": false,
    "customer": {
      "id": "customer_id",
      "loyaltyPoints": 150,
      "totalOrders": 5,
      "defaultAddressId": "address_id",
      "preferences": {
        "newsletter": true,
        "orderUpdates": true,
        "promotions": false
      }
    }
  }
}
```

**Response (Vendor):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane@business.com",
    "role": "vendor",
    "profileImage": null,
    "isEmailVerified": true,
    "vendor": {
      "id": "vendor_id",
      "businessName": "Jane's Electronics",
      "storeName": "Jane's Electronics Store",
      "storeSlug": "janes-electronics-store",
      "verificationStatus": "verified",
      "isVerified": true,
      "onboardingCompleted": true,
      "onboardingStep": 5,
      "rating": 4.5,
      "isActive": true,
      "isSuspended": false
    }
  }
}
```

**Response (Admin):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@shopez.com",
    "role": "admin",
    "admin": {
      "id": "admin_id",
      "adminLevel": "super_admin",
      "department": "operations",
      "permissions": {
        "canManageUsers": true,
        "canManageVendors": true,
        // ... all permissions
      },
      "isActive": true
    }
  }
}
```

**Error Responses:**

**Account Locked:**
```json
{
  "message": "Account is locked due to too many failed login attempts. Please try again later."
}
// Status: 423 (Locked)
```

**Wrong Role:**
```json
{
  "message": "This account is not registered as a vendor"
}
// Status: 403 (Forbidden)
```

---

### **Get Profile** (`GET /api/auth/profile`)

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Flow:**
1. Extract user from JWT token (via auth middleware)
2. Find user by ID
3. Populate appropriate role-specific model
4. Update admin activity if admin
5. Return complete profile data

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+919876543210",
    "role": "customer",
    "profileImage": null,
    "isActive": true,
    "isEmailVerified": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T15:45:00Z",
    "customer": {
      "_id": "customer_id",
      "user": "user_id",
      "addresses": [
        {
          "_id": "address_id",
          "fullName": "John Doe",
          "phone": "+919876543210",
          "street": "123 Main St",
          "city": "Mumbai",
          "state": "Maharashtra",
          "postalCode": "400001",
          "country": "India",
          "isDefault": true
        }
      ],
      "defaultAddressId": "address_id",
      "loyaltyPoints": 150,
      "totalOrders": 5,
      "totalSpent": 12500,
      "preferences": {
        "newsletter": true,
        "orderUpdates": true,
        "promotions": false
      },
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T15:45:00Z"
    }
  }
}
```

---

## 🚨 Breaking Changes

### **1. User Model Changes**

**Removed Fields:**
- ❌ `vendorInfo` object - Now in separate `Vendor` model
- ❌ `addresses` array - Now in `Customer` model
- ❌ `defaultAddressId` - Now in `Customer` model

**Added Fields:**
- ✅ `isEmailVerified` - Email verification status
- ✅ `emailVerificationToken` - Email verification token
- ✅ `passwordResetToken` - Password reset token
- ✅ `lastLogin` - Last login timestamp
- ✅ `loginAttempts` - Failed login attempt counter
- ✅ `lockUntil` - Account lock expiry time

### **2. Authentication Response Structure**

**Old Response:**
```json
{
  "user": {
    "id": "...",
    "vendorInfo": { ... }
  }
}
```

**New Response:**
```json
{
  "user": {
    "id": "...",
    "vendor": { ... }  // Separate object
  }
}
```

### **3. Database Queries**

**Old Way:**
```javascript
// ❌ Old - Query embedded vendorInfo
const user = await User.findById(userId);
const businessName = user.vendorInfo.businessName;
```

**New Way:**
```javascript
// ✅ New - Query separate Vendor model
const vendor = await Vendor.findOne({ user: userId }).populate('user');
const businessName = vendor.businessName;
```

---

## ⚠️ Required Controller Updates

The following controllers need to be updated to work with the new model structure:

### **❌ Pending Updates:**

1. **`vendorController.js`** (CRITICAL)
   - All 12 functions query `User.vendorInfo`
   - Need to query `Vendor` model instead
   - Functions affected:
     - `getDashboardStats()`
     - `getVendorProducts()`
     - `createProduct()`
     - `updateProduct()`
     - `deleteProduct()`
     - `getVendorOrders()`
     - `updateOrderStatus()`
     - `getVendorProfile()`
     - `updateVendorProfile()`
     - `uploadStoreLogo()`
     - `getStoreSettings()`
     - `updateStoreSettings()`

2. **`usersController.js`**
   - Address management functions need to work with `Customer` model
   - Profile updates need to update both `User` and `Customer`

3. **`adminController.js`**
   - Create new admin-specific controller
   - Implement permission checking with `admin.hasPermission()`
   - Add vendor verification functions

4. **`orderController.js`**
   - Update vendor population to use separate `Vendor` model
   - May need to populate `user` → `vendor` chain

5. **`productController.js`**
   - Update vendor population for product listings
   - Update `populate('vendor')` calls

6. **`reviewController.js`**
   - Update customer/vendor population if needed

7. **`cartController.js`**
   - Verify customer address population works correctly

---

## 📊 Database Migration Required

### **Migration Strategy:**

```javascript
// Pseudo-code for migration script
async function migrateExistingUsers() {
  const users = await User.find();
  
  for (const user of users) {
    if (user.role === "customer") {
      // Create Customer record
      await Customer.create({
        user: user._id,
        addresses: user.addresses || [],
        defaultAddressId: user.defaultAddressId,
        preferences: {
          newsletter: true,
          orderUpdates: true,
          promotions: false
        }
      });
    }
    
    if (user.role === "vendor" && user.vendorInfo) {
      // Create Vendor record
      await Vendor.create({
        user: user._id,
        ...user.vendorInfo  // Copy all vendorInfo fields
      });
    }
    
    if (user.role === "admin") {
      // Create Admin record with default permissions
      await Admin.create({
        user: user._id,
        adminLevel: "admin",
        permissions: {
          canManageUsers: true,
          canManageVendors: true,
          // ... set appropriate permissions
        }
      });
    }
    
    // Clean up old fields (after verification)
    // user.vendorInfo = undefined;
    // user.addresses = undefined;
    // user.defaultAddressId = undefined;
    // await user.save();
  }
}
```

**⚠️ Important:**
1. **Backup database before migration**
2. Test on development/staging first
3. Verify data integrity after migration
4. Keep old fields temporarily for rollback safety
5. Monitor application logs for errors

---

## 🧪 Testing Checklist

### **Authentication Tests:**
- [ ] Customer signup creates both User and Customer records
- [ ] Vendor signup creates both User and Vendor records with storeSlug
- [ ] Login returns correct role-specific data
- [ ] Login increments failed attempts and locks account after 5 failures
- [ ] Login resets attempts on success
- [ ] Get profile returns populated role data
- [ ] JWT token contains correct user ID and role

### **Model Tests:**
- [ ] Customer model saves with user reference
- [ ] Vendor model generates unique storeSlug
- [ ] Admin model permission checks work correctly
- [ ] updateRating() method calculates correctly
- [ ] One-to-one relationship enforced (unique user reference)

### **Controller Tests:**
- [ ] vendorController queries Vendor model correctly
- [ ] Customer addresses work with new Customer model
- [ ] Admin permission checks work throughout admin operations

### **Integration Tests:**
- [ ] Full customer registration → login → profile flow works
- [ ] Full vendor registration → login → dashboard flow works
- [ ] Admin login → vendor verification flow works
- [ ] Order creation populates vendor correctly
- [ ] Product listing shows vendor store information

---

## 📖 Usage Examples

### **Creating a Customer:**
```javascript
// Frontend: Register customer
const response = await axios.post('/api/auth/customer/signup', {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'securepass123',
  phone: '+919876543210'
});

// Response includes customer ID and loyalty points
console.log(response.data.user.customer.loyaltyPoints); // 0
```

### **Creating a Vendor:**
```javascript
// Frontend: Register vendor (4-step wizard)
const response = await axios.post('/api/auth/vendor/signup', {
  // Step 1: Personal Info
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@business.com',
  password: 'securepass123',
  phone: '+919876543210',
  
  // Step 2: Business Info
  businessName: "Jane's Electronics",
  businessType: 'proprietorship',
  businessCategory: 'electronics',
  businessPhone: '+919876543210',
  businessEmail: 'contact@jane.com',
  businessDescription: 'Quality electronics at great prices',
  
  // Step 3: Address & Tax
  businessAddress: {
    street: '123 Market St',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400001',
    country: 'India'
  },
  panNumber: 'ABCDE1234F',
  gstNumber: '27ABCDE1234F1Z5',
  
  // Step 4: Bank Details
  bankDetails: {
    accountHolderName: 'Jane Smith',
    accountNumber: '1234567890',
    ifscCode: 'SBIN0001234',
    bankName: 'State Bank of India',
    branchName: 'Mumbai Main',
    accountType: 'current'
  },
  
  storeName: "Jane's Electronics Store"
});

// Response includes vendor ID and store slug
console.log(response.data.user.vendor.storeSlug); // "janes-electronics-store"
```

### **Querying Vendor Data:**
```javascript
// Backend: Get vendor with user info
const vendor = await Vendor.findOne({ user: userId }).populate('user');
console.log(vendor.businessName);
console.log(vendor.user.email);

// Get all verified vendors
const verifiedVendors = await Vendor.find({ isVerified: true })
  .populate('user', 'firstName lastName email')
  .sort({ rating: -1 });
```

### **Checking Admin Permissions:**
```javascript
// Backend: Check if admin can verify vendors
const admin = await Admin.findOne({ user: req.user.id });

if (admin.hasPermission('canVerifyVendors')) {
  // Allow vendor verification
  const vendor = await Vendor.findById(vendorId);
  vendor.isVerified = true;
  vendor.verificationStatus = 'verified';
  vendor.verifiedBy = admin._id;
  vendor.verifiedAt = new Date();
  await vendor.save();
}
```

### **Updating Customer Address:**
```javascript
// Backend: Add address to customer
const customer = await Customer.findOne({ user: userId });

customer.addresses.push({
  fullName: 'John Doe',
  phone: '+919876543210',
  street: '456 New St',
  city: 'Delhi',
  state: 'Delhi',
  postalCode: '110001',
  country: 'India',
  isDefault: false
});

await customer.save();
```

---

## 🎉 Completed Tasks

- ✅ Created `Customer.js` model (70 lines)
- ✅ Created `Vendor.js` model (230 lines)
- ✅ Created `Admin.js` model (170 lines)
- ✅ Refactored `User.js` to base auth model
- ✅ Updated `authController.js` with new signup/login logic
- ✅ Added account locking after 5 failed login attempts
- ✅ Added role-specific data population in login
- ✅ Backend server restarted successfully

---

## 📋 Next Steps

1. **Update VendorController** - Refactor all 12 functions to use Vendor model
2. **Update UsersController** - Work with Customer model for addresses
3. **Create AdminController** - Implement admin-specific operations
4. **Database Migration** - Write and test migration script
5. **Update Other Controllers** - Fix populate() calls in order/product controllers
6. **Frontend Updates** - Update services to handle new response structure
7. **Comprehensive Testing** - Test all flows end-to-end
8. **Documentation** - Update API documentation

---

## 🔧 Troubleshooting

### **Issue: "User already exists" error**
- This occurs during signup if email is already registered
- Check if user exists before creating new account

### **Issue: "Cannot read property 'vendorInfo' of undefined"**
- Old controller code trying to access removed vendorInfo field
- Update to query Vendor model instead

### **Issue: "Cast to ObjectId failed"**
- Invalid user reference in Customer/Vendor/Admin model
- Verify user ID is valid ObjectId before creating related record

### **Issue: Login returns empty customer/vendor/admin object**
- Related record not created during signup
- Verify both User and role-specific record are created

### **Issue: "Cannot populate path 'vendor'"**
- Product/Order model still references old embedded structure
- Update model schema to reference Vendor model with user field

---

## 📚 Related Documentation

- [ROLE_BASED_AUTH_GUIDE.md](./ROLE_BASED_AUTH_GUIDE.md) - Original role-based auth documentation
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - Complete API reference
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick command reference

---

**Last Updated:** January 2024  
**Status:** ✅ Models Created | 🔄 Controllers In Progress | ❌ Testing Pending

