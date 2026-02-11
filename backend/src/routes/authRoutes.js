const express = require("express");
const { signup, customerSignup, vendorSignup, login, getProfile, updateProfile } = require("../controllers/authController");
const { auth } = require("../middlewares/auth");
const asyncHandler = require("../middlewares/asyncHandler");

const router = express.Router();

// Generic signup (backward compatibility)
router.post("/signup", asyncHandler(signup));

// Role-specific signups
router.post("/customer/signup", asyncHandler(customerSignup));
router.post("/vendor/signup", asyncHandler(vendorSignup));

// Login (works for all roles)
router.post("/login", asyncHandler(login));

// Profile routes
router.get("/profile", auth, asyncHandler(getProfile));
router.put("/profile", auth, asyncHandler(updateProfile));

module.exports = router;
