import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import axios from "../../api/axios"
import AdminSidebar from "../../components/AdminSidebar"
import { useAuth } from "../../context/AuthContext"

function AdminAnalytics() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [timeRange, setTimeRange] = useState("monthly") // daily, weekly, monthly, yearly
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [selectedMetric, setSelectedMetric] = useState(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/admin/analytics?range=${timeRange}`)
      if (response.data.success) {
        const payload = response.data.analytics || response.data.data || response.data
        console.log("Analytics data received:", payload)
        console.log("User growth points:", payload.userGrowthTrend?.length)
        console.log("Top vendors:", payload.topVendors?.length, payload.topVendors)
        setAnalytics(payload)
      } else {
        setError(response.data.message || "Failed to load analytics")
      }
    } catch (err) {
      console.error("Analytics error:", err.response?.data || err.message)
      setError(err.response?.data?.message || "Failed to load analytics")
    } finally {
      setLoading(false)
    }
  }, [timeRange])

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/admin/login")
      return
    }
    fetchAnalytics()
  }, [timeRange, user, navigate, fetchAnalytics])

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-screen bg-slate-50">
          <div className="p-6">
            {/* Skeleton for header */}
            <div className="h-12 w-64 bg-slate-200 rounded-lg animate-pulse mb-6"></div>
            {/* Skeleton for metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-32 animate-pulse">
                  <div className="h-4 w-24 bg-slate-200 rounded mb-4"></div>
                  <div className="h-8 w-32 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
            {/* Skeleton for charts */}
            <div className="grid gap-6 lg:grid-cols-2 mb-8">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-80 animate-pulse">
                  <div className="h-5 w-32 bg-slate-200 rounded mb-4"></div>
                  <div className="h-64 bg-slate-100 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const data = analytics || {
    revenueTrend: [],
    userGrowthTrend: [],
    orderStats: {},
    topProducts: [],
    topVendors: [],
    categoryDistribution: [],
    orderStatusBreakdown: [],
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalVendors: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
    userGrowth: 0,
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-[calc(100vh-64px)] bg-slate-50">
        {/* Header */}
        <div className="sticky top-16 z-40 bg-white border-b border-slate-200">
          <div className="px-6 py-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Platform Analytics</h1>
                <p className="text-slate-600 mt-1">Comprehensive insights and trends</p>
              </div>
              <div className="flex gap-2">
                {["daily", "weekly", "monthly", "yearly"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg font-semibold transition capitalize ${
                      timeRange === range
                        ? "bg-blue-600 text-white"
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

        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Debug Info - Remove in production */}
          {import.meta.env.DEV && analytics && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs font-mono text-blue-900">
                <strong>Debug:</strong> Revenue data points: {data.revenueTrend?.length || 0}, 
                User data points: {data.userGrowthTrend?.length || 0},
                Top Vendors: {data.topVendors?.length || 0}
              </p>
            </div>
          )}

          {/* Key Metrics Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {/* Total Revenue */}
            <div 
              onClick={() => setSelectedMetric(selectedMetric === 'revenue' ? null : 'revenue')}
              className={`bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm p-6 border-2 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedMetric === 'revenue' ? 'border-emerald-500 ring-4 ring-emerald-200' : 'border-emerald-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-700">Total Revenue</p>
                  <p className="text-3xl font-bold text-emerald-900 mt-2">
                    ₹{(data.totalRevenue || 0).toLocaleString()}
                  </p>
                  <div className="flex items-center mt-2">
                    <svg
                      className={`w-4 h-4 mr-1 ${data.revenueGrowth >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {data.revenueGrowth >= 0 ? (
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span className="text-xs font-medium text-emerald-600">
                      {Math.abs(data.revenueGrowth || 0).toFixed(1)}% vs last period
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-emerald-200 flex items-center justify-center transform transition-transform hover:rotate-12">
                  <svg className="h-6 w-6 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Orders */}
            <div 
              onClick={() => setSelectedMetric(selectedMetric === 'orders' ? null : 'orders')}
              className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border-2 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedMetric === 'orders' ? 'border-blue-500 ring-4 ring-blue-200' : 'border-blue-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-700">Total Orders</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{data.totalOrders || 0}</p>
                  <div className="flex items-center mt-2">
                    <svg
                      className={`w-4 h-4 mr-1 ${data.orderGrowth >= 0 ? "text-blue-600" : "text-red-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {data.orderGrowth >= 0 ? (
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span className="text-xs font-medium text-blue-600">
                      {Math.abs(data.orderGrowth || 0).toFixed(1)}% vs last period
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-200 flex items-center justify-center transform transition-transform hover:rotate-12">
                  <svg className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Users */}
            <div 
              onClick={() => setSelectedMetric(selectedMetric === 'users' ? null : 'users')}
              className={`bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-6 border-2 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedMetric === 'users' ? 'border-purple-500 ring-4 ring-purple-200' : 'border-purple-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-purple-700">Total Users</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{data.totalUsers || 0}</p>
                  <div className="flex items-center mt-2">
                    <svg
                      className={`w-4 h-4 mr-1 ${data.userGrowth >= 0 ? "text-purple-600" : "text-red-600"}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      {data.userGrowth >= 0 ? (
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      )}
                    </svg>
                    <span className="text-xs font-medium text-purple-600">
                      {Math.abs(data.userGrowth || 0).toFixed(1)}% vs last period
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-200 flex items-center justify-center transform transition-transform hover:rotate-12">
                  <svg className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Total Vendors */}
            <div 
              onClick={() => setSelectedMetric(selectedMetric === 'vendors' ? null : 'vendors')}
              className={`bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm p-6 border-2 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                selectedMetric === 'vendors' ? 'border-amber-500 ring-4 ring-amber-200' : 'border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-700">Active Vendors</p>
                  <p className="text-3xl font-bold text-amber-900 mt-2">{data.totalVendors || 0}</p>
                  <p className="text-xs text-amber-600 mt-2 font-medium">Contributing to platform</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-amber-200 flex items-center justify-center transform transition-transform hover:rotate-12">
                  <svg className="h-6 w-6 text-amber-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Revenue Trend Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">Revenue Trend</h2>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                  Last {data.revenueTrend?.length || 0} periods
                </span>
              </div>
              <div className="h-64 relative">
                {hoveredPoint && hoveredPoint.type === 'revenue' && (
                  <div 
                    className="absolute bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg z-50 transition-all duration-200 pointer-events-none"
                    style={{ 
                      left: `${hoveredPoint.x}px`, 
                      top: `${hoveredPoint.y}px`,
                      transform: 'translate(-50%, -120%)'
                    }}
                  >
                    <div className="text-xs font-semibold">{hoveredPoint.label}</div>
                    <div className="text-sm font-bold">₹{hoveredPoint.value.toLocaleString()}</div>
                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                      <div className="border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                )}
                {data.revenueTrend && data.revenueTrend.length > 0 ? (
                  <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                    {/* Grid lines */}
                    <line x1="0" y1="60" x2="600" y2="60" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="180" x2="600" y2="180" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
                    
                    {/* Line path */}
                    <path
                      d={(() => {
                        const maxValue = Math.max(...data.revenueTrend.map((p) => p.value), 1)
                        const maxIndex = Math.max(data.revenueTrend.length - 1, 1)
                        const points = data.revenueTrend.map((point, idx) => {
                          const x = (idx / maxIndex) * 600
                          const y = 220 - (point.value / maxValue) * 200
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' ')
                        return points
                      })()}
                      fill="none"
                      stroke="url(#revenueGradient)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="drop-shadow-sm"
                    />
                    
                    {/* Area under line */}
                    <path
                      d={(() => {
                        const maxValue = Math.max(...data.revenueTrend.map((p) => p.value), 1)
                        const maxIndex = Math.max(data.revenueTrend.length - 1, 1)
                        const points = data.revenueTrend.map((point, idx) => {
                          const x = (idx / maxIndex) * 600
                          const y = 220 - (point.value / maxValue) * 200
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' ')
                        return `${points} L 600 220 L 0 220 Z`
                      })()}
                      fill="url(#revenueAreaGradient)"
                      opacity="0.3"
                    />
                    
                    {/* Data points */}
                    {data.revenueTrend.map((point, idx) => {
                      const maxValue = Math.max(...data.revenueTrend.map((p) => p.value), 1)
                      const maxIndex = Math.max(data.revenueTrend.length - 1, 1)
                      const x = (idx / maxIndex) * 600
                      const y = 220 - (point.value / maxValue) * 200
                      return (
                        <g key={idx}>
                          <circle
                            cx={x}
                            cy={y}
                            r="6"
                            fill="#10b981"
                            stroke="white"
                            strokeWidth="3"
                            className="cursor-pointer transition-all hover:r-8"
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect()
                              setHoveredPoint({
                                type: 'revenue',
                                x: rect.left + (x / 600) * rect.width,
                                y: rect.top + (y / 240) * rect.height,
                                label: point.label,
                                value: point.value
                              })
                            }}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                        </g>
                      )
                    })}
                    
                    {/* Gradient definitions */}
                    <defs>
                      <linearGradient id="revenueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                      <linearGradient id="revenueAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                    <svg className="w-16 h-16 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p className="text-slate-400 text-sm font-medium">No revenue data yet</p>
                    <p className="text-slate-300 text-xs mt-1">Data will appear once orders are completed</p>
                  </div>
                )}
              </div>
              {/* Labels */}
              {data.revenueTrend && data.revenueTrend.length > 0 && (
                <div className="flex justify-between mt-4 px-2">
                  {data.revenueTrend.map((point, idx) => (
                    <span key={idx} className="text-xs text-slate-600 text-center font-medium" style={{ width: `${100 / data.revenueTrend.length}%` }}>
                      {point.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* User Growth Chart */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-slate-900">User Growth</h2>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-semibold">
                  Last {data.userGrowthTrend?.length || 0} periods
                </span>
              </div>
              <div className="h-64 relative">
                {hoveredPoint && hoveredPoint.type === 'users' && (
                  <div 
                    className="absolute bg-slate-900 text-white px-3 py-2 rounded-lg shadow-lg z-50 transition-all duration-200 pointer-events-none"
                    style={{ 
                      left: `${hoveredPoint.x}px`, 
                      top: `${hoveredPoint.y}px`,
                      transform: 'translate(-50%, -120%)'
                    }}
                  >
                    <div className="text-xs font-semibold">{hoveredPoint.label}</div>
                    <div className="text-sm font-bold">{hoveredPoint.value} users</div>
                    <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                      <div className="border-4 border-transparent border-t-slate-900"></div>
                    </div>
                  </div>
                )}
                {data.userGrowthTrend && data.userGrowthTrend.length > 0 ? (
                  <svg className="w-full h-full" viewBox="0 0 600 240" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="userLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#22c55e" />
                        <stop offset="100%" stopColor="#16a34a" />
                      </linearGradient>
                      <linearGradient id="userAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="userGridFade" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#f8fafc" />
                        <stop offset="100%" stopColor="#ffffff" />
                      </linearGradient>
                      <filter id="userLineGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#22c55e" floodOpacity="0.25" />
                      </filter>
                    </defs>

                    <rect x="0" y="0" width="600" height="240" fill="url(#userGridFade)" />

                    {/* Grid lines */}
                    <line x1="0" y1="60" x2="600" y2="60" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />
                    <line x1="0" y1="180" x2="600" y2="180" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="5,5" />

                    {/* Axes */}
                    <line x1="0" y1="220" x2="600" y2="220" stroke="#16a34a" strokeWidth="1.5" />
                    <line x1="0" y1="20" x2="0" y2="220" stroke="#16a34a" strokeWidth="1.5" />
                    <text x="300" y="236" textAnchor="middle" fontSize="11" fill="#166534">Periods</text>
                    <text x="12" y="120" textAnchor="middle" fontSize="11" fill="#166534" transform="rotate(-90 12 120)">Users</text>

                    {/* Y-axis labels */}
                    {(() => {
                      const maxValue = Math.max(...data.userGrowthTrend.map((p) => p.value), 1)
                      const ticks = [0, 0.25, 0.5, 0.75, 1]
                      return ticks.map((ratio, idx) => {
                        const value = Math.round(maxValue * ratio)
                        const y = 220 - ratio * 200
                        return (
                          <text
                            key={`user-tick-${idx}`}
                            x="6"
                            y={y}
                            textAnchor="end"
                            fontSize="10"
                            fill="#15803d"
                            dominantBaseline="middle"
                          >
                            {value}
                          </text>
                        )
                      })
                    })()}

                    {/* Area under line */}
                    <path
                      d={(() => {
                        const maxValue = Math.max(...data.userGrowthTrend.map((p) => p.value), 1)
                        const maxIndex = Math.max(data.userGrowthTrend.length - 1, 1)
                        const points = data.userGrowthTrend.map((point, idx) => {
                          const x = (idx / maxIndex) * 600
                          const y = 220 - (point.value / maxValue) * 200
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' ')
                        return `${points} L 600 220 L 0 220 Z`
                      })()}
                      fill="url(#userAreaGradient)"
                    />

                    {/* Line path */}
                    <path
                      d={(() => {
                        const maxValue = Math.max(...data.userGrowthTrend.map((p) => p.value), 1)
                        const maxIndex = Math.max(data.userGrowthTrend.length - 1, 1)
                        const points = data.userGrowthTrend.map((point, idx) => {
                          const x = (idx / maxIndex) * 600
                          const y = 220 - (point.value / maxValue) * 200
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`
                        }).join(' ')
                        return points
                      })()}
                      fill="none"
                      stroke="url(#userLineGradient)"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#userLineGlow)"
                    />

                    {/* Data points */}
                    {data.userGrowthTrend.map((point, idx) => {
                      const maxValue = Math.max(...data.userGrowthTrend.map((p) => p.value), 1)
                      const maxIndex = Math.max(data.userGrowthTrend.length - 1, 1)
                      const x = (idx / maxIndex) * 600
                      const y = 220 - (point.value / maxValue) * 200
                      const isLast = idx === data.userGrowthTrend.length - 1
                      return (
                        <g key={idx}>
                          <circle
                            cx={x}
                            cy={y}
                            r={isLast ? 7 : 5}
                            fill={isLast ? "#16a34a" : "#22c55e"}
                            stroke="white"
                            strokeWidth="3"
                            className="cursor-pointer transition-all hover:r-8"
                            onMouseEnter={(e) => {
                              const rect = e.currentTarget.ownerSVGElement.getBoundingClientRect()
                              setHoveredPoint({
                                type: 'users',
                                x: rect.left + (x / 600) * rect.width,
                                y: rect.top + (y / 240) * rect.height,
                                label: point.label,
                                value: point.value
                              })
                            }}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                        </g>
                      )
                    })}
                  </svg>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full animate-fade-in">
                    <svg className="w-16 h-16 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-slate-400 text-sm font-medium">No user data yet</p>
                    <p className="text-slate-300 text-xs mt-1">Data will appear once users register</p>
                  </div>
                )}
              </div>
              {/* Labels */}
              {data.userGrowthTrend && data.userGrowthTrend.length > 0 && (
                <div className="flex justify-between mt-4 px-2">
                  {data.userGrowthTrend.map((point, idx) => (
                    <span key={idx} className="text-xs text-slate-600 text-center font-medium" style={{ width: `${100 / data.userGrowthTrend.length}%` }}>
                      {point.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Insights */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* Order Status Breakdown */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Order Status</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                  {data.orderStatusBreakdown?.reduce((sum, s) => sum + s.count, 0) || 0} total
                </span>
              </div>
              <div className="space-y-4">
                {data.orderStatusBreakdown && data.orderStatusBreakdown.length > 0 ? (
                  data.orderStatusBreakdown.map((status) => {
                    const maxCount = Math.max(...data.orderStatusBreakdown.map((s) => s.count), 1)
                    const width = Math.max(5, (status.count / maxCount) * 100)
                    const colors = {
                      pending: { bg: "bg-yellow-500", text: "text-yellow-700", light: "bg-yellow-50" },
                      confirmed: { bg: "bg-blue-500", text: "text-blue-700", light: "bg-blue-50" },
                      shipped: { bg: "bg-purple-500", text: "text-purple-700", light: "bg-purple-50" },
                      delivered: { bg: "bg-green-500", text: "text-green-700", light: "bg-green-50" },
                      cancelled: { bg: "bg-red-500", text: "text-red-700", light: "bg-red-50" },
                    }
                    const statusName = (status.name || "unknown").toString()
                    const color = colors[statusName.toLowerCase()] || { bg: "bg-slate-400", text: "text-slate-700", light: "bg-slate-50" }
                    return (
                      <div key={statusName} className={`p-3 rounded-lg ${color.light} hover:shadow-md transition-all duration-200`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className={`text-sm font-bold capitalize ${color.text}`}>{statusName}</span>
                          <span className={`text-sm font-bold ${color.text}`}>{status.count}</span>
                        </div>
                        <div className="w-full h-3 rounded-full bg-white shadow-inner overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${color.bg} shadow-sm`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-slate-500 font-medium">
                            {((status.count / data.orderStatusBreakdown.reduce((sum, s) => sum + s.count, 0)) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p className="text-slate-400 text-sm font-medium">No order data</p>
                    <p className="text-slate-300 text-xs mt-1">Order statuses will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Top Products</h2>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                  {data.topProducts?.length || 0} products
                </span>
              </div>
              <div className="space-y-3">
                {data.topProducts && data.topProducts.length > 0 ? (
                  data.topProducts.slice(0, 5).map((product, idx) => (
                    <div 
                      key={product._id || idx} 
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate">{product.name}</p>
                          <p className="text-xs text-slate-600 font-medium">
                            {product.unitsSold || 0} sold • ₹{(product.revenue || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <div className="h-2 w-20 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((product.revenue / Math.max(...(data.topProducts?.map(p => p.revenue) || [1]))) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-700 font-semibold mt-1">
                          {((product.revenue / Math.max(...(data.topProducts?.map(p => p.revenue) || [1]))) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <p className="text-slate-400 text-sm font-medium">No product data</p>
                    <p className="text-slate-300 text-xs mt-1">Top products will appear here</p>
                  </div>
                )}
              </div>
            </div>

            {/* Top Vendors */}
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Top Vendors</h2>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                  {data.topVendors?.length || 0} vendors
                </span>
              </div>
              <div className="space-y-3">
                {data.topVendors && data.topVendors.length > 0 ? (
                  data.topVendors.slice(0, 5).map((vendor, idx) => (
                    <div 
                      key={vendor._id || idx} 
                      className="flex items-center justify-between p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg hover:from-amber-100 hover:to-orange-100 transition-all duration-200 transform hover:scale-[1.02] cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm font-bold flex-shrink-0 shadow-md group-hover:shadow-lg transition-shadow">
                          {idx + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {vendor.businessName || vendor.name || 'Unknown Vendor'}
                          </p>
                          <p className="text-xs text-slate-600 font-medium">
                            {vendor.totalOrders || 0} orders • ₹{(vendor.revenue || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end ml-2">
                        <div className="h-2 w-20 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-amber-500 to-orange-600 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min((vendor.revenue / Math.max(...(data.topVendors?.map(v => v.revenue) || [1]))) * 100, 100)}%` }}
                          />
                        </div>
                        <span className="text-xs text-amber-700 font-semibold mt-1">
                          {((vendor.revenue / Math.max(...(data.topVendors?.map(v => v.revenue) || [1]))) * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <p className="text-slate-400 text-sm font-medium">No vendor data available</p>
                    <p className="text-slate-300 text-xs mt-1">Vendors will appear once they make sales</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-900">Category Distribution</h2>
              <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full font-semibold">
                {data.categoryDistribution?.length || 0} categories
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.categoryDistribution && data.categoryDistribution.length > 0 ? (
                data.categoryDistribution.map((category, idx) => {
                  const colors = [
                    "from-blue-500 to-blue-600",
                    "from-purple-500 to-purple-600",
                    "from-pink-500 to-pink-600",
                    "from-orange-500 to-orange-600",
                    "from-teal-500 to-teal-600",
                    "from-indigo-500 to-indigo-600",
                  ]
                  const colorClass = colors[idx % colors.length]
                  return (
                    <div 
                      key={category.name || idx} 
                      className={`bg-gradient-to-br ${colorClass} rounded-xl shadow-md p-5 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer`}
                    >
                      <p className="text-sm font-semibold opacity-90 mb-1">{category.name}</p>
                      <p className="text-3xl font-bold mt-2">{category.count}</p>
                      <p className="text-xs opacity-80 mt-1">Products</p>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <svg className="w-16 h-16 text-slate-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <p className="text-slate-400 text-sm font-medium">No category data</p>
                  <p className="text-slate-300 text-xs mt-1">Product categories will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalytics
