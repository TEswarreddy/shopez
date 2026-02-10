const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrder,
  updateOrderStatus,
} = require("../controllers/orderController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/my-orders", auth, getMyOrders);
router.get("/:id", auth, getOrder);
router.put("/:id", auth, updateOrderStatus);

module.exports = router;
