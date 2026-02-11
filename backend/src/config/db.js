const mongoose = require("mongoose");
const dns = require("dns");

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
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("\nTroubleshooting tips:");
    console.error("1. Check your internet connection");
    console.error("2. Verify MONGODB_URI in .env file");
    console.error("3. Ensure MongoDB Atlas IP whitelist includes your IP");
    console.error("4. Check MongoDB Atlas cluster status\n");
    process.exit(1);
  }
};

module.exports = connectDB;
