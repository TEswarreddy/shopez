const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Admin Role & Permissions
    adminLevel: {
      type: String,
      enum: ["super_admin", "admin", "moderator", "support"],
      default: "admin",
    },
    permissions: {
      // User Management
      canManageUsers: { type: Boolean, default: true },
      canDeleteUsers: { type: Boolean, default: false },
      canSuspendUsers: { type: Boolean, default: true },
      
      // Vendor Management
      canManageVendors: { type: Boolean, default: true },
      canVerifyVendors: { type: Boolean, default: true },
      canSuspendVendors: { type: Boolean, default: true },
      canDeleteVendors: { type: Boolean, default: false },
      
      // Product Management
      canManageProducts: { type: Boolean, default: true },
      canDeleteProducts: { type: Boolean, default: true },
      canFeatureProducts: { type: Boolean, default: true },
      
      // Order Management
      canManageOrders: { type: Boolean, default: true },
      canRefundOrders: { type: Boolean, default: true },
      canCancelOrders: { type: Boolean, default: true },
      
      // Content Management
      canManageCategories: { type: Boolean, default: true },
      canManageBanners: { type: Boolean, default: true },
      canManagePromotions: { type: Boolean, default: true },
      
      // Financial
      canViewFinancials: { type: Boolean, default: false },
      canProcessPayouts: { type: Boolean, default: false },
      canManageCommissions: { type: Boolean, default: false },
      
      // System Settings
      canManageSettings: { type: Boolean, default: false },
      canViewLogs: { type: Boolean, default: true },
      canManageAdmins: { type: Boolean, default: false },
    },
    
    // Profile Information
    department: {
      type: String,
      enum: ["operations", "customer_support", "finance", "marketing", "technical", "management"],
    },
    employeeId: String,
    designation: String,
    
    // Activity Tracking
    lastLogin: Date,
    lastActivity: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
    
    // Statistics
    stats: {
      usersManaged: { type: Number, default: 0 },
      vendorsVerified: { type: Number, default: 0 },
      ordersProcessed: { type: Number, default: 0 },
      disputesResolved: { type: Number, default: 0 },
      ticketsHandled: { type: Number, default: 0 },
    },
    
    // Security
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: String,
    ipWhitelist: [String],
    
    // Notifications
    notificationSettings: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      newOrders: { type: Boolean, default: true },
      newVendors: { type: Boolean, default: true },
      disputes: { type: Boolean, default: true },
      systemAlerts: { type: Boolean, default: true },
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    
    // Assigned Areas
    assignedRegions: [String],
    assignedCategories: [String],
    
    // Contact
    workPhone: String,
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String,
    },
    
    // Added By (for audit trail)
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    
    // Notes (for internal use)
    notes: String,
  },
  { timestamps: true }
);

// Update last activity
adminSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

// Update login info
adminSchema.methods.recordLogin = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

// Check if admin has specific permission
adminSchema.methods.hasPermission = function(permission) {
  if (this.adminLevel === "super_admin") return true;
  return this.permissions[permission] === true;
};

module.exports = mongoose.model("Admin", adminSchema);
