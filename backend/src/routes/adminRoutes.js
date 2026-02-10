const express = require("express");
const {
  getAllUsers,
  getDashboardStats,
  verifyVendor,
  getAllOrders,
  deactivateProduct,
} = require("../controllers/adminController");
const { auth, adminAuth } = require("../middlewares/auth");

const router = express.Router();

// All admin routes are protected with adminAuth
router.get("/stats", adminAuth, getDashboardStats);
router.get("/users", adminAuth, getAllUsers);
router.put("/verify-vendor/:vendorId", adminAuth, verifyVendor);
router.get("/orders", adminAuth, getAllOrders);
router.put("/deactivate-product/:productId", adminAuth, deactivateProduct);

module.exports = router;
