const Order = require("../models/Order");
const Product = require("../models/Product");

// Create order
const createOrder = async (req, res) => {
  try {
    const { 
      items, 
      shippingAddress, 
      paymentMethod, 
      totalAmount,
      razorpayOrderId,
      transactionId 
    } = req.body;

    console.log("\n=== ORDER CREATION START ===");
    console.log("User ID:", req.user.id);
    console.log("Items count:", items?.length);
    console.log("Shipping address:", JSON.stringify(shippingAddress));
    console.log("Payment method:", paymentMethod);
    console.log("Razorpay Order ID:", razorpayOrderId);
    console.log("Transaction ID:", transactionId);

    // Validate request body
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    // Process each item
    for (const item of items) {
      console.log(`Processing item: ${item.product}`);
      
      const product = await Product.findById(item.product);

      if (!product) {
        console.error(`Product not found: ${item.product}`);
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      console.log(`Product found: ${product.name}, Stock: ${product.stock}`);

      if (product.stock < item.quantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}` 
        });
      }

      calculatedTotal += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        vendor: product.vendor || null,
        quantity: item.quantity,
        price: product.price,
      });

      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
      console.log(`Stock updated for ${product.name}: ${product.stock}`);
    }

    console.log("Creating order document...");

    const orderData = {
      orderNumber: `ORD-${Date.now()}`,
      customer: req.user.id,
      items: orderItems,
      totalAmount: totalAmount || calculatedTotal,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
      },
      paymentMethod,
      status: paymentMethod === "razorpay" && transactionId ? "confirmed" : "pending",
      paymentStatus: paymentMethod === "razorpay" && transactionId ? "completed" : "pending",
    };

    // Add Razorpay fields if provided
    if (razorpayOrderId) {
      orderData.razorpayOrderId = razorpayOrderId;
    }
    if (transactionId) {
      orderData.transactionId = transactionId;
    }

    const order = new Order(orderData);
    await order.save();
    
    console.log("✅ Order saved successfully:", order._id);

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        items: order.items,
        totalAmount: order.totalAmount,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        status: order.status,
        razorpayOrderId: order.razorpayOrderId,
        transactionId: order.transactionId,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("\n❌ ERROR in createOrder:");
    console.error("Message:", error.message);
    console.error("Stack:", error.stack);
    
    res.status(500).json({ 
      message: `Server error: ${error.message}`,
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined 
    });
  }
};

// Get customer orders
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate("items.product")
      .populate("items.vendor", "firstName lastName storeName");

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
      .populate("items.vendor", "firstName lastName storeName");

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
