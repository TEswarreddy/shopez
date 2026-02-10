const Review = require("../models/Review");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Create review
const createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    if (!rating || !title || !comment) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if customer has purchased the product
    const order = await Order.findOne({
      customer: req.user.id,
      "items.product": productId,
    });

    const verified = !!order;

    const review = new Review({
      product: productId,
      customer: req.user.id,
      rating,
      title,
      comment,
      verified,
    });

    await review.save();

    // Update product ratings
    const allReviews = await Review.find({ product: productId });
    let totalRating = 0;
    allReviews.forEach((r) => {
      totalRating += r.rating;
    });

    product.ratings.average = totalRating / allReviews.length;
    product.ratings.count = allReviews.length;
    product.reviews.push(review._id);

    await product.save();

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product reviews
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("customer", "firstName lastName")
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;

    let review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;

    await review.save();

    // Recalculate product ratings
    const product = await Product.findById(review.product);
    const allReviews = await Review.find({ product: review.product });
    let totalRating = 0;
    allReviews.forEach((r) => {
      totalRating += r.rating;
    });

    product.ratings.average = totalRating / allReviews.length;
    await product.save();

    res.json({ success: true, message: "Review updated", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.customer.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.reviewId);

    // Recalculate product ratings
    const product = await Product.findById(productId);
    const allReviews = await Review.find({ product: productId });

    if (allReviews.length > 0) {
      let totalRating = 0;
      allReviews.forEach((r) => {
        totalRating += r.rating;
      });
      product.ratings.average = totalRating / allReviews.length;
      product.ratings.count = allReviews.length;
    } else {
      product.ratings.average = 0;
      product.ratings.count = 0;
    }

    product.reviews = product.reviews.filter((id) => id.toString() !== req.params.reviewId);
    await product.save();

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
};
