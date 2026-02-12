import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "../../api/axios"
import AdminSidebar from "../../components/AdminSidebar"
import { useAuth } from "../../context/AuthContext"

function AdminDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [adminInfo, setAdminInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    // Debug: Log current user info
    console.log("Current user:", user)
    console.log("Token exists:", !!localStorage.getItem("token"))
    
    // Check if user is logged in and is an admin
    if (!user) {
      console.warn("No user found, redirecting to login...")
      navigate("/admin/login")
      return
    }
    
    if (user.role !== "admin") {
      console.error("User role:", user.role, "- Admin role required")
      setError("Access denied. Admin privileges required.")
      setLoading(false)
      return
    }

    fetchDashboardStats()
  }, [user, navigate])

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        navigate("/admin/login")
        return
      }

      const response = await axios.get("/admin/dashboard/stats")
      if (response.data.success) {
        setStats(response.data.stats)
        setAdminInfo(response.data.adminInfo)
      }
    } catch (err) {
      if (err.response?.status === 403) {
        setError("Access denied. You don't have permission to view this page.")
        // Clear invalid auth and redirect
        setTimeout(() => {
          logout()
          navigate("/admin/login")
        }, 2000)
      } else if (err.response?.status === 401) {
        setError("Session expired. Please login again.")
        setTimeout(() => {
          logout()
          navigate("/admin/login")
        }, 2000)
      } else {
        setError(err.response?.data?.message || "Failed to load dashboard data")
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex">
        <AdminSidebar />
        <div className="flex-1 min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
          <div className="max-w-md w-full space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <svg className="w-6 h-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-lg font-semibold text-red-800">Access Error</h3>
              </div>
              <p className="text-red-700 mb-4">{error}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/admin/login")}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                >
                  Go to Login
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="flex-1 border-2 border-red-300 text-red-700 px-4 py-2 rounded-lg font-semibold hover:bg-red-50 transition"
                >
                  Retry
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 mb-2">Common Issues:</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Make sure you're logged in with an <strong>admin account</strong></li>
                <li>Customer or vendor accounts cannot access this page</li>
                <li>Check the browser console (F12) for more details</li>
                <li>Try logging out and logging in again</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const isSuperAdmin = adminInfo?.level === "super_admin"

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 min-h-[calc(100vh-64px)] px-4 py-8 bg-slate-50">
      <div className="mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-600 mt-2">
            {isSuperAdmin ? "Super Admin" : "Admin"} - Manage the platform
          </p>
        </div>

        {/* Stats Grid - Permission-based visibility */}
        <div className="grid gap-6 md:grid-cols-4 mb-8">
          {/* Customer Stats */}
          {stats?.totalCustomers !== undefined && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Customers</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalCustomers}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats.activeCustomers} active
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Vendor Stats */}
          {stats?.totalVendors !== undefined && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Vendors</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalVendors}</p>
                  <p className="text-xs text-amber-600 mt-1">
                    {stats.pendingVendors} pending verification
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-amber-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Product Stats */}
          {stats?.totalProducts !== undefined && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Products</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalProducts}</p>
                  <p className="text-xs text-green-600 mt-1">
                    {stats.activeProducts} active
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Order Stats */}
          {stats?.totalOrders !== undefined && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Orders</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalOrders}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    {stats.pendingOrders} pending
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Revenue - Only for admins with financial permission */}
          {stats?.totalRevenue !== undefined && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Admin Stats - Super Admin Only */}
          {stats?.totalAdmins !== undefined && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Admins</p>
                  <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalAdmins}</p>
                  <p className="text-xs text-red-600 mt-1">Super Admin Only</p>
                </div>
                <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Management Sections */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Super Admin Section */}
          {isSuperAdmin && (
            <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-xl shadow-sm p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">Super Admin Controls</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/admins"
                  className="w-full flex items-center justify-between p-3 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition"
                >
                  <span className="font-medium">Manage Admins</span>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Vendor Management */}
          {adminInfo?.permissions?.canManageVendors && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Vendor Management</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/vendors"
                  className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
                >
                  <span className="font-medium text-slate-900">View All Vendors</span>
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                {stats?.pendingVendors > 0 && (
                  <Link
                    to="/admin/vendors?status=pending"
                    className="w-full flex items-center justify-between p-3 border border-amber-200 rounded-lg hover:border-amber-600 hover:bg-amber-50 transition bg-amber-50"
                  >
                    <span className="font-medium text-amber-900">
                      Pending Verifications ({stats.pendingVendors})
                    </span>
                    <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Customer Management */}
          {adminInfo?.permissions?.canManageUsers && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Customer Management</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/customers"
                  className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
                >
                  <span className="font-medium text-slate-900">View All Customers</span>
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Product Management */}
          {adminInfo?.permissions?.canManageProducts && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Product Management</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/products"
                  className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
                >
                  <span className="font-medium text-slate-900">View All Products</span>
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {/* Order Management */}
          {adminInfo?.permissions?.canManageOrders && (
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Order Management</h2>
              <div className="space-y-3">
                <Link
                  to="/admin/orders"
                  className="w-full flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:border-blue-600 hover:bg-blue-50 transition"
                >
                  <span className="font-medium text-slate-900">View All Orders</span>
                  <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}

export default AdminDashboard
