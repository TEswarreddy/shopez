import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { getCart, updateCartItem, removeFromCart, clearCart } from "../../api/cartService"

function Cart() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingItem, setUpdatingItem] = useState(null)
  const [removingItem, setRemovingItem] = useState(null)

  // Fetch cart from API
  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCart()
      setCart(data)
    } catch (err) {
      console.error("Error fetching cart:", err)
      setError(err.response?.data?.message || "Failed to load cart")
    } finally {
      setLoading(false)
    }
  }

  // Update quantity
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return
    
    try {
      setUpdatingItem(productId)
      const updatedCart = await updateCartItem(productId, newQuantity)
      setCart(updatedCart)
    } catch (err) {
      console.error("Error updating quantity:", err)
      alert(err.response?.data?.message || "Failed to update quantity")
    } finally {
      setUpdatingItem(null)
    }
  }

  // Remove item from cart
  const handleRemoveItem = async (productId) => {
    try {
      setRemovingItem(productId)
      const updatedCart = await removeFromCart(productId)
      setCart(updatedCart)
    } catch (err) {
      console.error("Error removing item:", err)
      alert(err.response?.data?.message || "Failed to remove item")
    } finally {
      setRemovingItem(null)
    }
  }

  // Clear entire cart
  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) return
    
    try {
      setLoading(true)
      const clearedCart = await clearCart()
      setCart(clearedCart)
    } catch (err) {
      console.error("Error clearing cart:", err)
      alert(err.response?.data?.message || "Failed to clear cart")
    } finally {
      setLoading(false)
    }
  }

  // Calculate totals
  const calculateSubtotal = () => {
    if (!cart?.items || cart.items.length === 0) return 0
    return cart.items.reduce((sum, item) => {
      const price = item.product?.price || 0
      return sum + (price * item.quantity)
    }, 0)
  }

  const subtotal = calculateSubtotal()
  const tax = subtotal * 0.18 // 18% GST
  const shipping = subtotal > 500 ? 0 : 40 // Free shipping above ₹500
  const total = subtotal + tax + shipping

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
              onClick={fetchCart}
              className="mt-4 rounded-lg bg-[#1f5fbf] px-6 py-3 font-semibold text-white transition hover:bg-[#1a4da0]"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-64px)] px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-slate-900">Shopping Cart</h1>
          
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">Your cart is empty</h2>
            <p className="mb-6 text-slate-600">Add some products to get started!</p>
            <Link
              to="/"
              className="inline-block rounded-lg bg-[#1f5fbf] px-6 py-3 font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Cart with items
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-slate-900">
            Shopping Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
          </h1>
          <button
            onClick={handleClearCart}
            disabled={loading}
            className="text-sm font-medium text-red-600 hover:text-red-700 transition disabled:opacity-50"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items - Left Side */}
          <div className="space-y-4 lg:col-span-2">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="group relative overflow-hidden rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md sm:p-6"
              >
                <div className="grid gap-4 sm:grid-cols-[120px_1fr] md:grid-cols-[160px_1fr]">
                  {/* Product Image */}
                  <Link
                    to={`/product/${item.product._id}`}
                    className="block overflow-hidden rounded-lg bg-slate-100"
                  >
                    <img
                      src={item.product.images?.[0] || "https://via.placeholder.com/400?text=Product"}
                      alt={item.product.name}
                      className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex flex-col">
                    <div className="flex-1">
                      <Link
                        to={`/product/${item.product._id}`}
                        className="mb-2 block text-lg font-semibold text-slate-900 hover:text-[#1f5fbf] transition"
                      >
                        {item.product.name}
                      </Link>
                      
                      {item.product.brand && (
                        <p className="mb-2 text-sm text-slate-600">
                          Brand: <span className="font-medium">{item.product.brand}</span>
                        </p>
                      )}

                      {/* Price */}
                      <div className="mb-4 flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-slate-900">
                          ₹{item.product.price?.toLocaleString()}
                        </span>
                        {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                          <>
                            <span className="text-sm text-slate-400 line-through">
                              ₹{item.product.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-sm font-semibold text-green-600">
                              {Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}% off
                            </span>
                          </>
                        )}
                      </div>

                      {/* Stock Status */}
                      {item.product.stock > 0 ? (
                        <p className="mb-3 text-sm text-green-600 font-medium">
                          In Stock {item.product.stock < 10 && `(Only ${item.product.stock} left)`}
                        </p>
                      ) : (
                        <p className="mb-3 text-sm text-red-600 font-medium">Out of Stock</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Quantity Selector */}
                      <div className="flex items-center gap-2 rounded-lg border-2 border-slate-200 bg-slate-50">
                        <button
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1 || updatingItem === item.product._id}
                          className="flex h-10 w-10 items-center justify-center text-slate-700 transition hover:bg-slate-100 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        
                        <span className="w-12 text-center text-lg font-semibold text-slate-900">
                          {updatingItem === item.product._id ? (
                            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-[#1f5fbf]"></div>
                          ) : (
                            item.quantity
                          )}
                        </span>
                        
                        <button
                          onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1)}
                          disabled={
                            item.quantity >= item.product.stock ||
                            updatingItem === item.product._id
                          }
                          className="flex h-10 w-10 items-center justify-center text-slate-700 transition hover:bg-slate-100 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </button>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={removingItem === item.product._id}
                        className="flex items-center gap-2 text-sm font-medium text-red-600 transition hover:text-red-700 hover:scale-105 active:scale-95 disabled:opacity-50"
                      >
                        {removingItem === item.product._id ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-300 border-t-red-600"></div>
                            Removing...
                          </>
                        ) : (
                          <>
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                          </>
                        )}
                      </button>
                    </div>

                    {/* Item Total */}
                    <div className="mt-4 border-t border-slate-100 pt-3">
                      <p className="text-sm text-slate-600">
                        Item Total: <span className="text-lg font-bold text-slate-900">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-4">
              {/* Price Breakdown */}
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-bold text-slate-900">Order Summary</h2>
                
                <div className="space-y-3 border-b border-slate-200 pb-4">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Subtotal ({cart.items.length} items)</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-slate-700">
                    <span>Tax (GST 18%)</span>
                    <span className="font-semibold">₹{tax.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {shipping > 0 && (
                  <div className="my-4 rounded-lg bg-amber-50 p-3">
                    <p className="text-sm text-amber-800">
                      Add items worth ₹{(500 - subtotal).toLocaleString()} more for FREE shipping!
                    </p>
                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-amber-200">
                      <div
                        className="h-full bg-amber-500 transition-all duration-500"
                        style={{ width: `${Math.min((subtotal / 500) * 100, 100)}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
                  <span className="text-lg font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-[#1f5fbf]">
                    ₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate('/checkout')}
                  className="mt-6 w-full rounded-lg bg-[#f7d443] py-4 text-lg font-bold text-slate-900 transition hover:bg-[#f7d443]/90 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                >
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/"
                  className="mt-3 block w-full rounded-lg border-2 border-slate-200 py-3 text-center font-semibold text-slate-700 transition hover:border-[#1f5fbf] hover:text-[#1f5fbf] hover:scale-105 active:scale-95"
                >
                  Continue Shopping
                </Link>
              </div>

              {/* Safe Shopping Badge */}
              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <svg className="h-6 w-6 flex-shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-blue-900">Safe & Secure</h3>
                    <p className="mt-1 text-sm text-blue-700">100% secure payments with easy returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
