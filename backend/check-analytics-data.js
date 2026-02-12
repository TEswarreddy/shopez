const mongoose = require("mongoose");
require("dotenv").config();

const Customer = require("./src/models/Customer");
const Vendor = require("./src/models/Vendor");
const Order = require("./src/models/Order");
const Product = require("./src/models/Product");

async function checkAnalyticsData() {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      throw new Error("Neither MONGODB_URI nor MONGO_URI is set in environment variables");
    }
    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB\n");

    // Check Customers
    const totalCustomers = await Customer.countDocuments();
    const recentCustomers = await Customer.find().sort({ createdAt: -1 }).limit(3).select("createdAt");
    console.log("👥 CUSTOMERS:");
    console.log(`   Total: ${totalCustomers}`);
    if (recentCustomers.length > 0) {
      console.log(`   Recent customers:`);
      recentCustomers.forEach((c, i) => {
        console.log(`   ${i + 1}. Created: ${c.createdAt.toISOString()}`);
      });
    }
    console.log("");

    // Check Vendors
    const totalVendors = await Vendor.countDocuments();
    const verifiedVendors = await Vendor.countDocuments({ verificationStatus: "verified" });
    const vendorSample = await Vendor.find().limit(3).populate("user", "firstName lastName").select("businessName verificationStatus");
    console.log("🏪 VENDORS:");
    console.log(`   Total: ${totalVendors}`);
    console.log(`   Verified: ${verifiedVendors}`);
    if (vendorSample.length > 0) {
      console.log(`   Sample vendors:`);
      vendorSample.forEach((v, i) => {
        console.log(`   ${i + 1}. ${v.businessName} - Status: ${v.verificationStatus}`);
      });
    }
    console.log("");

    // Check Orders
    const totalOrders = await Order.countDocuments();
    const completedOrders = await Order.countDocuments({ paymentStatus: "completed" });
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(3).select("totalAmount paymentStatus createdAt items");
    console.log("📦 ORDERS:");
    console.log(`   Total: ${totalOrders}`);
    console.log(`   Completed: ${completedOrders}`);
    if (recentOrders.length > 0) {
      console.log(`   Recent orders:`);
      recentOrders.forEach((o, i) => {
        console.log(`   ${i + 1}. ₹${o.totalAmount} - Status: ${o.paymentStatus} - Items: ${o.items?.length || 0}`);
        if (o.items && o.items.length > 0) {
          o.items.forEach(item => {
            console.log(`       - Vendor ID: ${item.vendor || "N/A"}`);
          });
        }
      });
    }
    console.log("");

    // Check Products
    const totalProducts = await Product.countDocuments();
    const productCategories = await Product.distinct("category");
    console.log("📦 PRODUCTS:");
    console.log(`   Total: ${totalProducts}`);
    console.log(`   Categories: ${productCategories.join(", ")}`);
    console.log("");

    // Test the aggregation queries
    console.log("🔍 TESTING AGGREGATIONS:");
    
    // Test User Growth
    const now = new Date();
    const startDate = new Date(now);
    startDate.setMonth(now.getMonth() - 12);
    const groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } };

    const userGrowth = await Customer.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: groupBy, value: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log(`   User Growth Points: ${userGrowth.length}`);
    if (userGrowth.length > 0) {
      console.log(`   Sample: ${JSON.stringify(userGrowth[0])}`);
    }

    // Test Top Vendors
    const topVendors = await Order.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $unwind: "$items" },
      { $group: { _id: "$items.vendor", totalOrders: { $sum: 1 }, revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } } } },
      { $match: { _id: { $ne: null } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);
    console.log(`   Top Vendors Found: ${topVendors.length}`);
    if (topVendors.length > 0) {
      topVendors.forEach((v, i) => {
        console.log(`   ${i + 1}. Vendor ID: ${v._id} - Orders: ${v.totalOrders} - Revenue: ₹${v.revenue}`);
      });
    }

    console.log("\n✅ Analytics data check complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkAnalyticsData();
