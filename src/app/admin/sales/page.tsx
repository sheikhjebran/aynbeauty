'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/AdminLayout'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ArrowTrendingUpIcon,
  CalendarIcon,
  TagIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

interface SalesSummary {
  total_orders: number
  total_revenue: number
  total_items_sold: number
  average_order_value: number
}

interface ProductSales {
  id: number
  name: string
  sku: string
  price: number
  stock_quantity: number
  units_sold: number
  revenue: number
  number_of_orders: number
}

interface DailySales {
  sale_date: string
  orders_count: number
  items_sold: number
  daily_revenue: number
}

interface RevenuePerProduct {
  id: number
  name: string
  price: number
  units_sold: number
  total_revenue: number
  average_selling_price: number
}

interface DailyRevenue {
  date: string
  revenue: number
  subtotal: number
  tax: number
  shipping: number
}

interface TopCustomer {
  id: number
  first_name: string
  last_name: string
  email: string
  total_orders: number
  total_spent: number
}

interface CategorySales {
  id: number
  category_name: string
  orders_count: number
  units_sold: number
  revenue: number
}

interface SalesData {
  summary: SalesSummary
  salesPerProduct: ProductSales[]
  salesPerDay: DailySales[]
  revenuePerProduct: RevenuePerProduct[]
  revenuePerDay: DailyRevenue[]
  topCustomers: TopCustomer[]
  salesByCategory: CategorySales[]
}

export default function SalesAnalytics() {
  const [salesData, setSalesData] = useState<SalesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateFilter, setDateFilter] = useState('30')
  const [activeTab, setActiveTab] = useState<'products' | 'daily' | 'customers' | 'categories'>('products')

  useEffect(() => {
    fetchSalesData()
  }, [dateFilter])

  const fetchSalesData = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Please login')
        return
      }

      const response = await fetch(`/api/admin/sales?dateFilter=${dateFilter}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch sales data')
      }

      const data = await response.json()
      setSalesData(data.data)
      setError('')
    } catch (error) {
      console.error('Sales fetch error:', error)
      setError('Failed to load sales data')
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
              onClick={fetchSalesData}
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
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sales Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive sales and revenue tracking</p>
          </div>

          {/* Date Filter */}
          <div className="mb-6 flex items-center gap-4 flex-wrap">
            <label className="text-sm font-medium text-gray-700">Time Period:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-pink-500 focus:border-pink-500"
            >
              <option value="today">Today</option>
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="90">Last 90 Days</option>
              <option value="year">This Year</option>
              <option value="all">All Time</option>
            </select>
            <button
              onClick={fetchSalesData}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Refresh
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ShoppingCartIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {salesData?.summary.total_orders || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CurrencyDollarIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ₹{salesData?.summary.total_revenue?.toLocaleString() || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <TagIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Items Sold</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {salesData?.summary.total_items_sold || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ArrowTrendingUpIcon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Avg Order Value</dt>
                      <dd className="text-lg font-medium text-gray-900">
                        ₹{salesData?.summary.average_order_value?.toFixed(2) || 0}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('products')}
                className={`${
                  activeTab === 'products'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Products
              </button>
              <button
                onClick={() => setActiveTab('daily')}
                className={`${
                  activeTab === 'daily'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Daily Sales
              </button>
              <button
                onClick={() => setActiveTab('customers')}
                className={`${
                  activeTab === 'customers'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Top Customers
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`${
                  activeTab === 'categories'
                    ? 'border-pink-500 text-pink-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Categories
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'products' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Sales by Product</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesData?.salesPerProduct?.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{product.price}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock_quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-pink-600">{product.units_sold}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">₹{product.revenue?.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.number_of_orders}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'daily' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Daily Sales & Revenue</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesData?.salesPerDay?.map((day, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {new Date(day.sale_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.orders_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{day.items_sold}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ₹{day.daily_revenue?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Top Customers</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesData?.topCustomers?.map((customer) => (
                      <tr key={customer.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {customer.first_name} {customer.last_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.total_orders}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ₹{customer.total_spent?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'categories' && (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Sales by Category</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Units Sold</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salesData?.salesByCategory?.map((category) => (
                      <tr key={category.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.category_name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.orders_count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{category.units_sold}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                          ₹{category.revenue?.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
