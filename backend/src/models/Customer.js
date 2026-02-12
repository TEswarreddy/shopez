const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide first name"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide last name"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide password"],
      minlength: 6,
      select: false,
    },
    phone: String,
    role: {
      type: String,
      default: "customer",
      immutable: true,
    },
    profileImage: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    lastLogin: Date,
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: Date,

    // Customer profile
    addresses: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        fullName: String,
        phone: String,
        street: String,
        city: String,
        state: String,
        postalCode: String,
        country: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    defaultAddressId: mongoose.Schema.Types.ObjectId,
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    preferences: {
      newsletter: {
        type: Boolean,
        default: true,
      },
      orderUpdates: {
        type: Boolean,
        default: true,
      },
      promotions: {
        type: Boolean,
        default: false,
      },
    },
    loyaltyPoints: {
      type: Number,
      default: 0,
    },
    totalOrders: {
      type: Number,
      default: 0,
    },
    totalSpent: {
      type: Number,
      default: 0,
    },
    lastOrderDate: Date,
    suspensionReason: String,
    suspendedAt: Date,
  },
  { timestamps: true, collection: "customeraccounts" }
);

customerSchema.virtual("isLocked").get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

customerSchema.pre("save", async function() {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

customerSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

customerSchema.methods.incLoginAttempts = function() {
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 },
    });
  }

  const updates = { $inc: { loginAttempts: 1 } };
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000;

  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }

  return this.updateOne(updates);
};

customerSchema.methods.resetLoginAttempts = function() {
  return this.updateOne({
    $set: { loginAttempts: 0, lastLogin: Date.now() },
    $unset: { lockUntil: 1 },
  });
};

module.exports = mongoose.model("Customer", customerSchema);
