'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function OrdersPage() {
  const router = useRouter()

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

          {/* Orders Content */}
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
        </div>
      </div>
    </div>
  )
}