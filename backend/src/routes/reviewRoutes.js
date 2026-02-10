const express = require("express");
const {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/:productId", auth, createReview);
router.get("/:productId", getProductReviews);
router.put("/:reviewId", auth, updateReview);
router.delete("/:reviewId", auth, deleteReview);

module.exports = router;
