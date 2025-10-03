'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

interface WishlistItem {
  id: number
  product_id: number
  name: string
  price: number
  discounted_price?: number
  image: string
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (product: Omit<WishlistItem, 'id'>) => Promise<void>
  removeFromWishlist: (productId: number) => Promise<void>
  isInWishlist: (productId: number) => boolean
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const { user, token } = useAuth()

  // Load wishlist when user logs in
  useEffect(() => {
    if (user && token) {
      loadWishlist()
    } else {
      setItems([])
    }
  }, [user, token])

  const loadWishlist = async () => {
    if (!token) return
    
    try {
      setLoading(true)
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setItems(data.items || [])
      }
    } catch (error) {
      console.error('Failed to load wishlist:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToWishlist = async (product: Omit<WishlistItem, 'id'>) => {
    if (!token) {
      throw new Error('Please sign in to add items to wishlist')
    }

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: product.product_id })
      })

      if (response.ok) {
        const newItem: WishlistItem = {
          ...product,
          id: Date.now()
        }
        setItems(prev => [...prev, newItem])
      } else {
        throw new Error('Failed to add to wishlist')
      }
    } catch (error) {
      console.error('Add to wishlist error:', error)
      throw error
    }
  }

  const removeFromWishlist = async (productId: number) => {
    if (!token) return

    try {
      const response = await fetch(`/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setItems(prev => prev.filter(item => item.product_id !== productId))
      } else {
        throw new Error('Failed to remove from wishlist')
      }
    } catch (error) {
      console.error('Remove from wishlist error:', error)
      throw error
    }
  }

  const isInWishlist = (productId: number) => {
    return items.some(item => item.product_id === productId)
  }

  return (
    <WishlistContext.Provider value={{
      items,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      loading
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}