'use client'

import { useState, useEffect } from 'react'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface WishlistButtonProps {
  productId: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  onToggle?: (inWishlist: boolean) => void
}

export function WishlistButton({ 
  productId, 
  className = '', 
  size = 'md',
  showLabel = false,
  onToggle 
}: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    checkAuthAndWishlistStatus()
  }, [productId])

  const checkAuthAndWishlistStatus = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      setIsAuthenticated(false)
      return
    }

    setIsAuthenticated(true)
    
    try {
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        const inWishlist = data.items.some((item: any) => item.product_id === productId)
        setIsInWishlist(inWishlist)
      }
    } catch (error) {
      console.error('Error checking wishlist status:', error)
    }
  }

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'toggle',
          product_id: productId
        })
      })

      if (response.ok) {
        const data = await response.json()
        setIsInWishlist(data.inWishlist)
        onToggle?.(data.inWishlist)
      } else {
        const error = await response.json()
        console.error('Error toggling wishlist:', error.message)
      }
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