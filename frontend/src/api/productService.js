import axiosInstance from "./axios"

// Get all products with optional filters
export const getProducts = async (params = {}) => {
  const response = await axiosInstance.get("/products", { params })
  const products = response.data.products || []
  
  // Transform products to match frontend expectations
  return products.map(product => {
    const normalizedStock = Number(
      product.stock ?? product.countInStock ?? product.inventory?.stock ?? 0
    )

    return {
      ...product,
      stock: Number.isNaN(normalizedStock) ? 0 : normalizedStock,
      images: Array.isArray(product.images) 
        ? product.images 
        : (typeof product.images === 'string' ? product.images.split(' ').filter(Boolean) : []),
      rating: product.ratings?.average || product.rating || 0,
      brand: product.brand || product.vendor?.firstName || 'Unknown',
      inStock: !Number.isNaN(normalizedStock) && normalizedStock > 0
    }
  })
}

// Get single product by ID
export const getProductById = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}`)
  const product = response.data.product
  
  // Transform product to match frontend expectations
  const normalizedStock = Number(
    product.stock ?? product.countInStock ?? product.inventory?.stock ?? 0
  )

  return {
    ...product,
    stock: Number.isNaN(normalizedStock) ? 0 : normalizedStock,
    images: Array.isArray(product.images) 
      ? product.images 
      : (typeof product.images === 'string' ? product.images.split(' ').filter(Boolean) : []),
    rating: product.ratings?.average || product.rating || 0,
    brand: product.brand || product.vendor?.firstName || 'Unknown',
    inStock: !Number.isNaN(normalizedStock) && normalizedStock > 0
  }
}

// Create new product (vendor only)
export const createProduct = async (productData) => {
  const response = await axiosInstance.post("/products", productData)
  return response.data.product
}

// Update product (vendor only)
export const updateProduct = async (productId, productData) => {
  const response = await axiosInstance.put(`/products/${productId}`, productData)
  return response.data.product
}

// Delete product (vendor only)
export const deleteProduct = async (productId) => {
  const response = await axiosInstance.delete(`/products/${productId}`)
  return response.data
}

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}
