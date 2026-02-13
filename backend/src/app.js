const express = require("express");
const cors = require("cors");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/cart", require("./routes/cartRoutes"));
app.use("/api/wishlist", require("./routes/wishlistRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/vendor", require("./routes/vendorRoutes"));
app.use("/api/payment", require("./routes/paymentRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/test", require("./routes/testRoutes"));

// Health check
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ShopEz API", status: "Server is running" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
