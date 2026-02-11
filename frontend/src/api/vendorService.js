import axiosInstance from "./axios"

// Dashboard
export const getVendorDashboard = async () => {
  const response = await axiosInstance.get("/vendor/dashboard/stats")
  return response.data
}

export const getVendorProfile = async () => {
  const response = await axiosInstance.get("/vendor/profile")
  return response.data
}

// Products
export const getVendorProducts = async (params = {}) => {
  const response = await axiosInstance.get("/vendor/products", { params })
  return response.data
}

export const createVendorProduct = async (productData) => {
  const response = await axiosInstance.post("/vendor/products", productData)
  return response.data
}

export const getVendorProduct = async (productId) => {
  const response = await axiosInstance.get(`/vendor/products/${productId}`)
  return response.data
}

export const updateVendorProduct = async (productId, productData) => {
  const response = await axiosInstance.put(`/vendor/products/${productId}`, productData)
  return response.data
}

export const deleteVendorProduct = async (productId) => {
  const response = await axiosInstance.delete(`/vendor/products/${productId}`)
  return response.data
}

// Orders
export const getVendorOrders = async (params = {}) => {
  const response = await axiosInstance.get("/vendor/orders", { params })
  return response.data
}

export const getVendorOrderDetails = async (orderId) => {
  const response = await axiosInstance.get(`/vendor/orders/${orderId}`)
  return response.data
}

export const updateVendorOrderStatus = async (orderId, itemIndex, status) => {
  const response = await axiosInstance.put(`/vendor/orders/${orderId}/status`, {
    itemIndex,
    status,
  })
  return response.data
}

// Analytics
export const getVendorAnalytics = async (period = "month") => {
  const response = await axiosInstance.get("/vendor/analytics", {
    params: { period },
  })
  return response.data
}

// Settings
export const getVendorSettings = async () => {
  const response = await axiosInstance.get("/vendor/settings")
  return response.data
}

export const updateVendorSettings = async (settingsData) => {
  const response = await axiosInstance.put("/vendor/settings", settingsData)
  return response.data
}

export default {
  getVendorDashboard,
  getVendorProfile,
  getVendorProducts,
  createVendorProduct,
  getVendorProduct,
  updateVendorProduct,
  deleteVendorProduct,
  getVendorOrders,
  getVendorOrderDetails,
  updateVendorOrderStatus,
  getVendorAnalytics,
  getVendorSettings,
  updateVendorSettings,
}
