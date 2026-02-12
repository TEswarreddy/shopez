import { useState, useEffect } from "react"
import axios from "../../api/axios"
import AdminSidebar from "../../components/AdminSidebar"

function OrderManagement() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [paymentFilter, setPaymentFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, paymentFilter, page])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 10 }
      if (statusFilter !== "all") params.status = statusFilter
      if (paymentFilter !== "all") params.paymentStatus = paymentFilter

      const response = await axios.get(`/admin/orders`, { params })
      if (response.data.success) {
        setOrders(response.data.orders)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const openDetailsModal = (order) => {
    setSelectedOrder(order)
    setShowDetailsModal(true)
  }

  const closeDetailsModal = () => {
    setShowDetailsModal(false)
    setSelectedOrder(null)
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
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <p className="text-slate-600 mt-2">View and track all orders on the platform</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Order Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => {
                setPaymentFilter(e.target.value)
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-100 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Order Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Payment Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-600">
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {order.customer?.firstName || "N/A"} {order.customer?.lastName || ""}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      ₹{order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "shipped"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "confirmed"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "completed"
                            ? "bg-green-100 text-green-800"
                            : order.paymentStatus === "failed"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openDetailsModal(order)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-6 max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Order #{selectedOrder._id.slice(-6).toUpperCase()}
            </h2>

            <div className="space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600">Name</p>
                    <p className="font-medium text-slate-900">
                      {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Email</p>
                    <p className="font-medium text-slate-900">{selectedOrder.customer?.email}</p>
                  </div>
                </div>
              </div>

              {/* Order Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Order Status</p>
                  <p className="font-medium text-slate-900 capitalize">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Payment Status</p>
                  <p className="font-medium text-slate-900 capitalize">
                    {selectedOrder.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Order Amount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600">Total Amount</p>
                  <p className="font-medium text-slate-900">
                    ₹{selectedOrder.totalAmount?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Order Date</p>
                  <p className="font-medium text-slate-900">
                    {new Date(selectedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Items */}
              {selectedOrder.items && selectedOrder.items.length > 0 && (
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Items</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg">
                        <p className="font-medium text-slate-900">
                          {item.product?.name || "Product"}
                        </p>
                        <p className="text-xs text-slate-600">
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString()} = ₹
                          {(item.quantity * item.price).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={closeDetailsModal}
              className="w-full mt-6 px-4 py-2 bg-slate-100 text-slate-900 rounded-lg hover:bg-slate-200 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default OrderManagement
