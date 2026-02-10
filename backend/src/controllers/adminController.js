const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    let filter = {};
    if (role) filter.role = role;

    const skip = (page - 1) * limit;

    const users = await User.find(filter)
      .select("-password")
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      users,
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

// Get dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await User.countDocuments({ isVendor: true });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalVendors,
        totalProducts,
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify vendor
const verifyVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await User.findByIdAndUpdate(
      vendorId,
      { "shop.verified": true },
      { new: true }
    );

    res.json({ success: true, message: "Vendor verified", vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;

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

// Deactivate product
const deactivateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      { isActive: false },
      { new: true }
    );

    res.json({ success: true, message: "Product deactivated", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  getDashboardStats,
  verifyVendor,
  getAllOrders,
  deactivateProduct,
};
