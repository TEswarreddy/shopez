import { useMemo, useState } from "react"
import { Link } from "react-router-dom"

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
    category: "Mobiles",
    brand: "Apple",
    inStock: true,
  },
  {
    id: 2,
    name: "Samsung Neo QLED 55\"",
    price: 67999,
    mrp: 79999,
    rating: 4.6,
    reviews: 642,
    badge: "Top Rated",
    category: "Electronics",
    brand: "Samsung",
    inStock: true,
  },
  {
    id: 3,
    name: "Nike Air Zoom",
    price: 6499,
    mrp: 8999,
    rating: 4.5,
    reviews: 421,
    badge: "Limited",
    category: "Fashion",
    brand: "Nike",
    inStock: true,
  },
  {
    id: 4,
    name: "Sony WH-1000XM5",
    price: 24999,
    mrp: 29999,
    rating: 4.8,
    reviews: 3121,
    badge: "Premium",
    category: "Electronics",
    brand: "Sony",
    inStock: false,
  },
  {
    id: 5,
    name: "LG 7kg Washer",
    price: 21999,
    mrp: 26999,
    rating: 4.4,
    reviews: 388,
    badge: "Eco",
    category: "Appliances",
    brand: "LG",
    inStock: true,
  },
  {
    id: 6,
    name: "Boat Airdopes",
    price: 1499,
    mrp: 2999,
    rating: 4.2,
    reviews: 9821,
    badge: "Deal",
    category: "Electronics",
    brand: "Boat",
    inStock: true,
  },
  {
    id: 7,
    name: "Adidas Training Tee",
    price: 899,
    mrp: 1499,
    rating: 4.1,
    reviews: 284,
    badge: "Trending",
    category: "Fashion",
    brand: "Adidas",
    inStock: true,
  },
  {
    id: 8,
    name: "Prestige Mixer",
    price: 2999,
    mrp: 4299,
    rating: 4.0,
    reviews: 512,
    badge: "Kitchen",
    category: "Home",
    brand: "Prestige",
    inStock: true,
  },
  {
    id: 9,
    name: "Cosrx Snail Essence",
    price: 1299,
    mrp: 1799,
    rating: 4.6,
    reviews: 893,
    badge: "Skincare",
    category: "Beauty",
    brand: "Cosrx",
    inStock: false,
  },
]

const filterCategories = Array.from(new Set(products.map((product) => product.category)))
const filterBrands = Array.from(new Set(products.map((product) => product.brand)))

const formatPrice = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [ratingMin, setRatingMin] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")

  const toggleSelection = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value))
      return
    }
    setList([...list, value])
  }

  const filteredProducts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const minPrice = priceRange.min ? Number(priceRange.min) : 0
    const maxPrice = priceRange.max ? Number(priceRange.max) : Number.POSITIVE_INFINITY

    const matchesQuery = (product) => {
      if (!query) return true
      return [product.name, product.brand, product.category]
        .join(" ")
        .toLowerCase()
        .includes(query)
    }

    const results = products.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice
      const matchesRating = product.rating >= ratingMin
      const matchesStock = !inStockOnly || product.inStock

      return (
        matchesQuery(product) &&
        matchesCategory &&
        matchesBrand &&
        matchesPrice &&
        matchesRating &&
        matchesStock
      )
    })

    if (sortBy === "price-low") {
      return [...results].sort((a, b) => a.price - b.price)
    }
    if (sortBy === "price-high") {
      return [...results].sort((a, b) => b.price - a.price)
    }
    if (sortBy === "rating") {
      return [...results].sort((a, b) => b.rating - a.rating)
    }
    return results
  }, [searchQuery, selectedCategories, selectedBrands, priceRange, ratingMin, inStockOnly, sortBy])

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange({ min: "", max: "" })
    setRatingMin(0)
    setInStockOnly(false)
    setSortBy("relevance")
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <main className="mx-auto w-full px-4 py-6">
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Product listing</h2>
              <p className="text-sm text-slate-500">
                {filteredProducts.length} items matched your filters.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <input
                  className="w-64 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm outline-none ring-offset-2 focus:ring-2 focus:ring-[#1f5fbf]/40"
                  placeholder="Search within listing"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <select
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="relevance">Sort: Relevance</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[240px_1fr]">
            <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">Filters</h3>
                <button
                  className="text-xs font-semibold text-[#1f5fbf]"
                  type="button"
                  onClick={resetFilters}
                >
                  Clear all
                </button>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Categories</p>
                <div className="mt-3 space-y-2">
                  {filterCategories.map((category) => (
                    <label key={category} className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-[#1f5fbf]"
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleSelection(category, selectedCategories, setSelectedCategories)}
                      />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Brands</p>
                <div className="mt-3 space-y-2">
                  {filterBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-300 text-[#1f5fbf]"
                        checked={selectedBrands.includes(brand)}
                        onChange={() => toggleSelection(brand, selectedBrands, setSelectedBrands)}
                      />
                      {brand}
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Price range</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
                    placeholder="Min"
                    type="number"
                    value={priceRange.min}
                    onChange={(event) => setPriceRange({ ...priceRange, min: event.target.value })}
                  />
                  <input
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
                    placeholder="Max"
                    type="number"
                    value={priceRange.max}
                    onChange={(event) => setPriceRange({ ...priceRange, max: event.target.value })}
                  />
                </div>
              </div>

              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Customer rating</p>
                <div className="mt-3 space-y-2">
                  {[4, 3, 2, 1].map((value) => (
                    <label key={value} className="flex items-center gap-2 text-sm text-slate-600">
                      <input
                        type="radio"
                        name="rating"
                        className="h-4 w-4 border-slate-300 text-[#1f5fbf]"
                        checked={ratingMin === value}
                        onChange={() => setRatingMin(value)}
                      />
                      {value}+ stars
                    </label>
                  ))}
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="radio"
                      name="rating"
                      className="h-4 w-4 border-slate-300 text-[#1f5fbf]"
                      checked={ratingMin === 0}
                      onChange={() => setRatingMin(0)}
                    />
                    All ratings
                  </label>
                </div>
              </div>

              <div className="mt-5">
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-[#1f5fbf]"
                    checked={inStockOnly}
                    onChange={() => setInStockOnly(!inStockOnly)}
                  />
                  In stock only
                </label>
              </div>
            </aside>

            <div>
              {filteredProducts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                  No products found. Try changing your filters.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    >
                      <Link to={`/product/${product.id}`} className="block">
                        <div className="absolute right-4 top-4 rounded-full bg-[#1f5fbf]/10 px-3 py-1 text-xs font-semibold text-[#1f5fbf]">
                          {product.badge}
                        </div>
                        <div className="flex h-32 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-400">
                          Product Image
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-slate-900">{product.name}</h3>
                        <p className="text-xs text-slate-500">
                          {product.brand} · {product.category}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                          <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-700">
                            {product.rating}★
                          </span>
                          <span className="text-slate-400">({product.reviews})</span>
                          <span
                            className={`ml-auto rounded-full px-2 py-1 text-xs font-semibold ${
                              product.inStock
                                ? "bg-slate-100 text-slate-600"
                                : "bg-rose-100 text-rose-600"
                            }`}
                          >
                            {product.inStock ? "In stock" : "Out of stock"}
                          </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-lg font-bold text-slate-900">
                            {formatPrice(product.price)}
                          </span>
                          <span className="text-sm text-slate-400 line-through">
                            {formatPrice(product.mrp)}
                          </span>
                        </div>
                      </Link>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            console.log("Add to cart:", product.id)
                          }}
                          className="flex-1 rounded-full bg-[#f7d443] px-4 py-2 text-sm font-semibold text-[#10366b] disabled:cursor-not-allowed disabled:opacity-60"
                          disabled={!product.inStock}
                        >
                          Add to cart
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            console.log("Add to wishlist:", product.id)
                          }}
                          className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                        >
                          Wish
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-4 px-4 py-6 text-sm text-slate-500">
          <p>ShopEz 2026. Built for fast, reliable shopping.</p>
          <div className="flex gap-4">
            <a className="hover:text-slate-700" href="#">
              Help Center
            </a>
            <a className="hover:text-slate-700" href="#">
              Returns
            </a>
            <a className="hover:text-slate-700" href="#">
              Track Order
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
