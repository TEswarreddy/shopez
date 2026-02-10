// Pagination utility
const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  if (page < 1) page = 1;
  if (limit < 1) limit = 12;
  if (limit > 100) limit = 100;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// Generate order number
const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Format currency
const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

module.exports = {
  getPaginationParams,
  generateOrderNumber,
  formatCurrency,
};
