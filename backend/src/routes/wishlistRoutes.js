const express = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getWishlist);
router.post("/add", auth, addToWishlist);
router.post("/remove", auth, removeFromWishlist);

module.exports = router;
