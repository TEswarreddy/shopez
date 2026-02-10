const express = require("express");
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
} = require("../controllers/cartController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", auth, getCart);
router.post("/add", auth, addToCart);
router.post("/remove", auth, removeFromCart);
router.put("/update", auth, updateCartItem);
router.delete("/clear", auth, clearCart);

module.exports = router;
