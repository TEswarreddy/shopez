const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};

const adminAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Admin access required" });
    }
  });
};

const vendorAuth = (req, res, next) => {
  auth(req, res, () => {
    if (req.user.role === "vendor" || req.user.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "Vendor access required" });
    }
  });
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    auth(req, res, () => {
      if (allowedRoles.includes(req.user.role)) {
        next();
      } else {
        res.status(403).json({ 
          message: `Access restricted to: ${allowedRoles.join(", ")}`,
          role: req.user.role
        });
      }
    });
  };
};

module.exports = { auth, adminAuth, vendorAuth, authorize };
