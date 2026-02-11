import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getCart, clearCart } from "../../api/cartService"
import { createOrder } from "../../api/orderService"
import { initiateRazorpayPayment, verifyPayment, loadRazorpayScript } from "../../api/razorpayService"

function Checkout() {
  const navigate = useNavigate()
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [placing, setPlacing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Address, 2: Payment, 3: Review
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India",
  })

  const [paymentMethod, setPaymentMethod] = useState("cod") // cod, card, upi, wallet

  // Validation errors
  const [addressErrors, setAddressErrors] = useState({})

  // Fetch cart from API
  useEffect(() => {
    loadRazorpay()
    fetchCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadRazorpay = async () => {
    const loaded = await loadRazorpayScript()
    setRazorpayLoaded(loaded)
    if (!loaded) {
      console.error("Failed to load Razorpay script")
    }
  }

  const fetchCart = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getCart()
      
      if (!data?.items || data.items.length === 0) {
        navigate("/cart")
        return
      }
      
      setCart(data)
    } catch (err) {
      console.error("Error fetching cart:", err)
      setError(err.response?.data?.message || "Failed to load cart")
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

  // Validate shipping address
  const validateAddress = () => {
    const errors = {}

    if (!shippingAddress.fullName.trim()) {
      errors.fullName = "Full name is required"
    }
    if (!shippingAddress.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^[0-9]{10}$/.test(shippingAddress.phone)) {
      errors.phone = "Phone number must be 10 digits"
    }
    if (!shippingAddress.street.trim()) {
      errors.street = "Street address is required"
    }
    if (!shippingAddress.city.trim()) {
      errors.city = "City is required"
    }
    if (!shippingAddress.state.trim()) {
      errors.state = "State is required"
    }
    if (!shippingAddress.zipCode.trim()) {
      errors.zipCode = "ZIP code is required"
    } else if (!/^[0-9]{6}$/.test(shippingAddress.zipCode)) {
      errors.zipCode = "ZIP code must be 6 digits"
    }

    setAddressErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle address form change
  const handleAddressChange = (field, value) => {
    setShippingAddress(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (addressErrors[field]) {
      setAddressErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  // Proceed to next step
  const handleContinue = () => {
    if (currentStep === 1) {
      if (validateAddress()) {
        setCurrentStep(2)
      }
    } else if (currentStep === 2) {
      setCurrentStep(3)
    }
  }

  // Place order
  const handlePlaceOrder = async () => {
    try {
      setPlacing(true)
      
      // Validate one more time before submission
      if (!validateAddress()) {
        alert("Please check your shipping address for errors.")
        setCurrentStep(1)
        setPlacing(false)
        return
      }
      
      const orderData = {
        items: cart.items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: {
          fullName: shippingAddress.fullName,
          phone: shippingAddress.phone,
          street: shippingAddress.street,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postalCode: shippingAddress.zipCode,
          country: shippingAddress.country,
        },
        paymentMethod,
        totalAmount: total,
      }

      // If Razorpay payment, handle separately
      if ((paymentMethod === "card" || paymentMethod === "razorpay") && razorpayLoaded) {
        try {
          console.log("Initiating Razorpay payment...")
          setPaymentProcessing(true)
          
          // Get Razorpay order details
          const razorpayDetails = await initiateRazorpayPayment({
            ...orderData,
            totalAmount: total
          })

          console.log("Razorpay details received:", razorpayDetails)

          const options = {
            key: razorpayDetails.key,
            amount: razorpayDetails.amount,
            currency: razorpayDetails.currency,
            order_id: razorpayDetails.razorpayOrderId,
            name: "ShopEz",
            description: "Order Payment",
            prefill: {
              name: shippingAddress.fullName,
              email: localStorage.getItem("userEmail") || "customer@shopez.com",
              contact: shippingAddress.phone
            },
            handler: async (response) => {
              try {
                console.log("Payment successful, response:", response)
                
                // Verify payment on backend
                const verificationResult = await verifyPayment({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  shippingAddress: orderData.shippingAddress,
                  paymentMethod: "razorpay"
                })

                console.log("Payment verified:", verificationResult)

                // Create order with payment confirmation
                const finalOrderData = {
                  ...orderData,
                  paymentMethod: "razorpay",
                  transactionId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id
                }

                const order = await createOrder(finalOrderData)
                console.log("Order created successfully:", order)
                
                // Clear cart after successful order
                await clearCart()
                
                // Navigate to order confirmation
                navigate("/order-confirmation", { state: { order } })
              } catch (err) {
                console.error("Payment verification error:", err)
                const errorMsg = err.response?.data?.message || err.message || "Payment verification failed"
                alert(`Error: ${errorMsg}`)
                setPaymentProcessing(false)
                setPlacing(false)
              }
            },
            theme: {
              color: "#1f5fbf"
            },
            modal: {
              ondismiss: () => {
                console.log("Payment modal closed")
                setPaymentProcessing(false)
                setPlacing(false)
              }
            }
          }

          console.log("Opening Razorpay with options:", options)
          
          if (!window.Razorpay) {
            throw new Error("Razorpay script not loaded properly")
          }

          const rzp = new window.Razorpay(options)
          rzp.open()
        } catch (err) {
          console.error("Error initializing Razorpay:", err)
          alert(`Razorpay Error: ${err.message}`)
          setPaymentProcessing(false)
          setPlacing(false)
        }
      } else {
        // Non-Razorpay payments (COD, UPI, Wallet)
        console.log("Sending order data:", orderData)
        const order = await createOrder(orderData)
        console.log("Order created successfully:", order)
        
        // Clear cart after successful order
        await clearCart()
        
        // Navigate to order confirmation
        navigate("/order-confirmation", { state: { order } })
      }
    } catch (err) {
      console.error("Error placing order:", err)
      console.error("Error response:", err.response?.data)
      
      const errorMsg = err.response?.data?.message || err.message || "Failed to place order. Please try again."
      alert(`Order Failed: ${errorMsg}`)
      
      // If stock issue, refresh cart
      if (errorMsg.includes("stock")) {
        fetchCart()
      }
    } finally {
      setPlacing(false)
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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
          <p className="mt-2 text-slate-600">Complete your purchase</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { step: 1, label: "Shipping Address" },
              { step: 2, label: "Payment Method" },
              { step: 3, label: "Review Order" },
            ].map((item, index) => (
              <div key={item.step} className="flex flex-1 items-center">
                <div className="flex items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-semibold transition ${
                      currentStep >= item.step
                        ? "border-[#1f5fbf] bg-[#1f5fbf] text-white"
                        : "border-slate-300 bg-white text-slate-400"
                    }`}
                  >
                    {currentStep > item.step ? (
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      item.step
                    )}
                  </div>
                  <span
                    className={`ml-3 hidden font-semibold sm:block ${
                      currentStep >= item.step ? "text-[#1f5fbf]" : "text-slate-400"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {index < 2 && (
                  <div
                    className={`mx-4 h-1 flex-1 rounded transition ${
                      currentStep > item.step ? "bg-[#1f5fbf]" : "bg-slate-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Address */}
            {currentStep === 1 && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-slate-900">Shipping Address</h2>
                
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.fullName}
                        onChange={(e) => handleAddressChange("fullName", e.target.value)}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                          addressErrors.fullName ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="John Doe"
                      />
                      {addressErrors.fullName && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.fullName}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) => handleAddressChange("phone", e.target.value.replace(/\D/g, ""))}
                        maxLength={10}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                          addressErrors.phone ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="9876543210"
                      />
                      {addressErrors.phone && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={shippingAddress.street}
                      onChange={(e) => handleAddressChange("street", e.target.value)}
                      className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                        addressErrors.street ? "border-red-500" : "border-slate-200"
                      }`}
                      placeholder="123 Main Street, Apartment 4B"
                    />
                    {addressErrors.street && (
                      <p className="mt-1 text-sm text-red-600">{addressErrors.street}</p>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">City *</label>
                      <input
                        type="text"
                        value={shippingAddress.city}
                        onChange={(e) => handleAddressChange("city", e.target.value)}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                          addressErrors.city ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="Mumbai"
                      />
                      {addressErrors.city && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.city}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">State *</label>
                      <input
                        type="text"
                        value={shippingAddress.state}
                        onChange={(e) => handleAddressChange("state", e.target.value)}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                          addressErrors.state ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="Maharashtra"
                      />
                      {addressErrors.state && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.state}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={shippingAddress.zipCode}
                        onChange={(e) => handleAddressChange("zipCode", e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        className={`w-full rounded-lg border-2 px-4 py-3 text-slate-900 outline-none transition focus:ring-2 focus:ring-[#1f5fbf]/20 ${
                          addressErrors.zipCode ? "border-red-500" : "border-slate-200"
                        }`}
                        placeholder="400001"
                      />
                      {addressErrors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">{addressErrors.zipCode}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">Country</label>
                      <input
                        type="text"
                        value={shippingAddress.country}
                        disabled
                        className="w-full rounded-lg border-2 border-slate-200 bg-slate-50 px-4 py-3 text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleContinue}
                  className="mt-6 w-full rounded-lg bg-[#1f5fbf] py-4 text-lg font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Step 2: Payment Method */}
            {currentStep === 2 && (
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-bold text-slate-900">Payment Method</h2>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition ${
                      paymentMethod === "cod"
                        ? "border-[#1f5fbf] bg-[#1f5fbf]/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-5 w-5 text-[#1f5fbf]"
                    />
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Cash on Delivery</p>
                        <p className="text-sm text-slate-600">Pay when you receive the order</p>
                      </div>
                    </div>
                  </label>

                  {/* Credit/Debit Card */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition ${
                      paymentMethod === "card"
                        ? "border-[#1f5fbf] bg-[#1f5fbf]/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-5 w-5 text-[#1f5fbf]"
                    />
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Credit/Debit Card</p>
                        <p className="text-sm text-slate-600">Visa, Mastercard, RuPay</p>
                      </div>
                    </div>
                  </label>

                  {/* UPI */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition ${
                      paymentMethod === "upi"
                        ? "border-[#1f5fbf] bg-[#1f5fbf]/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={paymentMethod === "upi"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-5 w-5 text-[#1f5fbf]"
                    />
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">UPI Payment</p>
                        <p className="text-sm text-slate-600">Google Pay, PhonePe, Paytm</p>
                      </div>
                    </div>
                  </label>

                  {/* Wallet */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition ${
                      paymentMethod === "wallet"
                        ? "border-[#1f5fbf] bg-[#1f5fbf]/5"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="wallet"
                      checked={paymentMethod === "wallet"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-5 w-5 text-[#1f5fbf]"
                    />
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100">
                        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Digital Wallet</p>
                        <p className="text-sm text-slate-600">Paytm, Amazon Pay, Mobikwik</p>
                      </div>
                    </div>
                  </label>

                  {/* Razorpay (Card Payment) */}
                  <label
                    className={`flex cursor-pointer items-center gap-4 rounded-lg border-2 p-4 transition ${
                      paymentMethod === "razorpay"
                        ? "border-[#1f5fbf] bg-[#1f5fbf]/5"
                        : "border-slate-200 hover:border-slate-300"
                    } ${!razorpayLoaded ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => razorpayLoaded && setPaymentMethod("razorpay")}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="razorpay"
                      checked={paymentMethod === "razorpay"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      disabled={!razorpayLoaded}
                      className="h-5 w-5 text-[#1f5fbf]"
                    />
                    <div className="flex flex-1 items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">Razorpay Secure Payment</p>
                        <p className="text-sm text-slate-600">Card, UPI, Wallets - Secure & Fast</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="flex-1 rounded-lg border-2 border-slate-200 py-4 font-semibold text-slate-700 transition hover:border-slate-300 hover:scale-105 active:scale-95"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleContinue}
                    className="flex-1 rounded-lg bg-[#1f5fbf] py-4 font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review Order */}
            {currentStep === 3 && (
              <div className="space-y-6">
                {/* Shipping Address Review */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Shipping Address</h2>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="text-sm font-semibold text-[#1f5fbf] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">{shippingAddress.fullName}</p>
                    <p className="mt-1 text-slate-700">{shippingAddress.phone}</p>
                    <p className="mt-2 text-slate-700">
                      {shippingAddress.street}, {shippingAddress.city}
                    </p>
                    <p className="text-slate-700">
                      {shippingAddress.state} - {shippingAddress.zipCode}
                    </p>
                    <p className="text-slate-700">{shippingAddress.country}</p>
                  </div>
                </div>

                {/* Payment Method Review */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="text-sm font-semibold text-[#1f5fbf] hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="font-semibold text-slate-900">
                      {paymentMethod === "cod" && "Cash on Delivery"}
                      {paymentMethod === "card" && "Credit/Debit Card"}
                      {paymentMethod === "upi" && "UPI Payment"}
                      {paymentMethod === "wallet" && "Digital Wallet"}
                      {paymentMethod === "razorpay" && "Razorpay Secure Payment"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {paymentMethod === "cod" && "Pay when you receive the order"}
                      {paymentMethod === "card" && "Visa, Mastercard, RuPay"}
                      {paymentMethod === "upi" && "Google Pay, PhonePe, Paytm"}
                      {paymentMethod === "wallet" && "Paytm, Amazon Pay, Mobikwik"}
                      {paymentMethod === "razorpay" && "Secure Payment Gateway"}
                    </p>
                  </div>
                </div>

                {/* Order Items Review */}
                <div className="rounded-xl bg-white p-6 shadow-sm">
                  <h2 className="mb-4 text-xl font-bold text-slate-900">Order Items ({cart.items.length})</h2>
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.product._id} className="flex gap-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100">
                          <img
                            src={item.product.images?.[0] || "https://via.placeholder.com/100"}
                            alt={item.product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{item.product.name}</p>
                          <p className="text-sm text-slate-600">Quantity: {item.quantity}</p>
                          <p className="mt-1 font-semibold text-slate-900">
                            ₹{(item.product.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCurrentStep(2)}
                    disabled={placing || paymentProcessing}
                    className="flex-1 rounded-lg border-2 border-slate-200 py-4 font-semibold text-slate-700 transition hover:border-slate-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placing || paymentProcessing}
                    className="flex-1 rounded-lg bg-[#f7d443] py-4 font-bold text-slate-900 transition hover:bg-[#f7d443]/90 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                  >
                    {paymentProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-900 border-t-transparent"></div>
                        Processing Razorpay...
                      </span>
                    ) : placing ? (
                      "Placing Order..."
                    ) : (
                      "Place Order"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-slate-900">Order Summary</h2>

              <div className="space-y-3 border-b border-slate-200 pb-4">
                <div className="flex justify-between text-slate-700">
                  <span>Subtotal ({cart?.items.length} items)</span>
                  <span className="font-semibold">
                    ₹{subtotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex justify-between text-slate-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping}`
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-slate-700">
                  <span>Tax (GST 18%)</span>
                  <span className="font-semibold">
                    ₹{tax.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

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
                  ₹{total.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Security Badge */}
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-6 w-6 flex-shrink-0 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-blue-900">Safe & Secure Checkout</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      Your payment information is encrypted and secure
                    </p>
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

export default Checkout
