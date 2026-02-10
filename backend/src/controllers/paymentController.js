const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Amount in paise (smallest currency unit)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(201).json({
      success: true,
      order: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay order creation error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message 
    });
  }
};

// Verify Razorpay payment signature
const verifyPayment = async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      orderId 
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false,
        message: "Missing payment verification details" 
      });
    }

    // Generate signature
    const text = razorpay_order_id + "|" + razorpay_payment_id;
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    // Verify signature
    if (generated_signature === razorpay_signature) {
      // Payment is verified, update order
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "completed";
          order.transactionId = razorpay_payment_id;
          order.status = "confirmed";
          await order.save();
        }
      }

      res.json({
        success: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
      });
    } else {
      // Signature doesn't match
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "failed";
          await order.save();
        }
      }

      res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    res.status(500).json({ 
      success: false,
      message: "Payment verification failed",
      error: error.message 
    });
  }
};

// Get payment details
const getPaymentDetails = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await razorpay.payments.fetch(paymentId);

    res.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Fetch payment error:", error);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch payment details",
      error: error.message 
    });
  }
};

// Refund payment
const refundPayment = async (req, res) => {
  try {
    const { paymentId, amount } = req.body;

    if (!paymentId) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    const refundOptions = amount ? { amount: amount * 100 } : {};

    const refund = await razorpay.payments.refund(paymentId, refundOptions);

    // Update order status
    const order = await Order.findOne({ transactionId: paymentId });
    if (order) {
      order.paymentStatus = "refunded";
      await order.save();
    }

    res.json({
      success: true,
      message: "Refund processed successfully",
      refund,
    });
  } catch (error) {
    console.error("Refund error:", error);
    res.status(500).json({ 
      success: false,
      message: "Refund processing failed",
      error: error.message 
    });
  }
};

// Webhook handler for Razorpay events
const handleWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (secret) {
      const shasum = crypto.createHmac("sha256", secret);
      shasum.update(JSON.stringify(req.body));
      const digest = shasum.digest("hex");

      if (digest !== req.headers["x-razorpay-signature"]) {
        return res.status(400).json({ message: "Invalid signature" });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload.payment.entity;

    switch (event) {
      case "payment.captured":
        // Payment was captured successfully
        console.log("Payment captured:", payload.id);
        break;

      case "payment.failed":
        // Payment failed
        console.log("Payment failed:", payload.id);
        const failedOrder = await Order.findOne({ 
          transactionId: payload.order_id 
        });
        if (failedOrder) {
          failedOrder.paymentStatus = "failed";
          await failedOrder.save();
        }
        break;

      case "refund.created":
        // Refund was created
        console.log("Refund created:", payload.id);
        break;

      default:
        console.log("Unhandled event:", event);
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).json({ 
      success: false,
      message: "Webhook processing failed" 
    });
  }
};

module.exports = {
  createRazorpayOrder,
  verifyPayment,
  getPaymentDetails,
  refundPayment,
  handleWebhook,
};
