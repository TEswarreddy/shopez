import axiosInstance from "./axios"

// Get user's wishlist
export const getWishlist = async () => {
  const response = await axiosInstance.get("/wishlist")
  return response.data.wishlist
}

// Add item to wishlist
export const addToWishlist = async (productId) => {
  const response = await axiosInstance.post("/wishlist/add", { productId })
  return response.data.wishlist
}

// Remove item from wishlist
export const removeFromWishlist = async (productId) => {
  const response = await axiosInstance.post("/wishlist/remove", { productId })
  return response.data.wishlist
}

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
}
