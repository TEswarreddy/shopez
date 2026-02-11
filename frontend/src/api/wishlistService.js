import axiosInstance from "./axios"

// Transform product data to match frontend expectations
const transformProduct = (product) => {
  if (!product) return null
  
  return {
    ...product,
    images: Array.isArray(product.images)
      ? product.images
      : typeof product.images === "string"
      ? product.images.split(" ").filter(Boolean)
      : [],
    rating: product.ratings?.average || product.rating || 0,
    brand: product.brand || product.vendor?.firstName || "Unknown",
    inStock: product.stock > 0,
  }
}

// Transform wishlist data
const transformWishlist = (wishlist) => {
  if (!wishlist) return null
  
  return {
    ...wishlist,
    items: (wishlist.products || []).map(item => ({
      ...item,
      product: transformProduct(item.product)
    }))
  }
}

// Get user's wishlist
export const getWishlist = async () => {
  const response = await axiosInstance.get("/wishlist")
  return transformWishlist(response.data.wishlist)
}

// Add item to wishlist
export const addToWishlist = async (productId) => {
  const response = await axiosInstance.post("/wishlist/add", { productId })
  return transformWishlist(response.data.wishlist)
}

// Remove item from wishlist
export const removeFromWishlist = async (productId) => {
  const response = await axiosInstance.post("/wishlist/remove", { productId })
  return transformWishlist(response.data.wishlist)
}

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
}
