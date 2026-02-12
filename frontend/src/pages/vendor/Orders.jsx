import { useState, useEffect } from "react"
import axiosInstance from "../../api/axios"
import VendorSidebar from "../../components/VendorSidebar"

function VendorOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get("/vendor/orders")
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async () => {
    try {
      await axiosInstance.put(`/vendor/orders/${selectedOrder._id}/status`, {
        status: newStatus,
      })
      setShowModal(false)
      setSelectedOrder(null)
      setNewStatus("")
      fetchOrders()
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update order status")
    }
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true
    return order.status === filter
  })

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-blue-100 text-blue-700",
      shipped: "bg-purple-100 text-purple-700",
      delivered: "bg-green-100 text-green-700",
      cancelled: "bg-red-100 text-red-700",
    }
    return colors[status] || "bg-slate-100 text-slate-700"
  }

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
          <h1 className="text-3xl font-bold text-slate-900">Order Management</h1>
          <p className="mt-1 text-slate-600">{filteredOrders.length} orders</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            { value: "all", label: "All Orders" },
            { value: "pending", label: "Pending" },
            { value: "confirmed", label: "Confirmed" },
            { value: "shipped", label: "Shipped" },
            { value: "delivered", label: "Delivered" },
            { value: "cancelled", label: "Cancelled" },
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

        {/* Orders Table */}
        {filteredOrders.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Items</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">#{order.orderNumber}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                        ₹{(order.totalAmount || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => {
                            setSelectedOrder(order)
                            setNewStatus(order.status)
                            setShowModal(true)
                          }}
                          className="text-[#1f5fbf] font-semibold hover:text-[#1a4da0] transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-slate-600">No orders found</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Order #{selectedOrder.orderNumber}</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Customer Information</h3>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedOrder.customer?.firstName} {selectedOrder.customer?.lastName}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">{selectedOrder.customer?.email}</p>
                    <p className="text-xs text-slate-600">{selectedOrder.customer?.phone}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Shipping Address</h3>
                  <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-600">
                    {selectedOrder.shippingAddress && (
                      <>
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                        <p>{selectedOrder.shippingAddress.pincode}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Order Items</h3>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{item.product?.name}</p>
                        <p className="text-xs text-slate-600">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment & Totals */}
              <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal:</span>
                  <span className="font-semibold text-slate-900">₹{(selectedOrder.subtotal || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping:</span>
                  <span className="font-semibold text-slate-900">₹{(selectedOrder.shippingCost || 0).toLocaleString()}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="font-semibold text-slate-900">Total:</span>
                  <span className="font-bold text-lg text-slate-900">₹{(selectedOrder.totalAmount || 0).toLocaleString()}</span>
                </div>
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Update Status</h3>
                <div className="flex gap-3">
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#1f5fbf] focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <button
                    onClick={handleUpdateStatus}
                    className="bg-[#1f5fbf] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#1a4da0] transition"
                  >
                    Update
                  </button>
                </div>
              </div>

              {/* Timeline */}
              {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-3">Order Timeline</h3>
                  <div className="space-y-2">
                    {selectedOrder.timeline.map((event, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <div className="w-2 h-2 rounded-full bg-[#1f5fbf] mt-2"></div>
                        <div>
                          <p className="font-semibold text-slate-900">{event.status}</p>
                          <p className="text-xs text-slate-600">{new Date(event.date).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default VendorOrders
