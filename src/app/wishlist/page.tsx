'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { TrashIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline'
import { WishlistButton } from '@/components/wishlist/wishlist-button'
import { useCart } from '@/contexts/CartContext'

interface WishlistItem {
  id: number
  product_id: number
  product_name: string
  price: number
  original_price?: number
  slug: string
  brand_name: string
  image_url: string
  stock_quantity: number
  avg_rating: number | string
  review_count: number
  created_at: string
}

export default function WishlistPage() {
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set())
  
  // Cart context
  const { addToCart: addToCartContext } = useCart()

  useEffect(() => {
    fetchWishlistItems()
  }, [])

  const fetchWishlistItems = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/auth/login?redirect=/wishlist')
        return
      }

      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          router.push('/auth/login?redirect=/wishlist')
          return
        }
        throw new Error('Failed to fetch wishlist items')
      }

      const data = await response.json()
      setWishlistItems(data.items || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: number) => {
    setRemovingItems(prev => new Set(prev).add(productId))
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'remove',
          product_id: productId
        })
      })

      if (response.ok) {
        setWishlistItems(items => items.filter(item => item.product_id !== productId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const addToCart = async (productId: number) => {
    try {
      const token = localStorage.getItem('token')
      
      // Find the product from wishlist items
      const product = wishlistItems.find(item => item.product_id === productId)
      
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'add',
          product_id: productId,
          quantity: 1
        })
      })

      if (response.ok) {
        // Update local cart context if we have product data
        if (product) {
          addToCartContext({
            product_id: product.product_id,
            name: product.product_name,
            price: product.price,
            discounted_price: product.original_price,
            image: product.image_url || '',
          }, 1)
        }
        
        // Show success message or update cart count
        console.log('Added to cart successfully')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const clearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setWishlistItems([])
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const renderStars = (rating: number | string) => {
    const numRating = typeof rating === 'string' ? parseFloat(rating) : rating
    const safeRating = isNaN(numRating) ? 0 : numRating
    
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < Math.floor(safeRating) ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({safeRating.toFixed(1)})</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-6 w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchWishlistItems}
            className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
          {wishlistItems.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">Start adding products you love to your wishlist.</p>
          <Link
            href="/products"
            className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          <p className="text-gray-600 mb-6">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Wishlist Button */}
                <div className="absolute top-2 right-2 z-10">
                  <WishlistButton
                    productId={item.product_id}
                    size="md"
                    onToggle={(inWishlist) => {
                      if (!inWishlist) {
                        setWishlistItems(items => items.filter(i => i.product_id !== item.product_id))
                      }
                    }}
                  />
                </div>

                {/* Product Image */}
                <Link href={`/products/${item.product_id}`}>
                  <div className="relative aspect-square">
                    <Image
                      src={item.image_url || `https://picsum.photos/300/300?random=${item.product_id}`}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                    {item.original_price && item.original_price > item.price && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                        {Math.round(((item.original_price - item.price) / item.original_price) * 100)}% OFF
                      </div>
                    )}
                    {item.stock_quantity === 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-semibold">Out of Stock</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Product Details */}
                <div className="p-4">
                  <Link href={`/products/${item.product_id}`}>
                    <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-pink-600">
                      {item.product_name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 mb-2">{item.brand_name}</p>

                  {/* Rating */}
                  {item.review_count > 0 && (
                    <div className="mb-2">
                      {renderStars(item.avg_rating)}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-gray-900">{formatPrice(item.price)}</span>
                    {item.original_price && item.original_price > item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.original_price)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item.product_id)}
                      disabled={item.stock_quantity === 0}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                        item.stock_quantity === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-pink-600 text-white hover:bg-pink-700'
                      }`}
                    >
                      <ShoppingBagIcon className="h-4 w-4" />
                      {item.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlist(item.product_id)}
                      disabled={removingItems.has(item.product_id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Added Date */}
                  <p className="text-xs text-gray-500 mt-2">
                    Added {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      </div>
    </div>
  )
}