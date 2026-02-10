import { useMemo, useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getProducts } from "../../api/productService"
import { addToCart } from "../../api/cartService"
import { addToWishlist } from "../../api/wishlistService"

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

const formatPrice = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value)
}

function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [ratingMin, setRatingMin] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProducts()
        setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching products:", err)
        setError(err.response?.data?.message || "Failed to load products")
        setProducts([]) // Ensure products is always an array even on error
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Calculate filter options from products
  const filterCategories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category).filter(Boolean)))
  }, [products])

  const filterBrands = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.brand).filter(Boolean)))
  }, [products])

  const toggleSelection = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value))
      return
    }
    setList([...list, value])
  }

  const handleAddToCart = async (productId) => {
    try {
      await addToCart(productId, 1)
      alert("Product added to cart!")
    } catch (err) {
      console.error("Error adding to cart:", err)
      if (err.response?.status === 401) {
        alert("Please login to add items to cart")
      } else {
        alert(err.response?.data?.message || "Failed to add to cart")
      }
    }
  }

  const handleAddToWishlist = async (productId) => {
    try {
      await addToWishlist(productId)
      alert("Product added to wishlist!")
    } catch (err) {
      console.error("Error adding to wishlist:", err)
      if (err.response?.status === 401) {
        alert("Please login to add items to wishlist")
      } else {
        alert(err.response?.data?.message || "Failed to add to wishlist")
      }
    }
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
            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 rounded-full border-2 border-[#1f5fbf] bg-white px-4 py-2 text-sm font-semibold text-[#1f5fbf] transition hover:bg-[#1f5fbf] hover:text-white lg:hidden"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
                {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange.min || priceRange.max || ratingMin > 0 || inStockOnly) && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1f5fbf] text-xs text-white">
                    {selectedCategories.length + selectedBrands.length + (priceRange.min || priceRange.max ? 1 : 0) + (ratingMin > 0 ? 1 : 0) + (inStockOnly ? 1 : 0)}
                  </span>
                )}
              </button>
              <div>
                <h2 className="text-xl font-bold">Product listing</h2>
                <p className="text-sm text-slate-500">
                  {filteredProducts.length} items matched your filters.
                </p>
              </div>
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
            {/* Desktop Filters - Hidden on Mobile */}
            <aside className="hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
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

            {/* Mobile Filter Drawer */}
            {mobileFiltersOpen && (
              <>
                {/* Backdrop Overlay */}
                <div
                  className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden"
                  onClick={() => setMobileFiltersOpen(false)}
                ></div>

                {/* Drawer */}
                <aside className="fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw] overflow-y-auto bg-white shadow-2xl transition-transform lg:hidden">
                  {/* Drawer Header */}
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
                    <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-sm font-semibold text-[#1f5fbf]"
                        type="button"
                        onClick={resetFilters}
                      >
                        Clear all
                      </button>
                      <button
                        onClick={() => setMobileFiltersOpen(false)}
                        className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900"
                      >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Drawer Content */}
                  <div className="p-5">
                    <div className="mt-3">
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
                              name="rating-mobile"
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
                            name="rating-mobile"
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
                  </div>

                  {/* Drawer Footer */}
                  <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4">
                    <button
                      onClick={() => setMobileFiltersOpen(false)}
                      className="w-full rounded-lg bg-[#1f5fbf] py-3 font-semibold text-white transition hover:bg-[#1a4da0] active:scale-95"
                    >
                      Apply Filters ({filteredProducts.length} items)
                    </button>
                  </div>
                </aside>
              </>
            )}

            <div>
              {loading ? (
                <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[#1f5fbf]"></div>
                  <p className="mt-4 text-sm text-slate-600">Loading products...</p>
                </div>
              ) : error ? (
                <div className="rounded-3xl border border-red-200 bg-red-50 p-10 text-center">
                  <p className="text-sm text-red-600 font-semibold mb-2">Error loading products</p>
                  <p className="text-xs text-red-500">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 rounded-full bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 transition"
                  >
                    Retry
                  </button>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                  No products found. Try changing your filters.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((product) => (
                    <div
                      key={product._id || product.id}
                      className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-[#1f5fbf]/30"
                    >
                      <Link to={`/product/${product._id || product.id}`} className="block">
                        {product.badge && (
                          <div className="absolute right-4 top-4 z-10 rounded-full bg-[#1f5fbf]/10 px-3 py-1 text-xs font-semibold text-[#1f5fbf] backdrop-blur-sm">
                            {product.badge}
                          </div>
                        )}
                        <div className="relative flex h-48 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="text-sm font-semibold text-slate-400 group-hover:scale-110 transition-transform duration-300">Product Image</span>
                        </div>
                        <h3 className="mt-4 text-base font-semibold text-slate-900 line-clamp-2 group-hover:text-[#1f5fbf] transition-colors">{product.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">
                          {product.brand} · {product.category}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-xs flex-wrap">
                          {product.rating && (
                            <span className="rounded-full bg-emerald-100 px-2 py-1 font-semibold text-emerald-700 inline-flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              {product.rating}
                            </span>
                          )}
                          {product.reviews && (
                            <span className="text-slate-400">({product.reviews.toLocaleString()})</span>
                          )}
                          <span
                            className={`ml-auto rounded-full px-2 py-1 text-xs font-semibold ${
                              product.inStock
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            }`}
                          >
                            {product.inStock ? "In stock" : "Out of stock"}
                          </span>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                          <span className="text-xl font-bold text-slate-900">
                            {formatPrice(product.price)}
                          </span>
                          {product.mrp && product.mrp > product.price && (
                            <>
                              <span className="text-sm text-slate-400 line-through">
                                {formatPrice(product.mrp)}
                              </span>
                              <span className="text-xs font-semibold text-green-600">
                                {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                              </span>
                            </>
                          )}
                        </div>
                      </Link>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToCart(product._id)
                          }}
                          className="flex-1 rounded-full bg-[#f7d443] px-4 py-2.5 text-sm font-semibold text-[#10366b] disabled:cursor-not-allowed disabled:opacity-60 hover:bg-[#f7d443]/90 hover:scale-105 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
                          disabled={!product.inStock}
                        >
                          <svg className="w-4 h-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to cart
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            handleAddToWishlist(product._id)
                          }}
                          className="rounded-full border-2 border-slate-200 p-2.5 text-slate-600 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600 hover:scale-110 active:scale-95 transition-all duration-200"
                          title="Add to wishlist"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
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
