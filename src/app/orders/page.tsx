'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface OrderItem {
  id: number
  product_name: string
  variant_name?: string
  quantity: number
  unit_price: number | string
  total_price: number | string
}

interface Order {
  id: number
  order_number: string
  status: string
  payment_status: string
  payment_method: string
  total_amount: number | string
  created_at: string
  shipping_address: any
  items: OrderItem[]
}

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please log in to view your orders')
        setLoading(false)
        return
      }

      const response = await fetch('/api/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.status === 401) {
        setError('Session expired. Please log in again.')
        localStorage.removeItem('token')
        setLoading(false)
        return
      }

      if (response.ok) {
        const data = await response.json()
        console.log('Orders response:', data) // Debug log
        setOrders(data.orders || [])
      } else {
        const errorData = await response.json()
        setError(errorData.message || 'Failed to fetch orders')
        console.error('Orders API error:', errorData) // Debug log
      }
    } catch (error) {
      setError('Error loading orders')
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              <Link 
                href="/account"
                className="text-pink-600 hover:text-pink-700 font-medium"
              >
                ← Back to Account
              </Link>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-600">{error}</p>
              {error.includes('log in') && (
                <Link
                  href="/login"
                  className="inline-block mt-3 bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700 transition-colors"
                >
                  Go to Login
                </Link>
              )}
            </div>
          )}

          {/* Orders Content */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
                <p className="text-gray-600 mb-8">
                  You haven't placed any orders yet. Start shopping to see your orders here.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-pink-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-pink-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 pb-4 border-b">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Order #{order.order_number}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{parseFloat(order.total_amount.toString()).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.payment_method.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Items Ordered:</h4>
                    {order.items && order.items.length > 0 && order.items[0].product_name ? (
                      order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.product_name}</p>
                            {item.variant_name && (
                              <p className="text-sm text-gray-600">Variant: {item.variant_name}</p>
                            )}
                            <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">₹{parseFloat(item.total_price?.toString() || '0').toFixed(2)}</p>
                            <p className="text-sm text-gray-600">₹{parseFloat(item.unit_price?.toString() || '0').toFixed(2)} each</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600">Order items not available (order created before system update)</p>
                    )}
                  </div>

                  {/* Shipping Address */}
                  {order.shipping_address && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address:</h4>
                      <div className="text-sm text-gray-600">
                        {(() => {
                          const addr = typeof order.shipping_address === 'string' 
                            ? JSON.parse(order.shipping_address)
                            : order.shipping_address;
                          return (
                            <div>
                              <p className="font-medium">{addr.name}</p>
                              <p>{addr.address}</p>
                              <p>{addr.city}, {addr.state} {addr.pincode}</p>
                              <p>Phone: {addr.phone}</p>
                            </div>
                          )
                        })()}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}