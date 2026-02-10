// Validation utilities
const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const validatePhone = (phone) => {
  const re = /^[\d\s\-\+\(\)]{7,}$/;
  return re.test(phone);
};

// Response utilities
const sendSuccess = (res, statusCode, message, data = null) => {
  const response = {
    success: true,
    message,
  };
  if (data) response.data = data;
  res.status(statusCode).json(response);
};

const sendError = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };
  if (errors) response.errors = errors;
  res.status(statusCode).json(response);
};

module.exports = {
  validateEmail,
  validatePassword,
  validatePhone,
  sendSuccess,
  sendError,
};
