const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const vendorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      select: false,
    },
    phone: String,
    role: {
      type: String,
      default: "vendor",
      immutable: true,
    },
    profileImage: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,

    // Vendor profile
    businessName: {
      type: String,
      required: true,
    },
    businessType: {
      type: String,
      enum: [
        "individual",
        "proprietorship",
        "partnership",
        "private_limited",
        "public_limited",
        "llp",
      ],
      required: true,
    },
    businessDescription: String,
    businessCategory: {
      type: String,
      enum: ["electronics", "fashion", "home", "beauty", "sports", "books", "food", "other"],
    },
    businessEmail: {
      type: String,
      lowercase: true,
    },
    businessPhone: {
      type: String,
      required: true,
    },
    alternatePhone: String,
    businessAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    pickupAddress: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
      isSameAsBusinessAddress: { type: Boolean, default: true },
    },
    gstNumber: {
      type: String,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Please provide a valid GST number",
      ],
    },
    panNumber: {
      type: String,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Please provide a valid PAN number"],
      required: true,
    },
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
    storeName: String,
    storeDescription: String,
    storeLogo: String,
    storeBanner: String,
    storeSlug: {
      type: String,
      unique: true,
      sparse: true,
    },
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
    documents: {
      gstCertificate: String,
      panCard: String,
      addressProof: String,
      cancelledCheque: String,
      businessLicense: String,
    },
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
    storeSettings: {
      isStoreActive: { type: Boolean, default: true },
      acceptsReturns: { type: Boolean, default: true },
      returnWindow: { type: Number, default: 7 },
      shippingMethods: [String],
      paymentMethods: [String],
      minOrderAmount: { type: Number, default: 0 },
      maxOrderAmount: Number,
      deliveryTime: { type: String, default: "3-5 business days" },
    },
    commissionRate: {
      type: Number,
      default: 10,
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
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingStep: {
      type: Number,
      default: 1,
    },
    performanceMetrics: {
      orderFulfillmentRate: { type: Number, default: 0 },
      averageShippingTime: Number,
      returnRate: { type: Number, default: 0 },
      responseTime: Number,
      customerSatisfaction: { type: Number, default: 0 },
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspensionReason: String,
    suspendedAt: Date,
    socialMedia: {
      facebook: String,
      instagram: String,
      twitter: String,
      website: String,
    },
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
  { timestamps: true, collection: "vendoraccounts" }
);

vendorSchema.virtual("isLocked").get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

vendorSchema.pre("save", function() {
  if (this.isModified("storeName") && this.storeName && !this.storeSlug) {
    this.storeSlug = this.storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }
});

vendorSchema.pre("save", async function() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

vendorSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

vendorSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000;

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return this.updateOne(updates);
};

vendorSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0, lastLogin: Date.now() },
    $unset: { lockUntil: 1 },
  });
};

module.exports = mongoose.model("Vendor", vendorSchema);
