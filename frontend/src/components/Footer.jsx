import { Link } from "react-router-dom"

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              About
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm hover:text-white transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm hover:text-white transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-sm hover:text-white transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/stories" className="text-sm hover:text-white transition">
                  ShopEz Stories
                </Link>
              </li>
              <li>
                <Link to="/press" className="text-sm hover:text-white transition">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/wholesale" className="text-sm hover:text-white transition">
                  ShopEz Wholesale
                </Link>
              </li>
              <li>
                <Link to="/corporate" className="text-sm hover:text-white transition">
                  Corporate Information
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Section */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Help
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help/payments" className="text-sm hover:text-white transition">
                  Payments
                </Link>
              </li>
              <li>
                <Link to="/help/shipping" className="text-sm hover:text-white transition">
                  Shipping
                </Link>
              </li>
              <li>
                <Link to="/help/cancellation" className="text-sm hover:text-white transition">
                  Cancellation & Returns
                </Link>
              </li>
              <li>
                <Link to="/help/faq" className="text-sm hover:text-white transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/help/reports" className="text-sm hover:text-white transition">
                  Report Infringement
                </Link>
              </li>
            </ul>
          </div>

          {/* Consumer Policy */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Consumer Policy
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/policies/terms" className="text-sm hover:text-white transition">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/policies/security" className="text-sm hover:text-white transition">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/policies/privacy" className="text-sm hover:text-white transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/policies/sitemap" className="text-sm hover:text-white transition">
                  Sitemap
                </Link>
              </li>
              <li>
                <Link to="/policies/grievance" className="text-sm hover:text-white transition">
                  Grievance Redressal
                </Link>
              </li>
              <li>
                <Link to="/policies/epr" className="text-sm hover:text-white transition">
                  EPR Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Mail */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Social
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm hover:text-white transition flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  YouTube
                </a>
              </li>
            </ul>

            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mt-8 mb-4">
              Mail Us
            </h3>
            <address className="not-italic text-sm leading-relaxed">
              ShopEz Internet Private Limited,
              <br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,
              <br />
              Outer Ring Road, Devarabeesanahalli Village,
              <br />
              Bengaluru, 560103,
              <br />
              Karnataka, India
            </address>
          </div>

          {/* Registered Office */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Registered Office Address
            </h3>
            <address className="not-italic text-sm leading-relaxed mb-6">
              ShopEz Internet Private Limited,
              <br />
              Buildings Alyssa, Begonia &<br />
              Clove Embassy Tech Village,
              <br />
              Outer Ring Road, Devarabeesanahalli Village,
              <br />
              Bengaluru, 560103,
              <br />
              Karnataka, India
              <br />
              CIN: U51109KA2012PTC066107
              <br />
              Telephone:{" "}
              <a href="tel:18002029898" className="hover:text-white transition">
                1800-202-9898
              </a>
            </address>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-white">Secure Payments:</span>
              <div className="flex items-center gap-3">
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-blue-600">VISA</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-orange-600">Mastercard</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-blue-700">RuPay</span>
                </div>
                <div className="bg-white rounded px-2 py-1">
                  <span className="text-xs font-bold text-purple-600">UPI</span>
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="text-sm text-center md:text-right">
              <p>
                &copy; {new Date().getFullYear()} ShopEz. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
