import axiosInstance from "./axios"

// Search products with query and filters
export const searchProducts = async (query, filters = {}) => {
  const params = {
    search: query,
    ...filters,
  }
  const response = await axiosInstance.get("/products", { params })
  const products = response.data.products || []
  
  // Transform products to match frontend expectations
  return products.map(product => ({
    ...product,
    images: Array.isArray(product.images) 
      ? product.images 
      : (typeof product.images === 'string' ? product.images.split(' ').filter(Boolean) : []),
    rating: product.ratings?.average || product.rating || 0,
    brand: product.brand || product.vendor?.firstName || 'Unknown',
    inStock: product.stock > 0
  }))
}

// Get search suggestions (quick search for autocomplete)
export const getSearchSuggestions = async (query) => {
  if (!query || query.length < 2) return []
  
  const response = await axiosInstance.get("/products", {
    params: { search: query, limit: 5 },
  })
  const products = response.data.products || []
  
  // Transform products to match frontend expectations
  return products.map(product => ({
    ...product,
    images: Array.isArray(product.images) 
      ? product.images 
      : (typeof product.images === 'string' ? product.images.split(' ').filter(Boolean) : []),
    rating: product.ratings?.average || product.rating || 0,
    brand: product.brand || product.vendor?.firstName || 'Unknown',
    inStock: product.stock > 0
  }))
}

export default {
  searchProducts,
  getSearchSuggestions,
}
