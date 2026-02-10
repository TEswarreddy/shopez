import axiosInstance from "./axios"

// Get all products with optional filters
export const getProducts = async (params = {}) => {
  const response = await axiosInstance.get("/products", { params })
  return response.data.products || []
}

// Get single product by ID
export const getProductById = async (productId) => {
  const response = await axiosInstance.get(`/products/${productId}`)
  return response.data.product
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
