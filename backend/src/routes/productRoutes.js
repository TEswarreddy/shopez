const express = require("express");
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { auth, vendorAuth } = require("../middlewares/auth");

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", auth, vendorAuth, createProduct);
router.put("/:id", auth, vendorAuth, updateProduct);
router.delete("/:id", auth, vendorAuth, deleteProduct);

module.exports = router;
