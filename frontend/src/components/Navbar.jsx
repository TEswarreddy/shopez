import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    navigate("/")
  }

  return (
    <header className="bg-[#1f5fbf] text-white sticky top-0 z-50 shadow-md">
      <div className="mx-auto flex w-full items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#f7d443] text-[#10366b] font-black">
            S
          </div>
          <div>
            <p className="text-base font-bold leading-tight">ShopEz</p>
            <p className="text-xs text-white/80">Flipkart-style deals</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-[#f7d443] transition">
            Home
          </Link>
          
          {user && (
            <>
              <Link to="/cart" className="text-sm font-medium hover:text-[#f7d443] transition">
                Cart
              </Link>
              <Link to="/orders" className="text-sm font-medium hover:text-[#f7d443] transition">
                Orders
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
