const User = require("../models/User");
const Admin = require("../models/Admin");
const Customer = require("../models/Customer");
const Vendor = require("../models/Vendor");
const Order = require("../models/Order");
const Product = require("../models/Product");

// ===================================
// ADMIN MANAGEMENT (Super Admin Only)
// ===================================

// Create new admin
const createAdmin = async (req, res) => {
  try {
    const { email, password, firstName, lastName, adminLevel, permissions } = req.body;

    // Check if requester is super admin
    const requestingAdmin = await Admin.findOne({ user: req.user.id });
    if (!requestingAdmin || requestingAdmin.adminLevel !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can create other admins" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create User account
    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: "admin",
      isEmailVerified: true,
      isActive: true
    });

    // Create Admin profile
    const admin = await Admin.create({
      user: user._id,
      adminLevel: adminLevel || "admin",
      addedBy: req.user.id,
      ...permissions // Spread permission flags
    });

    const populatedAdmin = await Admin.findById(admin._id).populate("user", "firstName lastName email");

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin: populatedAdmin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all admins
const getAllAdmins = async (req, res) => {
  try {
    const { page = 1, limit = 10, adminLevel } = req.query;

    // Only super admins can view all admins
    const requestingAdmin = await Admin.findOne({ user: req.user.id });
    if (!requestingAdmin || requestingAdmin.adminLevel !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can view all admins" });
    }

    let filter = {};
    if (adminLevel) filter.adminLevel = adminLevel;

    const skip = (page - 1) * limit;

    const admins = await Admin.find(filter)
      .populate("user", "firstName lastName email isActive lastLogin")
      .populate("addedBy", "firstName lastName email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Admin.countDocuments(filter);

    res.json({
      success: true,
      admins,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update admin permissions
const updateAdminPermissions = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { adminLevel, permissions } = req.body;

    // Only super admins can update permissions
    const requestingAdmin = await Admin.findOne({ user: req.user.id });
    if (!requestingAdmin || requestingAdmin.adminLevel !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can update permissions" });
    }

    const targetAdmin = await Admin.findById(adminId);
    if (!targetAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent super admin from downgrading themselves
    if (targetAdmin.user.toString() === req.user.id && adminLevel && adminLevel !== "super_admin") {
      return res.status(400).json({ message: "Cannot downgrade your own admin level" });
    }

    // Update admin
    if (adminLevel) targetAdmin.adminLevel = adminLevel;
    if (permissions) {
      Object.keys(permissions).forEach(key => {
        targetAdmin[key] = permissions[key];
      });
    }

    await targetAdmin.save();

    const updatedAdmin = await Admin.findById(adminId).populate("user", "firstName lastName email");

    res.json({
      success: true,
      message: "Admin permissions updated",
      admin: updatedAdmin
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Deactivate admin
const deactivateAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    // Only super admins can deactivate
    const requestingAdmin = await Admin.findOne({ user: req.user.id });
    if (!requestingAdmin || requestingAdmin.adminLevel !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can deactivate admins" });
    }

    const targetAdmin = await Admin.findById(adminId);
    if (!targetAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent deactivating self
    if (targetAdmin.user.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot deactivate your own account" });
    }

    // Deactivate the associated User account
    await User.findByIdAndUpdate(targetAdmin.user, { isActive: false });

    res.json({
      success: true,
      message: "Admin deactivated successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================================
// VENDOR MANAGEMENT
// ===================================

// Get all vendors
const getAllVendors = async (req, res) => {
  try {
    const { page = 1, limit = 10, verificationStatus, isActive } = req.query;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canManageVendors")) {
      return res.status(403).json({ message: "No permission to manage vendors" });
    }

    let filter = {};
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const skip = (page - 1) * limit;

    const vendors = await Vendor.find(filter)
      .populate("user", "firstName lastName email phone isActive")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Vendor.countDocuments(filter);

    res.json({
      success: true,
      vendors,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get vendor details
const getVendorDetails = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canManageVendors")) {
      return res.status(403).json({ message: "No permission to view vendor details" });
    }

    const vendor = await Vendor.findById(vendorId)
      .populate("user", "firstName lastName email phone isActive createdAt");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    res.json({
      success: true,
      vendor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify vendor
const verifyVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canVerifyVendors")) {
      return res.status(403).json({ message: "No permission to verify vendors" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.verificationStatus = "verified";
    vendor.verifiedAt = new Date();
    vendor.verifiedBy = req.user.id;
    await vendor.save();

    // Update admin stats
    admin.stats.vendorsVerified += 1;
    await admin.save();

    res.json({
      success: true,
      message: "Vendor verified successfully",
      vendor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reject vendor
const rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canVerifyVendors")) {
      return res.status(403).json({ message: "No permission to reject vendors" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.verificationStatus = "rejected";
    vendor.rejectionReason = reason;
    await vendor.save();

    res.json({
      success: true,
      message: "Vendor rejected",
      vendor
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suspend vendor
const suspendVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canSuspendVendors")) {
      return res.status(403).json({ message: "No permission to suspend vendors" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.isSuspended = true;
    vendor.suspensionReason = reason;
    vendor.suspendedAt = new Date();
    await vendor.save();

    // Also deactivate the User account
    await User.findByIdAndUpdate(vendor.user, { isActive: false });

    res.json({
      success: true,
      message: "Vendor suspended successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unsuspend vendor
const unsuspendVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canSuspendVendors")) {
      return res.status(403).json({ message: "No permission to unsuspend vendors" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.isSuspended = false;
    vendor.suspensionReason = undefined;
    vendor.suspendedAt = undefined;
    await vendor.save();

    // Reactivate the User account
    await User.findByIdAndUpdate(vendor.user, { isActive: true });

    res.json({
      success: true,
      message: "Vendor unsuspended successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete vendor
const deleteVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canDeleteVendors")) {
      return res.status(403).json({ message: "No permission to delete vendors" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Soft delete by deactivating User account
    await User.findByIdAndUpdate(vendor.user, { isActive: false });

    res.json({
      success: true,
      message: "Vendor deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================================
// CUSTOMER MANAGEMENT
// ===================================

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canManageUsers")) {
      return res.status(403).json({ message: "No permission to manage customers" });
    }

    let userFilter = { role: "customer" };
    if (search) {
      userFilter.$or = [
        { firstName: new RegExp(search, "i") },
        { lastName: new RegExp(search, "i") },
        { email: new RegExp(search, "i") }
      ];
    }

    const skip = (page - 1) * limit;

    const users = await User.find(userFilter)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const userIds = users.map(u => u._id);
    const customers = await Customer.find({ user: { $in: userIds } });

    const total = await User.countDocuments(userFilter);

    res.json({
      success: true,
      customers: users.map(user => {
        const customer = customers.find(c => c.user.toString() === user._id.toString());
        return {
          user,
          customer
        };
      }),
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer details
const getCustomerDetails = async (req, res) => {
  try {
    const { userId } = req.params;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canManageUsers")) {
      return res.status(403).json({ message: "No permission to view customer details" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const customer = await Customer.findOne({ user: userId });
    const recentOrders = await Order.find({ customer: userId })
      .limit(5)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      user,
      customer,
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Suspend customer
const suspendCustomer = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canSuspendUsers")) {
      return res.status(403).json({ message: "No permission to suspend customers" });
    }

    await User.findByIdAndUpdate(userId, { 
      isActive: false,
      suspensionReason: reason 
    });

    res.json({
      success: true,
      message: "Customer suspended successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unsuspend customer
const unsuspendCustomer = async (req, res) => {
  try {
    const { userId } = req.params;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canSuspendUsers")) {
      return res.status(403).json({ message: "No permission to unsuspend customers" });
    }

    await User.findByIdAndUpdate(userId, { 
      isActive: true,
      $unset: { suspensionReason: "" }
    });

    res.json({
      success: true,
      message: "Customer unsuspended successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================================
// PRODUCT MANAGEMENT
// ===================================

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category } = req.query;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canManageProducts")) {
      return res.status(403).json({ message: "No permission to manage products" });
    }

    let filter = {};
    if (search) {
      filter.$or = [
        { name: new RegExp(search, "i") },
        { description: new RegExp(search, "i") }
      ];
    }
    if (category) filter.category = category;

    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .populate("vendor", "firstName lastName email")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Product.countDocuments(filter);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canDeleteProducts")) {
      return res.status(403).json({ message: "No permission to delete products" });
    }

    await Product.findByIdAndDelete(productId);

    res.json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Feature product
const featureProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { featured } = req.body;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canFeatureProducts")) {
      return res.status(403).json({ message: "No permission to feature products" });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { isFeatured: featured },
      { new: true }
    );

    res.json({
      success: true,
      message: featured ? "Product featured" : "Product unfeatured",
      product
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ===================================
// DASHBOARD & ORDERS
// ===================================

// Get dashboard stats (permission-based visibility)
const getDashboardStats = async (req, res) => {
  try {
    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin) {
      return res.status(403).json({ message: "Admin profile not found" });
    }

    const stats = {};

    // Customer stats
    if (admin.hasPermission("canManageUsers")) {
      stats.totalCustomers = await User.countDocuments({ role: "customer" });
      stats.activeCustomers = await User.countDocuments({ role: "customer", isActive: true });
    }

    // Vendor stats
    if (admin.hasPermission("canManageVendors")) {
      stats.totalVendors = await Vendor.countDocuments();
      stats.verifiedVendors = await Vendor.countDocuments({ verificationStatus: "verified" });
      stats.pendingVendors = await Vendor.countDocuments({ verificationStatus: "pending" });
    }

    // Product stats
    if (admin.hasPermission("canManageProducts")) {
      stats.totalProducts = await Product.countDocuments();
      stats.activeProducts = await Product.countDocuments({ isActive: true });
    }

    // Order stats
    if (admin.hasPermission("canManageOrders")) {
      stats.totalOrders = await Order.countDocuments();
      stats.pendingOrders = await Order.countDocuments({ status: "pending" });
    }

    // Financial data (only for admins with this permission)
    if (admin.hasPermission("canViewFinancials")) {
      const totalRevenue = await Order.aggregate([
        { $match: { paymentStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]);
      stats.totalRevenue = totalRevenue[0]?.total || 0;
    }

    // Admin stats (super admin only)
    if (admin.adminLevel === "super_admin") {
      stats.totalAdmins = await Admin.countDocuments();
      stats.activeAdmins = await Admin.countDocuments({ "user.isActive": true });
    }

    res.json({
      success: true,
      stats,
      adminInfo: {
        level: admin.adminLevel,
        permissions: admin.toObject()
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;

    const admin = await Admin.findOne({ user: req.user.id });
    if (!admin || !admin.hasPermission("canManageOrders")) {
      return res.status(403).json({ message: "No permission to manage orders" });
    }

    let filter = {};
    if (status) filter.status = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    const skip = (page - 1) * limit;

    const orders = await Order.find(filter)
      .populate("customer", "firstName lastName email")
      .populate("items.product", "name")
      .populate("items.vendor", "firstName lastName")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Order.countDocuments(filter);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: Number(page),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  // Admin Management
  createAdmin,
  getAllAdmins,
  updateAdminPermissions,
  deactivateAdmin,
  
  // Vendor Management
  getAllVendors,
  getVendorDetails,
  verifyVendor,
  rejectVendor,
  suspendVendor,
  unsuspendVendor,
  deleteVendor,
  
  // Customer Management
  getAllCustomers,
  getCustomerDetails,
  suspendCustomer,
  unsuspendCustomer,
  
  // Product Management
  getAllProducts,
  deleteProduct,
  featureProduct,
  
  // Dashboard & Orders
  getDashboardStats,
  getAllOrders,
};
