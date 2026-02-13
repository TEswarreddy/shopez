const express = require("express");
const router = express.Router();
const {
  getAdminRevenueDashboard,
  getRevenueTrend,
  getPaymentReconciliation,
  markPaymentReconciled,
  getVendorRevenueDashboard,
  getVendorRevenueBreakdown,
  getVendorTransactionHistory,
  getPaymentDetails,
  recordPayment,
  processRefund,
} = require("../controllers/analyticsController");
const { auth, authorize } = require("../middlewares/auth");

// Admin routes
router.get(
  "/admin/revenue-dashboard",
  auth,
  authorize("admin", "super_admin"),
  getAdminRevenueDashboard
);

router.get(
  "/admin/revenue-trend",
  auth,
  authorize("admin", "super_admin"),
  getRevenueTrend
);

router.get(
  "/admin/reconciliation",
  auth,
  authorize("admin", "super_admin"),
  getPaymentReconciliation
);

router.post(
  "/admin/reconciliation/mark",
  auth,
  authorize("admin", "super_admin"),
  markPaymentReconciled
);

router.post(
  "/admin/refund",
  auth,
  authorize("admin", "super_admin"),
  processRefund
);

// Vendor routes
router.get(
  "/vendor/revenue-dashboard",
  auth,
  authorize("vendor"),
  getVendorRevenueDashboard
);

router.get(
  "/vendor/revenue-breakdown",
  auth,
  authorize("vendor"),
  getVendorRevenueBreakdown
);

router.get(
  "/vendor/transactions",
  auth,
  authorize("vendor"),
  getVendorTransactionHistory
);

// Public routes (protected by auth)
router.get(
  "/payment/:transactionId",
  auth,
  getPaymentDetails
);

router.post(
  "/record",
  auth,
  recordPayment
);

module.exports = router;
