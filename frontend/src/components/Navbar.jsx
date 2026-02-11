import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getSearchSuggestions } from "../api/searchService"

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const [suggestions, setSuggestions] = useState([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const searchRef = useRef(null)
  const debounceTimer = useRef(null)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // Debounced search suggestions
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([])
      return
    }

    setLoadingSuggestions(true)

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    // Set new timer for debouncing
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await getSearchSuggestions(searchQuery)
        setSuggestions(results)
      } catch (err) {
        console.error("Error fetching suggestions:", err)
        setSuggestions([])
      } finally {
        setLoadingSuggestions(false)
      }
    }, 300) // 300ms debounce delay

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [searchQuery])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchFocused(false)
      setSuggestions([])
    }
  }

  // Handle suggestion click
  const handleSuggestionClick = (productId) => {
    navigate(`/product/${productId}`)
    setSearchQuery("")
    setSearchFocused(false)
    setSuggestions([])
  }

  // Show all results from suggestions
  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchFocused(false)
      setSuggestions([])
    }
  }

  return (
    <header className="bg-[#1f5fbf] text-white sticky top-0 z-50 shadow-md">
      <div className="mx-auto flex w-full items-center gap-4 px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex flex-shrink-0 items-center gap-2 hover:opacity-90 transition">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f7d443] text-[#10366b] font-black">
            S
          </div>
          <div className="hidden sm:block">
            <p className="text-base font-bold leading-tight">ShopEz</p>
            <p className="text-xs text-white/80">Flipkart-style deals</p>
          </div>
        </Link>

        {/* Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-2xl">
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                className="w-full rounded-lg bg-white px-4 py-2 pr-10 text-sm text-slate-900 placeholder-slate-500 outline-none focus:ring-2 focus:ring-[#f7d443]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#1f5fbf] transition"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </form>

          {/* Search Suggestions Dropdown */}
          {searchFocused && searchQuery.length >= 2 && (
            <div className="absolute left-0 right-0 top-full mt-2 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl">
              {loadingSuggestions ? (
                <div className="flex items-center justify-center py-8">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-[#1f5fbf]"></div>
                </div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="max-h-96 overflow-y-auto">
                    {suggestions.map((product) => (
                      <button
                        key={product._id}
                        onClick={() => handleSuggestionClick(product._id)}
                        className="flex w-full items-center gap-3 border-b border-slate-100 p-3 text-left transition hover:bg-slate-50"
                      >
                        <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <img
                            src={product.images?.[0] || "https://via.placeholder.com/100"}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#1f5fbf]">
                              ₹{product.price?.toLocaleString()}
                            </span>
                            {product.brand && (
                              <span className="text-xs text-slate-500">• {product.brand}</span>
                            )}
                          </div>
                        </div>
                        <svg className="h-5 w-5 flex-shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={handleViewAllResults}
                    className="w-full border-t border-slate-200 bg-slate-50 py-3 text-center text-sm font-semibold text-[#1f5fbf] transition hover:bg-slate-100"
                  >
                    View all results for "{searchQuery}"
                  </button>
                </>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-slate-600">No suggestions found</p>
                  <button
                    onClick={handleViewAllResults}
                    className="mt-2 text-sm font-semibold text-[#1f5fbf] hover:underline"
                  >
                    Search anyway
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 flex-shrink-0">
          <Link to="/" className="text-sm font-medium hover:text-[#f7d443] transition">
            Home
          </Link>
          
          {user && (
            <>
              <Link to="/wishlist" className="text-sm font-medium hover:text-[#f7d443] transition">
                Wishlist
              </Link>
              <Link to="/cart" className="text-sm font-medium hover:text-[#f7d443] transition">
                Cart
              </Link>
              <Link to="/orders" className="text-sm font-medium hover:text-[#f7d443] transition">
                Orders
              </Link>
              <Link to="/profile" className="text-sm font-medium hover:text-[#f7d443] transition">
                Profile
              </Link>
            </>
          )}

          {user?.role === "vendor" && (
            <Link
              to="/vendor/dashboard"
              className="text-sm font-medium hover:text-[#f7d443] transition"
            >
              Vendor Dashboard
            </Link>
          )}

          {user?.role === "admin" && (
            <Link
              to="/admin/dashboard"
              className="text-sm font-medium hover:text-[#f7d443] transition"
            >
              Admin Dashboard
            </Link>
          )}
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden sm:block text-sm">
                <p className="font-semibold">{user.firstName}</p>
                <p className="text-xs text-white/80 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hidden sm:block rounded-full bg-[#f7d443] text-[#10366b] px-4 py-2 text-sm font-bold transition hover:bg-[#f7d443]/90"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
