import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getProductById } from "../../api/productService"
import { addToCart } from "../../api/cartService"
import { addToWishlist } from "../../api/wishlistService"

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Fetch product from API
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        console.error("Error fetching product:", err)
        setError(err.response?.data?.message || "Failed to load product")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-slate-300 border-t-[#1f5fbf] mb-4"></div>
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            {error ? "Error Loading Product" : "Product Not Found"}
          </h1>
          {error && <p className="text-red-600 mb-4">{error}</p>}
          <Link
            to="/"
            className="inline-block bg-[#1f5fbf] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1a4da0] transition"
          >
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const discount = product.mrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0
  const images = [1, 2, 3, 4] // Mock image count

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity)
      alert(`Added ${quantity} ${product.name} to cart!`)
    } catch (err) {
      console.error("Error adding to cart:", err)
      if (err.response?.status === 401) {
        alert("Please login to add items to cart")
      } else {
        alert(err.response?.data?.message || "Failed to add to cart")
      }
    }
  }

  const handleBuyNow = async () => {
    try {
      await addToCart(product._id, quantity)
      window.location.href = "/cart"
    } catch (err) {
      console.error("Error proceeding to checkout:", err)
      if (err.response?.status === 401) {
        alert("Please login to proceed")
      } else {
        alert(err.response?.data?.message || "Failed to proceed to checkout")
      }
    }
  }

  const handleAddToWishlist = async () => {
    try {
      await addToWishlist(product._id)
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

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link to="/" className="hover:text-[#1f5fbf]">
              Home
            </Link>
            <span>/</span>
            <Link to="/" className="hover:text-[#1f5fbf]">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden rounded-2xl bg-white border border-slate-200">
              <div className="flex h-full items-center justify-center">
                <div className="text-center p-8">
                  <div className="h-64 w-64 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center mb-4">
                    <svg
                      className="h-32 w-32 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-slate-500">Image {selectedImage + 1}</p>
                  <p className="text-xs text-slate-400 mt-1">{product.name}</p>
                </div>
              </div>
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-1 aspect-square rounded-lg border-2 transition overflow-hidden ${
                    selectedImage === idx
                      ? "border-[#1f5fbf] shadow-md"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="h-full bg-slate-100 flex items-center justify-center">
                    <svg
                      className="h-8 w-8 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-[#f7d443] text-[#10366b] px-6 py-4 rounded-xl font-bold text-lg hover:bg-[#f7d443]/90 transition shadow-lg">
                <svg
                  className="inline h-6 w-6 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Add to Cart
              </button>
              <button
                onClick={handleAddToWishlist}
                className="flex-shrink-0 bg-white border-2 border-slate-300 px-4 py-4 rounded-xl hover:bg-slate-50 transition"
              >
                <svg
                  className="h-6 w-6 text-slate-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Badge & Brand */}
            {(product.badge || product.brand) && (
              <div className="flex items-center gap-3">
                {product.badge && (
                  <span className="inline-block rounded-full bg-[#1f5fbf] px-3 py-1 text-xs font-semibold text-white">
                    {product.badge}
                  </span>
                )}
                {product.brand && <span className="text-sm text-slate-600">{product.brand}</span>}
              </div>
            )}

            {/* Product Name */}
            <h1 className="text-3xl font-bold text-slate-900 leading-tight">
              {product.name}
            </h1>

            {/* Rating & Reviews */}
            <div className="flex items-center gap-4">
              {product.rating && (
                <div className="flex items-center gap-1">
                  <div className="flex items-center bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold">
                    {product.rating}
                    <svg className="h-3 w-3 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  {product.reviews && (
                    <span className="text-sm text-slate-600">
                      {product.reviews.toLocaleString()} reviews
                    </span>
                  )}
                </div>
              )}
              {product.inStock ? (
                <span className="text-sm font-semibold text-green-600">In Stock</span>
              ) : (
                <span className="text-sm font-semibold text-red-600">Out of Stock</span>
              )}
            </div>

            {/* Price */}
            <div className="border-y border-slate-200 py-4">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-slate-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.mrp && product.mrp > product.price && (
                  <>
                    <span className="text-xl text-slate-500 line-through">
                      ₹{product.mrp.toLocaleString()}
                    </span>
                    <span className="text-lg font-semibold text-green-600">{discount}% off</span>
                  </>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-2">Inclusive of all taxes</p>
            </div>

            {/* Quantity Selector */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-10 w-10 rounded-lg border-2 border-slate-300 hover:bg-slate-100 transition font-semibold"
                >
                  −
                </button>
                <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-10 w-10 rounded-lg border-2 border-slate-300 hover:bg-slate-100 transition font-semibold"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-[#1f5fbf] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#1a4da0] transition shadow-lg"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 bg-[#f7d443] text-[#10366b] px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#f7d443]/90 transition shadow-lg"
              >
                Buy Now
              </button>
            </div>

            {/* Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-5">
                <h3 className="font-semibold text-slate-900 mb-3">Key Highlights</h3>
                <ul className="space-y-2">
                  {product.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                      <svg
                        className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 space-y-8">
          {product.description && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Product Description</h2>
              <p className="text-slate-700 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Specifications</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex border-b border-slate-200 pb-3">
                    <span className="w-1/2 font-medium text-slate-700">{key}</span>
                    <span className="w-1/2 text-slate-600">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Customer Reviews */}
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Customer Reviews</h2>
              <button className="text-[#1f5fbf] font-semibold hover:underline">
                Write a Review
              </button>
            </div>

            <div className="flex items-center gap-6 mb-8 pb-6 border-b">
              <div className="text-center">
                <div className="text-5xl font-bold text-slate-900">{product.rating}</div>
                <div className="flex items-center justify-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.round(product.rating)
                          ? "text-yellow-400"
                          : "text-slate-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-sm text-slate-600 mt-1">
                  {product.reviews.toLocaleString()} reviews
                </div>
              </div>

              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center gap-3">
                    <span className="text-sm text-slate-600 w-12">{stars} ★</span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400"
                        style={{
                          width: `${stars === 5 ? 65 : stars === 4 ? 25 : stars === 3 ? 7 : 2}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-slate-600 w-12">
                      {stars === 5 ? "65%" : stars === 4 ? "25%" : stars === 3 ? "7%" : "2%"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Reviews */}
            <div className="space-y-6">
              {[
                {
                  name: "Rahul Sharma",
                  rating: 5,
                  date: "2 days ago",
                  review:
                    "Excellent product! Worth every penny. The quality is outstanding and it exceeded my expectations.",
                  verified: true,
                },
                {
                  name: "Priya Singh",
                  rating: 4,
                  date: "1 week ago",
                  review:
                    "Good product overall. Fast delivery and well-packaged. Would recommend to others.",
                  verified: true,
                },
                {
                  name: "Amit Kumar",
                  rating: 5,
                  date: "2 weeks ago",
                  review:
                    "Amazing! Been using it for a while now and it's working perfectly. Best purchase this year!",
                  verified: false,
                },
              ].map((review, idx) => (
                <div key={idx} className="border-b border-slate-200 pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">{review.name}</span>
                        {review.verified && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600">
                            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            Verified Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? "text-yellow-400" : "text-slate-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-slate-500">{review.date}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-700 leading-relaxed">{review.review}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
