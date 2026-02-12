const Customer = require("../models/Customer");
const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");

const ensureCustomer = (req, res) => {
  if (req.user.role !== "customer") {
    res.status(403).json({ success: false, message: "Customer access required" });
    return false;
  }
  return true;
};

// Get user profile
exports.getProfile = asyncHandler(async (req, res) => {
  if (!ensureCustomer(req, res)) return;

  const user = await Customer.findById(req.user.id).select("-password");
  
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({
    success: true,
    user,
  });
});

// Update user profile
exports.updateProfile = asyncHandler(async (req, res) => {
  if (!ensureCustomer(req, res)) return;

  const allowedFields = ["firstName", "lastName", "email", "phone"];
  const updates = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const user = await Customer.findByIdAndUpdate(req.user.id, updates, {
    returnDocument: 'after',
    runValidators: true,
  }).select("-password");

  res.json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});

// Change password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide all password fields",
    });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "New passwords do not match",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }

  // Get user with password
  if (!ensureCustomer(req, res)) return;

  const user = await Customer.findById(req.user.id).select("+password");

  // Verify current password
  const isPasswordCorrect = await user.comparePassword(currentPassword);
  if (!isPasswordCorrect) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: "Password changed successfully",
  });
});

// Upload profile picture
exports.uploadProfilePicture = asyncHandler(async (req, res) => {
  // In a real app, you would upload to S3/Cloudinary
  // For now, we'll accept a base64 string or file path
  const { profileImage } = req.body;

  if (!profileImage) {
    return res.status(400).json({
      success: false,
      message: "Please provide profile image",
    });
  }

  if (!ensureCustomer(req, res)) return;

  const user = await Customer.findByIdAndUpdate(
    req.user.id,
    { profileImage },
    { returnDocument: 'after' }
  ).select("-password");

  res.json({
    success: true,
    message: "Profile picture updated successfully",
    user,
  });
});

// Get user addresses
exports.getAddresses = asyncHandler(async (req, res) => {
  if (!ensureCustomer(req, res)) return;

  const user = await Customer.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({
    success: true,
    addresses: user.addresses || [],
  });
});

// Add new address
exports.addAddress = asyncHandler(async (req, res) => {
  const { fullName, phone, street, city, state, postalCode, country } =
    req.body;

  // Validation
  if (!fullName || !phone || !street || !city || !state || !postalCode) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  if (!ensureCustomer(req, res)) return;

  const user = await Customer.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Initialize addresses array if it doesn't exist
  if (!user.addresses) {
    user.addresses = [];
  }

  // Create new address
  const newAddress = {
    _id: new mongoose.Types.ObjectId(),
    fullName,
    phone,
    street,
    city,
    state,
    postalCode,
    country: country || "India",
    isDefault: user.addresses.length === 0, // Set as default if first address
  };

  user.addresses.push(newAddress);

  // Set as default if it's the first address
  if (user.addresses.length === 1) {
    user.defaultAddressId = newAddress._id;
  }

  await user.save();

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    address: newAddress,
  });
});

// Update address
exports.updateAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;
  const { fullName, phone, street, city, state, postalCode, country } =
    req.body;

  if (!ensureCustomer(req, res)) return;

  const user = await Customer.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const address = user.addresses.find(
    (addr) => addr._id.toString() === addressId
  );

  if (!address) {
    return res
      .status(404)
      .json({ success: false, message: "Address not found" });
  }

  // Update address fields
  if (fullName) address.fullName = fullName;
  if (phone) address.phone = phone;
  if (street) address.street = street;
  if (city) address.city = city;
  if (state) address.state = state;
  if (postalCode) address.postalCode = postalCode;
  if (country) address.country = country;

  await user.save();

  res.json({
    success: true,
    message: "Address updated successfully",
    address,
  });
});

// Delete address
exports.deleteAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  if (!ensureCustomer(req, res)) return;

  const user = await Customer.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  user.addresses = user.addresses.filter(
    (addr) => addr._id.toString() !== addressId
  );

  // If deleted address was default, set new default
  if (user.defaultAddressId?.toString() === addressId) {
    if (user.addresses.length > 0) {
      user.defaultAddressId = user.addresses[0]._id;
      user.addresses[0].isDefault = true;
    } else {
      user.defaultAddressId = null;
    }
  }

  await user.save();

  res.json({
    success: true,
    message: "Address deleted successfully",
  });
});

// Set default address
exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const { addressId } = req.params;

  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const address = user.addresses.find(
    (addr) => addr._id.toString() === addressId
  );

  if (!address) {
    return res
      .status(404)
      .json({ success: false, message: "Address not found" });
  }

  // Remove isDefault from all addresses
  user.addresses.forEach((addr) => {
    addr.isDefault = false;
  });

  // Set as default
  address.isDefault = true;
  user.defaultAddressId = address._id;

  await user.save();

  res.json({
    success: true,
    message: "Default address updated successfully",
    address,
  });
});
