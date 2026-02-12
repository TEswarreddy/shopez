import { Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import ProtectedRoute from "./components/ProtectedRoute"

// Auth Pages
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"
import VendorLogin from "./pages/auth/VendorLogin"
import VendorRegister from "./pages/auth/VendorRegister"
import AdminLogin from "./pages/auth/AdminLogin"

// User Pages
import Home from "./pages/user/Home"
import Cart from "./pages/user/Cart"
import Checkout from "./pages/user/Checkout"
import OrderConfirmation from "./pages/user/OrderConfirmation"
import Orders from "./pages/user/Orders"
import Profile from "./pages/user/Profile"
import Wishlist from "./pages/user/Wishlist"
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
import VendorProducts from "./pages/vendor/Products"
import VendorOrders from "./pages/vendor/Orders"
import VendorAnalytics from "./pages/vendor/Analytics"

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard"
import AdminAnalytics from "./pages/admin/Analytics"
import AdminList from "./pages/admin/AdminList"
import VendorManagement from "./pages/admin/VendorManagement"
import CustomerManagement from "./pages/admin/CustomerManagement"
import ProductManagement from "./pages/admin/ProductManagement"
import OrderManagement from "./pages/admin/OrderManagement"

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
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/vendor/login" element={<VendorLogin />} />
          <Route path="/vendor/register" element={<VendorRegister />} />
          
          {/* Admin Login - Direct URL access */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin-access/login" element={<AdminLogin />} />

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
            path="/order-confirmation"
            element={
              <ProtectedRoute>
                <OrderConfirmation />
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
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
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
          <Route
            path="/vendor/products"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/orders"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendor/analytics"
            element={
              <ProtectedRoute allowedRoles={["vendor"]}>
                <VendorAnalytics />
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
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/admins"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/vendors"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <VendorManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <CustomerManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ProductManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <OrderManagement />
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
