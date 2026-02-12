import { useState, useEffect } from "react"
import axios from "../../api/axios"
import AdminSidebar from "../../components/AdminSidebar"

function ProductManagement() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [actionType, setActionType] = useState("") // delete, feature
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchProducts()
  }, [search, page])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/admin/products`, {
        params: { search, page, limit: 10 },
      })
      if (response.data.success) {
        setProducts(response.data.products)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    try {
      const response = await axios.delete(`/admin/products/${selectedProduct._id}`)
      if (response.data.success) {
        setProducts(products.filter((p) => p._id !== selectedProduct._id))
        closeModal()
        alert("Product deleted successfully!")
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete product")
    }
  }

  const handleFeatureProduct = async (featured) => {
    try {
      const response = await axios.put(`/admin/products/${selectedProduct._id}/feature`, {
        featured,
      })
      if (response.data.success) {
        setProducts(
          products.map((p) =>
            p._id === selectedProduct._id
              ? { ...p, isFeatured: featured }
              : p
          )
        )
        closeModal()
        alert(`Product ${featured ? "featured" : "unfeatured"} successfully!`)
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update product")
    }
  }

  const openModal = (product, type) => {
    setSelectedProduct(product)
    setActionType(type)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedProduct(null)
    setActionType("")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-screen px-4 py-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Product Management</h1>
          <p className="text-slate-600 mt-2">Manage products on the platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Product Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Vendor
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Featured
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-600">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-600">{product.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-600">
                        {product.vendor?.firstName} {product.vendor?.lastName}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      ₹{product.price?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {product.stock || 0} units
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.isFeatured
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {product.isFeatured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.isFeatured ? (
                          <button
                            onClick={() => openModal(product, "feature")}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Unfeature
                          </button>
                        ) : (
                          <button
                            onClick={() => openModal(product, "feature")}
                            className="text-orange-600 hover:text-orange-800 text-sm font-medium"
                          >
                            Feature
                          </button>
                        )}
                        <button
                          onClick={() => openModal(product, "delete")}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {actionType === "delete" && "Delete Product"}
              {actionType === "feature" &&
                (selectedProduct.isFeatured ? "Unfeature Product" : "Feature Product")}
            </h2>

            <p className="text-slate-600 mb-6">{selectedProduct.name}</p>

            {actionType === "delete" && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                This action cannot be undone. The product will be permanently deleted from the
                platform.
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-900 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={
                  actionType === "delete"
                    ? handleDeleteProduct
                    : () => handleFeatureProduct(!selectedProduct.isFeatured)
                }
                className={`flex-1 px-4 py-2 text-white rounded-lg transition ${
                  actionType === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {actionType === "delete" && "Delete"}
                {actionType === "feature" &&
                  (selectedProduct.isFeatured ? "Unfeature" : "Feature")}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default ProductManagement
