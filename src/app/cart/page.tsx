'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ProductImage } from '@/components/ui/ProductImage'

interface CartItem {
  id: number
  product_id: number
  quantity: number
  price: string
  created_at: string
  updated_at: string
  product_name: string
  product_slug: string
  brand_name: string
  image_url: string
  stock_quantity: number
  original_price?: string
}

export default function CartPage() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCart()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCartItems(data.items || [])
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId)
      return
    }

    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      })

      if (response.ok) {
        await fetchCart()
      } else {
        alert('Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      alert('Failed to update quantity')
    } finally {
      setUpdating(false)
    }
  }

  const removeFromCart = async (itemId: number) => {
    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        await fetchCart()
      } else {
        alert('Failed to remove item')
      }
    } catch (error) {
      console.error('Error removing item:', error)
      alert('Failed to remove item')
    } finally {
      setUpdating(false)
    }
  }

  const clearCart = async () => {
    if (!confirm('Are you sure you want to clear your cart?')) return

    setUpdating(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setCartItems([])
      } else {
        alert('Failed to clear cart')
      }
    } catch (error) {
      console.error('Error clearing cart:', error)
      alert('Failed to clear cart')
    } finally {
      setUpdating(false)
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity)
    }, 0)
  }

  const calculateOriginalTotal = () => {
    return cartItems.reduce((total, item) => {
      const originalPrice = item.original_price ? parseFloat(item.original_price) : parseFloat(item.price)
      return total + (originalPrice * item.quantity)
    }, 0)
  }

  const calculateSavings = () => {
    return calculateOriginalTotal() - calculateTotal()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Your Cart</h1>
            <p className="text-gray-600 mb-4">Please login to view your cart</p>
            <Link
              href="/auth/signin"
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your cart...</p>
          </div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Your Cart</h1>
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              href="/"
              className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Your Cart ({cartItems.length} items)</h1>
          <button
            onClick={clearCart}
            disabled={updating}
            className="text-red-600 hover:text-red-800 disabled:opacity-50"
          >
            Clear Cart
          </button>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <ProductImage
                      src={item.image_url || '/placeholder-product.jpg'}
                      alt={item.product_name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product_slug}`}
                      className="text-lg font-medium hover:text-pink-600 text-gray-900"
                    >
                      {item.product_name}
                    </Link>
                    {item.brand_name && (
                      <p className="text-sm text-gray-600">{item.brand_name}</p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      {item.original_price && parseFloat(item.original_price) > parseFloat(item.price) ? (
                        <>
                          <span className="text-lg font-bold text-pink-600">
                            ${parseFloat(item.price).toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${parseFloat(item.original_price).toFixed(2)}
                          </span>
                          <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-medium">
                            {Math.round(((parseFloat(item.original_price) - parseFloat(item.price)) / parseFloat(item.original_price)) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-pink-600">
                          ${parseFloat(item.price).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      disabled={updating}
                      className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 border border-gray-300 text-gray-700 hover:text-gray-900"
                    >
                      <MinusIcon className="h-4 w-4" />
                    </button>
                    <span className="w-12 text-center text-gray-900 font-medium bg-gray-50 py-1 px-2 rounded border">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      disabled={updating || item.quantity >= item.stock_quantity}
                      className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 border border-gray-300 text-gray-700 hover:text-gray-900"
                    >
                      <PlusIcon className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                    {item.original_price && parseFloat(item.original_price) > parseFloat(item.price) && (
                      <p className="text-sm text-gray-500 line-through">
                        ${(parseFloat(item.original_price) * item.quantity).toFixed(2)}
                      </p>
                    )}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      disabled={updating}
                      className="text-red-600 hover:text-red-800 text-sm disabled:opacity-50 mt-2"
                    >
                      <TrashIcon className="h-4 w-4 inline mr-1" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              {calculateSavings() > 0 && (
                <div className="flex justify-between text-gray-700">
                  <span>Original Price</span>
                  <span className="line-through">${calculateOriginalTotal().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>${calculateTotal().toFixed(2)}</span>
              </div>
              {calculateSavings() > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>You Save</span>
                  <span>-${calculateSavings().toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>

            <button
              disabled={updating}
              className="w-full bg-pink-600 text-white py-3 px-4 rounded-lg hover:bg-pink-700 disabled:opacity-50 font-medium"
            >
              Proceed to Checkout
            </button>

            <Link
              href="/"
              className="block w-full text-center mt-3 text-pink-600 hover:text-pink-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
