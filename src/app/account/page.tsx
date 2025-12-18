'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  UserIcon, 
  ShoppingBagIcon, 
  HeartIcon, 
  MapPinIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'

interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  phone?: string
  date_of_birth?: string
  gender?: string
  created_at: string
}

interface DashboardStats {
  totalOrders: number
  totalSpent: number
  wishlistCount: number
  recentOrders: any[]
  savedAddresses: number
}

export default function AccountDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login?redirect=/account')
      return
    }

    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    fetchDashboardData()
  }, [router])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      
      // Fetch user stats (orders, wishlist, etc.)
      const [ordersRes, wishlistRes] = await Promise.all([
        fetch('/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/wishlist', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const ordersData = ordersRes.ok ? await ordersRes.json() : { orders: [], total: 0 }
      const wishlistData = wishlistRes.ok ? await wishlistRes.json() : { items: [] }

      const totalSpent = ordersData.orders?.reduce((sum: number, order: any) => 
        sum + (order.total_amount || 0), 0) || 0

      setStats({
        totalOrders: ordersData.total || 0,
        totalSpent,
        wishlistCount: wishlistData.items?.length || 0,
        recentOrders: ordersData.orders?.slice(0, 5) || [],
        savedAddresses: 0 // Will be implemented later
      })

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: UserIcon },
    { id: 'orders', label: 'My Orders', icon: ShoppingBagIcon },
    { id: 'wishlist', label: 'Wishlist', icon: HeartIcon },
    { id: 'addresses', label: 'Addresses', icon: MapPinIcon },
    { id: 'profile', label: 'Profile Settings', icon: CogIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="bg-gray-200 h-64 rounded"></div>
            <div className="lg:col-span-3 bg-gray-200 h-96 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        {user && (
          <p className="text-gray-600 mt-2">
            Welcome back, {user.first_name} {user.last_name}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === item.id
                        ? 'bg-pink-50 text-pink-700 border-r-2 border-pink-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </button>
                )
              })}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Orders</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
                    </div>
                    <ShoppingBagIcon className="h-8 w-8 text-pink-600" />
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatPrice(stats?.totalSpent || 0)}
                      </p>
                    </div>
                    <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">₹</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Wishlist Items</p>
                      <p className="text-2xl font-bold text-gray-900">{stats?.wishlistCount || 0}</p>
                    </div>
                    <HeartIcon className="h-8 w-8 text-red-500" />
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                  >
                    View All
                  </button>
                </div>
                
                {stats?.recentOrders.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-3">
                    {stats?.recentOrders.map((order, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                        <div>
                          <p className="font-medium text-gray-900">#{order.order_number}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{formatPrice(order.total_amount)}</p>
                          <p className={`text-sm capitalize ${
                            order.status === 'delivered' ? 'text-green-600' :
                            order.status === 'cancelled' ? 'text-red-600' :
                            'text-yellow-600'
                          }`}>
                            {order.status}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => router.push('/products')}
                    className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingBagIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Shop Now</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <HeartIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Wishlist</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <ShoppingBagIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Track Orders</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <CogIcon className="h-6 w-6 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">Settings</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Orders</h3>
              <p className="text-gray-600">Order management functionality will be implemented here.</p>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">My Wishlist</h3>
              <p className="text-gray-600 mb-4">
                You have {stats?.wishlistCount || 0} items in your wishlist.
              </p>
              <button
                onClick={() => router.push('/wishlist')}
                className="bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700"
              >
                View Wishlist
              </button>
            </div>
          )}

          {activeTab === 'profile' && user && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <p className="text-gray-900">{user.first_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <p className="text-gray-900">{user.last_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <p className="text-gray-900">{user.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Member Since</label>
                  <p className="text-gray-900">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="mt-4 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700">
                Edit Profile
              </button>
            </div>
          )}

          {/* Other tabs */}
          {!['overview', 'orders', 'wishlist', 'profile'].includes(activeTab) && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {menuItems.find(item => item.id === activeTab)?.label}
              </h3>
              <p className="text-gray-600">This section is coming soon.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
