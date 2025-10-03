'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Share2, ShoppingCart, Star, Plus, Minus, ChevronLeft, ChevronRight } from 'lucide-react'

interface Product {
  id: number
  name: string
  description: string
  price: number
  sale_price?: number
  sku: string
  stock_quantity: number
  brand_name: string
  brand_slug: string
  category_name: string
  category_slug: string
  avg_rating?: number
  review_count: number
  images: Array<{
    image_url: string
    alt_text: string
    sort_order: number
  }>
  variants: Array<{
    id: number
    variant_name: string
    variant_value: string
    price_adjustment: number
  }>
  reviews: Array<{
    id: number
    rating: number
    title: string
    comment: string
    first_name: string
    last_name: string
    created_at: string
  }>
  related_products: Array<{
    id: number
    name: string
    price: number
    sale_price?: number
    main_image: string
    avg_rating?: number
  }>
}

interface ProductDetailPageProps {
  productId: string
}

export function ProductDetailPage({ productId }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isWishlisted, setIsWishlisted] = useState(false)

  useEffect(() => {
    fetchProduct()
  }, [productId])

  const fetchProduct = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/products/${productId}`)
      
      if (!response.ok) {
        throw new Error('Product not found')
      }

      const data = await response.json()
      setProduct(data.product)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load product')
    } finally {
      setIsLoading(false)
    }
  }

  const addToCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': '1' // Replace with actual user ID from auth
        },
        body: JSON.stringify({
          product_id: product?.id,
          variant_id: selectedVariant,
          quantity
        })
      })

      if (response.ok) {
        // Show success message or update cart UI
        alert('Product added to cart!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add to cart')
      }
    } catch (error) {
      alert('Failed to add to cart')
    }
  }

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    // Implement wishlist API call
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">{error || 'The requested product could not be found.'}</p>
          <Link
            href="/"
            className="bg-primary-500 text-white px-6 py-3 rounded-lg hover:bg-primary-600 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const currentPrice = product.sale_price || product.price
  const originalPrice = product.sale_price ? product.price : null
  const discount = originalPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0

  return (
    <div className="min-h-screen bg-white">
      {/* Header spacing for fixed header */}
      <div className="pt-32">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-primary-500">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/category/${product.category_slug}`} className="hover:text-primary-500">
              {product.category_name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        {/* Product Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16">
            {/* Product Images */}
            <div className="mb-8 lg:mb-0">
              {/* Main Image */}
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {product.images && product.images.length > 0 ? (
                  <Image
                    src={product.images[selectedImageIndex]?.image_url || '/placeholder-product.jpg'}
                    alt={product.images[selectedImageIndex]?.alt_text || product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image available
                  </div>
                )}
                
                {/* Navigation arrows */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setSelectedImageIndex(Math.max(0, selectedImageIndex - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                      disabled={selectedImageIndex === 0}
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setSelectedImageIndex(Math.min(product.images.length - 1, selectedImageIndex + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
                      disabled={selectedImageIndex === product.images.length - 1}
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-primary-500' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={image.image_url}
                        alt={image.alt_text}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              {/* Brand */}
              <Link 
                href={`/brand/${product.brand_slug}`}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                {product.brand_name}
              </Link>

              {/* Product Name */}
              <h1 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              {product.avg_rating && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= Math.round(product.avg_rating!)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {product.avg_rating.toFixed(1)} ({product.review_count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{currentPrice.toFixed(2)}
                  </span>
                  {originalPrice && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ₹{originalPrice.toFixed(2)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-sm px-2 py-1 rounded">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                <p className="text-green-600 text-sm mt-1">Inclusive of all taxes</p>
              </div>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Options</h3>
                  <div className="space-y-3">
                    {product.variants.map((variant) => (
                      <label key={variant.id} className="flex items-center">
                        <input
                          type="radio"
                          name="variant"
                          value={variant.id}
                          checked={selectedVariant === variant.id}
                          onChange={() => setSelectedVariant(variant.id)}
                          className="mr-3"
                        />
                        <span>
                          {variant.variant_name}: {variant.variant_value}
                          {variant.price_adjustment !== 0 && (
                            <span className="text-gray-500">
                              {' '}(+₹{variant.price_adjustment})
                            </span>
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Quantity</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 border border-gray-300 rounded-lg min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={quantity >= product.stock_quantity}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-500">
                    {product.stock_quantity} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={addToCart}
                  disabled={product.stock_quantity === 0}
                  className="flex-1 bg-primary-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  {product.stock_quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button
                  onClick={toggleWishlist}
                  className={`p-3 border rounded-lg transition-colors ${
                    isWishlisted
                      ? 'bg-red-50 border-red-200 text-red-600'
                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              {/* Product Description */}
              <div className="prose prose-sm max-w-none">
                <h3 className="text-lg font-semibold mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {product.reviews && product.reviews.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 font-medium">
                        {review.first_name} {review.last_name.charAt(0)}.
                      </span>
                      <span className="ml-2 text-gray-500 text-sm">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.title && (
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                    )}
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Products */}
          {product.related_products && product.related_products.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-8">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {product.related_products.map((relatedProduct) => (
                  <Link
                    key={relatedProduct.id}
                    href={`/product/${relatedProduct.id}`}
                    className="group"
                  >
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                      <Image
                        src={relatedProduct.main_image || '/placeholder-product.jpg'}
                        alt={relatedProduct.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-500 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center mt-1">
                      <span className="font-semibold text-gray-900">
                        ₹{(relatedProduct.sale_price || relatedProduct.price).toFixed(2)}
                      </span>
                      {relatedProduct.sale_price && (
                        <span className="ml-2 text-gray-500 line-through text-sm">
                          ₹{relatedProduct.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {relatedProduct.avg_rating && (
                      <div className="flex items-center mt-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-gray-600">
                          {relatedProduct.avg_rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}