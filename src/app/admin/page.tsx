'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'
export const revalidate = 0

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import {
  UserGroupIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  TrophyIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

interface RecentOrder {
  id: number
  total_amount: number
  status: string
  created_at: string
  first_name: string
  last_name: string
  email: string
}

interface LowStockProduct {
  id: number
  name: string
  stock_quantity: number
  price: number
}

interface TopSellingProduct {
  id: number
  name: string
  price: number
  stock_quantity: number
  total_sold: number
}

interface DashboardData {
  stats: DashboardStats
  recentOrders: RecentOrder[]
  lowStockProducts: LowStockProduct[]
  topSellingProducts: TopSellingProduct[]
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    
    // Set up auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      if (autoRefreshEnabled) {
        fetchDashboardData()
      }
    }, 30000) // 30 seconds
    
    return () => clearInterval(refreshInterval)
  }, [autoRefreshEnabled])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }

      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token')
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data')
      }

      const data = await response.json()
      setDashboardData(data.data)
      setLastUpdated(new Date())
      setError('')
    } catch (error) {
      console.error('Dashboard fetch error:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
            >
              Retry
            </button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="py-4 sm:py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <div className="mb-4">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Welcome to your admin dashboard</p>
              {lastUpdated && (
                <p className="text-xs text-gray-500 mt-1 sm:mt-2">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={fetchDashboardData}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
                title="Refresh dashboard data"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <button
                onClick={() => setAutoRefreshEnabled(!autoRefreshEnabled)}
                className={`px-4 py-2 rounded transition-colors flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto ${
                  autoRefreshEnabled
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-400 text-white hover:bg-gray-500'
                }`}
                title={autoRefreshEnabled ? 'Auto-refresh enabled (30s)' : 'Auto-refresh disabled'}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  {autoRefreshEnabled ? (
                    <path d="M15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  ) : (
                    <path d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-13.5-4l9 9m0 0l-9-9" />
                  )}
                </svg>
                <span className="hidden sm:inline">{autoRefreshEnabled ? 'Auto-Refresh On' : 'Auto-Refresh Off'}</span>
                <span className="sm:hidden">{autoRefreshEnabled ? 'Auto On' : 'Auto Off'}</span>
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <UserGroupIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Users</dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        {dashboardData?.stats.totalUsers || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingBagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Products</dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        {dashboardData?.stats.totalProducts || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ChartBarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        {dashboardData?.stats.totalOrders || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-4 sm:p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                  </div>
                  <div className="ml-3 sm:ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="text-base sm:text-lg font-medium text-gray-900">
                        ₹{dashboardData?.stats.totalRevenue?.toLocaleString() || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Recent Orders */}
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Recent Orders</h3>
                  <ClockIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
                <div className="flow-root">
                  <ul className="-my-3 sm:-my-5 divide-y divide-gray-200">
                    {dashboardData?.recentOrders?.slice(0, 5).map((order) => (
                      <li key={order.id} className="py-3 sm:py-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {order.first_name} {order.last_name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                              Order #{order.id} • ₹{order.total_amount}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              order.status === 'completed' ? 'bg-green-100 text-green-800' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Low Stock Products */}
            <div className="bg-white shadow rounded-lg">
              <div className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Low Stock Alert</h3>
                  <ExclamationTriangleIcon className="h-4 w-4 sm:h-5 sm:w-5 text-red-400" />
                </div>
                <div className="flow-root">
                  <ul className="-my-3 sm:-my-5 divide-y divide-gray-200">
                    {dashboardData?.lowStockProducts?.slice(0, 5).map((product) => (
                      <li key={product.id} className="py-3 sm:py-4">
                        <div className="flex items-center space-x-3 sm:space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500">
                              ₹{product.price} • Stock: {product.stock_quantity}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Low Stock
                            </span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Top Selling Products */}
          <div className="mt-6 sm:mt-8 bg-white shadow rounded-lg">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <h3 className="text-base sm:text-lg leading-6 font-medium text-gray-900">Top Selling Products</h3>
                <TrophyIcon className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400" />
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Stock
                        </th>
                        <th className="px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sold
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {dashboardData?.topSellingProducts?.map((product) => (
                        <tr key={product.id}>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium text-gray-900">
                            <div className="max-w-[120px] sm:max-w-none truncate">{product.name}</div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            ₹{product.price}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {product.stock_quantity}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-500">
                            {product.total_sold}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}