const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transactionId: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      unique: true,
      sparse: true,
    },
    orderRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      sparse: true,
    },
    paymentMethod: {
      type: String,
      enum: ["card", "razorpay", "cod", "upi", "wallet", "net_banking"],
      required: true,
    },
    // Amount details
    orderAmount: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    shippingCharges: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    // Vendor and Platform split
    vendorAmount: {
      type: Number,
      default: 0,
    },
    platformCommission: {
      type: Number,
      default: 0,
    },
    commissionPercentage: {
      type: Number,
      default: 10, // Default 10% platform commission
    },
    // Payment status
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded", "partially_refunded"],
      default: "pending",
      index: true,
    },
    // Refund tracking
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundReason: String,
    refundedAt: Date,
    // Payment metadata
    paymentGatewayResponse: {
      razorpayOrderId: String,
      razorpaySignature: String,
      gatewayTransactionId: String,
      acquirerData: mongoose.Schema.Types.Mixed,
    },
    billingAddress: {
      fullName: String,
      email: String,
      phone: String,
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
    // Notes and reconciliation
    notes: String,
    internalNotes: String,
    reconciled: {
      type: Boolean,
      default: false,
    },
    reconciledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    reconciledAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Indexes for revenue queries
paymentSchema.index({ status: 1, createdAt: -1 });
paymentSchema.index({ vendor: 1, status: 1, createdAt: -1 });
paymentSchema.index({ customer: 1, createdAt: -1 });
paymentSchema.index({ createdAt: -1 });

// Pre-save hook to calculate vendor amount
paymentSchema.pre("save", function (next) {
  if (this.isModified("totalAmount") || this.isModified("commissionPercentage")) {
    this.platformCommission = parseFloat(
      (this.totalAmount * this.commissionPercentage) / 100
    ).toFixed(2);
    this.vendorAmount = parseFloat(
      this.totalAmount - this.platformCommission
    ).toFixed(2);
  }
  next();
});

// Instance method to get revenue summary
paymentSchema.methods.getRevenueSummary = function () {
  return {
    transactionId: this.transactionId,
    totalAmount: this.totalAmount,
    vendorAmount: this.vendorAmount,
    platformCommission: this.platformCommission,
    status: this.status,
    date: this.createdAt,
  };
};

// Static method for admin revenue report
paymentSchema.statics.getAdminRevenueReport = async function (
  startDate,
  endDate
) {
  const result = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ["completed", "partially_refunded"] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$platformCommission" },
        totalTransactions: { $sum: 1 },
        totalRefunded: {
          $sum: {
            $cond: [{ $eq: ["$status", "partially_refunded"] }, "$refundAmount", 0],
          },
        },
        avgTransactionValue: { $avg: "$totalAmount" },
      },
    },
  ]);

  return result[0] || {
    totalRevenue: 0,
    totalTransactions: 0,
    totalRefunded: 0,
    avgTransactionValue: 0,
  };
};

// Static method for vendor revenue report
paymentSchema.statics.getVendorRevenueReport = async function (
  vendorId,
  startDate,
  endDate
) {
  const result = await this.aggregate([
    {
      $match: {
        vendor: mongoose.Types.ObjectId(vendorId),
        createdAt: { $gte: startDate, $lte: endDate },
        status: { $in: ["completed", "partially_refunded"] },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$vendorAmount" },
        totalTransactions: { $sum: 1 },
        totalRefunded: {
          $sum: {
            $cond: [{ $eq: ["$status", "partially_refunded"] }, "$refundAmount", 0],
          },
        },
        avgTransactionValue: { $avg: "$totalAmount" },
      },
    },
  ]);

  return result[0] || {
    totalRevenue: 0,
    totalTransactions: 0,
    totalRefunded: 0,
    avgTransactionValue: 0,
  };
};

// Static method for daily revenue tracking
paymentSchema.statics.getDailyRevenueBreakdown = async function (
  startDate,
  endDate,
  vendorId = null
) {
  const matchStage = {
    createdAt: { $gte: startDate, $lte: endDate },
    status: { $in: ["completed", "partially_refunded"] },
  };

  if (vendorId) {
    matchStage.vendor = mongoose.Types.ObjectId(vendorId);
  }

  const result = await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
        },
        totalRevenue: {
          $sum: vendorId ? "$vendorAmount" : "$platformCommission",
        },
        transactions: { $sum: 1 },
        totalAmount: { $sum: "$totalAmount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return result;
};

module.exports = mongoose.model("Payment", paymentSchema);
