import { useState, useEffect } from "react"
import axiosInstance from "../../api/axios"
import VendorSidebar from "../../components/VendorSidebar"

function VendorAnalytics() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeRange, setTimeRange] = useState("monthly")

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const { data } = await axiosInstance.get(`/vendor/analytics?range=${timeRange}`)
      if (data.success) {
        setAnalytics(data.analytics)
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load analytics")
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

  const data = analytics || {}

  return (
    <div className="flex">
      <VendorSidebar />
      <div className="flex-1 min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-slate-900">Sales Analytics</h1>
            <div className="flex gap-2">
              {["daily", "weekly", "monthly", "yearly"].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                    timeRange === range
                      ? "bg-[#1f5fbf] text-white"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {error && (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 mb-6">
            {error}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Revenue */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200">
            <p className="text-sm font-medium text-green-700">Total Revenue</p>
            <p className="text-3xl font-bold text-green-900 mt-2">₹{(data.totalRevenue || 0).toLocaleString()}</p>
            <p className="text-xs text-green-600 mt-2">
              {data.revenueGrowth > 0 ? "↑" : "↓"} {Math.abs(data.revenueGrowth || 0).toFixed(1)}% vs last period
            </p>
          </div>

          {/* Total Orders */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200">
            <p className="text-sm font-medium text-blue-700">Total Orders</p>
            <p className="text-3xl font-bold text-blue-900 mt-2">{data.totalOrders || 0}</p>
            <p className="text-xs text-blue-600 mt-2">
              {data.orderGrowth > 0 ? "↑" : "↓"} {Math.abs(data.orderGrowth || 0).toFixed(1)}% vs last period
            </p>
          </div>

          {/* Avg Order Value */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-6 border border-purple-200">
            <p className="text-sm font-medium text-purple-700">Avg Order Value</p>
            <p className="text-3xl font-bold text-purple-900 mt-2">₹{(data.avgOrderValue || 0).toLocaleString()}</p>
            <p className="text-xs text-purple-600 mt-2">
              {data.aovGrowth > 0 ? "↑" : "↓"} {Math.abs(data.aovGrowth || 0).toFixed(1)}% vs last period
            </p>
          </div>

          {/* Conversion Rate */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl shadow-sm p-6 border border-orange-200">
            <p className="text-sm font-medium text-orange-700">Conversion Rate</p>
            <p className="text-3xl font-bold text-orange-900 mt-2">{(data.conversionRate || 0).toFixed(1)}%</p>
            <p className="text-xs text-orange-600 mt-2">
              {data.conversionGrowth > 0 ? "↑" : "↓"} {Math.abs(data.conversionGrowth || 0).toFixed(1)}% vs last period
            </p>
          </div>
        </div>

        {/* Charts & Detailed Analytics */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sales Trend */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Sales Trend</h2>
            <div className="h-64 flex items-end gap-2 justify-between">
              {data.salesTrend?.map((point, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-gradient-to-t from-[#1f5fbf] to-blue-400 rounded-t transition hover:opacity-80"
                    style={{ height: `${Math.max(10, (point.value / Math.max(...data.salesTrend.map(p => p.value), 1)) * 100)}%` }}
                    title={`₹${point.value.toLocaleString()}`}
                  />
                  <span className="text-xs text-slate-600 text-center">{point.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Order Status Distribution</h2>
            <div className="space-y-4">
              {data.orderStatusBreakdown?.map((status) => (
                <div key={status.name}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">{status.name}</span>
                    <span className="text-sm font-semibold text-slate-900">{status.count}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full transition ${
                        status.name === "Delivered" ? "bg-green-500" :
                        status.name === "Shipped" ? "bg-blue-500" :
                        status.name === "Confirmed" ? "bg-purple-500" :
                        "bg-slate-400"
                      }`}
                      style={{
                        width: `${Math.max(5, (status.count / Math.max(...data.orderStatusBreakdown.map(s => s.count), 1)) * 100)}%`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Top Selling Products</h2>
            <div className="space-y-3">
              {data.topProducts?.map((product, idx) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1f5fbf] text-white text-sm font-bold">
                      {idx + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.unitsSold} sold</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-900 text-right">₹{(product.revenue || 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Metrics */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Key Metrics</h2>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Customer Retention</span>
                <span className="text-sm font-semibold text-slate-900">{(data.customerRetention || 0).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: `${data.customerRetention || 0}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Product Performance</span>
                <span className="text-sm font-semibold text-slate-900">{data.productsPerformingWell || 0}/{data.totalProducts || 0}</span>
              </div>
              <p className="text-xs text-slate-600">Strong performing products</p>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-sm font-medium text-slate-700 mb-2">Average Rating</p>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(data.avgRating || 0) ? "text-yellow-400" : "text-slate-300"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-semibold text-slate-900">{(data.avgRating || 0).toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}

export default VendorAnalytics
