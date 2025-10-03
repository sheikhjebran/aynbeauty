'use client''use client''use client'



import { useState } from 'react'

import Link from 'next/link'

import Image from 'next/image'import { useState } from 'react'import { useState } from 'react'

import { useCart } from '@/contexts/CartContext'

import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'import Link from 'next/link'import Link from 'next/link'



export default function CartPage() {import Image from 'next/image'import Image from 'next/image'

  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart()

  const [loading, setLoading] = useState(false)import { useCart } from '@/contexts/CartContext'import { useCart } from '@/contexts/CartContext'



  const handleQuantityChange = (itemId: number, newQuantity: number) => {import { useAuth } from '@/contexts/AuthContext'import { useAuth } from '@/contexts/AuthContext'

    if (newQuantity < 1) {

      removeFromCart(itemId)import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'import { TrashIcon, MinusIcon, PlusIcon } from '@heroicons/react/24/outline'

    } else {

      updateQuantity(itemId, newQuantity)import { withAuth } from '@/contexts/AuthContext'import { withAuth } from '@/contexts/AuthContext'

    }

  }



  const handleCheckout = async () => {function CartPage() {function CartPage() {

    setLoading(true)

    setTimeout(() => {  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart()  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart()

      alert('Checkout functionality will be implemented next!')

      setLoading(false)  const { user } = useAuth()  const { user } = useAuth()

    }, 1000)

  }  const [loading, setLoading] = useState(false)  const [loading, setLoading] = useState(false)



  if (items.length === 0) {

    return (

      <div className="min-h-screen bg-gray-50 py-12">  const handleQuantityChange = (itemId: number, newQuantity: number) => {  const handleQuantityChange = (itemId: number, newQuantity: number) => {

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="bg-white rounded-lg shadow-sm p-8 text-center">    if (newQuantity < 1) {    if (newQuantity < 1) {

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>

            <p className="text-gray-600 mb-8">Add some products to get started!</p>      removeFromCart(itemId)      removeFromCart(itemId)

            <Link

              href="/"    } else {    } else {

              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors"

            >      updateQuantity(itemId, newQuantity)      updateQuantity(itemId, newQuantity)

              Continue Shopping

            </Link>    }    }

          </div>

        </div>  }  }

      </div>

    )

  }

  const handleCheckout = async () => {  const handleCheckout = async () => {

  return (

    <div className="min-h-screen bg-gray-50 py-12">    setLoading(true)    setLoading(true)

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="flex flex-col lg:flex-row gap-8">    // TODO: Implement checkout logic    // TODO: Implement checkout logic

          <div className="lg:w-2/3">

            <div className="bg-white rounded-lg shadow-sm">    setTimeout(() => {    setTimeout(() => {

              <div className="p-6 border-b border-gray-200">

                <div className="flex items-center justify-between">      alert('Checkout functionality will be implemented next!')      alert('Checkout functionality will be implemented next!')

                  <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>

                  <button      setLoading(false)      setLoading(false)

                    onClick={clearCart}

                    className="text-sm text-gray-600 hover:text-red-600 transition-colors"    }, 1000)    }, 1000)

                  >

                    Clear Cart  }  }

                  </button>

                </div>

              </div>

  if (items.length === 0) {  const fetchCartItems = async () => {

              <div className="divide-y divide-gray-200">

                {items.map((item) => (    return (    try {

                  <div key={item.id} className="p-6">

                    <div className="flex items-start space-x-4">      <div className="min-h-screen bg-gray-50 py-12">      const token = localStorage.getItem('token')

                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">

                        <Image        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">      if (!token) {

                          src={item.image || '/images/placeholder-product.jpg'}

                          alt={item.name}          <div className="bg-white rounded-lg shadow-sm p-8 text-center">        router.push('/auth/login?redirect=/cart')

                          width={96}

                          height={96}            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">        return

                          className="w-full h-full object-cover"

                        />              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">      }

                      </div>

                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 9H6L5 9z" />

                      <div className="flex-1 min-w-0">

                        <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>              </svg>      const response = await fetch('/api/cart', {

                        

                        <div className="flex items-center space-x-2 mb-4">            </div>        headers: {

                          {item.discounted_price ? (

                            <>            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>          'Authorization': `Bearer ${token}`

                              <span className="text-lg font-bold text-gray-900">

                                ₹{item.discounted_price.toFixed(2)}            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>        }

                              </span>

                              <span className="text-sm text-gray-500 line-through">            <Link      })

                                ₹{item.price.toFixed(2)}

                              </span>              href="/"

                            </>

                          ) : (              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 transition-colors"      if (!response.ok) {

                            <span className="text-lg font-bold text-gray-900">

                              ₹{item.price.toFixed(2)}            >        if (response.status === 401) {

                            </span>

                          )}              Continue Shopping          localStorage.removeItem('token')

                        </div>

            </Link>          localStorage.removeItem('user')

                        <div className="flex items-center justify-between">

                          <div className="flex items-center space-x-3">          </div>          router.push('/auth/login?redirect=/cart')

                            <button

                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}        </div>          return

                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"

                            >      </div>        }

                              <MinusIcon className="h-4 w-4 text-gray-600" />

                            </button>    )        throw new Error('Failed to fetch cart items')

                            <span className="font-medium text-gray-900 min-w-[2rem] text-center">

                              {item.quantity}  }      }

                            </span>

                            <button

                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}

                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"  return (      const data = await response.json()

                            >

                              <PlusIcon className="h-4 w-4 text-gray-600" />    <div className="min-h-screen bg-gray-50 py-12">      setCartItems(data.items || [])

                            </button>

                          </div>      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">    } catch (err) {



                          <button        <div className="flex flex-col lg:flex-row gap-8">      setError(err instanceof Error ? err.message : 'An error occurred')

                            onClick={() => removeFromCart(item.id)}

                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"          {/* Cart Items */}    } finally {

                          >

                            <TrashIcon className="h-5 w-5" />          <div className="lg:w-2/3">      setLoading(false)

                          </button>

                        </div>            <div className="bg-white rounded-lg shadow-sm">    }

                      </div>

              <div className="p-6 border-b border-gray-200">  }

                      <div className="text-right">

                        <p className="text-lg font-bold text-gray-900">                <div className="flex items-center justify-between">

                          ₹{((item.discounted_price || item.price) * item.quantity).toFixed(2)}

                        </p>                  <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>  const updateQuantity = async (itemId: number, newQuantity: number) => {

                      </div>

                    </div>                  <button    if (newQuantity < 1) return

                  </div>

                ))}                    onClick={clearCart}

              </div>

            </div>                    className="text-sm text-gray-600 hover:text-red-600 transition-colors"    setUpdating(itemId)

          </div>

                  >    try {

          <div className="lg:w-1/3">

            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">                    Clear Cart      const token = localStorage.getItem('token')

              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                                </button>      const response = await fetch('/api/cart', {

              <div className="space-y-4 mb-6">

                <div className="flex justify-between">                </div>        method: 'POST',

                  <span className="text-gray-600">Subtotal</span>

                  <span className="font-medium">₹{totalPrice.toFixed(2)}</span>                <p className="text-gray-600 mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>        headers: {

                </div>

                <div className="flex justify-between">              </div>          'Content-Type': 'application/json',

                  <span className="text-gray-600">Shipping</span>

                  <span className="font-medium text-green-600">Free</span>          'Authorization': `Bearer ${token}`

                </div>

                <div className="flex justify-between">              <div className="divide-y divide-gray-200">        },

                  <span className="text-gray-600">Tax</span>

                  <span className="font-medium">₹{(totalPrice * 0.18).toFixed(2)}</span>                {items.map((item) => (        body: JSON.stringify({

                </div>

                <hr />                  <div key={item.id} className="p-6">          action: 'update',

                <div className="flex justify-between text-lg font-bold">

                  <span>Total</span>                    <div className="flex items-start space-x-4">          item_id: itemId,

                  <span>₹{(totalPrice * 1.18).toFixed(2)}</span>

                </div>                      {/* Product Image */}          quantity: newQuantity

              </div>

                      <div className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">        })

              <button

                onClick={handleCheckout}                        <Image      })

                disabled={loading}

                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"                          src={item.image || '/images/placeholder-product.jpg'}

              >

                {loading ? 'Processing...' : 'Proceed to Checkout'}                          alt={item.name}      if (!response.ok) {

              </button>

                          width={96}        throw new Error('Failed to update quantity')

              <div className="mt-4 text-center">

                <Link                          height={96}      }

                  href="/"

                  className="text-pink-600 hover:text-pink-700 font-medium transition-colors"                          className="w-full h-full object-cover"

                >

                  Continue Shopping                        />      // Update local state

                </Link>

              </div>                      </div>      setCartItems(items =>

            </div>

          </div>        items.map(item =>

        </div>

      </div>                      {/* Product Details */}          item.id === itemId ? { ...item, quantity: newQuantity } : item

    </div>

  )                      <div className="flex-1 min-w-0">        )

}
                        <h3 className="text-lg font-medium text-gray-900 mb-1">{item.name}</h3>      )

                        {item.variant && (    } catch (err) {

                          <p className="text-sm text-gray-600 mb-2">Variant: {item.variant}</p>      console.error('Error updating quantity:', err)

                        )}    } finally {

                              setUpdating(null)

                        {/* Price */}    }

                        <div className="flex items-center space-x-2 mb-4">  }

                          {item.discounted_price ? (

                            <>  const removeItem = async (itemId: number) => {

                              <span className="text-lg font-bold text-gray-900">    setUpdating(itemId)

                                ₹{item.discounted_price.toFixed(2)}    try {

                              </span>      const token = localStorage.getItem('token')

                              <span className="text-sm text-gray-500 line-through">      const response = await fetch('/api/cart', {

                                ₹{item.price.toFixed(2)}        method: 'POST',

                              </span>        headers: {

                            </>          'Content-Type': 'application/json',

                          ) : (          'Authorization': `Bearer ${token}`

                            <span className="text-lg font-bold text-gray-900">        },

                              ₹{item.price.toFixed(2)}        body: JSON.stringify({

                            </span>          action: 'remove',

                          )}          item_id: itemId

                        </div>        })

      })

                        {/* Quantity Controls */}

                        <div className="flex items-center justify-between">      if (!response.ok) {

                          <div className="flex items-center space-x-3">        throw new Error('Failed to remove item')

                            <button      }

                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}

                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"      // Update local state

                            >      setCartItems(items => items.filter(item => item.id !== itemId))

                              <MinusIcon className="h-4 w-4 text-gray-600" />    } catch (err) {

                            </button>      console.error('Error removing item:', err)

                            <span className="font-medium text-gray-900 min-w-[2rem] text-center">    } finally {

                              {item.quantity}      setUpdating(null)

                            </span>    }

                            <button  }

                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}

                              className="p-1 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"  const formatPrice = (price: number) => {

                            >    return new Intl.NumberFormat('en-IN', {

                              <PlusIcon className="h-4 w-4 text-gray-600" />      style: 'currency',

                            </button>      currency: 'INR',

                          </div>      minimumFractionDigits: 0

    }).format(price)

                          {/* Remove Button */}  }

                          <button

                            onClick={() => removeFromCart(item.id)}  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)

                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"  const shippingFee = subtotal >= 299 ? 0 : 49

                          >  const total = subtotal + shippingFee

                            <TrashIcon className="h-5 w-5" />

                          </button>  if (loading) {

                        </div>    return (

                      </div>      <div className="container mx-auto px-4 py-8">

        <div className="animate-pulse">

                      {/* Item Total */}          <div className="h-8 bg-gray-200 rounded mb-6 w-1/4"></div>

                      <div className="text-right">          <div className="space-y-4">

                        <p className="text-lg font-bold text-gray-900">            {[...Array(3)].map((_, i) => (

                          ₹{((item.discounted_price || item.price) * item.quantity).toFixed(2)}              <div key={i} className="flex gap-4 p-4 bg-gray-100 rounded"></div>

                        </p>            ))}

                      </div>          </div>

                    </div>        </div>

                  </div>      </div>

                ))}    )

              </div>  }

            </div>

          </div>  if (error) {

    return (

          {/* Order Summary */}      <div className="container mx-auto px-4 py-8 text-center">

          <div className="lg:w-1/3">        <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>

            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">        <p className="text-gray-600 mb-4">{error}</p>

              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>        <button

                        onClick={fetchCartItems}

              <div className="space-y-4 mb-6">          className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"

                <div className="flex justify-between">        >

                  <span className="text-gray-600">Subtotal</span>          Try Again

                  <span className="font-medium">₹{totalPrice.toFixed(2)}</span>        </button>

                </div>      </div>

                <div className="flex justify-between">    )

                  <span className="text-gray-600">Shipping</span>  }

                  <span className="font-medium text-green-600">Free</span>

                </div>  return (

                <div className="flex justify-between">    <div className="container mx-auto px-4 py-8">

                  <span className="text-gray-600">Tax</span>      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                  <span className="font-medium">₹{(totalPrice * 0.18).toFixed(2)}</span>

                </div>      {cartItems.length === 0 ? (

                <hr />        <div className="text-center py-16">

                <div className="flex justify-between text-lg font-bold">          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>

                  <span>Total</span>          <p className="text-gray-600 mb-8">Start shopping to add items to your cart.</p>

                  <span>₹{(totalPrice * 1.18).toFixed(2)}</span>          <Link

                </div>            href="/products"

              </div>            className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 inline-block"

          >

              <button            Continue Shopping

                onClick={handleCheckout}          </Link>

                disabled={loading}        </div>

                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"      ) : (

              >        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {loading ? (          {/* Cart Items */}

                  <div className="flex items-center justify-center">          <div className="lg:col-span-2">

                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">

                    Processing...              <div className="p-6">

                  </div>                <h2 className="text-xl font-semibold text-gray-900 mb-4">

                ) : (                  Cart Items ({cartItems.length})

                  'Proceed to Checkout'                </h2>

                )}                <div className="space-y-4">

              </button>                  {cartItems.map((item) => (

                    <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg">

              <div className="mt-4 text-center">                      <div className="relative w-20 h-20 flex-shrink-0">

                <Link                        <Image

                  href="/"                          src={item.product_image || `https://picsum.photos/300/300?random=${item.product_id}`}

                  className="text-pink-600 hover:text-pink-700 font-medium transition-colors"                          alt={item.product_name}

                >                          fill

                  Continue Shopping                          className="object-cover rounded-md"

                </Link>                        />

              </div>                      </div>

            </div>                      

          </div>                      <div className="flex-1">

        </div>                        <Link

      </div>                          href={`/product/${item.product_id}`}

    </div>                          className="font-medium text-gray-900 hover:text-pink-600"

  )                        >

}                          {item.product_name}

                        </Link>

export default withAuth(CartPage)                        {item.variant_name && (
                          <p className="text-sm text-gray-600 mt-1">
                            Variant: {item.variant_name}
                          </p>
                        )}
                        <p className="text-lg font-semibold text-gray-900 mt-2">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-gray-300 rounded-md">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updating === item.id || item.quantity <= 1}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <MinusIcon className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updating === item.id || item.quantity >= item.stock_quantity}
                            className="p-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PlusIcon className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          disabled={updating === item.id}
                          className="text-red-600 hover:text-red-700 disabled:opacity-50"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>

                        {/* Stock Warning */}
                        {item.quantity > item.stock_quantity && (
                          <p className="text-sm text-red-600">
                            Only {item.stock_quantity} left in stock
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}</span>
                </div>
                {shippingFee > 0 && (
                  <p className="text-sm text-gray-500">
                    Add {formatPrice(299 - subtotal)} more for free shipping
                  </p>
                )}
                <hr className="border-gray-200" />
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-pink-600 text-white py-3 px-4 rounded-md hover:bg-pink-700 font-medium transition-colors"
              >
                Proceed to Checkout
              </button>

              <Link
                href="/products"
                className="block text-center text-pink-600 hover:text-pink-700 mt-4"
              >
                Continue Shopping
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Easy returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>Customer support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}