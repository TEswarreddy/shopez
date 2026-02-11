import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getWishlist, removeFromWishlist } from "../../api/wishlistService"
import { addToCart } from "../../api/cartService"

function Wishlist() {
  const [wishlist, setWishlist] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [processingItems, setProcessingItems] = useState({}) // Track items being moved/removed

  // Fetch wishlist from API
  useEffect(() => {
    fetchWishlist()
  }, [])

  const fetchWishlist = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getWishlist()
      setWishlist(data)
    } catch (err) {
      console.error("Error fetching wishlist:", err)
      setError(err.response?.data?.message || "Failed to load wishlist")
    } finally {
      setLoading(false)
    }
  }

  // Move item to cart
  const handleMoveToCart = async (productId) => {
    try {
      setProcessingItems(prev => ({ ...prev, [productId]: "moving" }))
      
      // Add to cart
      await addToCart(productId, 1)
      
      // Remove from wishlist
      await removeFromWishlist(productId)
      
      // Update local state
      setWishlist(prev => ({
        ...prev,
        items: prev.items.filter(item => item.product._id !== productId)
      }))
      
      setProcessingItems(prev => {
        const newState = { ...prev }
        delete newState[productId]
        return newState
      })
    } catch (err) {
      console.error("Error moving to cart:", err)
      alert(err.response?.data?.message || "Failed to move item to cart")
      setProcessingItems(prev => {
        const newState = { ...prev }
        delete newState[productId]
        return newState
      })
    }
  }

  // Remove item from wishlist
  const handleRemoveFromWishlist = async (productId) => {
    try {
      setProcessingItems(prev => ({ ...prev, [productId]: "removing" }))
      
      await removeFromWishlist(productId)
      
      // Update local state
      setWishlist(prev => ({
        ...prev,
        items: prev.items.filter(item => item.product._id !== productId)
      }))
      
      setProcessingItems(prev => {
        const newState = { ...prev }
        delete newState[productId]
        return newState
      })
    } catch (err) {
      console.error("Error removing from wishlist:", err)
      alert(err.response?.data?.message || "Failed to remove item from wishlist")
      setProcessingItems(prev => {
        const newState = { ...prev }
        delete newState[productId]
        return newState
      })
    }
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
              onClick={fetchWishlist}
              className="mt-4 rounded-lg bg-[#1f5fbf] px-6 py-3 font-semibold text-white transition hover:bg-[#1a4da0]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Empty wishlist state
  if (!wishlist?.items || wishlist.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
            <p className="mt-2 text-slate-600">Save items you love for later</p>
          </div>

          {/* Empty State */}
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h2 className="mb-2 text-2xl font-bold text-slate-900">Your Wishlist is Empty</h2>
            <p className="mb-8 text-slate-600">
              Start adding items you love to your wishlist and keep track of them!
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1f5fbf] px-8 py-4 font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
            <p className="mt-2 text-slate-600">
              {wishlist.items.length} {wishlist.items.length === 1 ? "item" : "items"} saved
            </p>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Continue Shopping
          </Link>
        </div>

        {/* Wishlist Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.items.map((item) => {
            const product = item.product
            const isProcessing = processingItems[product._id]
            
            return (
              <div
                key={product._id}
                className="group relative rounded-xl bg-white p-4 shadow-sm transition hover:shadow-lg"
              >
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  disabled={isProcessing}
                  className="absolute right-2 top-2 z-10 rounded-full bg-white p-2 text-slate-400 shadow-md transition hover:bg-red-50 hover:text-red-600 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove from wishlist"
                >
                  {isProcessing === "removing" ? (
                    <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </button>

                {/* Product Image */}
                <Link to={`/product/${product._id}`} className="block">
                  <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-slate-100">
                    <img
                      src={product.images?.[0] || "https://via.placeholder.com/300"}
                      alt={product.name}
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                </Link>

                {/* Product Info */}
                <Link to={`/product/${product._id}`} className="block">
                  <h3 className="mb-2 line-clamp-2 font-semibold text-slate-900 transition group-hover:text-[#1f5fbf]">
                    {product.name}
                  </h3>
                </Link>

                {/* Brand */}
                {product.brand && (
                  <p className="mb-2 text-sm text-slate-600">{product.brand}</p>
                )}

                {/* Rating */}
                {product.rating > 0 && (
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <svg className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-slate-900">{product.rating.toFixed(1)}</span>
                    </div>
                    {product.reviews?.length > 0 && (
                      <span className="text-sm text-slate-500">({product.reviews.length})</span>
                    )}
                  </div>
                )}

                {/* Price */}
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    ₹{product.price?.toLocaleString()}
                  </span>
                  {product.originalPrice && product.originalPrice > product.price && (
                    <>
                      <span className="text-sm text-slate-500 line-through">
                        ₹{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                      </span>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                {product.inStock ? (
                  <div className="mb-4 flex items-center gap-2 text-sm text-green-600">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold">In Stock</span>
                  </div>
                ) : (
                  <div className="mb-4 flex items-center gap-2 text-sm text-red-600">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleMoveToCart(product._id)}
                    disabled={!product.inStock || isProcessing}
                    className="w-full rounded-lg bg-[#f7d443] py-3 font-bold text-slate-900 transition hover:bg-[#f7d443]/90 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 shadow-md hover:shadow-lg"
                  >
                    {isProcessing === "moving" ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Moving...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        Move to Cart
                      </span>
                    )}
                  </button>

                  <Link
                    to={`/product/${product._id}`}
                    className="block w-full rounded-lg border-2 border-slate-200 bg-white py-3 text-center font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Continue shopping section */}
        <div className="mt-12 rounded-xl bg-white p-8 text-center shadow-sm">
          <h3 className="mb-2 text-xl font-bold text-slate-900">Looking for more?</h3>
          <p className="mb-6 text-slate-600">Browse our collection and find your next favorite item</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-[#1f5fbf] px-8 py-4 font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Explore Products
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Wishlist
