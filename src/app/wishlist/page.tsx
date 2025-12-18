'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { TrashIcon, ShoppingBagIcon, StarIcon } from '@heroicons/react/24/outline'
import { WishlistButton } from '@/components/wishlist/wishlist-button'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'

interface WishlistDisplayItem {
  id: number
  product_id: number
  name: string
  price: number
  discounted_price?: number
  image: string
}

export default function WishlistPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set())
  
  // Wishlist context
  const { items: wishlistItems, removeFromWishlist, isGuest } = useWishlist()
  
  // Cart context
  const { addToCart: addToCartContext } = useCart()

  useEffect(() => {
    // Simulate loading state
    setTimeout(() => {
      setLoading(false)
    }, 500)
  }, [])

  const removeFromWishlistHandler = async (productId: number) => {
    setRemovingItems(prev => new Set(prev).add(productId))
    
    try {
      await removeFromWishlist(productId)
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      setError('Failed to remove item from wishlist')
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }

  const addToCart = async (item: WishlistDisplayItem) => {
    try {
      addToCartContext({
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        discounted_price: item.discounted_price,
        image: item.image,
      }, 1)
      
      // Show success message or update cart count
      console.log('Added to cart successfully')
    } catch (error) {
      console.error('Error adding to cart:', error)
      setError('Failed to add item to cart')
    }
  }

  const clearWishlist = async () => {
    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
      return
    }

    try {
      // Remove all items one by one
      for (const item of wishlistItems) {
        await removeFromWishlist(item.product_id)
      }
    } catch (error) {
      console.error('Error clearing wishlist:', error)
      setError('Failed to clear wishlist')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
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
            onClick={() => setError(null)}
            className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
          >
            Dismiss
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
            {isGuest && (
              <p className="text-sm text-gray-600 mt-2">
              
              </p>
            )}
          </div>
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
              <div key={item.id} className="relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                {/* Wishlist Button */}
                <div className="absolute top-2 right-2 z-10">
                  <WishlistButton
                    productId={item.product_id}
                    productName={item.name}
                    productPrice={item.price}
                    productDiscountedPrice={item.discounted_price}
                    productImage={item.image}
                    size="md"
                    onToggle={(inWishlist) => {
                      if (!inWishlist) {
                        // Item was removed from wishlist
                      }
                    }}
                  />
                </div>

                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <Image
                    src={item.image || '/images/placeholder.jpg'}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
                    {item.name}
                  </h3>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-gray-900">{formatPrice(item.discounted_price || item.price)}</span>
                    {item.discounted_price && item.discounted_price < item.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(item.price)}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-3 text-sm font-medium rounded-md transition-colors bg-pink-600 text-white hover:bg-pink-700"
                    >
                      <ShoppingBagIcon className="h-4 w-4" />
                      Add to Cart
                    </button>
                    
                    <button
                      onClick={() => removeFromWishlistHandler(item.product_id)}
                      disabled={removingItems.has(item.product_id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Remove from wishlist"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
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
