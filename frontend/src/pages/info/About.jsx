function About() {
  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="text-sm text-slate-600 mb-6">
          Home / About Us
        </div>

        {/* Page Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">About ShopEz</h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            India's most trusted shopping destination for millions of customers across the country
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Story</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              ShopEz started in 2026 with a mission to transform the way India shops online. We began as a small team
              with a big dream - to create a platform that offers quality products at affordable prices, delivered
              right to your doorstep.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Today, we're proud to serve millions of customers across India, offering over 150 million products
              across 80+ categories. From fashion to electronics, home essentials to beauty products, ShopEz has
              become the go-to destination for online shopping.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h2>
            <p className="text-slate-600 leading-relaxed">
              To provide a seamless shopping experience that combines quality, affordability, and convenience. We
              believe in empowering customers with choice and enabling sellers to reach millions of buyers across the
              country.
            </p>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Choose ShopEz?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">✓ Wide Selection</h3>
                <p className="text-slate-600">Over 150 million products across 80+ categories</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">✓ Best Prices</h3>
                <p className="text-slate-600">Competitive pricing with regular deals and discounts</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">✓ Fast Delivery</h3>
                <p className="text-slate-600">Quick and reliable delivery across India</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">✓ Secure Shopping</h3>
                <p className="text-slate-600">100% secure payment with multiple options</p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow-sm p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Customer Support</h3>
                <p className="text-slate-600">Phone: 1800-202-9898 (Toll Free)</p>
                <p className="text-slate-600">Email: support@shopez.com</p>
                <p className="text-slate-600">Available: 24/7</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Registered Office</h3>
                <address className="not-italic text-slate-600">
                  ShopEz Internet Private Limited,<br />
                  Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
                  Outer Ring Road, Devarabeesanahalli Village,<br />
                  Bengaluru, 560103, Karnataka, India
                </address>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About
