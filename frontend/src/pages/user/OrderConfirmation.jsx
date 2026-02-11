import { useEffect, useState } from "react"
import { useNavigate, useLocation, Link } from "react-router-dom"

function OrderConfirmation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [order, setOrder] = useState(null)
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Get order from navigation state
    if (location.state?.order) {
      setOrder(location.state.order)
    } else {
      // If no order in state, redirect to orders page
      navigate("/orders")
    }

    // Hide confetti after 3 seconds
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [location.state, navigate])

  if (!order) {
    return null
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const estimatedDelivery = () => {
    const date = new Date()
    date.setDate(date.getDate() + 7) // Add 7 days
    return formatDate(date)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: [
                    "#f7d443",
                    "#1f5fbf",
                    "#10b981",
                    "#ef4444",
                    "#8b5cf6",
                  ][Math.floor(Math.random() * 5)],
                }}
              />
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-4 animate-bounce">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Order Confirmed! 🎉
          </h1>
          <p className="text-lg text-slate-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          {/* Order Number & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 mb-6">
            <div>
              <h2 className="text-sm font-medium text-slate-600 mb-1">Order Number</h2>
              <p className="text-2xl font-bold text-[#1f5fbf]">
                {order.orderNumber || `ORD-${order._id?.slice(-8).toUpperCase()}`}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 text-left sm:text-right">
              <h2 className="text-sm font-medium text-slate-600 mb-1">Order Date</h2>
              <p className="text-lg font-semibold text-slate-900">
                {formatDate(order.createdAt || new Date())}
              </p>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg
                    className="h-6 w-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 mb-1">
                  Estimated Delivery
                </h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">
                  {estimatedDelivery()}
                </p>
                <p className="text-sm text-slate-600">
                  Your order will be delivered to the address provided during checkout.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Shipping Address</h3>
            <div className="rounded-lg bg-slate-50 p-4">
              <p className="font-medium text-slate-900">
                {order.shippingAddress?.fullName}
              </p>
              <p className="text-slate-700 mt-1">{order.shippingAddress?.phone}</p>
              <p className="text-slate-700 mt-2">
                {order.shippingAddress?.street}
              </p>
              <p className="text-slate-700">
                {order.shippingAddress?.city}, {order.shippingAddress?.state} -{" "}
                {order.shippingAddress?.postalCode || order.shippingAddress?.zipCode}
              </p>
              <p className="text-slate-700">{order.shippingAddress?.country}</p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 mb-3">Payment Method</h3>
            <div className="rounded-lg bg-slate-50 p-4 flex items-center gap-3">
              {order.paymentMethod === "cod" && (
                <>
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Cash on Delivery</p>
                    <p className="text-sm text-slate-600">Pay when you receive</p>
                  </div>
                </>
              )}
              {order.paymentMethod === "card" && (
                <>
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Credit/Debit Card</p>
                    <p className="text-sm text-slate-600">Paid securely online</p>
                  </div>
                </>
              )}
              {order.paymentMethod === "upi" && (
                <>
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-purple-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">UPI Payment</p>
                    <p className="text-sm text-slate-600">Paid via UPI</p>
                  </div>
                </>
              )}
              {order.paymentMethod === "wallet" && (
                <>
                  <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <svg
                      className="h-5 w-5 text-amber-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Digital Wallet</p>
                    <p className="text-sm text-slate-600">Paid via wallet</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">
              Order Items ({order.items?.length || 0})
            </h3>
            <div className="space-y-4">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 rounded-lg bg-slate-50"
                >
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                    <img
                      src={
                        item.product?.images?.[0] ||
                        "https://via.placeholder.com/100"
                      }
                      alt={item.product?.name || "Product"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">
                      {item.product?.name || "Product"}
                    </h4>
                    <p className="text-sm text-slate-600 mt-1">
                      Quantity: {item.quantity}
                    </p>
                    <p className="font-semibold text-slate-900 mt-2">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="space-y-2">
              <div className="flex justify-between text-slate-700">
                <span>Subtotal</span>
                <span className="font-semibold">
                  {formatPrice(order.totalAmount || 0)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-slate-900 pt-2 border-t">
                <span>Total Amount</span>
                <span className="text-2xl text-[#1f5fbf]">
                  {formatPrice(order.totalAmount || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/orders"
            className="flex-1 bg-[#1f5fbf] text-white px-6 py-4 rounded-xl font-semibold text-center hover:bg-[#1a4da0] hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            View All Orders
          </Link>
          <Link
            to="/"
            className="flex-1 bg-white text-slate-700 px-6 py-4 rounded-xl font-semibold text-center border-2 border-slate-200 hover:border-[#1f5fbf] hover:text-[#1f5fbf] hover:scale-105 active:scale-95 transition-all"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-slate-100 rounded-xl p-6 text-center">
          <h3 className="font-semibold text-slate-900 mb-2">Need Help?</h3>
          <p className="text-sm text-slate-600 mb-4">
            If you have any questions about your order, feel free to contact us.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              to="/help/faq"
              className="text-[#1f5fbf] font-semibold hover:underline"
            >
              FAQs
            </Link>
            <Link
              to="/help/shipping"
              className="text-[#1f5fbf] font-semibold hover:underline"
            >
              Shipping Info
            </Link>
            <Link
              to="/help/cancellation"
              className="text-[#1f5fbf] font-semibold hover:underline"
            >
              Returns & Cancellation
            </Link>
          </div>
        </div>
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  )
}

export default OrderConfirmation
