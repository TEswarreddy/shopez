const mongoose = require("mongoose");

const vendorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Basic Business Information
    businessName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      enum: ["individual", "proprietorship", "partnership", "private_limited", "public_limited", "llp"],
      required: true,
    },
    businessDescription: String,
    businessCategory: {
      type: String,
      enum: ["electronics", "fashion", "home", "beauty", "sports", "books", "food", "other"],
    },
    
    // Business Contact
    businessEmail: {
      type: String,
      lowercase: true,
    },
    businessPhone: {
      type: String,
      required: true,
    },
    alternatePhone: String,
    
    // Business Address
    businessAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    
    // Pickup Address (if different from business address)
    pickupAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      isSameAsBusinessAddress: { type: Boolean, default: true },
    },
    
    // Tax Information
    gstNumber: {
      type: String,
      match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, "Please provide a valid GST number"],
    },
    panNumber: {
      type: String,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please provide a valid PAN number"],
      required: true,
    },
    
    // Bank Account Details
    bankDetails: {
      accountHolderName: { type: String, required: true },
      accountNumber: { type: String, required: true },
      ifscCode: { 
        type: String, 
        required: true,
        match: [/^[A-Z]{4}0[A-Z0-9]{6}$/, "Please provide a valid IFSC code"],
      },
      bankName: String,
      branchName: String,
      accountType: {
        type: String,
        enum: ["savings", "current"],
        default: "current",
      },
    },
    
    // Store/Shop Information
    storeName: String,
    storeDescription: String,
    storeLogo: String,
    storeBanner: String,
    storeSlug: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    // Verification & Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ["pending", "under_review", "verified", "rejected"],
      default: "pending",
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    rejectionReason: String,
    
    // Documents
    documents: {
      gstCertificate: String,
      panCard: String,
      addressProof: String,
      cancelledCheque: String,
      businessLicense: String,
    },
    
    // Business Metrics
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalRatings: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    totalSales: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      default: 0,
    },
    totalProducts: {
      type: Number,
      default: 0,
    },
    
    // Store Settings
    storeSettings: {
      isStoreActive: { type: Boolean, default: true },
      acceptsReturns: { type: Boolean, default: true },
      returnWindow: { type: Number, default: 7 }, // days
      shippingMethods: [String],
      paymentMethods: [String],
      minOrderAmount: { type: Number, default: 0 },
      maxOrderAmount: Number,
      deliveryTime: { type: String, default: "3-5 business days" },
    },
    
    // Commission & Payments
    commissionRate: {
      type: Number,
      default: 10, // percentage
    },
    pendingPayouts: {
      type: Number,
      default: 0,
    },
    totalPayouts: {
      type: Number,
      default: 0,
    },
    lastPayoutDate: Date,
    
    // Onboarding
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingStep: {
      type: Number,
      default: 1,
    },
    
    // Performance Metrics
    performanceMetrics: {
      orderFulfillmentRate: { type: Number, default: 0 }, // percentage
      averageShippingTime: Number, // days
      returnRate: { type: Number, default: 0 }, // percentage
      responseTime: Number, // hours
      customerSatisfaction: { type: Number, default: 0 }, // 0-100
    },
    
    // Account Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspensionReason: String,
    suspendedAt: Date,
    
    // Social Media & Website
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      website: String,
    },
    
    // Business Hours
    businessHours: {
      monday: { open: String, close: String, closed: Boolean },
      tuesday: { open: String, close: String, closed: Boolean },
      wednesday: { open: String, close: String, closed: Boolean },
      thursday: { open: String, close: String, closed: Boolean },
      friday: { open: String, close: String, closed: Boolean },
      saturday: { open: String, close: String, closed: Boolean },
      sunday: { open: String, close: String, closed: Boolean },
    },
  },
  { timestamps: true }
);

// Generate store slug before saving
vendorSchema.pre("save", function(next) {
  if (this.isModified("storeName") && this.storeName && !this.storeSlug) {
    this.storeSlug = this.storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
  next();
});

// Method to update rating
vendorSchema.methods.updateRating = function(newRating) {
  this.totalRatings += 1;
  this.rating = ((this.rating * (this.totalRatings - 1)) + newRating) / this.totalRatings;
  return this.save();
};

module.exports = mongoose.model("Vendor", vendorSchema);
