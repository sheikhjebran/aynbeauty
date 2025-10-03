'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingBagIcon,
  ArrowLeftIcon,
  ShareIcon,
  FireIcon,
  SparklesIcon,
  NewspaperIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface ProductImage {
  id: number
  image_url: string
  is_primary: boolean
  sort_order: number
}

interface Product {
  id: number
  name: string
  description: string
  price: number
  discounted_price?: number
  stock_quantity: number
  category_name: string
  category_slug: string
  image_url?: string
  primary_image?: string
  is_trending: boolean
  is_must_have: boolean
  is_new_arrival: boolean
  created_at: string
  updated_at: string
  images?: ProductImage[]
  rating?: number
  reviews?: ProductReview[]
}

interface ProductReview {
  id: number
  user_id: number
  rating: number
  comment: string
  created_at: string
  user_name: string
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const productId = params?.id as string
  
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/products/${productId}`)
      
      if (!response.ok) {
        throw new Error('Product not found')
      }
      
      const data = await response.json()
      setProduct(data.product)
      
      // Fetch product images
      const imagesResponse = await fetch(`/api/products/${productId}/images`)
      if (imagesResponse.ok) {
        const imagesData = await imagesResponse.json()
        if (imagesData.success && imagesData.images.length > 0) {
          setProduct(prev => prev ? { ...prev, images: imagesData.images } : null)
        }
      }

      // Fetch product reviews
      const reviewsResponse = await fetch(`/api/products/${productId}/reviews`)
      if (reviewsResponse.ok) {
        const reviewsData = await reviewsResponse.json()
        if (reviewsData.success) {
          setReviews(reviewsData.reviews || [])
          setAverageRating(reviewsData.averageRating || 0)
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error)
      setError('Failed to load product')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    try {
      setAddingToCart(true)
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/signin')
        return
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product?.id,
          quantity
        })
      })

      if (response.ok) {
        alert('Product added to cart!')
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Failed to add product to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const addToWishlist = async () => {
    try {
      const token = localStorage.getItem('token')
      
      if (!token) {
        router.push('/signin')
        return
      }

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product_id: product?.id
        })
      })

      if (response.ok) {
        alert('Product added to wishlist!')
      } else {
        throw new Error('Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Add to wishlist error:', error)
      alert('Failed to add product to wishlist')
    }
  }

  const shareProduct = async () => {
    const url = window.location.href
    const text = `Check out this amazing product: ${product?.name}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.name,
          text: text,
          url: url,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to clipboard
      navigator.clipboard.writeText(url).then(() => {
        alert('Product link copied to clipboard!')
      })
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <StarSolidIcon
        key={index}
        className={`h-5 w-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
      />
    ))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'The product you are looking for does not exist.'}</p>
          <Link 
            href="/"
            className="inline-flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const displayImages = product.images && product.images.length > 0 
    ? product.images.sort((a, b) => a.sort_order - b.sort_order)
    : product.image_url 
    ? [{ id: 0, image_url: product.image_url, is_primary: true, sort_order: 0 }]
    : []

  const discountPercentage = product.discounted_price && product.discounted_price < product.price
    ? Math.round(((product.price - product.discounted_price) / product.price) * 100)
    : 0

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={addToWishlist}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <HeartIcon className="h-6 w-6" />
              </button>
              <button 
                onClick={shareProduct}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ShareIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
              <Image
                src={displayImages[selectedImageIndex]?.image_url || '/placeholder-product.jpg'}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {displayImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {displayImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-pink-600' : 'border-gray-200'
                    }`}
                  >
                    <Image
                      src={image.image_url}
                      alt={`${product.name} ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-700">Home</Link>
              <span className="mx-2">/</span>
              <Link href={`/categories/${product.category_slug}`} className="hover:text-gray-700">
                {product.category_name}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>

            {/* Product Tags */}
            <div className="flex gap-2">
              {product.is_trending && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <FireIcon className="h-3 w-3 mr-1" />
                  Trending
                </span>
              )}
              {product.is_must_have && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <SparklesIcon className="h-3 w-3 mr-1" />
                  Must Have
                </span>
              )}
              {product.is_new_arrival && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <NewspaperIcon className="h-3 w-3 mr-1" />
                  New Arrival
                </span>
              )}
            </div>

            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
              <p className="text-lg text-gray-600 mt-2">{product.category_name}</p>
              
              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center">
                  {renderStars(Math.round(averageRating))}
                </div>
                <span className="text-sm text-gray-600">
                  {averageRating > 0 ? `${averageRating.toFixed(1)} out of 5` : 'No ratings yet'}
                </span>
                <span className="text-sm text-gray-500">
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              {product.discounted_price && product.discounted_price < product.price ? (
                <>
                  <span className="text-3xl font-bold text-pink-600">₹{product.discounted_price}</span>
                  <span className="text-xl text-gray-500 line-through">₹{product.price}</span>
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    {discountPercentage}% OFF
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">₹{product.price}</span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <div 
                className="text-gray-700 leading-relaxed"
                style={{ whiteSpace: 'pre-line' }}
              >
                {product.description}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock_quantity > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-gray-700">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900 font-bold"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 border-x border-gray-300 font-bold text-lg text-gray-900 min-w-[50px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:text-gray-900 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={addToCart}
                    disabled={addingToCart}
                    className="flex-1 bg-pink-600 text-white py-3 px-6 rounded-lg hover:bg-pink-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {addingToCart ? 'Adding...' : 'Add to Cart'}
                  </button>
                  
                  <button
                    onClick={addToWishlist}
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:border-pink-600 hover:text-pink-600 transition-colors"
                  >
                    <HeartIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Reviews Section */}
        <div className="mt-12">
          <div className="border-t pt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
              <button 
                onClick={() => {
                  const token = localStorage.getItem('token')
                  if (!token) {
                    router.push('/signin')
                  } else {
                    // Navigate to review form
                    alert('Review form coming soon!')
                  }
                }}
                className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Rate This Product
              </button>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">{review.user_name}</h4>
                          <div className="flex items-center">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(review.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No reviews yet. Be the first to review this product!</p>
                <button 
                  onClick={() => {
                    const token = localStorage.getItem('token')
                    if (!token) {
                      router.push('/signin')
                    } else {
                      alert('Review form coming soon!')
                    }
                  }}
                  className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700 transition-colors"
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}