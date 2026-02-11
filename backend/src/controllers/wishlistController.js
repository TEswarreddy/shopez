const Wishlist = require("../models/Wishlist");

// Get wishlist
const getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ customer: req.user.id }).populate(
      "products.product"
    );

    if (!wishlist) {
      wishlist = new Wishlist({ customer: req.user.id, products: [] });
      await wishlist.save();
    }

    res.json({ success: true, wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ customer: req.user.id });

    if (!wishlist) {
      wishlist = new Wishlist({ customer: req.user.id, products: [] });
    }

    const exists = wishlist.products.some((item) => item.product.toString() === productId);

    if (!exists) {
      wishlist.products.push({ product: productId });
      await wishlist.save();
    }

    // Populate products before returning
    await wishlist.populate("products.product");

    res.json({ success: true, message: "Product added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ customer: req.user.id });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (item) => item.product.toString() !== productId
    );

    await wishlist.save();

    // Populate products before returning
    await wishlist.populate("products.product");

    res.json({ success: true, message: "Product removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};
