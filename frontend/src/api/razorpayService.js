import axiosInstance from "./axios"

// Initialize Razorpay payment
export const initiateRazorpayPayment = async (orderData) => {
  try {
    console.log("Creating Razorpay order with data:", {
      amount: orderData.totalAmount,
      currency: "INR",
      itemsCount: orderData.items?.length
    })

    // First, create the order on backend
    const response = await axiosInstance.post("/payment/create-razorpay-order", {
      amount: orderData.totalAmount,
      currency: "INR",
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
    })

    console.log("Razorpay order response:", response.data)

    if (!response.data.success) {
      throw new Error(response.data.message || "Failed to create Razorpay order")
    }

    const { razorpayOrderId, key } = response.data

    if (!razorpayOrderId || !key) {
      throw new Error("Invalid response from server - missing order ID or key")
    }

    const paymentDetails = {
      razorpayOrderId,
      key,
      amount: orderData.totalAmount * 100, // Razorpay expects amount in paise
      currency: "INR",
    }

    console.log("Payment details prepared:", paymentDetails)
    return paymentDetails
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    throw error
  }
}

// Verify payment after successful transaction
export const verifyPayment = async (paymentData) => {
  try {
    console.log("Verifying payment with data:", {
      order_id: paymentData.razorpay_order_id,
      payment_id: paymentData.razorpay_payment_id
    })

    const response = await axiosInstance.post("/payment/verify-razorpay", {
      razorpay_order_id: paymentData.razorpay_order_id,
      razorpay_payment_id: paymentData.razorpay_payment_id,
      razorpay_signature: paymentData.razorpay_signature,
      shippingAddress: paymentData.shippingAddress,
      paymentMethod: "razorpay",
    })

    console.log("Verification response:", response.data)

    if (!response.data.success) {
      throw new Error(response.data.message || "Payment verification failed")
    }

    return response.data
  } catch (error) {
    console.error("Error verifying payment:", error)
    console.error("Error details:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    })
    throw error
  }
}

// Load Razorpay script
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    // Check if already loaded
    if (window.Razorpay) {
      console.log("Razorpay already loaded")
      resolve(true)
      return
    }

    console.log("Loading Razorpay script...")
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    
    script.onload = () => {
      console.log("Razorpay script loaded successfully")
      resolve(true)
    }
    
    script.onerror = () => {
      console.error("Failed to load Razorpay script")
      resolve(false)
    }
    
    document.body.appendChild(script)
  })
}

export default {
  initiateRazorpayPayment,
  verifyPayment,
  loadRazorpayScript,
}
