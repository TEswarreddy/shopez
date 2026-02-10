const Order = require("../models/Order");
const Product = require("../models/Product");

// Create order
const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: item.product,
        vendor: product.vendor,
        quantity: item.quantity,
        price: product.price,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      customer: req.user.id,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod,
    });

    await order.save();

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get customer orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate("items.product")
      .populate("items.vendor", "firstName lastName shop");

    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order details
const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("customer")
      .populate("items.product")
      .populate("items.vendor", "firstName lastName shop");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if user is customer, vendor of an item, or admin
    if (
      order.customer._id.toString() !== req.user.id &&
      req.user.role !== "admin" &&
      !order.items.some((item) => item.vendor._id.toString() === req.user.id)
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update order status (vendor/admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { itemIndex, status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.items[itemIndex].vendor.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.items[itemIndex].status = status;
    await order.save();

    res.json({ success: true, message: "Order updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
};
