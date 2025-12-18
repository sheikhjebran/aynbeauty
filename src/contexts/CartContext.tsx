'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface CartItem {
  id: number
  product_id: number
  name: string
  price: number
  discounted_price?: number
  image: string
  quantity: number
  variant?: string
}

interface CartContextType {
  items: CartItem[]
  totalItems: number
  totalPrice: number
  addToCart: (product: Omit<CartItem, 'id' | 'quantity'>, quantity?: number) => void
  removeFromCart: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: number) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('shopping_cart')
      if (savedCart) {
        setItems(JSON.parse(savedCart))
      }
    }
  }, [])

  // Save cart to localStorage whenever items change (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shopping_cart', JSON.stringify(items))
    }
  }, [items])

  const addToCart = (product: Omit<CartItem, 'id' | 'quantity'>, quantity = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.product_id === product.product_id)
      
      if (existingItem) {
        // Update quantity if item already exists
        return prevItems.map(item =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        // Add new item
        const newItem: CartItem = {
          ...product,
          id: Date.now(), // Simple ID generation
          quantity
        }
        return [...prevItems, newItem]
      }
    })
  }

  const removeFromCart = (itemId: number) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const isInCart = (productId: number) => {
    return items.some(item => item.product_id === productId)
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => {
    const price = item.discounted_price || item.price
    return sum + (price * item.quantity)
  }, 0)

  return (
    <CartContext.Provider value={{
      items,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isInCart
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}