const Product = require("../models/Product");
const Order = require("../models/Order");
const Vendor = require("../models/Vendor");
const asyncHandler = require("../middlewares/asyncHandler");
const mongoose = require("mongoose");

// ============ DASHBOARD ============

// Get vendor dashboard stats
exports.getDashboardStats = asyncHandler(async (req, res) => {
  const vendorId = req.user.id;

  // Total products
  const totalProducts = await Product.countDocuments({ vendor: vendorId });

  // Pending orders
  const pendingOrders = await Order.countDocuments({
    "items.vendor": vendorId,
    "items.status": "pending",
  });

  // Total revenue
  const revenue = await Order.aggregate([
    {
      $match: {
        "items.vendor": new mongoose.Types.ObjectId(vendorId),
        paymentStatus: "completed",
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$totalAmount" },
      },
    },
  ]);

  // Recent orders
  const recentOrders = await Order.find({
    "items.vendor": vendorId,
  })
    .populate("customer", "firstName lastName email")
    .populate("items.product", "name")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    success: true,
    stats: {
      totalProducts,
      pendingOrders,
      totalRevenue: revenue[0]?.total || 0,
      totalOrders: recentOrders.length,
    },
    recentOrders,
  });
});

// Get vendor profile with shop settings
exports.getVendorProfile = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.user.id).select("-password");

  if (!vendor) {
    return res.status(404).json({ success: false, message: "Vendor not found" });
  }

  res.json({
    success: true,
    vendor,
  });
});

// ============ PRODUCT MANAGEMENT ============

// Get vendor's products
exports.getVendorProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = "", category = "" } = req.query;
  const vendorId = req.user.id;

  let filter = { vendor: vendorId };

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(filter)
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
});

// Create new product
exports.createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, price, originalPrice, discount, stock, images, tags } = req.body;

  // Validation
  if (!name || !description || !category || !price || stock === undefined) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  const product = new Product({
    name,
    description,
    category,
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : Number(price),
    discount: discount || 0,
    stock: Number(stock),
    images: images || [],
    tags: tags || [],
    vendor: req.user.id,
  });

  await product.save();

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

// Get single product (vendor's own product only)
exports.getVendorProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const vendorId = req.user.id;

  const product = await Product.findOne({
    _id: productId,
    vendor: vendorId,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found or you don't have access",
    });
  }

  res.json({
    success: true,
    product,
  });
});

// Update product
exports.updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const vendorId = req.user.id;
  const updates = req.body;

  // Don't allow changing vendor
  delete updates.vendor;

  const product = await Product.findOneAndUpdate(
    { _id: productId, vendor: vendorId },
    updates,
    { returnDocument: 'after', runValidators: true }
  );

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found or you don't have access",
    });
  }

  res.json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

// Delete product
exports.deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const vendorId = req.user.id;

  const product = await Product.findOneAndDelete({
    _id: productId,
    vendor: vendorId,
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found or you don't have access",
    });
  }

  res.json({
    success: true,
    message: "Product deleted successfully",
  });
});

// ============ ORDER MANAGEMENT ============

// Get vendor's orders
exports.getVendorOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status = "", fromDate = "", toDate = "" } = req.query;
  const vendorId = req.user.id;

  let filter = { "items.vendor": vendorId };

  if (status && status !== "all") {
    filter["items.status"] = status;
  }

  if (fromDate || toDate) {
    filter.createdAt = {};
    if (fromDate) filter.createdAt.$gte = new Date(fromDate);
    if (toDate) filter.createdAt.$lte = new Date(toDate);
  }

  const skip = (page - 1) * limit;

  const orders = await Order.find(filter)
    .populate("customer", "firstName lastName email phone")
    .populate("items.product", "name price")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

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
});

// Update order item status
exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { itemIndex, status } = req.body;
  const vendorId = req.user.id;

  const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status",
    });
  }

  const order = await Order.findById(orderId);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Check if vendor owns this item
  if (!order.items[itemIndex].vendor.equals(vendorId)) {
    return res.status(403).json({
      success: false,
      message: "You don't have permission to update this order",
    });
  }

  order.items[itemIndex].status = status;
  await order.save();

  res.json({
    success: true,
    message: "Order status updated successfully",
    order,
  });
});

// Get order details
exports.getOrderDetails = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const vendorId = req.user.id;

  const order = await Order.findById(orderId)
    .populate("customer", "firstName lastName email phone")
    .populate("items.product");

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // Check if vendor has items in this order
  const hasVendorItems = order.items.some((item) =>
    item.vendor.equals(vendorId)
  );

  if (!hasVendorItems) {
    return res.status(403).json({
      success: false,
      message: "You don't have access to this order",
    });
  }

  res.json({
    success: true,
    order,
  });
});

// ============ SALES ANALYTICS ============

// Get sales analytics
exports.getSalesAnalytics = asyncHandler(async (req, res) => {
  const { period = "month" } = req.query;
  const vendorId = req.user.id;

  let groupBy, dateFilter;

  switch (period) {
    case "week":
      dateFilter = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      groupBy = { $dayOfWeek: "$createdAt" };
      break;
    case "year":
      dateFilter = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
      groupBy = { $month: "$createdAt" };
      break;
    default: // month
      dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      groupBy = { $dayOfMonth: "$createdAt" };
  }

  // Sales data over time
  const salesData = await Order.aggregate([
    {
      $match: {
        "items.vendor": new mongoose.Types.ObjectId(vendorId),
        createdAt: { $gte: dateFilter },
        paymentStatus: "completed",
      },
    },
    {
      $group: {
        _id: groupBy,
        totalSales: { $sum: "$totalAmount" },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top products
  const topProducts = await Order.aggregate([
    {
      $match: {
        "items.vendor": new mongoose.Types.ObjectId(vendorId),
        paymentStatus: "completed",
      },
    },
    { $unwind: "$items" },
    {
      $match: {
        "items.vendor": new mongoose.Types.ObjectId(vendorId),
      },
    },
    {
      $group: {
        _id: "$items.product",
        quantity: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product",
      },
    },
  ]);

  // Category breakdown
  const categoryBreakdown = await Order.aggregate([
    {
      $match: {
        "items.vendor": new mongoose.Types.ObjectId(vendorId),
        paymentStatus: "completed",
      },
    },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "products",
        localField: "items.product",
        foreignField: "_id",
        as: "productData",
      },
    },
    { $unwind: "$productData" },
    {
      $group: {
        _id: "$productData.category",
        sales: { $sum: "$items.quantity" },
        revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
      },
    },
  ]);

  res.json({
    success: true,
    salesData,
    topProducts,
    categoryBreakdown,
  });
});

// ============ SHOP SETTINGS ============

// Update shop settings
exports.updateShopSettings = asyncHandler(async (req, res) => {
  const { shopName, shopDescription, shopImage, phone } = req.body;

  const updates = {};
  if (shopName) updates.storeName = shopName;
  if (shopDescription) updates.storeDescription = shopDescription;
  if (shopImage) updates.storeLogo = shopImage;
  if (phone) updates.phone = phone;

  const vendor = await Vendor.findByIdAndUpdate(req.user.id, updates, {
    returnDocument: 'after',
    runValidators: true,
  }).select("-password");

  res.json({
    success: true,
    message: "Shop settings updated successfully",
    vendor,
  });
});

// Get shop settings
exports.getShopSettings = asyncHandler(async (req, res) => {
  const vendor = await Vendor.findById(req.user.id).select("-password");

  if (!vendor) {
    return res.status(404).json({ success: false, message: "Vendor not found" });
  }

  res.json({
    success: true,
    shop: {
      name: vendor.storeName || "",
      description: vendor.storeDescription || "",
      image: vendor.storeLogo || "",
      verified: vendor.isVerified || false,
    },
    contact: {
      phone: vendor.phone || "",
    },
  });
});
