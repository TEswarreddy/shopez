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
    const requestingAdmin = await Admin.findById(req.user.id);
    if (!requestingAdmin || requestingAdmin.adminLevel !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can create other admins" });
    }

    // Check if user already exists
    const [existingCustomer, existingVendor, existingAdmin] = await Promise.all([
      Customer.findOne({ email }),
      Vendor.findOne({ email }),
      Admin.findOne({ email }),
    ]);
    if (existingCustomer || existingVendor || existingAdmin) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const admin = await Admin.create({
      email,
      password,
      firstName,
      lastName,
      role: "admin",
      adminLevel: adminLevel || "admin",
      permissions: permissions || {},
      addedBy: req.user.id,
      isEmailVerified: true,
      isActive: true,
    });

    const populatedAdmin = await Admin.findById(admin._id).select("-password");

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

    console.log('getAllAdmins called by user:', req.user);

    // Check if user ID exists
    if (!req.user || !req.user.id) {
      console.error('❌ No user ID in request');
      return res.status(401).json({ 
        success: false,
        message: "User authentication failed. Please log in again." 
      });
    }

    // Only super admins can view all admins
    const requestingAdmin = await Admin.findById(req.user.id);
    
    console.log('Requesting admin:', requestingAdmin);
    
    if (!requestingAdmin) {
      console.error('❌ No Admin document found for user:', req.user.id);
      return res.status(403).json({ 
        success: false,
        message: "Admin profile not found. Please contact the system administrator." 
      });
    }
    
    if (requestingAdmin.adminLevel !== "super_admin") {
      console.warn('⚠️  Access denied - user is not super admin:', requestingAdmin.adminLevel);
      return res.status(403).json({ 
        success: false,
        message: "Only super admins can view all admins" 
      });
    }

    let filter = {};
    if (adminLevel) filter.adminLevel = adminLevel;

    const skip = (page - 1) * limit;

    const admins = await Admin.find(filter)
      .select("-password")
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
    console.error('❌ Error in getAllAdmins:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Update admin permissions
const updateAdminPermissions = async (req, res) => {
  try {
    const { adminId } = req.params;
    const { adminLevel, permissions } = req.body;

    // Only super admins can update permissions
    const requestingAdmin = await Admin.findById(req.user.id);
    if (!requestingAdmin || requestingAdmin.adminLevel !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can update permissions" });
    }

    const targetAdmin = await Admin.findById(adminId);
    if (!targetAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent super admin from downgrading themselves
    if (targetAdmin._id.toString() === req.user.id && adminLevel && adminLevel !== "super_admin") {
      return res.status(400).json({ message: "Cannot downgrade your own admin level" });
    }

    // Update admin
    if (adminLevel) targetAdmin.adminLevel = adminLevel;
    if (permissions) {
      Object.keys(permissions).forEach(key => {
        targetAdmin.permissions[key] = permissions[key];
      });
    }

    await targetAdmin.save();

    const updatedAdmin = await Admin.findById(adminId).select("-password");

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
    const requestingAdmin = await Admin.findById(req.user.id);
    if (!requestingAdmin || requestingAdmin.adminLevel !== "super_admin") {
      return res.status(403).json({ message: "Only super admins can deactivate admins" });
    }

    const targetAdmin = await Admin.findById(adminId);
    if (!targetAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Prevent deactivating self
    if (targetAdmin._id.toString() === req.user.id) {
      return res.status(400).json({ message: "Cannot deactivate your own account" });
    }

    targetAdmin.isActive = false;
    await targetAdmin.save();

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

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.hasPermission("canManageVendors")) {
      return res.status(403).json({ message: "No permission to manage vendors" });
    }

    let filter = {};
    if (verificationStatus) filter.verificationStatus = verificationStatus;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const skip = (page - 1) * limit;

    const vendors = await Vendor.find(filter)
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

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.hasPermission("canManageVendors")) {
      return res.status(403).json({ message: "No permission to view vendor details" });
    }

    const vendor = await Vendor.findById(vendorId);

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

    const admin = await Admin.findById(req.user.id);
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

// Update vendor details
const updateVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.hasPermission("canManageVendors")) {
      return res.status(403).json({ message: "No permission to update vendors" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Allowed fields for admin to update
    const allowedUpdates = [
      "businessName",
      "businessType",
      "businessDescription",
      "businessCategory",
      "businessEmail",
      "businessPhone",
      "alternatePhone",
      "businessAddress",
      "pickupAddress",
      "gstNumber",
      "storeName",
      "storeDescription",
      "commission",
      "commissionRate",
    ];

    // Update only allowed fields
    Object.keys(req.body).forEach((key) => {
      if (!allowedUpdates.includes(key)) {
        return;
      }
      if (key === "commission") {
        vendor.commissionRate = req.body[key];
        return;
      }
      vendor[key] = req.body[key];
    });

    await vendor.save();

    const updatedVendor = await Vendor.findById(vendorId);

    res.json({
      success: true,
      message: "Vendor updated successfully",
      vendor: updatedVendor
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

    const admin = await Admin.findById(req.user.id);
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

    const admin = await Admin.findById(req.user.id);
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
    vendor.isActive = false;
    await vendor.save();

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

    const admin = await Admin.findById(req.user.id);
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
    vendor.isActive = true;
    await vendor.save();

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

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.hasPermission("canDeleteVendors")) {
      return res.status(403).json({ message: "No permission to delete vendors" });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    vendor.isActive = false;
    await vendor.save();

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

    const admin = await Admin.findById(req.user.id);
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

    const customers = await Customer.find(userFilter)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Customer.countDocuments(userFilter);

    res.json({
      success: true,
      customers,
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

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.hasPermission("canManageUsers")) {
      return res.status(403).json({ message: "No permission to view customer details" });
    }

    const customer = await Customer.findById(userId).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const recentOrders = await Order.find({ customer: userId })
      .limit(5)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
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

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.hasPermission("canSuspendUsers")) {
      return res.status(403).json({ message: "No permission to suspend customers" });
    }

    await Customer.findByIdAndUpdate(userId, { 
      isActive: false,
      suspensionReason: reason,
      suspendedAt: new Date(),
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

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.hasPermission("canSuspendUsers")) {
      return res.status(403).json({ message: "No permission to unsuspend customers" });
    }

    await Customer.findByIdAndUpdate(userId, { 
      isActive: true,
      $unset: { suspensionReason: "", suspendedAt: "" }
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

    const admin = await Admin.findById(req.user.id);
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

    const admin = await Admin.findById(req.user.id);
    if (!admin || !admin.hasPermission("canFeatureProducts")) {
      return res.status(403).json({ message: "No permission to feature products" });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { isFeatured: featured },
      { returnDocument: 'after' }
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
    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({ message: "Admin profile not found" });
    }

    const stats = {};

    // Customer stats
    if (admin.hasPermission("canManageUsers")) {
      stats.totalCustomers = await Customer.countDocuments();
      stats.activeCustomers = await Customer.countDocuments({ isActive: true });
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
      stats.activeAdmins = await Admin.countDocuments({ isActive: true });
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

    const admin = await Admin.findById(req.user.id);
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

// Get analytics data
const getAnalytics = async (req, res) => {
  try {
    const { range = "monthly" } = req.query;

    const admin = await Admin.findById(req.user.id);
    if (!admin) {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Calculate date range
    const now = new Date();
    let startDate = new Date();
    let groupBy;
    let labelFormat;

    switch (range) {
      case "daily":
        startDate.setDate(now.getDate() - 7);
        groupBy = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
        labelFormat = (date) => new Date(date).toLocaleDateString("en-US", { weekday: "short" });
        break;
      case "weekly":
        startDate.setDate(now.getDate() - 28);
        groupBy = { $week: "$createdAt" };
        labelFormat = (week) => `Week ${week}`;
        break;
      case "yearly":
        startDate.setFullYear(now.getFullYear() - 2);
        groupBy = { $year: "$createdAt" };
        labelFormat = (year) => year.toString();
        break;
      case "monthly":
      default:
        startDate.setMonth(now.getMonth() - 12);
        groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };
        labelFormat = (date) => new Date(date + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" });
        break;
    }

    // Revenue trend
    const revenueTrend = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: "completed",
          createdAt: { $gte: startDate }
        } 
      },
      {
        $group: {
          _id: groupBy,
          value: { $sum: "$totalAmount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // User growth trend - Show cumulative user counts
    const userGrowthTrend = await Customer.aggregate([
      {
        $facet: {
          allUsers: [
            { $match: { createdAt: { $gte: startDate } } },
            {
              $group: {
                _id: groupBy,
                value: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ],
          totalBefore: [
            { $match: { createdAt: { $lt: startDate } } },
            { $count: "count" }
          ]
        }
      },
      {
        $project: {
          userGrowth: {
            $let: {
              vars: {
                baseCount: { $ifNull: [{ $arrayElemAt: ["$totalBefore.count", 0] }, 0] }
              },
              in: {
                $map: {
                  input: "$allUsers",
                  as: "item",
                  in: {
                    _id: "$$item._id",
                    value: "$$item.value"
                  }
                }
              }
            }
          }
        }
      },
      { $unwind: "$userGrowth" },
      { $replaceRoot: { newRoot: "$userGrowth" } }
    ]);

    // Order status breakdown
    const orderStatusBreakdown = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Top products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          unitsSold: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          _id: 1,
          name: "$productInfo.name",
          unitsSold: 1,
          revenue: 1
        }
      }
    ]);

    // Top vendors
    const topVendors = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.vendor",
          totalOrders: { $sum: 1 },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $match: { _id: { $ne: null } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "vendors",
          localField: "_id",
          foreignField: "_id",
          as: "vendorInfo"
        }
      },
      { $unwind: { path: "$vendorInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          businessName: { 
            $ifNull: [
              "$vendorInfo.businessName",
              "$vendorInfo.storeName"
            ]
          },
          totalOrders: 1,
          revenue: 1
        }
      }
    ]);

    // Category distribution
    const categoryDistribution = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 6 },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0
        }
      }
    ]);

    // Calculate totals and growth
    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const totalOrders = await Order.countDocuments();
    const totalUsers = await Customer.countDocuments();
    const totalVendors = await Vendor.countDocuments({ verificationStatus: "verified" });

    // Calculate growth percentages (comparing to previous period)
    const previousPeriodStart = new Date(startDate);
    previousPeriodStart.setTime(startDate.getTime() - (now.getTime() - startDate.getTime()));

    const previousRevenue = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: "completed",
          createdAt: { $gte: previousPeriodStart, $lt: startDate }
        } 
      },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const previousOrders = await Order.countDocuments({
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    });

    const previousUsers = await Customer.countDocuments({
      createdAt: { $gte: previousPeriodStart, $lt: startDate }
    });

    const currentRevenue = totalRevenue[0]?.total || 0;
    const prevRevenue = previousRevenue[0]?.total || 1;
    const revenueGrowth = ((currentRevenue - prevRevenue) / prevRevenue) * 100;

    const currentOrders = await Order.countDocuments({
      createdAt: { $gte: startDate }
    });
    const orderGrowth = previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders) * 100 : 0;

    const currentUsers = await Customer.countDocuments({
      createdAt: { $gte: startDate }
    });
    const userGrowth = previousUsers > 0 ? ((currentUsers - previousUsers) / previousUsers) * 100 : 0;

    console.log('Analytics generated:', {
      revenueTrendPoints: revenueTrend.length,
      userGrowthTrendPoints: userGrowthTrend.length,
      topProductsCount: topProducts.length,
      topVendorsCount: topVendors.length,
      totalUsers,
      totalVendors,
      vendorData: topVendors.map(v => ({ id: v._id, name: v.businessName, orders: v.totalOrders }))
    });

    res.json({
      success: true,
      analytics: {
        revenueTrend: revenueTrend.map(item => ({
          label: labelFormat(item._id),
          value: item.value
        })),
        userGrowthTrend: userGrowthTrend.map(item => ({
          label: labelFormat(item._id),
          value: item.value
        })),
        orderStatusBreakdown: orderStatusBreakdown.map(item => ({
          name: item._id,
          count: item.count
        })),
        topProducts,
        topVendors,
        categoryDistribution,
        totalRevenue: currentRevenue,
        totalOrders,
        totalUsers,
        totalVendors,
        revenueGrowth: isFinite(revenueGrowth) ? revenueGrowth : 0,
        orderGrowth: isFinite(orderGrowth) ? orderGrowth : 0,
        userGrowth: isFinite(userGrowth) ? userGrowth : 0,
      }
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
  updateVendor,
  
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
  getAnalytics,
};
