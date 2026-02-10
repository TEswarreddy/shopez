import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getMyOrders, getOrderById } from "../../api/orderService"

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState("All")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [loadingOrderDetails, setLoadingOrderDetails] = useState(false)

  // Fetch orders from API
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMyOrders()
      // Sort by date (newest first)
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setOrders(sortedOrders)
    } catch (err) {
      console.error("Error fetching orders:", err)
      setError(err.response?.data?.message || "Failed to load orders")
    } finally {
      setLoading(false)
    }
  }

  // Fetch order details for modal
  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingOrderDetails(true)
      const orderData = await getOrderById(orderId)
      setSelectedOrder(orderData)
      setShowModal(true)
    } catch (err) {
      console.error("Error fetching order details:", err)
      alert(err.response?.data?.message || "Failed to load order details")
    } finally {
      setLoadingOrderDetails(false)
    }
  }

  // Filter orders by status
  const filterOptions = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
  const filteredOrders = selectedFilter === "All" 
    ? orders 
    : orders.filter(order => order.status === selectedFilter)

  // Get status badge styling
  const getStatusBadge = (status) => {
    const badges = {
      Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      Processing: "bg-blue-100 text-blue-800 border-blue-200",
      Shipped: "bg-purple-100 text-purple-800 border-purple-200",
      Delivered: "bg-green-100 text-green-800 border-green-200",
      Cancelled: "bg-red-100 text-red-800 border-red-200",
    }
    return badges[status] || "bg-slate-100 text-slate-800 border-slate-200"
  }

  // Get tracking progress (0-100%)
  const getTrackingProgress = (status) => {
    const progress = {
      Pending: 25,
      Processing: 50,
      Shipped: 75,
      Delivered: 100,
      Cancelled: 0,
    }
    return progress[status] || 0
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  // Close modal
  const closeModal = () => {
    setShowModal(false)
    setSelectedOrder(null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-[#1f5fbf]"></div>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-red-50 p-8 text-center">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">{error}</h2>
            <button
              onClick={fetchOrders}
              className="mt-4 rounded-lg bg-[#1f5fbf] px-6 py-3 font-semibold text-white transition hover:bg-[#1a4da0]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Empty orders state
  if (orders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-slate-900">My Orders</h1>
          
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">No orders yet</h2>
            <p className="mb-6 text-slate-600">Your order history will appear here.</p>
            <Link
              to="/"
              className="inline-block rounded-lg bg-[#1f5fbf] px-6 py-3 font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Orders list with filters
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">
            My Orders ({orders.length})
          </h1>
          <p className="mt-2 text-slate-600">Track and manage your orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 overflow-x-auto">
          <div className="flex gap-2 border-b border-slate-200 pb-2">
            {filterOptions.map((filter) => {
              const count = filter === "All" 
                ? orders.length 
                : orders.filter(o => o.status === filter).length
              
              return (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 font-semibold transition ${
                    selectedFilter === filter
                      ? "bg-[#1f5fbf] text-white shadow-md"
                      : "bg-white text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {filter}
                  <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                    selectedFilter === filter
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700"
                  }`}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">No {selectedFilter.toLowerCase()} orders found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="group overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md"
              >
                {/* Order Header */}
                <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Order ID</p>
                        <p className="font-mono text-sm font-semibold text-slate-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div className="h-8 w-px bg-slate-200"></div>
                      <div>
                        <p className="text-sm text-slate-600">Order Date</p>
                        <p className="font-semibold text-slate-900">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="h-8 w-px bg-slate-200"></div>
                      <div>
                        <p className="text-sm text-slate-600">Total Amount</p>
                        <p className="text-lg font-bold text-[#1f5fbf]">
                          ₹{order.totalAmount?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                  <div className="space-y-3">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <img
                            src={item.product?.images?.[0] || "https://via.placeholder.com/100"}
                            alt={item.product?.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">
                            {item.product?.name || "Product"}
                          </p>
                          <p className="text-sm text-slate-600">
                            Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-semibold text-slate-900">
                          ₹{(item.quantity * item.price)?.toLocaleString()}
                        </p>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <p className="text-sm text-slate-600">
                        +{order.items.length - 3} more item{order.items.length - 3 > 1 ? "s" : ""}
                      </p>
                    )}
                  </div>

                  {/* Order Tracking Progress */}
                  {order.status !== "Cancelled" && (
                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-slate-700">Order Progress</span>
                        <span className="text-slate-600">{order.status}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full bg-gradient-to-r from-[#1f5fbf] to-[#1a4da0] transition-all duration-1000"
                          style={{ width: `${getTrackingProgress(order.status)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 flex justify-between text-xs text-slate-500">
                        <span>Pending</span>
                        <span>Processing</span>
                        <span>Shipped</span>
                        <span>Delivered</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button
                      onClick={() => fetchOrderDetails(order._id)}
                      disabled={loadingOrderDetails}
                      className="flex items-center gap-2 rounded-lg border-2 border-[#1f5fbf] px-4 py-2 font-semibold text-[#1f5fbf] transition hover:bg-[#1f5fbf] hover:text-white hover:scale-105 active:scale-95 disabled:opacity-50"
                    >
                      {loadingOrderDetails ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1f5fbf] border-t-transparent"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Details
                        </>
                      )}
                    </button>

                    {order.status === "Delivered" && (
                      <button className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-200 hover:scale-105 active:scale-95">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Leave Review
                      </button>
                    )}

                    {(order.status === "Pending" || order.status === "Processing") && (
                      <button className="flex items-center gap-2 rounded-lg bg-red-50 px-4 py-2 font-semibold text-red-600 transition hover:bg-red-100 hover:scale-105 active:scale-95">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">Order Details</h2>
                  <p className="text-sm text-slate-600">
                    Order ID: #{selectedOrder._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Status & Date */}
                <div className="mb-6 flex flex-wrap items-center gap-4">
                  <div
                    className={`rounded-full border-2 px-4 py-1.5 text-sm font-bold ${getStatusBadge(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </div>
                  <div className="h-6 w-px bg-slate-200"></div>
                  <p className="text-slate-600">
                    Ordered on <span className="font-semibold text-slate-900">{formatDate(selectedOrder.createdAt)}</span>
                  </p>
                </div>

                {/* Tracking Timeline */}
                {selectedOrder.status !== "Cancelled" && (
                  <div className="mb-8 rounded-xl bg-slate-50 p-6">
                    <h3 className="mb-4 font-bold text-slate-900">Order Tracking</h3>
                    <div className="relative">
                      {/* Progress Line */}
                      <div className="absolute left-4 top-0 h-full w-0.5 bg-slate-200"></div>
                      <div
                        className="absolute left-4 top-0 w-0.5 bg-gradient-to-b from-[#1f5fbf] to-[#1a4da0] transition-all duration-1000"
                        style={{ height: `${getTrackingProgress(selectedOrder.status)}%` }}
                      ></div>

                      {/* Timeline Steps */}
                      <div className="space-y-6">
                        {["Pending", "Processing", "Shipped", "Delivered"].map((step, index) => {
                          const isCompleted = getTrackingProgress(selectedOrder.status) >= (index + 1) * 25
                          const isCurrent = selectedOrder.status === step

                          return (
                            <div key={step} className="relative flex items-start gap-4">
                              <div
                                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 transition ${
                                  isCompleted
                                    ? "border-[#1f5fbf] bg-[#1f5fbf] text-white"
                                    : "border-slate-300 bg-white text-slate-400"
                                }`}
                              >
                                {isCompleted ? (
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                  </svg>
                                ) : (
                                  <span className="text-sm font-bold">{index + 1}</span>
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`font-semibold ${isCurrent ? "text-[#1f5fbf]" : "text-slate-900"}`}>
                                  {step}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {step === "Pending" && "Order placed successfully"}
                                  {step === "Processing" && "Your order is being prepared"}
                                  {step === "Shipped" && "Order is on the way"}
                                  {step === "Delivered" && "Order delivered"}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="mb-4 font-bold text-slate-900">Items ({selectedOrder.items?.length})</h3>
                  <div className="space-y-4">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex gap-4 rounded-lg border border-slate-200 p-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <img
                            src={item.product?.images?.[0] || "https://via.placeholder.com/100"}
                            alt={item.product?.name || "Product"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{item.product?.name || "Product"}</p>
                          <p className="mt-1 text-sm text-slate-600">
                            Quantity: {item.quantity}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Price: ₹{item.price?.toLocaleString()} each
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-slate-900">
                            ₹{(item.quantity * item.price)?.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div className="mb-6 rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-2 font-bold text-slate-900">Shipping Address</h3>
                    <p className="text-slate-700">
                      {selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.city}
                    </p>
                    <p className="text-slate-700">
                      {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.zipCode}
                    </p>
                    <p className="text-slate-700">{selectedOrder.shippingAddress.country}</p>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="rounded-lg border border-slate-200 p-4">
                  <h3 className="mb-4 font-bold text-slate-900">Payment Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-700">
                      <span>Subtotal</span>
                      <span>₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-700">
                      <span>Shipping</span>
                      <span className="text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-lg font-bold text-slate-900">
                      <span>Total</span>
                      <span className="text-[#1f5fbf]">₹{selectedOrder.totalAmount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Need Help */}
                <div className="mt-6 rounded-lg bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <svg className="h-6 w-6 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <div>
                      <h4 className="font-semibold text-blue-900">Need Help?</h4>
                      <p className="mt-1 text-sm text-blue-700">Contact our support team for any issues with your order.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Orders
