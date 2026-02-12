const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
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
      default: "admin",
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

    adminLevel: {
      type: String,
      enum: ["super_admin", "admin", "moderator", "support"],
      default: "admin",
    },
    permissions: {
      canManageUsers: { type: Boolean, default: true },
      canDeleteUsers: { type: Boolean, default: false },
      canSuspendUsers: { type: Boolean, default: true },
      canManageVendors: { type: Boolean, default: true },
      canVerifyVendors: { type: Boolean, default: true },
      canSuspendVendors: { type: Boolean, default: true },
      canDeleteVendors: { type: Boolean, default: false },
      canManageProducts: { type: Boolean, default: true },
      canDeleteProducts: { type: Boolean, default: true },
      canFeatureProducts: { type: Boolean, default: true },
      canManageOrders: { type: Boolean, default: true },
      canRefundOrders: { type: Boolean, default: true },
      canCancelOrders: { type: Boolean, default: true },
      canManageCategories: { type: Boolean, default: true },
      canManageBanners: { type: Boolean, default: true },
      canManagePromotions: { type: Boolean, default: true },
      canViewFinancials: { type: Boolean, default: false },
      canProcessPayouts: { type: Boolean, default: false },
      canManageCommissions: { type: Boolean, default: false },
      canManageSettings: { type: Boolean, default: false },
      canViewLogs: { type: Boolean, default: true },
      canManageAdmins: { type: Boolean, default: false },
    },
    department: {
      type: String,
      enum: ["operations", "customer_support", "finance", "marketing", "technical", "management"],
    },
    employeeId: String,
    designation: String,
    lastActivity: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
    stats: {
      usersManaged: { type: Number, default: 0 },
      vendorsVerified: { type: Number, default: 0 },
      ordersProcessed: { type: Number, default: 0 },
      disputesResolved: { type: Number, default: 0 },
      ticketsHandled: { type: Number, default: 0 },
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    ipWhitelist: [String],
    notificationSettings: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      newOrders: { type: Boolean, default: true },
      newVendors: { type: Boolean, default: true },
      disputes: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true },
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    assignedRegions: [String],
    assignedCategories: [String],
    workPhone: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    notes: String,
  },
  { timestamps: true, collection: "adminaccounts" }
);

adminSchema.virtual("isLocked").get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

adminSchema.pre("save", async function() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

adminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

adminSchema.methods.incLoginAttempts = function() {
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

adminSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0, lastLogin: Date.now() },
    $unset: { lockUntil: 1 },
  });
};

adminSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

adminSchema.methods.recordLogin = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

adminSchema.methods.hasPermission = function(permission) {
  if (this.adminLevel === "super_admin") return true;
  return this.permissions[permission] === true;
};

module.exports = mongoose.model("Admin", adminSchema);
