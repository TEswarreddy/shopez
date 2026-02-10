import { useState, useEffect, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { searchProducts } from "../../api/searchService"
import { addToCart } from "../../api/cartService"
import { addToWishlist } from "../../api/wishlistService"

function Search() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedBrands, setSelectedBrands] = useState([])
  const [priceRange, setPriceRange] = useState({ min: "", max: "" })
  const [ratingMin, setRatingMin] = useState(0)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState("relevance")

  // Fetch search results
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setProducts([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await searchProducts(query)
        setProducts(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error searching products:", err)
        setError(err.response?.data?.message || "Failed to search products")
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchSearchResults()
  }, [query])

  // Calculate filter options
  const filterCategories = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.category).filter(Boolean)))
  }, [products])

  const filterBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand).filter(Boolean)))
  }, [products])

  // Toggle filter selection
  const toggleSelection = (value, list, setList) => {
    if (list.includes(value)) {
      setList(list.filter((item) => item !== value))
    } else {
      setList([...list, value])
    }
  }

  // Apply filters
  const filteredProducts = useMemo(() => {
    const minPrice = priceRange.min ? Number(priceRange.min) : 0
    const maxPrice = priceRange.max ? Number(priceRange.max) : Number.POSITIVE_INFINITY

    const results = products.filter((product) => {
      const matchesCategory =
        selectedCategories.length === 0 || selectedCategories.includes(product.category)
      const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(product.brand)
      const matchesPrice = product.price >= minPrice && product.price <= maxPrice
      const matchesRating = product.rating >= ratingMin
      const matchesStock = !inStockOnly || product.inStock

      return matchesCategory && matchesBrand && matchesPrice && matchesRating && matchesStock
    })

    // Sort results
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
  }, [products, selectedCategories, selectedBrands, priceRange, ratingMin, inStockOnly, sortBy])

  // Reset filters
  const resetFilters = () => {
    setSelectedCategories([])
    setSelectedBrands([])
    setPriceRange({ min: "", max: "" })
    setRatingMin(0)
    setInStockOnly(false)
    setSortBy("relevance")
  }

  // Add to cart
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

  // Add to wishlist
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

  // Empty query state
  if (!query) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="mb-2 text-xl font-semibold text-slate-900">Start searching</h2>
            <p className="mb-6 text-slate-600">Enter a search term to find products</p>
            <Link
              to="/"
              className="inline-block rounded-lg bg-[#1f5fbf] px-6 py-3 font-semibold text-white transition hover:bg-[#1a4da0] hover:scale-105 active:scale-95"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-7xl">
        {/* Search Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            Search results for "{query}"
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {loading ? "Searching..." : `${filteredProducts.length} products found`}
          </p>
        </div>

        {/* Search Controls */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={resetFilters}
              className="rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              Reset Filters
            </button>
            {(selectedCategories.length > 0 || selectedBrands.length > 0 || priceRange.min || priceRange.max || ratingMin > 0 || inStockOnly) && (
              <span className="rounded-full bg-[#1f5fbf]/10 px-3 py-1 text-sm font-semibold text-[#1f5fbf]">
                {selectedCategories.length + selectedBrands.length + (priceRange.min || priceRange.max ? 1 : 0) + (ratingMin > 0 ? 1 : 0) + (inStockOnly ? 1 : 0)} filters active
              </span>
            )}
          </div>

          <select
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="relevance">Sort: Relevance</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          {/* Filters Sidebar */}
          <aside className="h-fit rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-slate-900">Refine Results</h3>

            {/* Categories */}
            {filterCategories.length > 0 && (
              <div className="mb-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Categories</p>
                <div className="space-y-2">
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
            )}

            {/* Brands */}
            {filterBrands.length > 0 && (
              <div className="mb-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Brands</p>
                <div className="space-y-2">
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
            )}

            {/* Price Range */}
            <div className="mb-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Price Range</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
                  placeholder="Min"
                  type="number"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                />
                <input
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600"
                  placeholder="Max"
                  type="number"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                />
              </div>
            </div>

            {/* Rating */}
            <div className="mb-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Customer Rating</p>
              <div className="space-y-2">
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

            {/* In Stock */}
            <div>
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

          {/* Results */}
          <div>
            {loading ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[#1f5fbf]"></div>
                <p className="mt-4 text-sm text-slate-600">Searching products...</p>
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-10 text-center">
                <p className="mb-2 text-sm font-semibold text-red-600">Error searching products</p>
                <p className="text-xs text-red-500">{error}</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <svg className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-slate-900">No products found</h3>
                <p className="mb-6 text-sm text-slate-600">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={resetFilters}
                  className="rounded-lg bg-[#1f5fbf] px-6 py-2 text-sm font-semibold text-white transition hover:bg-[#1a4da0]"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link to={`/product/${product._id}`} className="block">
                      <div className="aspect-square overflow-hidden bg-slate-100">
                        <img
                          src={product.images?.[0] || "https://via.placeholder.com/400"}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      </div>
                    </Link>

                    <div className="p-4">
                      <Link to={`/product/${product._id}`}>
                        <h3 className="mb-2 line-clamp-2 text-sm font-semibold text-slate-900 group-hover:text-[#1f5fbf] transition">
                          {product.name}
                        </h3>
                      </Link>

                      {product.brand && (
                        <p className="mb-2 text-xs text-slate-500">{product.brand}</p>
                      )}

                      <div className="mb-3 flex items-baseline gap-2">
                        <span className="text-lg font-bold text-slate-900">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="text-xs text-slate-400 line-through">
                              ₹{product.originalPrice.toLocaleString()}
                            </span>
                            <span className="text-xs font-semibold text-green-600">
                              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
                            </span>
                          </>
                        )}
                      </div>

                      {product.rating > 0 && (
                        <div className="mb-3 flex items-center gap-1">
                          <div className="flex items-center gap-0.5 rounded bg-green-600 px-1.5 py-0.5">
                            <span className="text-xs font-semibold text-white">{product.rating}</span>
                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product._id)}
                          className="flex-1 rounded-lg bg-[#f7d443] py-2 text-sm font-semibold text-slate-900 transition hover:bg-[#f7d443]/90 hover:scale-105 active:scale-95"
                        >
                          Add to Cart
                        </button>
                        <button
                          onClick={() => handleAddToWishlist(product._id)}
                          className="rounded-lg border-2 border-slate-200 bg-white p-2 text-slate-600 transition hover:border-red-500 hover:text-red-500 hover:scale-105 active:scale-95"
                        >
                          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Search
