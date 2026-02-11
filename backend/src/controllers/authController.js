const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Customer = require("../models/Customer");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");

// Customer Signup
const customerSignup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: "customer",
    });

    await user.save();

    // Create customer profile
    const customer = new Customer({
      user: user._id,
      preferences: {
        newsletter: true,
        orderUpdates: true,
        promotions: false
      }
    });

    await customer.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        customer: {
          id: customer._id,
          loyaltyPoints: customer.loyaltyPoints
        }
      },
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
      storeDescription
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !businessName || !businessType || !businessPhone || !panNumber) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Validate business address
    if (!businessAddress || !businessAddress.street || !businessAddress.city || !businessAddress.state || !businessAddress.postalCode) {
      return res.status(400).json({ message: "Please provide complete business address" });
    }

    // Validate bank details
    if (!bankDetails || !bankDetails.accountHolderName || !bankDetails.accountNumber || !bankDetails.ifscCode) {
      return res.status(400).json({ message: "Please provide complete bank details" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: "vendor",
    });

    await user.save();

    // Create vendor profile
    const vendor = new Vendor({
      user: user._id,
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
      onboardingStep: 1
    });

    await vendor.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        vendor: {
          id: vendor._id,
          businessName: vendor.businessName,
          verificationStatus: vendor.verificationStatus,
          onboardingStep: vendor.onboardingStep,
          storeSlug: vendor.storeSlug
        }
      },
      message: "Vendor account created. Verification is pending."
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generic Signup (backward compatibility)
const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role = "customer" } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    await user.save();

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
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

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(403).json({ message: "Account is deactivated" });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ message: "Account is locked due to too many failed login attempts. Please try again later." });
    }

    // Check if logging in with correct role
    if (role && user.role !== role) {
      await user.incLoginAttempts();
      return res.status(403).json({ message: `This account is not registered as a ${role}` });
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      await user.incLoginAttempts();
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
      isEmailVerified: user.isEmailVerified
    };

    // Populate role-specific data
    if (user.role === "customer") {
      const customer = await Customer.findOne({ user: user._id });
      if (customer) {
        userData.customer = {
          id: customer._id,
          loyaltyPoints: customer.loyaltyPoints,
          totalOrders: customer.totalOrders,
          defaultAddressId: customer.defaultAddressId,
          preferences: customer.preferences
        };
      }
    } else if (user.role === "vendor") {
      const vendor = await Vendor.findOne({ user: user._id });
      if (vendor) {
        userData.vendor = {
          id: vendor._id,
          businessName: vendor.businessName,
          storeName: vendor.storeName,
          storeSlug: vendor.storeSlug,
          verificationStatus: vendor.verificationStatus,
          isVerified: vendor.isVerified,
          onboardingCompleted: vendor.onboardingCompleted,
          onboardingStep: vendor.onboardingStep,
          rating: vendor.rating,
          isActive: vendor.isActive,
          isSuspended: vendor.isSuspended
        };
      }
    } else if (user.role === "admin") {
      const admin = await Admin.findOne({ user: user._id });
      if (admin) {
        await admin.recordLogin();
        userData.admin = {
          id: admin._id,
          adminLevel: admin.adminLevel,
          department: admin.department,
          permissions: admin.permissions,
          isActive: admin.isActive
        };
      }
    }

    res.json({
      success: true,
      token,
      user: userData,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      profileImage: user.profileImage,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };

    // Populate role-specific data
    if (user.role === "customer") {
      const customer = await Customer.findOne({ user: user._id });
      if (customer) {
        userData.customer = customer;
      }
    } else if (user.role === "vendor") {
      const vendor = await Vendor.findOne({ user: user._id });
      if (vendor) {
        userData.vendor = vendor;
      }
    } else if (user.role === "admin") {
      const admin = await Admin.findOne({ user: user._id });
      if (admin) {
        await admin.updateActivity();
        userData.admin = admin;
      }
    }

    res.json({ success: true, user: userData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Profile
const updateProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
      runValidators: true,
    });

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
