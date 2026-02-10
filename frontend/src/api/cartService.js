import axiosInstance from "./axios"

// Get user's cart
export const getCart = async () => {
  const response = await axiosInstance.get("/cart")
  return response.data.cart
}

// Add item to cart
export const addToCart = async (productId, quantity = 1) => {
  const response = await axiosInstance.post("/cart/add", {
    productId,
    quantity,
  })
  return response.data.cart
}

// Remove item from cart
export const removeFromCart = async (productId) => {
  const response = await axiosInstance.post("/cart/remove", { productId })
  return response.data.cart
}

// Update cart item quantity
export const updateCartItem = async (productId, quantity) => {
  const response = await axiosInstance.put("/cart/update", {
    productId,
    quantity,
  })
  return response.data.cart
}

// Clear entire cart
export const clearCart = async () => {
  const response = await axiosInstance.delete("/cart/clear")
  return response.data.cart
}

export default {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
}
