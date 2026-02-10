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
router.post("/", vendorAuth, createProduct);
router.put("/:id", vendorAuth, updateProduct);
router.delete("/:id", vendorAuth, deleteProduct);

module.exports = router;
