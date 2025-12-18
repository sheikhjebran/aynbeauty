'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon, PrinterIcon, ShoppingBagIcon } from '@heroicons/react/24/outline'

interface Order {
  id: number
  order_number: string
  status: string
  payment_status: string
  payment_method: string
  total_amount: number
  shipping_amount: number
  subtotal: number
  created_at: string
  shipping_address: any
  items: Array<{
    product_name: string
    variant_name?: string
    quantity: number
    unit_price: number
    total_price: number
  }>
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const orderNumber = searchParams.get('order')
  
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!orderNumber) {
      router.push('/')
      return
    }
    
    fetchOrder()
  }, [orderNumber, router])

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      // For now, we'll create a mock order since we don't have order details API
      // In a real app, you'd fetch from /api/orders/[orderNumber]
      const mockOrder: Order = {
        id: 1,
        order_number: orderNumber!,
        status: 'pending',
        payment_status: 'paid',
        payment_method: 'card',
        total_amount: 1500,
        shipping_amount: 0,
        subtotal: 1500,
        created_at: new Date().toISOString(),
        shipping_address: {
          first_name: 'John',
          last_name: 'Doe',
          address_line_1: '123 Main St',
          city: 'Mumbai',
          state: 'Maharashtra',
          postal_code: '400001'
        },
        items: [
          {
            product_name: 'Sample Product',
            quantity: 1,
            unit_price: 1500,
            total_price: 1500
          }
        ]
      }
      
      setOrder(mockOrder)
    } catch (err) {
      setError('Failed to load order details')
    } finally {
      setLoading(false)
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
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/2 mx-auto"></div>
          <div className="max-w-2xl mx-auto bg-gray-200 h-96 rounded"></div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
        <p className="text-gray-600 mb-6">{error || 'The order you are looking for could not be found.'}</p>
        <Link
          href="/"
          className="bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700"
        >
          Return Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">
            Thank you for your order. We've received your order and will begin processing it soon.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Order #{order.order_number}</h2>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <button className="flex items-center gap-2 text-pink-600 hover:text-pink-700">
                <PrinterIcon className="h-5 w-5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {/* Order Status */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                  order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                  order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Payment:</span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  order.payment_status === 'paid' ? 'bg-green-100 text-green-800' :
                  order.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-start p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{item.product_name}</h4>
                      {item.variant_name && (
                        <p className="text-sm text-gray-600">Variant: {item.variant_name}</p>
                      )}
                      <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatPrice(item.total_price)}</p>
                      <p className="text-sm text-gray-600">{formatPrice(item.unit_price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{order.shipping_amount === 0 ? 'FREE' : formatPrice(order.shipping_amount)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 border-t border-gray-200 pt-2">
                  <span>Total</span>
                  <span>{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <div className="text-gray-600">
                <p>{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                <p>{order.shipping_address.address_line_1}</p>
                {order.shipping_address.address_line_2 && <p>{order.shipping_address.address_line_2}</p>}
                <p>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">What happens next?</h3>
          <ul className="text-blue-800 space-y-1 text-sm">
            <li>• You'll receive an email confirmation shortly</li>
            <li>• We'll send you tracking information once your order ships</li>
            <li>• Estimated delivery: 3-5 business days</li>
            <li>• Need help? Contact our customer support</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/account"
            className="flex items-center justify-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
          >
            <ShoppingBagIcon className="h-5 w-5" />
            View All Orders
          </Link>
          
          <Link
            href="/products"
            className="flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you have any questions about your order, please don't hesitate to contact us.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a href="mailto:support@aynbeauty.com" className="text-pink-600 hover:text-pink-700">
              Email: support@aynbeauty.com
            </a>
            <a href="tel:+911234567890" className="text-pink-600 hover:text-pink-700">
              Phone: +91 12345 67890
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading order details...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}