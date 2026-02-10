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
    
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log("MongoDB connected successfully ✅");
  } catch (error) {
    console.error("MongoDB connection failed ❌", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
