// Simple test endpoint to verify Razorpay connection
const express = require("express")
const Razorpay = require("razorpay")
require("dotenv").config()

const router = express.Router()

console.log("🔍 Razorpay Test Endpoint Initialized")
console.log("API Key:", process.env.RAZORPAY_KEY_ID ? "✅ SET" : "❌ NOT SET")
console.log("API Secret:", process.env.RAZORPAY_KEY_SECRET ? "✅ SET" : "❌ NOT SET")

// Test Razorpay connection
router.get("/test-razorpay", async (req, res) => {
  try {
    console.log("\n🧪 Testing Razorpay Connection...")

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })

    console.log("✅ Razorpay instance created")

    // Try to create a test order
    const testOrder = await razorpay.orders.create({
      amount: 10000, // 100 INR
      currency: "INR",
      receipt: `test_${Date.now()}`,
    })

    console.log("✅ Test order created successfully")
    console.log("Order ID:", testOrder.id)
    console.log("Amount:", testOrder.amount)
    console.log("Status:", testOrder.status)

    res.json({
      success: true,
      message: "Razorpay connection working",
      order: testOrder,
      keyId: process.env.RAZORPAY_KEY_ID,
    })
  } catch (error) {
    console.error("❌ Razorpay Test Failed")
    console.error("Error:", error.message)
    console.error("Code:", error.code)
    console.error("Status Code:", error.statusCode)
    console.error("Description:", error.description)

    res.status(500).json({
      success: false,
      message: "Razorpay connection failed",
      error: error.message,
      code: error.code,
    })
  }
})

module.exports = router
