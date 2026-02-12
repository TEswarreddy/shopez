// Simple test endpoint to verify Razorpay connection
const express = require("express")
const Razorpay = require("razorpay")
const Admin = require("../models/Admin")
require("dotenv").config()

const router = express.Router()

console.log("🔍 Test Routes Initialized")
console.log("Razorpay API Key:", process.env.RAZORPAY_KEY_ID ? "✅ SET" : "❌ NOT SET")
console.log("Razorpay API Secret:", process.env.RAZORPAY_KEY_SECRET ? "✅ SET" : "❌ NOT SET")

// Create super admin endpoint (for testing only)
router.post("/create-admin", async (req, res) => {
  try {
    console.log("\n🔐 Creating super admin...")

    // Check if already exists
    let adminAccount = await Admin.findOne({ email: 'superadmin@shopez.com' })
    if (adminAccount) {
      if (adminAccount.adminLevel === "super_admin") {
        return res.json({
          success: true,
          message: "Super admin already exists",
          email: "superadmin@shopez.com"
        })
      }
    }

    adminAccount = await Admin.create({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@shopez.com',
      password: 'admin123',
      role: 'admin',
      adminLevel: 'super_admin',
      department: 'management',
      employeeId: 'SA001',
      permissions: {
        canManageUsers: true,
        canDeleteUsers: true,
        canSuspendUsers: true,
        canManageVendors: true,
        canVerifyVendors: true,
        canSuspendVendors: true,
        canDeleteVendors: true,
        canManageProducts: true,
        canDeleteProducts: true,
        canFeatureProducts: true,
        canManageOrders: true,
        canRefundOrders: true,
        canCancelOrders: true,
        canManageCategories: true,
        canManageBanners: true,
        canManagePromotions: true,
        canViewFinancials: true,
        canProcessPayouts: true,
        canManageCommissions: true,
        canManageSettings: true,
        canViewLogs: true,
        canManageAdmins: true,
      },
      isEmailVerified: true,
      isActive: true,
    })
    console.log('✅ Admin account created')

    res.json({
      success: true,
      message: "Super admin created successfully",
      data: {
        email: "superadmin@shopez.com",
        password: "admin123",
        level: "super_admin",
        loginUrl: "http://localhost:5173/admin-access/login"
      }
    })
  } catch (error) {
    console.error('❌ Error:', error.message)
    res.status(500).json({
      success: false,
      message: "Failed to create super admin",
      error: error.message
    })
  }
})

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
