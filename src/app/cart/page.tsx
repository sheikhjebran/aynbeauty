'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'
import { ProductImage } from '@/components/ui/ProductImage'
import DeliveryDetailsModal from '@/components/ui/DeliveryDetailsModal'

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
  variant_id?: number
}

export default function CartPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)

  useEffect(() => {
    if (user) {
      fetchCart()
    }
  }, [user])

  // WhatsApp checkout function
  const handleWhatsAppCheckout = async () => {
    if (!user) {
      alert('Please log in to proceed with checkout. You will be redirected to the login page.')
      router.push('/login')
      return
    }

    if (cartItems.length === 0) {
      alert('Your cart is empty')
      return
    }

    // Show delivery details modal instead of processing directly
    setShowDeliveryModal(true)
  }

  // Process WhatsApp checkout with delivery details  
  const processWhatsAppCheckout = async (deliveryDetails: any) => {
    const confirm = window.confirm('This will send your order details to WhatsApp for processing. Do you want to continue?')
    if (!confirm) return

    try {
      setCheckoutLoading(true)

      // Create order in database first
      const token = localStorage.getItem('token')
      const orderData = {
        shipping_address: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone || '',
          address: 'To be provided',
          city: 'To be provided',
          state: 'To be provided',
          pincode: 'To be provided'
        },
        billing_address: {
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phone: user.phone || '',
          address: 'To be provided',
          city: 'To be provided',
          state: 'To be provided',
          pincode: 'To be provided'
        },
        payment_method: 'whatsapp_checkout',
        payment_reference: null, // Will be updated when payment is confirmed
        items: cartItems.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id || null,
          quantity: item.quantity
        }))
      }

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      if (!orderResponse.ok) {
        throw new Error('Failed to create order')
      }

      const orderResult = await orderResponse.json()
      const orderNumber = orderResult.order.order_number

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.price) * item.quantity), 0)
      const shippingAmount = subtotal >= 299 ? 0 : 49
      const total = subtotal + shippingAmount

      // Prepare WhatsApp message
      const customerDetails = `
*Customer Details:*
Name: ${user.first_name} ${user.last_name}
Email: ${user.email}
Phone: ${user.phone || 'Not provided'}
Address: To be provided via WhatsApp
      `.trim()

      const orderDetails = cartItems.map(item => 
        `• ${item.product_name} (Qty: ${item.quantity}) - ₹${(parseFloat(item.price) * item.quantity).toFixed(2)}`
      ).join('\n')

      const totalDetails = `
*Order Summary:*
Subtotal: ₹${subtotal.toFixed(2)}
Shipping: ₹${shippingAmount.toFixed(2)}
*Total: ₹${total.toFixed(2)}*
      `.trim()

      const whatsappMessage = `
�️ *New Order from AYN Beauty*

*Order Number:* ${orderNumber}

${customerDetails}

*Order Details:*
${orderDetails}

${totalDetails}

*Payment Method:* WhatsApp Checkout

Please confirm this order and provide payment instructions.

Thank you for choosing AYN Beauty! 💄✨
      `.trim()

      // Send to WhatsApp
      const whatsappUrl = `https://wa.me/917019449136?text=${encodeURIComponent(whatsappMessage)}`
      window.open(whatsappUrl, '_blank')

      // Show success message and redirect
      alert(`Order ${orderNumber} created successfully! You will be redirected to WhatsApp to complete the checkout process.`)
      
      // Refresh cart to show it's empty (since the order creation clears the cart)
      fetchCart()

    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to create order. Please try again.')
    } finally {
      setCheckoutLoading(false)
    }
  }

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
              onClick={handleWhatsAppCheckout}
              disabled={updating || cartItems.length === 0 || loading || checkoutLoading}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2 transition-colors duration-200"
              title={cartItems.length === 0 ? "Your cart is empty" : "Send order via WhatsApp"}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
              {checkoutLoading ? 'Creating Order...' : loading ? 'Loading...' : cartItems.length === 0 ? 'Cart is Empty' : 'Order via WhatsApp'}
            </button>

            {/* Alternative checkout info */}
            <div className="mt-2 text-xs text-gray-500 text-center">
              💬 Your order will be sent to WhatsApp for confirmation
            </div>

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
      
      {/* Delivery Details Modal */}
      <DeliveryDetailsModal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        onConfirm={processWhatsAppCheckout}
        userEmail={user?.email || ''}
        userName={user ? `${user.first_name} ${user.last_name}` : ''}
        userPhone={user?.phone}
      />
    </div>
  )
}
