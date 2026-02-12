const express = require("express");
const {
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
} = require("../controllers/adminController");
const { auth, adminAuth } = require("../middlewares/auth");

const router = express.Router();

// ===================================
// ADMIN MANAGEMENT ROUTES (Super Admin Only)
// ===================================
router.post("/admins", adminAuth, createAdmin);
router.get("/admins", adminAuth, getAllAdmins);
router.put("/admins/:adminId", adminAuth, updateAdminPermissions);
router.delete("/admins/:adminId", adminAuth, deactivateAdmin);

// ===================================
// VENDOR MANAGEMENT ROUTES
// ===================================
router.get("/vendors", adminAuth, getAllVendors);
router.get("/vendors/:vendorId", adminAuth, getVendorDetails);
router.put("/vendors/:vendorId", adminAuth, updateVendor);
router.put("/vendors/:vendorId/verify", adminAuth, verifyVendor);
router.put("/vendors/:vendorId/reject", adminAuth, rejectVendor);
router.put("/vendors/:vendorId/suspend", adminAuth, suspendVendor);
router.put("/vendors/:vendorId/unsuspend", adminAuth, unsuspendVendor);
router.delete("/vendors/:vendorId", adminAuth, deleteVendor);

// ===================================
// CUSTOMER MANAGEMENT ROUTES
// ===================================
router.get("/customers", adminAuth, getAllCustomers);
router.get("/customers/:userId", adminAuth, getCustomerDetails);
router.put("/customers/:userId/suspend", adminAuth, suspendCustomer);
router.put("/customers/:userId/unsuspend", adminAuth, unsuspendCustomer);

// ===================================
// PRODUCT MANAGEMENT ROUTES
// ===================================
router.get("/products", adminAuth, getAllProducts);
router.delete("/products/:productId", adminAuth, deleteProduct);
router.put("/products/:productId/feature", adminAuth, featureProduct);

// ===================================
// DASHBOARD & ORDERS ROUTES
// ===================================
router.get("/dashboard/stats", adminAuth, getDashboardStats);
router.get("/analytics", adminAuth, getAnalytics);
router.get("/orders", adminAuth, getAllOrders);

module.exports = router;
