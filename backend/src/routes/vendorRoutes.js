const express = require("express");
const {
  getDashboardStats,
  getVendorProfile,
  getVendorProducts,
  createProduct,
  getVendorProduct,
  updateProduct,
  deleteProduct,
  getVendorOrders,
  updateOrderStatus,
  getOrderDetails,
  getSalesAnalytics,
  updateShopSettings,
  getShopSettings,
} = require("../controllers/vendorController");
const { auth, vendorAuth } = require("../middlewares/auth");

const router = express.Router();

// All routes require vendor authentication
router.use(vendorAuth);

// Dashboard
router.get("/dashboard/stats", getDashboardStats);
router.get("/profile", getVendorProfile);

// Product Management
router.get("/products", getVendorProducts);
router.post("/products", createProduct);
router.get("/products/:productId", getVendorProduct);
router.put("/products/:productId", updateProduct);
router.delete("/products/:productId", deleteProduct);

// Order Management
router.get("/orders", getVendorOrders);
router.get("/orders/:orderId", getOrderDetails);
router.put("/orders/:orderId/status", updateOrderStatus);

// Sales Analytics
router.get("/analytics", getSalesAnalytics);

// Shop Settings
router.get("/settings", getShopSettings);
router.put("/settings", updateShopSettings);

module.exports = router;
