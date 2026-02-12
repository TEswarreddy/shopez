const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");

const accountModels = {
  customer: Customer,
  vendor: Vendor,
  admin: Admin,
};

const findExistingAccountByEmail = async (email) => {
  const [customer, vendor, admin] = await Promise.all([
    Customer.findOne({ email }),
    Vendor.findOne({ email }),
    Admin.findOne({ email }),
  ]);

  if (customer) return { account: customer, role: "customer" };
  if (vendor) return { account: vendor, role: "vendor" };
  if (admin) return { account: admin, role: "admin" };

  return null;
};

const buildUserPayload = (account) => ({
  id: account._id,
  firstName: account.firstName,
  lastName: account.lastName,
  email: account.email,
  phone: account.phone,
  role: account.role,
  profileImage: account.profileImage,
  isEmailVerified: account.isEmailVerified,
  isActive: account.isActive,
});

const attachRolePayload = (userPayload, account) => {
  if (account.role === "customer") {
    userPayload.customer = {
      id: account._id,
      loyaltyPoints: account.loyaltyPoints,
      totalOrders: account.totalOrders,
      defaultAddressId: account.defaultAddressId,
      preferences: account.preferences,
    };
  }

  if (account.role === "vendor") {
    userPayload.vendor = {
      id: account._id,
      businessName: account.businessName,
      storeName: account.storeName,
      storeSlug: account.storeSlug,
      verificationStatus: account.verificationStatus,
      isVerified: account.isVerified,
      onboardingCompleted: account.onboardingCompleted,
      onboardingStep: account.onboardingStep,
      rating: account.rating,
      isActive: account.isActive,
      isSuspended: account.isSuspended,
    };
  }

  if (account.role === "admin") {
    userPayload.admin = {
      id: account._id,
      adminLevel: account.adminLevel,
      department: account.department,
      permissions: account.permissions,
      isActive: account.isActive,
    };
  }

  return userPayload;
};

// Customer Signup
const customerSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const existing = await findExistingAccountByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const customer = new Customer({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: "customer",
      preferences: {
        newsletter: true,
        orderUpdates: true,
        promotions: false,
      },
    });

    await customer.save();

    const token = jwt.sign({ id: customer._id, role: customer.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const user = attachRolePayload(buildUserPayload(customer), customer);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor Signup
const vendorSignup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      businessName,
      businessType,
      businessPhone,
      businessAddress,
      gstNumber,
      panNumber,
      bankDetails,
      businessDescription,
      businessCategory,
      businessEmail,
      alternatePhone,
      pickupAddress,
      storeName,
      storeDescription,
    } = req.body;

    if (!firstName || !lastName || !email || !password || !businessName || !businessType || !businessPhone || !panNumber) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (!businessAddress || !businessAddress.street || !businessAddress.city || !businessAddress.state || !businessAddress.postalCode) {
      return res.status(400).json({ message: "Please provide complete business address" });
    }

    if (!bankDetails || !bankDetails.accountHolderName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
      return res.status(400).json({ message: "Please provide complete bank details" });
    }

    const existing = await findExistingAccountByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const vendor = new Vendor({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: "vendor",
      businessName,
      businessType,
      businessPhone,
      businessAddress,
      panNumber,
      bankDetails,
      businessDescription,
      businessCategory,
      businessEmail: businessEmail || email,
      alternatePhone,
      pickupAddress,
      storeName: storeName || businessName,
      storeDescription,
      gstNumber,
      verificationStatus: "pending",
      onboardingStep: 1,
    });

    await vendor.save();

    const token = jwt.sign({ id: vendor._id, role: vendor.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const user = attachRolePayload(buildUserPayload(vendor), vendor);

    res.status(201).json({
      success: true,
      token,
      user,
      message: "Vendor account created. Verification is pending.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic Signup (backward compatibility)
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = "customer" } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (!accountModels[role]) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await findExistingAccountByEmail(email);
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const AccountModel = accountModels[role];
    const account = new AccountModel({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    await account.save();

    const token = jwt.sign({ id: account._id, role: account.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const user = attachRolePayload(buildUserPayload(account), account);

    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login (role-specific)
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    let account = null;
    let accountRole = role;

    if (role && accountModels[role]) {
      account = await accountModels[role].findOne({ email }).select("+password");
    } else {
      const found = await findExistingAccountByEmail(email);
      account = found?.account || null;
      accountRole = found?.role || null;
      if (account) {
        account = await accountModels[accountRole].findById(account._id).select("+password");
      }
    }

    if (!account) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!account.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    if (account.isLocked) {
      return res.status(423).json({ message: "Account is locked due to too many failed login attempts. Please try again later." });
    }

    if (role && account.role !== role) {
      await account.incLoginAttempts();
      return res.status(403).json({ message: `This account is not registered as a ${role}` });
    }

    const isPasswordCorrect = await account.comparePassword(password);

    if (!isPasswordCorrect) {
      await account.incLoginAttempts();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    await account.resetLoginAttempts();

    if (account.role === "admin") {
      await account.recordLogin();
    }

    const token = jwt.sign({ id: account._id, role: account.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const user = attachRolePayload(buildUserPayload(account), account);

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const AccountModel = accountModels[req.user.role];
    if (!AccountModel) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const account = await AccountModel.findById(req.user.id).select("-password");

    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = attachRolePayload(buildUserPayload(account), account);

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const AccountModel = accountModels[req.user.role];
    if (!AccountModel) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const allowedFields = ["firstName", "lastName", "email", "phone", "profileImage"]; 
    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const account = await AccountModel.findByIdAndUpdate(req.user.id, updates, {
      returnDocument: 'after',
      runValidators: true,
    }).select("-password");

    if (!account) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = attachRolePayload(buildUserPayload(account), account);

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  signup,
  customerSignup,
  vendorSignup,
  login,
  getProfile,
  updateProfile,
};
