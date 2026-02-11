const express = require("express");
const {
  createRazorpayOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
  handleWebhook,
} = require("../controllers/paymentController");
const { auth, adminAuth } = require("../middlewares/auth");

const router = express.Router();

// Create Razorpay order
router.post("/create-razorpay-order", auth, createRazorpayOrder);
router.post("/create-order", auth, createRazorpayOrder);

// Verify payment
router.post("/verify-razorpay", auth, verifyPayment);
router.post("/verify", auth, verifyPayment);

// Get payment details
router.get("/details/:paymentId", auth, getPaymentDetails);

// Refund payment (admin only)
router.post("/refund", adminAuth, refundPayment);

// Webhook endpoint (no auth required)
router.post("/webhook", handleWebhook);

module.exports = router;
