import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"

// Auth Pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

// User Pages
import Home from "./pages/user/Home"
import Cart from "./pages/user/Cart"
import Checkout from "./pages/user/Checkout"
import Orders from "./pages/user/Orders"
import ProductDetails from "./pages/user/ProductDetails"
import Search from "./pages/user/Search"

// Info Pages
import About from "./pages/info/About"
import Careers from "./pages/info/Careers"

// Help Pages
import Payments from "./pages/help/Payments"
import Shipping from "./pages/help/Shipping"
import Cancellation from "./pages/help/Cancellation"
import FAQ from "./pages/help/FAQ"

// Policy Pages
import Terms from "./pages/policies/Terms"
import Privacy from "./pages/policies/Privacy"

// Vendor Pages
import VendorDashboard from "./pages/restaurant/Dashboard"

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard"

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Info Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/careers" element={<Careers />} />

          {/* Help Pages */}
          <Route path="/help/payments" element={<Payments />} />
          <Route path="/help/shipping" element={<Shipping />} />
          <Route path="/help/cancellation" element={<Cancellation />} />
          <Route path="/help/faq" element={<FAQ />} />

          {/* Policy Pages */}
          <Route path="/policies/terms" element={<Terms />} />
          <Route path="/policies/privacy" element={<Privacy />} />

          {/* User Routes - Protected */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Vendor Routes - Protected */}
          <Route
            path="/vendor/dashboard"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorDashboard />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes - Protected */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
