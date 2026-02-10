const Cart = require("../models/Cart");
const Product = require("../models/Product");

// Get cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customer: req.user.id }).populate("items.product");

    if (!cart) {
      cart = new Cart({ customer: req.user.id, items: [] });
      await cart.save();
    }

    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to cart
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      cart = new Cart({ customer: req.user.id, items: [] });
    }

    const existingItem = cart.items.find((item) => item.product.toString() === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    cart.totalPrice = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      cart.totalPrice += prod.price * item.quantity;
    }

    await cart.save();

    res.json({ success: true, message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    cart.totalPrice = 0;
    for (const item of cart.items) {
      const prod = await Product.findById(item.product);
      cart.totalPrice += prod.price * item.quantity;
    }

    await cart.save();

    res.json({ success: true, message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((item) => item.product.toString() === productId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;

    cart.totalPrice = 0;
    for (const cartItem of cart.items) {
      const prod = await Product.findById(cartItem.product);
      cart.totalPrice += prod.price * cartItem.quantity;
    }

    await cart.save();

    res.json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ success: true, message: "Cart cleared", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
};
