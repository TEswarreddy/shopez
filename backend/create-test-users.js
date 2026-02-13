require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");
const Customer = require("./src/models/Customer");
const Vendor = require("./src/models/Vendor");
const Admin = require("./src/models/Admin");
const Product = require("./src/models/Product");
const Order = require("./src/models/Order");

const connectDB = async () => {
  try {
    if (process.env.MONGO_DNS_SERVERS) {
      dns.setServers(
        process.env.MONGO_DNS_SERVERS
          .split(",")
          .map((server) => server.trim())
          .filter(Boolean)
      );
    }

    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Neither MONGODB_URI nor MONGO_URI is set in environment variables");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      family: 4
    });
    console.log("✅ MongoDB connected successfully\n");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

// Test user data
const testData = {
  superadmin: {
    firstName: "Super",
    lastName: "Admin",
    email: "superadmin@test.com",
    password: "superadmin123",
    phone: "9876543210",
    departmentName: "Administration",
    adminLevel: "super_admin",
  },
  admins: [
    {
      firstName: "Admin",
      lastName: "One",
      email: "admin1@test.com",
      password: "admin123",
      phone: "9876543211",
      department: "User Management",
      adminLevel: "admin",
    },
    {
      firstName: "Admin",
      lastName: "Two",
      email: "admin2@test.com",
      password: "admin456",
      phone: "9876543212",
      department: "Vendor Management",
      adminLevel: "admin",
    },
  ],
  vendors: [
    {
      firstName: "Vendor",
      lastName: "One",
      email: "vendor1@test.com",
      password: "vendor123",
      phone: "9988776655",
      storeName: "Tech Store",
      storeDescription: "Premium Electronics and Gadgets",
      businessType: "Retail",
    },
    {
      firstName: "Vendor",
      lastName: "Two",
      email: "vendor2@test.com",
      password: "vendor456",
      phone: "9988776656",
      storeName: "Fashion Boutique",
      storeDescription: "Latest Fashion Trends",
      businessType: "Fashion",
    },
    {
      firstName: "Vendor",
      lastName: "Three",
      email: "vendor3@test.com",
      password: "vendor789",
      phone: "9988776657",
      storeName: "Home Essentials",
      storeDescription: "Quality Home Products",
      businessType: "Home & Living",
    },
  ],
  customers: [
    {
      firstName: "John",
      lastName: "Doe",
      email: "customer1@test.com",
      password: "customer123",
      phone: "9111222333",
      shippingAddress: {
        fullName: "John Doe",
        street: "123 Main Street",
        city: "New York",
        state: "NY",
        postalCode: "10001",
        country: "USA",
      },
    },
    {
      firstName: "Jane",
      lastName: "Smith",
      email: "customer2@test.com",
      password: "customer456",
      phone: "9111222334",
      shippingAddress: {
        fullName: "Jane Smith",
        street: "456 Oak Avenue",
        city: "Los Angeles",
        state: "CA",
        postalCode: "90001",
        country: "USA",
      },
    },
    {
      firstName: "Robert",
      lastName: "Johnson",
      email: "customer3@test.com",
      password: "customer789",
      phone: "9111222335",
      shippingAddress: {
        fullName: "Robert Johnson",
        street: "789 Pine Road",
        city: "Chicago",
        state: "IL",
        postalCode: "60601",
        country: "USA",
      },
    },
    {
      firstName: "Sarah",
      lastName: "Williams",
      email: "customer4@test.com",
      password: "customer999",
      phone: "9111222336",
      shippingAddress: {
        fullName: "Sarah Williams",
        street: "321 Elm Street",
        city: "Houston",
        state: "TX",
        postalCode: "77001",
        country: "USA",
      },
    },
  ],
};

const createTestUsers = async () => {
  try {
    console.log("👥 Setting up test users...\n");

    // Create Super Admin
    console.log("📝 Creating Super Admin...");
    const existingSuperAdmin = await Admin.findOne({
      email: testData.superadmin.email,
    });
    let superAdmin;
    if (existingSuperAdmin) {
      console.log("⚠️  Super Admin already exists");
      superAdmin = existingSuperAdmin;
    } else {
      superAdmin = await Admin.create({
        firstName: testData.superadmin.firstName,
        lastName: testData.superadmin.lastName,
        email: testData.superadmin.email,
        password: testData.superadmin.password,
        phone: testData.superadmin.phone,
        role: "admin",
        adminLevel: "super_admin",
        isActive: true,
        isEmailVerified: true,
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
      });
      console.log("✅ Super Admin created:", testData.superadmin.email);
    }

    // Create Admins
    console.log("\n📝 Creating Admins...");
    for (const adminData of testData.admins) {
      const existingAdmin = await Admin.findOne({ email: adminData.email });
      if (existingAdmin) {
        console.log("⚠️  Admin already exists:", adminData.email);
      } else {
        await Admin.create({
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          email: adminData.email,
          password: adminData.password,
          phone: adminData.phone,
          role: "admin",
          adminLevel: "admin",
          department: adminData.department,
          isActive: true,
          isEmailVerified: true,
          permissions: {
            canManageUsers: true,
            canDeleteUsers: false,
            canSuspendUsers: true,
            canManageVendors: true,
            canVerifyVendors: true,
            canSuspendVendors: true,
            canDeleteVendors: false,
            canManageProducts: true,
            canDeleteProducts: false,
            canFeatureProducts: true,
            canManageOrders: true,
            canRefundOrders: true,
            canCancelOrders: true,
            canManageCategories: true,
            canManageBanners: false,
            canManagePromotions: false,
            canViewFinancials: true,
            canProcessPayouts: false,
            canManageCommissions: false,
            canManageSettings: false,
            canViewLogs: true,
            canManageAdmins: false,
          },
        });
        console.log("✅ Admin created:", adminData.email);
      }
    }

    // Create Vendors
    console.log("\n📝 Creating Vendors...");
    for (const vendorData of testData.vendors) {
      const existingVendor = await Vendor.findOne({ email: vendorData.email });
      if (existingVendor) {
        console.log("⚠️  Vendor already exists:", vendorData.email);
      } else {
        await Vendor.create({
          firstName: vendorData.firstName,
          lastName: vendorData.lastName,
          email: vendorData.email,
          password: vendorData.password,
          phone: vendorData.phone,
          role: "vendor",
          storeName: vendorData.storeName,
          storeDescription: vendorData.storeDescription,
          businessType: vendorData.businessType,
          isActive: true,
          isEmailVerified: true,
          isVerified: true,
          verificationStatus: "approved",
        });
        console.log("✅ Vendor created:", vendorData.email);
      }
    }

    // Create Customers
    console.log("\n📝 Creating Customers...");
    for (const customerData of testData.customers) {
      const existingCustomer = await Customer.findOne({
        email: customerData.email,
      });
      if (existingCustomer) {
        console.log("⚠️  Customer already exists:", customerData.email);
      } else {
        await Customer.create({
          firstName: customerData.firstName,
          lastName: customerData.lastName,
          email: customerData.email,
          password: customerData.password,
          phone: customerData.phone,
          role: "customer",
          isActive: true,
          isEmailVerified: true,
          shippingAddresses: [customerData.shippingAddress],
        });
        console.log("✅ Customer created:", customerData.email);
      }
    }

    console.log("\n✅ Test users setup complete!\n");
    return { superAdmin };
  } catch (error) {
    console.error("❌ Error creating test users:", error.message);
    throw error;
  }
};

const main = async () => {
  await connectDB();
  await createTestUsers();
  
  console.log("\n📋 TEST USERS CREATED:\n");
  console.log("🔐 SUPER ADMIN:");
  console.log(`   Email: ${testData.superadmin.email}`);
  console.log(`   Password: ${testData.superadmin.password}\n`);
  
  console.log("🔐 ADMINS:");
  testData.admins.forEach((admin) => {
    console.log(`   Email: ${admin.email}, Password: ${admin.password}`);
  });
  
  console.log("\n🏪 VENDORS:");
  testData.vendors.forEach((vendor) => {
    console.log(`   Email: ${vendor.email}, Password: ${vendor.password}`);
  });
  
  console.log("\n👥 CUSTOMERS:");
  testData.customers.forEach((customer) => {
    console.log(`   Email: ${customer.email}, Password: ${customer.password}`);
  });

  await mongoose.connection.close();
  console.log("\n👋 Connection closed");
  process.exit(0);
};

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
