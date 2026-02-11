const express = require("express");
const {
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePicture,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require("../controllers/usersController");
const { auth } = require("../middlewares/auth");

const router = express.Router();

// All routes require authentication
router.use(auth);

// Profile routes
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

// Password routes
router.put("/change-password", changePassword);

// Profile picture routes
router.post("/profile-picture", uploadProfilePicture);

// Address routes
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);
router.put("/addresses/:addressId/default", setDefaultAddress);

module.exports = router;
