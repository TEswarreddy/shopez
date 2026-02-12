const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide product name"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
    },
    category: {
      type: String,
      required: [true, "Please provide product category"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
    },
    originalPrice: {
      type: Number,
    },
    discount: {
      type: Number,
      default: 0,
    },
    stock: {
      type: Number,
      required: [true, "Please provide stock quantity"],
      default: 0,
    },
    images: [String],
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    ratings: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index for search
productSchema.index({ name: "text", description: "text", category: "text" });

module.exports = mongoose.model("Product", productSchema);
