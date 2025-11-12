'use client'

import { useState, useEffect } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import { useWishlist } from '@/contexts/WishlistContext'

interface WishlistButtonProps {
  productId: number
  productName?: string
  productPrice?: number
  productDiscountedPrice?: number
  productImage?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  onToggle?: (inWishlist: boolean) => void
}

export function WishlistButton({ 
  productId,
  productName = 'Product',
  productPrice = 0,
  productDiscountedPrice,
  productImage = '/images/placeholder.jpg',
  className = '', 
  size = 'md',
  showLabel = false,
  onToggle 
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const { addToWishlist, removeFromWishlist, isInWishlist: checkIsInWishlist } = useWishlist()

  useEffect(() => {
    setIsInWishlist(checkIsInWishlist(productId))
  }, [productId, checkIsInWishlist])

  const toggleWishlist = async () => {
    setLoading(true)
    try {
      if (isInWishlist) {
        await removeFromWishlist(productId)
        setIsInWishlist(false)
      } else {
        await addToWishlist({
          product_id: productId,
          name: productName,
          price: productPrice,
          discounted_price: productDiscountedPrice,
          image: productImage
        })
        setIsInWishlist(true)
      }
      onToggle?.(!isInWishlist)
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'h-4 w-4'
      case 'md':
        return 'h-5 w-5'
      case 'lg':
        return 'h-6 w-6'
      default:
        return 'h-5 w-5'
    }
  }

  const getButtonClasses = () => {
    const baseClasses = 'inline-flex items-center gap-1 transition-colors duration-200'
    const sizeClasses = size === 'sm' ? 'p-1' : size === 'lg' ? 'p-3' : 'p-2'
    const colorClasses = isInWishlist 
      ? 'text-red-600 hover:text-red-700' 
      : 'text-gray-400 hover:text-red-500'
    
    return `${baseClasses} ${sizeClasses} ${colorClasses} ${className}`
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className={getButtonClasses()}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {loading ? (
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-red-600 ${getSizeClasses()}`} />
      ) : isInWishlist ? (
        <HeartSolidIcon className={getSizeClasses()} />
      ) : (
        <HeartIcon className={getSizeClasses()} />
      )}
      
      {showLabel && (
        <span className="text-sm font-medium">
          {isInWishlist ? 'Saved' : 'Save'}
        </span>
      )}
    </button>
  )
}