import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getVendorDashboard } from "../../api/vendorService"

function VendorDashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const data = await getVendorDashboard()
      setDashboard(data)
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
  const recentOrders = dashboard?.recentOrders || []

  return (
    <div className="min-h-[calc(100vh-64px)] px-4 py-8 bg-slate-50">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Vendor Dashboard</h1>
          <p className="mt-2 text-slate-600">Manage your products, orders, and sales</p>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Products */}
          <Link to="/vendor/products" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Products</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalProducts || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Pending Orders */}
          <Link to="/vendor/orders" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending Orders</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.pendingOrders || 0}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Total Revenue */}
          <Link to="/vendor/analytics" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">₹{(stats.totalRevenue || 0).toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Total Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Orders</p>
                <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalOrders || 0}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
            <Link
              to="/vendor/orders"
              className="text-sm font-semibold text-[#1f5fbf] hover:text-[#1a4da0]"
            >
              View All →
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Customer</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Product</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-sm text-slate-600">{order.orderNumber}</td>
                      <td className="px-4 py-3 text-sm text-slate-900">
                        {order.customer?.firstName} {order.customer?.lastName}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {order.items?.[0]?.product?.name || "-"}
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                        ₹{order.totalAmount?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-500">No orders yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <Link
            to="/vendor/products"
            className="rounded-lg bg-[#1f5fbf] px-6 py-4 text-center font-semibold text-white transition hover:bg-[#1a4da0]"
          >
            Manage Products
          </Link>
          <Link
            to="/vendor/orders"
            className="rounded-lg border-2 border-[#1f5fbf] px-6 py-4 text-center font-semibold text-[#1f5fbf] transition hover:bg-[#1f5fbf] hover:text-white"
          >
            View Orders
          </Link>
          <Link
            to="/vendor/settings"
            className="rounded-lg border-2 border-slate-200 px-6 py-4 text-center font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Shop Settings
          </Link>
        </div>
      </div>
    </div>
  )
}

export default VendorDashboard
