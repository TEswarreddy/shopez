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
router.get("/stats", auth, adminAuth, getDashboardStats);
router.get("/users", auth, adminAuth, getAllUsers);
router.put("/verify-vendor/:vendorId", auth, adminAuth, verifyVendor);
router.get("/orders", auth, adminAuth, getAllOrders);
router.put("/deactivate-product/:productId", auth, adminAuth, deactivateProduct);

module.exports = router;
