import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import axiosInstance from "../../api/axios"

function VendorDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedTab, setSelectedTab] = useState("overview")

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get("/vendor/dashboard/stats")
      if (data.success) {
        const payload = data.data || data
        setDashboard(payload)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard")
      console.error("Dashboard error:", err)
    } finally {
      setLoading(false)
    }
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

  if (error) {
    return (
      <div className="min-h-[calc(100vh-64px)] px-4 py-8 bg-slate-50">
        <div className="rounded-xl bg-red-50 p-8 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchDashboard}
            className="mt-4 rounded-lg bg-[#1f5fbf] px-6 py-2 text-white transition hover:bg-[#1a4da0]"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const stats = dashboard?.stats || {}
  const topProducts = dashboard?.topProducts || []
  const recentOrders = dashboard?.recentOrders || []
  const performanceMetrics = dashboard?.performance || {}
  const inventory = dashboard?.inventory || { lowStockItems: [], lowStockCount: 0 }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Vendor Dashboard</h1>
              <p className="mt-1 text-slate-600">Manage your store, products, and orders</p>
            </div>
            <button
              onClick={fetchDashboard}
              className="rounded-lg bg-[#1f5fbf] px-4 py-2 text-white transition hover:bg-[#1a4da0] flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Key Metrics - Row 1 */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700">Total Revenue</p>
                <p className="text-3xl font-bold text-green-900 mt-2">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">This month</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-200 flex items-center justify-center">
                <svg className="h-6 w-6 text-green-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700">Total Orders</p>
                <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalOrders || 0}</p>
                <p className="text-xs text-blue-600 mt-1">{stats.pendingOrders || 0} pending</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-200 flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-6 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700">Active Products</p>
                <p className="text-3xl font-bold text-purple-900 mt-2">{stats.totalProducts || 0}</p>
                <p className="text-xs text-purple-600 mt-1">{inventory.lowStockCount || 0} low stock</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-200 flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>
          </div>

          {/* Rating & Reviews */}
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl shadow-sm p-6 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-700">Average Rating</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-bold text-yellow-900">{(stats.avgRating || 0).toFixed(1)}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(stats.avgRating || 0) ? "text-yellow-400" : "text-yellow-200"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-yellow-600 mt-1">{stats.totalReviews || 0} reviews</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-200 flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          {/* Conversion Rate */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{(performanceMetrics.conversionRate || 0).toFixed(1)}%</p>
            <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${performanceMetrics.conversionRate || 0}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">Visitors to customers</p>
          </div>

          {/* Avg Order Value */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm font-medium text-slate-600">Avg Order Value</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">₹{(performanceMetrics.avgOrderValue || 0).toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-4">
              ↑ {(performanceMetrics.orderValueTrend || 0).toFixed(1)}% from last month
            </p>
          </div>

          {/* Fulfillment Rate */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <p className="text-sm font-medium text-slate-600">Fulfillment Rate</p>
            <p className="text-2xl font-bold text-slate-900 mt-2">{(performanceMetrics.fulfillmentRate || 0).toFixed(1)}%</p>
            <div className="mt-4 h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-green-500" style={{ width: `${performanceMetrics.fulfillmentRate || 0}%` }}></div>
            </div>
            <p className="text-xs text-slate-500 mt-2">On-time delivery</p>
          </div>
        </div>

        {/* Top Products & Recent Orders */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Top Selling Products</h2>
              <Link to="/vendor/products" className="text-xs font-semibold text-[#1f5fbf] hover:text-[#1a4da0]">
                View All →
              </Link>
            </div>

            {topProducts.length > 0 ? (
              <div className="space-y-4">
                {topProducts.slice(0, 5).map((product, idx) => (
                  <div key={product._id} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                        <p className="text-xs text-slate-500">{product.soldCount || 0} sold</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-slate-900">₹{(product.price || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">No products yet</p>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
              <Link to="/vendor/orders" className="text-xs font-semibold text-[#1f5fbf] hover:text-[#1a4da0]">
                View All →
              </Link>
            </div>

            {recentOrders.length > 0 ? (
              <div className="space-y-4">
                {recentOrders.slice(0, 5).map((order) => (
                  <div key={order._id} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">Order #{order.orderNumber}</p>
                      <p className="text-xs text-slate-500">{order.customer?.firstName} {order.customer?.lastName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-slate-900">₹{(order.totalAmount || 0).toLocaleString()}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "delivered" ? "bg-green-100 text-green-700" :
                        order.status === "shipped" ? "bg-blue-100 text-blue-700" :
                        order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Inventory Alerts */}
        {inventory.lowStockItems && inventory.lowStockItems.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border-l-4 border-yellow-400">
            <div className="flex items-center gap-3 mb-4">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4v2m0 4v2M7.818 4.904a3 3 0 001.946-1.806 3 3 0 013.472 0 3.001 3.001 0 001.946 1.806M7 20h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v15a2 2 0 002 2z" />
              </svg>
              <h3 className="text-lg font-bold text-slate-900">Low Stock Alert</h3>
            </div>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {inventory.lowStockItems.map((item) => (
                <Link
                  key={item._id}
                  to={`/vendor/products/${item._id}`}
                  className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 hover:bg-yellow-100 transition"
                >
                  <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                  <p className="text-xs text-yellow-700 mt-1">{item.stock} units remaining</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            to="/vendor/products"
            className="flex items-center gap-3 rounded-lg bg-[#1f5fbf] px-6 py-4 font-semibold text-white transition hover:bg-[#1a4da0]"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </Link>
          <Link
            to="/vendor/orders"
            className="flex items-center gap-3 rounded-lg border-2 border-[#1f5fbf] px-6 py-4 font-semibold text-[#1f5fbf] transition hover:bg-[#1f5fbf] hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Manage Orders
          </Link>
          <Link
            to="/vendor/analytics"
            className="flex items-center gap-3 rounded-lg border-2 border-slate-200 px-6 py-4 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Analytics
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboard
