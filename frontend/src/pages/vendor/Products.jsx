import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "../../api/axios"
import VendorSidebar from "../../components/VendorSidebar"

function VendorProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [imageError, setImageError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    images: [],
  })

  const categoryOptions = useMemo(() => {
    const defaults = [
      "Electronics",
      "Fashion",
      "Home",
      "Beauty",
      "Sports",
      "Grocery",
      "Books",
      "Toys",
      "Automotive",
      "Other",
    ]
    const dynamic = products.map((product) => product.category).filter(Boolean)
    return Array.from(new Set([...defaults, ...dynamic]))
  }, [products])

  useEffect(() => {
    fetchProducts()
  }, [filter])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get("/vendor/products")
      if (data.success) {
        setProducts(data.products)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) {
      setImagePreview("")
      setImageError("")
      setFormData((prev) => ({ ...prev, images: [] }))
      return
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"]
    if (!allowedTypes.includes(file.type)) {
      setImageError("Only JPG, PNG, or WEBP images are allowed.")
      setImagePreview("")
      setFormData((prev) => ({ ...prev, images: [] }))
      return
    }

    const maxSizeBytes = 2 * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setImageError("Image must be smaller than 2MB.")
      setImagePreview("")
      setFormData((prev) => ({ ...prev, images: [] }))
      return
    }

    setImageError("")
    const reader = new FileReader()
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : ""
      setImagePreview(result)
      setFormData((prev) => ({ ...prev, images: result ? [result] : [] }))
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!editingProduct && formData.images.length === 0) {
        setImageError("Please select a product image.")
        return
      }

      const payload = {
        ...formData,
        images:
          formData.images.length > 0
            ? formData.images
            : Array.isArray(editingProduct?.images)
              ? editingProduct.images
              : [],
      }

      if (editingProduct) {
        await axiosInstance.put(`/vendor/products/${editingProduct._id}`, payload)
      } else {
        await axiosInstance.post("/vendor/products", payload)
      }
      setShowForm(false)
      setFormData({ name: "", description: "", price: "", stock: "", category: "", images: [] })
      setImagePreview("")
      setImageError("")
      setEditingProduct(null)
      fetchProducts()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product")
    }
  }

  const handleEdit = (product) => {
    const existingImages = Array.isArray(product.images)
      ? product.images
      : product.image
        ? [product.image]
        : []

    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      images: existingImages,
    })
    setImagePreview(existingImages[0] || "")
    setImageError("")
    setShowForm(true)
  }

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axiosInstance.delete(`/vendor/products/${productId}`)
        fetchProducts()
      } catch (err) {
        setError(err.response?.data?.message || "Failed to delete product")
      }
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())

    if (filter === "low-stock") return matchesSearch && p.stock < 10
    if (filter === "active") return matchesSearch && p.isActive
    if (filter === "inactive") return matchesSearch && !p.isActive
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] px-4 py-8 bg-slate-50">
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1f5fbf]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex">
      <VendorSidebar />
      <div className="flex-1 min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Product Management</h1>
              <p className="mt-1 text-slate-600">{filteredProducts.length} products</p>
            </div>
            <button
              onClick={() => {
                setEditingProduct(null)
                setFormData({ name: "", description: "", price: "", stock: "", category: "", images: [] })
                setImagePreview("")
                setImageError("")
                setShowForm(!showForm)
              }}
              className="bg-[#1f5fbf] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1a4da0] transition flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Add/Edit Product Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹)</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Stock</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
                  placeholder="0"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
                  placeholder="Product description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Product Image</label>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
                />
                {imageError && (
                  <p className="mt-2 text-sm text-red-600">{imageError}</p>
                )}
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    className="mt-3 h-32 w-32 rounded-lg object-cover border border-slate-200"
                  />
                )}
              </div>

              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#1f5fbf] text-white py-2 rounded-lg font-semibold hover:bg-[#1a4da0] transition"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 border-2 border-slate-300 text-slate-700 py-2 rounded-lg font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            { value: "all", label: "All Products" },
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "low-stock", label: "Low Stock" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition ${
                filter === f.value
                  ? "bg-[#1f5fbf] text-white"
                  : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
          />
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition">
                <div className="h-40 bg-slate-100 overflow-hidden">
                  {product.images?.[0] || product.image ? (
                    <img
                      src={product.images?.[0] || product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-slate-900">{product.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                    }`}>
                      {product.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{product.category}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-slate-900">₹{product.price.toLocaleString()}</span>
                    <span className="text-sm text-slate-600">Stock: {product.stock}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold hover:bg-blue-200 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p className="text-slate-600 mb-4">No products found</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#1f5fbf] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1a4da0]"
            >
              Create Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default VendorProducts
