'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CreditCardIcon, BanknotesIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface CartItem {
  id: number
  product_id: number
  product_name: string
  product_image: string
  price: number
  quantity: number
  variant_id?: number
  variant_name?: string
}

interface Address {
  first_name: string
  last_name: string
  email: string
  phone: string
  address_line_1: string
  address_line_2: string
  city: string
  state: string
  postal_code: string
  country: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState('card')
  
  const [shippingAddress, setShippingAddress] = useState<Address>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  })

  const [billingAddress, setBillingAddress] = useState<Address>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'India'
  })

  const [sameAsShipping, setSameAsShipping] = useState(true)

  useEffect(() => {
    fetchCartItems()
    loadUserData()
  }, [])

  useEffect(() => {
    if (sameAsShipping) {
      setBillingAddress(shippingAddress)
    }
  }, [shippingAddress, sameAsShipping])

  const loadUserData = () => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const user = JSON.parse(userData)
      setShippingAddress(prev => ({
        ...prev,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || ''
      }))
    }
  }

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login?redirect=/checkout')
        return
      }

      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch cart items')
      }

      const data = await response.json()
      if (!data.items || data.items.length === 0) {
        router.push('/cart')
        return
      }
      
      setCartItems(data.items)
    } catch (error) {
      console.error('Error fetching cart:', error)
      router.push('/cart')
    } finally {
      setLoading(false)
    }
  }

  const validateAddress = (address: Address): boolean => {
    return !!(
      address.first_name &&
      address.last_name &&
      address.email &&
      address.phone &&
      address.address_line_1 &&
      address.city &&
      address.state &&
      address.postal_code
    )
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateAddress(shippingAddress)) {
        alert('Please fill in all required shipping address fields')
        return
      }
      if (!sameAsShipping && !validateAddress(billingAddress)) {
        alert('Please fill in all required billing address fields')
        return
      }
    }
    setCurrentStep(currentStep + 1)
  }

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const shippingFee = subtotal >= 299 ? 0 : 49
    const tax = 0 // Add tax calculation if needed
    const total = subtotal + shippingFee + tax

    return { subtotal, shippingFee, tax, total }
  }

  const handlePlaceOrder = async () => {
    setProcessing(true)
    
    try {
      const token = localStorage.getItem('token')
      const orderData = {
        shipping_address: shippingAddress,
        billing_address: sameAsShipping ? shippingAddress : billingAddress,
        payment_method: paymentMethod,
        payment_reference: paymentMethod === 'card' ? `card_${Date.now()}` : null,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity
        }))
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to place order')
      }

      const result = await response.json()
      
      // Redirect to order confirmation
      router.push(`/order-confirmation?order=${result.order.order_number}`)
      
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setProcessing(false)
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-gray-200 h-96 rounded"></div>
            <div className="bg-gray-200 h-64 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  const { subtotal, shippingFee, tax, total } = calculateTotals()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= step 
                  ? 'bg-pink-600 border-pink-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
              }`}>
                {currentStep > step ? (
                  <CheckCircleIcon className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step}</span>
                )}
              </div>
              {step < 3 && (
                <div className={`w-16 h-0.5 ${
                  currentStep > step ? 'bg-pink-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <div className="grid grid-cols-3 gap-16 text-sm text-gray-600">
            <span className={currentStep >= 1 ? 'text-pink-600 font-medium' : ''}>
              Shipping
            </span>
            <span className={currentStep >= 2 ? 'text-pink-600 font-medium' : ''}>
              Payment
            </span>
            <span className={currentStep >= 3 ? 'text-pink-600 font-medium' : ''}>
              Review
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step 1: Shipping Information */}
          {currentStep === 1 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.first_name}
                    onChange={(e) => setShippingAddress({...shippingAddress, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.last_name}
                    onChange={(e) => setShippingAddress({...shippingAddress, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={shippingAddress.email}
                    onChange={(e) => setShippingAddress({...shippingAddress, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    value={shippingAddress.phone}
                    onChange={(e) => setShippingAddress({...shippingAddress, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={shippingAddress.address_line_1}
                  onChange={(e) => setShippingAddress({...shippingAddress, address_line_1: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={shippingAddress.address_line_2}
                  onChange={(e) => setShippingAddress({...shippingAddress, address_line_2: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.city}
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.state}
                    onChange={(e) => setShippingAddress({...shippingAddress, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    value={shippingAddress.postal_code}
                    onChange={(e) => setShippingAddress({...shippingAddress, postal_code: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                    required
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="sameAsShipping"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <label htmlFor="sameAsShipping" className="ml-2 text-sm text-gray-700">
                    Billing address is same as shipping address
                  </label>
                </div>

                {!sameAsShipping && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Billing Address</h3>
                    {/* Repeat billing address fields similar to shipping */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name *"
                        value={billingAddress.first_name}
                        onChange={(e) => setBillingAddress({...billingAddress, first_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                      <input
                        type="text"
                        placeholder="Last Name *"
                        value={billingAddress.last_name}
                        onChange={(e) => setBillingAddress({...billingAddress, last_name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      />
                    </div>
                    {/* Add other billing address fields as needed */}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Payment Method */}
          {currentStep === 2 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="card"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                  <label htmlFor="card" className="ml-3 flex items-center gap-2">
                    <CreditCardIcon className="h-5 w-5 text-gray-600" />
                    <span>Credit/Debit Card</span>
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-pink-600 focus:ring-pink-500"
                  />
                  <label htmlFor="cod" className="ml-3 flex items-center gap-2">
                    <BanknotesIcon className="h-5 w-5 text-gray-600" />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Card payment integration would be implemented here using Stripe, Razorpay, or similar payment gateway.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Order Review */}
          {currentStep === 3 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Review Your Order</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 border border-gray-100 rounded-lg">
                    <div className="relative w-16 h-16 flex-shrink-0">
                      <Image
                        src={item.product_image || `https://picsum.photos/300/300?random=${item.product_id}`}
                        alt={item.product_name}
                        fill
                        className="object-cover rounded-md"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                      {item.variant_name && (
                        <p className="text-sm text-gray-600">Variant: {item.variant_name}</p>
                      )}
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-medium text-gray-900 mb-2">Shipping Address</h3>
                <p className="text-sm text-gray-600">
                  {shippingAddress.first_name} {shippingAddress.last_name}<br />
                  {shippingAddress.address_line_1}<br />
                  {shippingAddress.address_line_2 && `${shippingAddress.address_line_2}\n`}
                  {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postal_code}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {currentStep < 3 ? (
              <button
                onClick={handleNextStep}
                className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700"
              >
                Continue
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={processing}
                className="px-6 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 disabled:opacity-50"
              >
                {processing ? 'Processing...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            
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
          </div>
        </div>
      </div>
    </div>
  )
}