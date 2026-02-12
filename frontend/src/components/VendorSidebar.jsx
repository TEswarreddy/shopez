import { Link, useLocation } from "react-router-dom"
import { useState } from "react"

function VendorSidebar() {
  const location = useLocation()
  const [isCollapsed, setIsCollapsed] = useState(false)

  const menuItems = [
    {
      name: "Products",
      path: "/vendor/products",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      name: "Orders",
      path: "/vendor/orders",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
    },
    {
      name: "Analytics",
      path: "/vendor/analytics",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-amber-600 text-white p-3 rounded-full shadow-lg hover:bg-amber-700 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] bg-white border-r border-slate-200 transition-all duration-300 z-40 ${
          isCollapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Toggle Button for Desktop */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-full py-4 hover:bg-slate-50 transition-colors border-b border-slate-200"
          >
            <svg
              className={`w-5 h-5 text-slate-600 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>

          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-amber-50 text-amber-600 font-medium"
                          : "text-slate-700 hover:bg-slate-50"
                      } ${isCollapsed ? "justify-center" : ""}`}
                      title={isCollapsed ? item.name : ""}
                    >
                      <span className={isActive ? "text-amber-600" : "text-slate-500"}>
                        {item.icon}
                      </span>
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-200 p-4">
            {!isCollapsed ? (
              <div className="text-xs text-slate-500 text-center">
                <p className="font-medium">Vendor Panel</p>
                <p className="mt-1">ShopEz v1.0</p>
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-amber-600">V</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Spacer for content */}
      <div className={`${isCollapsed ? "lg:w-20" : "lg:w-64"} transition-all duration-300`} />
    </>
  )
}

export default VendorSidebar
