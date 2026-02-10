const categories = [
  "All",
  "Mobiles",
  "Electronics",
  "Fashion",
  "Home",
  "Appliances",
  "Beauty",
  "Sports",
  "Toys",
  "Books",
]

const quickLinks = [
  "Super Deals",
  "New Arrivals",
  "Top Brands",
  "Under 999",
  "Exchange",
]

const deals = [
  { title: "Mega Savings", subtitle: "Up to 70% off", tag: "Flash" },
  { title: "No Cost EMI", subtitle: "On select cards", tag: "Today" },
  { title: "New Season", subtitle: "Fresh fashion edit", tag: "Hot" },
]

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: 119999,
    mrp: 129999,
    rating: 4.7,
    reviews: 1284,
    badge: "Best Seller",
  },
  {
    id: 2,
    name: "Samsung Neo QLED 55\"",
    price: 67999,
    mrp: 79999,
    rating: 4.6,
    reviews: 642,
    badge: "Top Rated",
  },
  {
    id: 3,
    name: "Nike Air Zoom",
    price: 6499,
    mrp: 8999,
    rating: 4.5,
    reviews: 421,
    badge: "Limited",
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    price: 24999,
    mrp: 29999,
    rating: 4.8,
    reviews: 3121,
    badge: "Premium",
  },
  {
    id: 5,
    name: "LG 7kg Washer",
    price: 21999,
    mrp: 26999,
    rating: 4.4,
    reviews: 388,
    badge: "Eco",
  },
  {
    id: 6,
    name: "Boat Airdopes",
    price: 1499,
    mrp: 2999,
    rating: 4.2,
    reviews: 9821,
    badge: "Deal",
  },
]

const formatPrice = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-[#1f5fbf] text-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f7d443] text-[#10366b] font-black">
              S
            </div>
            <div>
              <p className="text-lg font-bold leading-tight">ShopEz</p>
              <p className="text-xs text-white/80">Flipkart-style deals</p>
            </div>
          </div>

          <div className="flex flex-1 items-center gap-2">
            <div className="relative hidden w-40 md:block">
              <select
                className="w-full appearance-none rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-white backdrop-blur"
                defaultValue="All"
              >
                {categories.map((item) => (
                  <option key={item} value={item} className="text-slate-900">
                    {item}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3 top-2.5 text-xs">▾</span>
            </div>
            <div className="relative flex-1">
              <input
                className="w-full rounded-lg border border-white/20 bg-white px-4 py-2 text-sm text-slate-900 shadow-sm outline-none ring-offset-2 focus:ring-2 focus:ring-[#f7d443]"
                placeholder="Search for products, brands and more"
              />
              <button className="absolute right-1.5 top-1.5 rounded-md bg-[#f7d443] px-3 py-1.5 text-sm font-semibold text-[#10366b] transition hover:brightness-95">
                Search
              </button>
            </div>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20">
              Login
            </button>
            <button className="rounded-full bg-[#f7d443] px-4 py-2 text-sm font-semibold text-[#10366b]">
              Cart (2)
            </button>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-6xl flex-wrap gap-4 px-4 py-3 text-sm text-white/90">
            {quickLinks.map((link) => (
              <button
                key={link}
                className="rounded-full border border-white/15 px-3 py-1 transition hover:border-white/40 hover:text-white"
              >
                {link}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <section className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1f5fbf] via-[#1a4da0] to-[#0b2d66] p-6 text-white">
            <div className="absolute -right-16 -top-14 h-48 w-48 rounded-full bg-[#f7d443]/30 blur-3xl" />
            <p className="text-sm uppercase tracking-widest text-white/70">February Deals</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
              Flipkart-style prices.
              <br />
              Premium picks for everyone.
            </h1>
            <p className="mt-3 max-w-md text-sm text-white/80">
              Shop curated offers across electronics, fashion, and home. Free delivery on your first order.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-full bg-[#f7d443] px-5 py-2 text-sm font-semibold text-[#10366b]">
                Shop Deals
              </button>
              <button className="rounded-full border border-white/30 px-5 py-2 text-sm font-semibold">
                View Categories
              </button>
            </div>
            <div className="mt-8 flex flex-wrap gap-4 text-xs text-white/70">
              <span>Free returns</span>
              <span>Assured quality</span>
              <span>Secure payments</span>
            </div>
          </div>

          <div className="grid gap-4">
            {deals.map((deal) => (
              <div
                key={deal.title}
                className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#f7d443]/30 px-3 py-1 text-xs font-semibold text-[#7a5b00]">
                    {deal.tag}
                  </span>
                  <span className="text-xs text-slate-400">Limited</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">{deal.title}</h3>
                <p className="text-sm text-slate-500">{deal.subtitle}</p>
                <button className="mt-4 text-sm font-semibold text-[#1f5fbf]">
                  Explore
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Browse by category</h2>
              <p className="text-sm text-slate-500">Find the perfect match for every need.</p>
            </div>
            <button className="text-sm font-semibold text-[#1f5fbf]">View all</button>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.slice(1).map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-1 hover:border-[#1f5fbf]/40"
              >
                {item}
                <p className="mt-2 text-xs font-normal text-slate-400">Top picks inside</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Top deals for you</h2>
              <p className="text-sm text-slate-500">Handpicked offers refreshed hourly.</p>
            </div>
            <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
              See all deals
            </button>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="absolute right-4 top-4 rounded-full bg-[#1f5fbf]/10 px-3 py-1 text-xs font-semibold text-[#1f5fbf]">
                  {product.badge}
                </div>
                <div className="flex h-32 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-400">
                  Product Image
                </div>
                <h3 className="mt-4 text-base font-semibold text-slate-900">{product.name}</h3>
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">
                    {product.rating}★
                  </span>
                  <span className="text-slate-400">({product.reviews})</span>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</span>
                  <span className="text-sm text-slate-400 line-through">{formatPrice(product.mrp)}</span>
                </div>
                <div className="mt-4 flex gap-2">
                  <button className="flex-1 rounded-full bg-[#f7d443] px-4 py-2 text-sm font-semibold text-[#10366b]">
                    Add to cart
                  </button>
                  <button className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600">
                    Wish
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-slate-500">
          <p>ShopEz 2026. Built for fast, reliable shopping.</p>
          <div className="flex gap-4">
            <a className="hover:text-slate-700" href="#">Help Center</a>
            <a className="hover:text-slate-700" href="#">Returns</a>
            <a className="hover:text-slate-700" href="#">Track Order</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
