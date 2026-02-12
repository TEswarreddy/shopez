const mongoose = require("mongoose");
const Admin = require("./src/models/Admin");
require("dotenv").config();

async function createSuperAdmin() {
  try {
    console.log("🔌 Connecting to database...");

    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MONGODB_URI not found in environment variables");
      process.exit(1);
    }

    console.log("📍 Using connection string:", mongoUri.substring(0, 50) + "...");

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      retryWrites: true,
    });

    console.log("✅ Connected to MongoDB");

    const existingAdmin = await Admin.findOne({ email: "superadmin@shopez.com" });
    if (existingAdmin) {
      console.log("✅ Super admin already exists - no action taken");
      await mongoose.connection.close();
      return;
    }

    await Admin.create({
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@shopez.com",
      password: "admin123",
      role: "admin",
      adminLevel: "super_admin",
      department: "Administration",
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
    });

    console.log("✅ Admin account created");
    console.log("");
    console.log("═════════════════════════════════════════════════════");
    console.log("✨ SUPER ADMIN READY FOR TESTING");
    console.log("═════════════════════════════════════════════════════");
    console.log("📧 Email:       superadmin@shopez.com");
    console.log("🔐 Password:    admin123");
    console.log("👤 Role:        admin");
    console.log("🎯 Level:       super_admin");
    console.log("🌐 Login URL:   http://localhost:5173/admin-access/login");
    console.log("═════════════════════════════════════════════════════");
    console.log("");

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("Network Error: Cannot reach MongoDB Atlas");
    }
    process.exit(1);
  }
}

createSuperAdmin();
