const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const AdminAccount = require("./src/models/AdminAccount");

async function createSuperAdmin() {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!mongoUri) {
      console.error("❌ MONGODB_URI not found in environment variables");
      process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log("✅ Connected to MongoDB");

    const existingAdmin = await AdminAccount.findOne({ email: "superadmin@shopez.com" });
    if (existingAdmin) {
      console.log("⚠️  Super admin already exists");
      mongoose.connection.close();
      return;
    }

    await AdminAccount.create({
      firstName: "Super",
      lastName: "Admin",
      email: "superadmin@shopez.com",
      password: "admin123",
      role: "admin",
      adminLevel: "super_admin",
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

    console.log("\n✅ SUPER ADMIN CREATED SUCCESSFULLY!\n");
    console.log("📧 Email: superadmin@shopez.com");
    console.log("🔑 Password: admin123");
    console.log("👑 Admin Level: super_admin");
    console.log("\n✨ All permissions granted!\n");

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error creating super admin:", error.message);
    mongoose.connection.close();
    process.exit(1);
  }
}

createSuperAdmin();
