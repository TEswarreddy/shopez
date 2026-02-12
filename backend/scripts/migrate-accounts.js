require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
const Customer = require("../src/models/Customer");
const Vendor = require("../src/models/Vendor");
const Admin = require("../src/models/Admin");

const permissionFields = [
  "canManageUsers",
  "canDeleteUsers",
  "canSuspendUsers",
  "canManageVendors",
  "canVerifyVendors",
  "canSuspendVendors",
  "canDeleteVendors",
  "canManageProducts",
  "canDeleteProducts",
  "canFeatureProducts",
  "canManageOrders",
  "canRefundOrders",
  "canCancelOrders",
  "canManageCategories",
  "canManageBanners",
  "canManagePromotions",
  "canViewFinancials",
  "canProcessPayouts",
  "canManageCommissions",
  "canManageSettings",
  "canViewLogs",
  "canManageAdmins",
];

const toStringId = (value) => (value ? value.toString() : null);

const buildPermissions = (adminDoc) => {
  const permissions = { ...(adminDoc?.permissions || {}) };

  permissionFields.forEach((field) => {
    if (permissions[field] === undefined && adminDoc?.[field] !== undefined) {
      permissions[field] = adminDoc[field];
    }
  });

  return permissions;
};

const migrateAccounts = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri) {
    throw new Error("MONGODB_URI or MONGO_URI must be set");
  }

  if (process.env.MONGO_DNS_SERVERS) {
    dns.setServers(
      process.env.MONGO_DNS_SERVERS
        .split(",")
        .map((server) => server.trim())
        .filter(Boolean)
    );
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000,
    socketTimeoutMS: 45000,
    family: 4,
  });

  const legacyUserSchema = new mongoose.Schema({}, { strict: false, collection: "users" });
  const legacyCustomerSchema = new mongoose.Schema({}, { strict: false, collection: "customers" });
  const legacyVendorSchema = new mongoose.Schema({}, { strict: false, collection: "vendors" });
  const legacyAdminSchema = new mongoose.Schema({}, { strict: false, collection: "admins" });

  const LegacyUser = mongoose.model("LegacyUser", legacyUserSchema);
  const LegacyCustomer = mongoose.model("LegacyCustomer", legacyCustomerSchema);
  const LegacyVendor = mongoose.model("LegacyVendor", legacyVendorSchema);
  const LegacyAdmin = mongoose.model("LegacyAdmin", legacyAdminSchema);

  const users = await LegacyUser.find();
  const customers = await LegacyCustomer.find();
  const vendors = await LegacyVendor.find();
  const admins = await LegacyAdmin.find();

  const customerMap = new Map(customers.map((c) => [toStringId(c.user), c]));
  const vendorMap = new Map(vendors.map((v) => [toStringId(v.user), v]));
  const adminMap = new Map(admins.map((a) => [toStringId(a.user), a]));
  const adminIdMap = new Map(admins.map((a) => [toStringId(a._id), toStringId(a.user)]));

  let created = 0;
  let skipped = 0;

  for (const user of users) {
    const role = user.role || "customer";
    const base = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      phone: user.phone,
      role,
      profileImage: user.profileImage,
      isActive: user.isActive,
      isEmailVerified: user.isEmailVerified,
      emailVerificationToken: user.emailVerificationToken,
      emailVerificationExpires: user.emailVerificationExpires,
      passwordResetToken: user.passwordResetToken,
      passwordResetExpires: user.passwordResetExpires,
      lastLogin: user.lastLogin,
      loginAttempts: user.loginAttempts,
      lockUntil: user.lockUntil,
    };

    if (role === "customer") {
      const exists = await Customer.findById(user._id);
      if (exists) {
        skipped += 1;
        continue;
      }

      const customer = customerMap.get(toStringId(user._id));

      const doc = {
        ...base,
        addresses: customer?.addresses || [],
        defaultAddressId: customer?.defaultAddressId,
        dateOfBirth: customer?.dateOfBirth,
        gender: customer?.gender,
        preferences: customer?.preferences,
        loyaltyPoints: customer?.loyaltyPoints || 0,
        totalOrders: customer?.totalOrders || 0,
        totalSpent: customer?.totalSpent || 0,
        lastOrderDate: customer?.lastOrderDate,
        suspensionReason: customer?.suspensionReason,
        suspendedAt: customer?.suspendedAt,
        createdAt: customer?.createdAt || user.createdAt,
        updatedAt: customer?.updatedAt || user.updatedAt,
      };

      await Customer.collection.insertOne(doc);
      created += 1;
      continue;
    }

    if (role === "vendor") {
      const exists = await Vendor.findById(user._id);
      if (exists) {
        skipped += 1;
        continue;
      }

      const vendor = vendorMap.get(toStringId(user._id));

      const doc = {
        ...base,
        businessName: vendor?.businessName,
        businessType: vendor?.businessType,
        businessDescription: vendor?.businessDescription,
        businessCategory: vendor?.businessCategory,
        businessEmail: vendor?.businessEmail,
        businessPhone: vendor?.businessPhone,
        alternatePhone: vendor?.alternatePhone,
        businessAddress: vendor?.businessAddress,
        pickupAddress: vendor?.pickupAddress,
        gstNumber: vendor?.gstNumber,
        panNumber: vendor?.panNumber,
        bankDetails: vendor?.bankDetails,
        storeName: vendor?.storeName,
        storeDescription: vendor?.storeDescription,
        storeLogo: vendor?.storeLogo,
        storeBanner: vendor?.storeBanner,
        storeSlug: vendor?.storeSlug,
        isVerified: vendor?.isVerified || false,
        verificationStatus: vendor?.verificationStatus || "pending",
        verifiedAt: vendor?.verifiedAt,
        verifiedBy: adminIdMap.get(toStringId(vendor?.verifiedBy)) || undefined,
        rejectionReason: vendor?.rejectionReason,
        documents: vendor?.documents,
        rating: vendor?.rating || 0,
        totalRatings: vendor?.totalRatings || 0,
        totalReviews: vendor?.totalReviews || 0,
        totalSales: vendor?.totalSales || 0,
        totalOrders: vendor?.totalOrders || 0,
        totalRevenue: vendor?.totalRevenue || 0,
        totalProducts: vendor?.totalProducts || 0,
        storeSettings: vendor?.storeSettings,
        commissionRate: vendor?.commissionRate || 10,
        pendingPayouts: vendor?.pendingPayouts || 0,
        totalPayouts: vendor?.totalPayouts || 0,
        lastPayoutDate: vendor?.lastPayoutDate,
        onboardingCompleted: vendor?.onboardingCompleted || false,
        onboardingStep: vendor?.onboardingStep || 1,
        performanceMetrics: vendor?.performanceMetrics,
        isSuspended: vendor?.isSuspended || false,
        suspensionReason: vendor?.suspensionReason,
        suspendedAt: vendor?.suspendedAt,
        socialMedia: vendor?.socialMedia,
        businessHours: vendor?.businessHours,
        createdAt: vendor?.createdAt || user.createdAt,
        updatedAt: vendor?.updatedAt || user.updatedAt,
      };

      if (!doc.storeSlug) {
        delete doc.storeSlug;
      }

      await Vendor.collection.insertOne(doc);
      created += 1;
      continue;
    }

    if (role === "admin") {
      const exists = await Admin.findById(user._id);
      if (exists) {
        skipped += 1;
        continue;
      }

      const admin = adminMap.get(toStringId(user._id));

      const doc = {
        ...base,
        adminLevel: admin?.adminLevel || "admin",
        permissions: buildPermissions(admin),
        department: admin?.department,
        employeeId: admin?.employeeId,
        designation: admin?.designation,
        lastActivity: admin?.lastActivity,
        loginCount: admin?.loginCount || 0,
        stats: admin?.stats,
        twoFactorEnabled: admin?.twoFactorEnabled || false,
        twoFactorSecret: admin?.twoFactorSecret,
        ipWhitelist: admin?.ipWhitelist || [],
        notificationSettings: admin?.notificationSettings,
        isOnline: admin?.isOnline || false,
        assignedRegions: admin?.assignedRegions || [],
        assignedCategories: admin?.assignedCategories || [],
        workPhone: admin?.workPhone,
        emergencyContact: admin?.emergencyContact,
        addedBy: adminIdMap.get(toStringId(admin?.addedBy)) || undefined,
        notes: admin?.notes,
        createdAt: admin?.createdAt || user.createdAt,
        updatedAt: admin?.updatedAt || user.updatedAt,
      };

      await Admin.collection.insertOne(doc);
      created += 1;
      continue;
    }

    skipped += 1;
  }

  console.log("Migration complete:");
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);

  await mongoose.connection.close();
};

migrateAccounts().catch((error) => {
  console.error("Migration failed:", error);
  mongoose.connection.close();
  process.exit(1);
});
