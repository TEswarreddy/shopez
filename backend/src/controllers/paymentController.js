const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");
const Payment = require("../models/Payment");

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, items, shippingAddress } = req.body;

    console.log("🔍 RAZORPAY ORDER CREATION START");
    console.log("Raw amount received:", amount, typeof amount);
    console.log("Currency:", currency);
    console.log("Items count:", items?.length);

    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Valid amount is required and must be greater than 0"
      });
    }

    // Amount in paise (smallest currency unit)
    // Convert to integer to avoid decimal places
    const amountInPaise = Math.round(parseFloat(amount) * 100);

    console.log("Amount in paise:", amountInPaise);

    if (amountInPaise <= 0) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid amount after conversion to paise"
      });
    }

    const options = {
      amount: amountInPaise,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1, // Auto capture payment
    };

    console.log("📦 Razorpay options:", JSON.stringify(options));

    const razorpayOrder = await razorpay.orders.create(options);

    console.log("✅ Razorpay order created successfully");
    console.log("Order ID:", razorpayOrder.id);
    console.log("Order amount:", razorpayOrder.amount);
    console.log("Order status:", razorpayOrder.status);

    res.status(201).json({
      success: true,
      razorpayOrderId: razorpayOrder.id,
      key: process.env.RAZORPAY_KEY_ID,
      amount: amount,
      currency: currency,
      message: "Order created successfully"
    });
  } catch (error) {
    console.error("❌ Razorpay order creation error:", error.message);
    console.error("Error code:", error.code);
    console.error("Error details:", error.error?.description || error.error);
    
    res.status(500).json({ 
      success: false,
      message: "Failed to create Razorpay order",
      error: error.message,
      code: error.code
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

    console.log("=== RAZORPAY PAYMENT VERIFICATION START ===");
    console.log("Order ID:", razorpay_order_id);
    console.log("Payment ID:", razorpay_payment_id);

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

    console.log("Expected signature:", generated_signature?.substring(0, 20) + "...");
    console.log("Received signature:", razorpay_signature?.substring(0, 20) + "...");
    console.log("Signatures match:", generated_signature === razorpay_signature);

    // Verify signature
    if (generated_signature === razorpay_signature) {
      console.log("✅ Signature verified successfully");
      
      // Payment is verified, update order
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = "completed";
          order.transactionId = razorpay_payment_id;
          order.razorpayOrderId = razorpay_order_id;
          order.status = "confirmed";
          await order.save();
          
          // Record payment in Payment model
          const vendorId = order.items[0]?.vendor;
          const payment = await Payment.create({
            transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            razorpayPaymentId: razorpay_payment_id,
            orderRef: orderId,
            customer: order.customer,
            vendor: vendorId,
            paymentMethod: "razorpay",
            orderAmount: order.totalAmount,
            totalAmount: order.totalAmount,
            commissionPercentage: 10,
            status: "completed",
            paymentGatewayResponse: {
              razorpayOrderId: razorpay_order_id,
              razorpaySignature: razorpay_signature,
            },
          });
          
          console.log("✅ Payment recorded successfully:", payment.transactionId);
          console.log("Order updated with payment confirmation");
        }
      }

      console.log("=== RAZORPAY PAYMENT VERIFICATION END ===");

      res.json({
        success: true,
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id,
      });
    } else {
      // Signature doesn't match
      console.error("Signature verification failed");
      
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
    console.error("Payment verification error:", error.message);
    console.error("Error stack:", error.stack);
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
    
    // Update payment record
    const payment = await Payment.findOne({ razorpayPaymentId: paymentId });
    if (payment) {
      payment.refundAmount = amount || payment.totalAmount;
      payment.status = amount && amount < payment.totalAmount ? "partially_refunded" : "refunded";
      payment.refundedAt = new Date();
      await payment.save();
      console.log("✅ Payment record updated for refund");
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
