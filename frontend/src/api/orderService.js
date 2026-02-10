import axiosInstance from "./axios"

// Create new order
export const createOrder = async (orderData) => {
  const response = await axiosInstance.post("/orders", orderData)
  return response.data.order
}

// Get user's orders
export const getMyOrders = async () => {
  const response = await axiosInstance.get("/orders/my-orders")
  return response.data.orders
}

// Get single order by ID
export const getOrderById = async (orderId) => {
  const response = await axiosInstance.get(`/orders/${orderId}`)
  return response.data.order
}

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await axiosInstance.put(`/orders/${orderId}`, { status })
  return response.data.order
}

export default {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
}
