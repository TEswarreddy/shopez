const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const Customer = require("../models/Customer");
const Vendor = require("../models/Vendor");
const Admin = require("../models/Admin");
const Product = require("../models/Product");
const Order = require("../models/Order");
const { auth, authorize } = require("../middlewares/auth");
require("dotenv").config();

console.log("🔍 Test Routes Initialized");
console.log("Razorpay API Key:", process.env.RAZORPAY_KEY_ID ? "✅ SET" : "❌ NOT SET");
console.log("Razorpay API Secret:", process.env.RAZORPAY_KEY_SECRET ? "✅ SET" : "❌ NOT SET");

// ============================================
// 🔓 AUTHENTICATION TESTS (No auth required)
// ============================================

/**
 * Login Test - works for any user type
 * POST /api/test/login
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    let user = await Customer.findOne({ email }).select("+password");
    let userType = "customer";

    if (!user) {
      user = await Vendor.findOne({ email }).select("+password");
      userType = "vendor";
    }

    if (!user) {
      user = await Admin.findOne({ email }).select("+password");
      userType = "admin";
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        role: user.role,
        adminLevel: user.adminLevel,
        userType: userType,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: `${userType} logged in successfully`,
      token,
      user: {
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        userType: userType,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get all test users info for reference
 * GET /api/test/users
 */
router.get("/users", async (req, res) => {
  try {
    const [customers, vendors, admins] = await Promise.all([
      Customer.find({}, { password: 0 }).limit(5),
      Vendor.find({}, { password: 0 }).limit(5),
      Admin.find({}, { password: 0 }).limit(5),
    ]);

    res.status(200).json({
      success: true,
      data: {
        customers: customers.length,
        vendors: vendors.length,
        admins: admins.length,
        customersList: customers,
        vendorsList: vendors,
        adminsList: admins,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// 👥 CUSTOMER TESTS
// ============================================

/**
 * Get customer profile - requires customer auth
 * GET /api/test/customer/profile
 */
router.get("/customer/profile", auth, authorize("customer"), async (req, res) => {
  try {
    const customer = await Customer.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: customer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get customer orders
 * GET /api/test/customer/orders
 */
router.get("/customer/orders", auth, authorize("customer"), async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id })
      .populate("items.product")
      .populate("items.vendor", "storeName");

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Update customer profile
 * PUT /api/test/customer/profile
 */
router.put("/customer/profile", auth, authorize("customer"), async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;

    const updated = await Customer.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, phone },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// 🏪 VENDOR TESTS
// ============================================

/**
 * Get vendor profile - requires vendor auth
 * GET /api/test/vendor/profile
 */
router.get("/vendor/profile", auth, authorize("vendor"), async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user._id);
    res.status(200).json({
      success: true,
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get vendor products
 * GET /api/test/vendor/products
 */
router.get("/vendor/products", auth, authorize("vendor"), async (req, res) => {
  try {
    const products = await Product.find({ vendor: req.user._id });

    res.status(200).json({
      success: true,
      totalProducts: products.length,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get vendor orders/sales
 * GET /api/test/vendor/orders
 */
router.get("/vendor/orders", auth, authorize("vendor"), async (req, res) => {
  try {
    const orders = await Order.find({ "items.vendor": req.user._id })
      .populate("customer", "firstName lastName email")
      .populate("items.product", "name price");

    res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Update vendor store info
 * PUT /api/test/vendor/profile
 */
router.put("/vendor/profile", auth, authorize("vendor"), async (req, res) => {
  try {
    const { storeName, storeDescription, businessType } = req.body;

    const updated = await Vendor.findByIdAndUpdate(
      req.user._id,
      { storeName, storeDescription, businessType },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Store info updated successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// 👨‍💼 ADMIN TESTS
// ============================================

/**
 * Get admin dashboard stats - requires admin auth
 * GET /api/test/admin/dashboard
 */
router.get("/admin/dashboard", auth, authorize("admin", "super_admin"), async (req, res) => {
  try {
    const [totalCustomers, totalVendors, totalProducts, totalOrders, totalAdmins] = await Promise.all([
      Customer.countDocuments(),
      Vendor.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Admin.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      dashboard: {
        totalCustomers,
        totalVendors,
        totalProducts,
        totalOrders,
        totalAdmins,
        adminLevel: req.user.adminLevel,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get all customers
 * GET /api/test/admin/customers
 */
router.get("/admin/customers", auth, authorize("admin", "super_admin"), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [customers, total] = await Promise.all([
      Customer.find({}, { password: 0 })
        .skip(skip)
        .limit(parseInt(limit)),
      Customer.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      customers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get all vendors
 * GET /api/test/admin/vendors
 */
router.get("/admin/vendors", auth, authorize("admin", "super_admin"), async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const [vendors, total] = await Promise.all([
      Vendor.find({}, { password: 0 })
        .skip(skip)
        .limit(parseInt(limit)),
      Vendor.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      vendors,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Get system statistics
 * GET /api/test/admin/stats
 */
router.get("/admin/stats", auth, authorize("admin", "super_admin"), async (req, res) => {
  try {
    const stats = {
      users: {
        customers: await Customer.countDocuments({ isActive: true }),
        vendors: await Vendor.countDocuments({ isActive: true }),
        admins: await Admin.countDocuments({ isActive: true }),
      },
      status: {
        activeCustomers: await Customer.countDocuments({ isActive: true }),
        suspendedCustomers: await Customer.countDocuments({ isActive: false }),
        verifiedVendors: await Vendor.countDocuments({ isVerified: true }),
        unverifiedVendors: await Vendor.countDocuments({ isVerified: false }),
      },
      orders: {
        total: await Order.countDocuments(),
        pending: await Order.countDocuments({ status: "pending" }),
        completed: await Order.countDocuments({ status: "delivered" }),
      },
      products: {
        total: await Product.countDocuments(),
      },
    };

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Suspend a customer
 * PUT /api/test/admin/customer/:customerId/suspend
 */
router.put(
  "/admin/customer/:customerId/suspend",
  auth,
  authorize("admin", "super_admin"),
  async (req, res) => {
    try {
      const result = await Customer.findByIdAndUpdate(
        req.params.customerId,
        { isActive: false },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Customer suspended successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

/**
 * Verify a vendor
 * PUT /api/test/admin/vendor/:vendorId/verify
 */
router.put(
  "/admin/vendor/:vendorId/verify",
  auth,
  authorize("admin", "super_admin"),
  async (req, res) => {
    try {
      const result = await Vendor.findByIdAndUpdate(
        req.params.vendorId,
        {
          isVerified: true,
          verificationStatus: "approved",
        },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Vendor verified successfully",
        data: result,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ============================================
// 🔐 SUPER ADMIN TESTS
// ============================================

/**
 * Get all admins (super admin only)
 * GET /api/test/superadmin/admins
 */
router.get("/superadmin/admins", auth, authorize("super_admin"), async (req, res) => {
  try {
    const admins = await Admin.find({}, { password: 0 });

    res.status(200).json({
      success: true,
      total: admins.length,
      admins,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * Update admin permissions (super admin only)
 * PUT /api/test/superadmin/admin/:adminId/permissions
 */
router.put(
  "/superadmin/admin/:adminId/permissions",
  auth,
  authorize("super_admin"),
  async (req, res) => {
    try {
      const { permissions } = req.body;

      const updated = await Admin.findByIdAndUpdate(
        req.params.adminId,
        { permissions },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: "Admin permissions updated",
        data: updated,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
);

// ============================================
// 🔑 CURRENT USER INFO
// ============================================

/**
 * Get current logged-in user info
 * GET /api/test/me
 */
router.get("/me", auth, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============================================
// 🧪 RAZORPAY TEST (kept from original)
// ============================================

// Test Razorpay connection
router.get("/test-razorpay", async (req, res) => {
  try {
    console.log("\n🧪 Testing Razorpay Connection...")

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    console.log("✅ Razorpay instance created")

    // Try to create a test order
    const testOrder = await razorpay.orders.create({
      amount: 10000, // 100 INR
      currency: "INR",
      receipt: `test_${Date.now()}`,
    })

    console.log("✅ Test order created successfully")
    console.log("Order ID:", testOrder.id)
    console.log("Amount:", testOrder.amount)
    console.log("Status:", testOrder.status)

    res.json({
      success: true,
      message: "Razorpay connection working",
      order: testOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("❌ Razorpay Test Failed")
    console.error("Error:", error.message)
    console.error("Code:", error.code)
    console.error("Status Code:", error.statusCode)
    console.error("Description:", error.description)

    res.status(500).json({
      success: false,
      message: "Razorpay connection failed",
      error: error.message,
      code: error.code,
    })
  }
})

module.exports = router
