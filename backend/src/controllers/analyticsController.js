const Payment = require("../models/Payment");
const Order = require("../models/Order");
const Vendor = require("../models/Vendor");
const asyncHandler = require("../middlewares/asyncHandler");

// Admin - Get overall platform revenue dashboard
exports.getAdminRevenueDashboard = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  let matchStage = {
    status: { $in: ["completed", "partially_refunded"] },
  };

  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const [revenue, transactions, topVendors, paymentMethods] = await Promise.all([
    Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$platformCommission" },
          totalGrossRevenue: { $sum: "$totalAmount" },
          totalTransactions: { $sum: 1 },
          totalRefunded: {
            $sum: {
              $cond: [
                { $eq: ["$status", "partially_refunded"] },
                "$refundAmount",
                0,
              ],
            },
          },
          avgTransactionValue: { $avg: "$totalAmount" },
        },
      },
    ]),
    Payment.countDocuments(matchStage),
    Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$vendor",
          vendorRevenue: { $sum: "$vendorAmount" },
          transactions: { $sum: 1 },
        },
      },
      { $sort: { vendorRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "vendors",
          localField: "_id",
          foreignField: "_id",
          as: "vendorInfo",
        },
      },
    ]),
    Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$paymentMethod",
          count: { $sum: 1 },
          totalAmount: { $sum: "$totalAmount" },
        },
      },
      { $sort: { count: -1 } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    data: {
      revenue: revenue[0] || {
        totalRevenue: 0,
        totalGrossRevenue: 0,
        totalTransactions: 0,
        totalRefunded: 0,
        avgTransactionValue: 0,
      },
      topVendors,
      paymentMethods,
    },
  });
});

// Admin - Get revenue trend (daily/monthly)
exports.getRevenueTrend = asyncHandler(async (req, res) => {
  const { startDate, endDate, groupBy = "day" } = req.query;

  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const dateFormat = groupBy === "month" ? "%Y-%m" : "%Y-%m-%d";

  const trend = await Payment.aggregate([
    {
      $match: {
        createdAt: { $gte: start, $lte: end },
        status: { $in: ["completed", "partially_refunded"] },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: dateFormat, date: "$createdAt" },
        },
        platformRevenue: { $sum: "$platformCommission" },
        vendorRevenue: { $sum: "$vendorAmount" },
        totalAmount: { $sum: "$totalAmount" },
        transactions: { $sum: 1 },
        refunded: {
          $sum: {
            $cond: [{ $eq: ["$status", "partially_refunded"] }, "$refundAmount", 0],
          },
        },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: trend,
  });
});

// Admin - Get payment reconciliation details
exports.getPaymentReconciliation = asyncHandler(async (req, res) => {
  const { status = "pending", limit = 20, page = 1 } = req.query;

  const skip = (page - 1) * limit;

  const [payments, total] = await Promise.all([
    Payment.find({ reconciled: status === "pending" ? false : true })
      .populate("vendor", "storeName email")
      .populate("customer", "firstName lastName email")
      .populate("orderRef", "orderNumber totalAmount")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Payment.countDocuments({ reconciled: status === "pending" ? false : true }),
  ]);

  res.status(200).json({
    success: true,
    data: {
      payments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    },
  });
});

// Admin - Mark payment as reconciled
exports.markPaymentReconciled = asyncHandler(async (req, res) => {
  const { paymentIds } = req.body;
  const adminId = req.user._id;

  const result = await Payment.updateMany(
    { _id: { $in: paymentIds } },
    {
      reconciled: true,
      reconciledBy: adminId,
      reconciledAt: new Date(),
    }
  );

  res.status(200).json({
    success: true,
    message: `${result.modifiedCount} payments marked as reconciled`,
    data: result,
  });
});

// Vendor - Get vendor revenue dashboard
exports.getVendorRevenueDashboard = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const { startDate, endDate } = req.query;

  let matchStage = {
    vendor: require("mongoose").Types.ObjectId(vendorId),
    status: { $in: ["completed", "partially_refunded"] },
  };

  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const [revenue, transactions] = await Promise.all([
    Payment.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalEarnings: { $sum: "$vendorAmount" },
          totalTransactions: { $sum: 1 },
          totalRefunded: {
            $sum: {
              $cond: [
                { $eq: ["$status", "partially_refunded"] },
                "$refundAmount",
                0,
              ],
            },
          },
          avgOrderValue: { $avg: "$totalAmount" },
        },
      },
    ]),
    Payment.countDocuments(matchStage),
  ]);

  res.status(200).json({
    success: true,
    data: {
      revenue: revenue[0] || {
        totalEarnings: 0,
        totalTransactions: 0,
        totalRefunded: 0,
        avgOrderValue: 0,
      },
    },
  });
});

// Vendor - Get vendor revenue breakdown
exports.getVendorRevenueBreakdown = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const { startDate, endDate, groupBy = "day" } = req.query;

  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const dateFormat = groupBy === "month" ? "%Y-%m" : "%Y-%m-%d";

  const breakdown = await Payment.aggregate([
    {
      $match: {
        vendor: require("mongoose").Types.ObjectId(vendorId),
        createdAt: { $gte: start, $lte: end },
        status: { $in: ["completed", "partially_refunded"] },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: { format: dateFormat, date: "$createdAt" },
        },
        earnings: { $sum: "$vendorAmount" },
        commission: { $sum: "$platformCommission" },
        totalAmount: { $sum: "$totalAmount" },
        transactions: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.status(200).json({
    success: true,
    data: breakdown,
  });
});

// Vendor - Get vendor transaction history
exports.getVendorTransactionHistory = asyncHandler(async (req, res) => {
  const vendorId = req.user._id;
  const { limit = 20, page = 1, status } = req.query;

  const skip = (page - 1) * limit;
  const filter = { vendor: require("mongoose").Types.ObjectId(vendorId) };

  if (status) {
    filter.status = status;
  }

  const [payments, total] = await Promise.all([
    Payment.find(filter)
      .populate("customer", "firstName lastName email")
      .populate("orderRef", "orderNumber totalAmount")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Payment.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    data: {
      transactions: payments,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    },
  });
});

// Get payment details by transaction ID
exports.getPaymentDetails = asyncHandler(async (req, res) => {
  const { transactionId } = req.params;

  const payment = await Payment.findOne({ transactionId })
    .populate("customer")
    .populate("vendor")
    .populate("orderRef");

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  res.status(200).json({
    success: true,
    data: payment,
  });
});

// Record new payment (called after successful payment)
exports.recordPayment = asyncHandler(async (req, res) => {
  const {
    orderRef,
    customer,
    vendor,
    paymentMethod,
    orderAmount,
    discount = 0,
    tax = 0,
    shippingCharges = 0,
    commissionPercentage = 10,
    razorpayPaymentId,
    razorpayOrderId,
    razorpaySignature,
  } = req.body;

  const totalAmount = orderAmount - discount + tax + shippingCharges;

  const payment = await Payment.create({
    transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    orderRef,
    customer,
    vendor,
    paymentMethod,
    orderAmount,
    discount,
    tax,
    shippingCharges,
    totalAmount,
    commissionPercentage,
    status: "completed",
    razorpayPaymentId,
    paymentGatewayResponse: {
      razorpayOrderId,
      razorpaySignature,
    },
  });

  res.status(201).json({
    success: true,
    message: "Payment recorded successfully",
    data: payment,
  });
});

// Handle refund
exports.processRefund = asyncHandler(async (req, res) => {
  const { paymentId, refundAmount, reason } = req.body;

  const payment = await Payment.findById(paymentId);

  if (!payment) {
    return res.status(404).json({
      success: false,
      message: "Payment not found",
    });
  }

  if (refundAmount > payment.totalAmount) {
    return res.status(400).json({
      success: false,
      message: "Refund amount cannot exceed total payment amount",
    });
  }

  payment.refundAmount = refundAmount;
  payment.refundReason = reason;
  payment.status = refundAmount === payment.totalAmount ? "refunded" : "partially_refunded";
  payment.refundedAt = new Date();

  await payment.save();

  res.status(200).json({
    success: true,
    message: "Refund processed successfully",
    data: payment,
  });
});
