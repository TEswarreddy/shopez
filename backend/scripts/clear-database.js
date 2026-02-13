require("dotenv").config();
const mongoose = require("mongoose");
const dns = require("dns");

// Import all models
const Customer = require("../src/models/Customer");
const Vendor = require("../src/models/Vendor");
const Admin = require("../src/models/Admin");
const Product = require("../src/models/Product");
const Order = require("../src/models/Order");
const Cart = require("../src/models/Cart");
const Wishlist = require("../src/models/Wishlist");
const Review = require("../src/models/Review");

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

const clearDatabase = async () => {
  try {
    const models = [
      { name: "Customer", model: Customer },
      { name: "Vendor", model: Vendor },
      { name: "Admin", model: Admin },
      { name: "Product", model: Product },
      { name: "Order", model: Order },
      { name: "Cart", model: Cart },
      { name: "Wishlist", model: Wishlist },
      { name: "Review", model: Review }
    ];

    console.log("🗑️  Deleting all data from database...\n");

    for (const { name, model } of models) {
      const result = await model.deleteMany({});
      console.log(`✅ ${name}: Deleted ${result.deletedCount} documents`);
    }

    console.log("\n✅ Database cleared successfully!");
  } catch (error) {
    console.error("❌ Error clearing database:", error.message);
    process.exit(1);
  }
};

const main = async () => {
  await connectDB();
  await clearDatabase();
  await mongoose.connection.close();
  console.log("\n👋 Connection closed");
  process.exit(0);
};

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
