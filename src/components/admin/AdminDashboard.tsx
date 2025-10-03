'use client'

import React, { useState, useEffect } from 'react'
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, TrendingDown, Users, ShoppingCart, 
  DollarSign, Package, AlertTriangle, CheckCircle,
  Activity, Zap, Database, Globe, Cpu, HardDrive,
  Target, Camera, Mail, BarChart3
} from 'lucide-react'

interface DashboardData {
  analytics: any
  recommendations: any
  virtualTryOn: any
  marketing: any
  performance: any
}

interface MetricCard {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color: string
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      const [analytics, recommendations, virtualTryOn, marketing, performance] = await Promise.all([
        fetch('/api/analytics?type=overview').then(res => res.json()),
        fetch('/api/ai/recommendations?type=performance').then(res => res.json()),
        fetch('/api/virtual-tryon?type=analytics').then(res => res.json()),
        fetch('/api/marketing-automation?type=dashboard').then(res => res.json()),
        fetch('/api/performance?type=overview').then(res => res.json())
      ])

      setData({
        analytics,
        recommendations,
        virtualTryOn,
        marketing,
        performance
      })
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'ai', label: 'AI Systems', icon: <Zap className="w-4 h-4" /> },
    { id: 'virtual-tryon', label: 'Virtual Try-On', icon: <Camera className="w-4 h-4" /> },
    { id: 'marketing', label: 'Marketing', icon: <Mail className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <Activity className="w-4 h-4" /> }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
          <button 
            onClick={loadDashboardData}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Advanced Analytics & AI Management</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={loadDashboardData}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && <OverviewTab data={data} />}
        {activeTab === 'analytics' && <AnalyticsTab data={data?.analytics} />}
        {activeTab === 'ai' && <AITab data={data?.recommendations} />}
        {activeTab === 'virtual-tryon' && <VirtualTryOnTab data={data?.virtualTryOn} />}
        {activeTab === 'marketing' && <MarketingTab data={data?.marketing} />}
        {activeTab === 'performance' && <PerformanceTab data={data?.performance} />}
      </div>
    </div>
  )
}

const OverviewTab: React.FC<{ data: DashboardData | null }> = ({ data }) => {
  if (!data) return <div>Loading overview...</div>

  const metrics: MetricCard[] = [
    {
      title: 'Total Revenue',
      value: `$${data.analytics?.revenue_metrics?.total_revenue?.toLocaleString() || '0'}`,
      change: data.analytics?.revenue_metrics?.growth_rate || 0,
      icon: <DollarSign className="w-6 h-6" />,
      color: 'green'
    },
    {
      title: 'Active Users',
      value: data.analytics?.customer_metrics?.total_customers?.toLocaleString() || '0',
      change: data.analytics?.customer_metrics?.new_customers_rate || 0,
      icon: <Users className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'AI Recommendations',
      value: data.recommendations?.total_recommendations?.toLocaleString() || '0',
      change: data.recommendations?.performance?.click_through_rate || 0,
      icon: <Zap className="w-6 h-6" />,
      color: 'purple'
    },
    {
      title: 'Virtual Try-Ons',
      value: data.virtualTryOn?.total_sessions?.toLocaleString() || '0',
      change: data.virtualTryOn?.conversion_rate || 0,
      icon: <Camera className="w-6 h-6" />,
      color: 'pink'
    },
    {
      title: 'Performance Score',
      value: `${data.performance?.performance_score || 0}/100`,
      change: 0,
      icon: <Activity className="w-6 h-6" />,
      color: data.performance?.performance_score > 80 ? 'green' : 'orange'
    },
    {
      title: 'Marketing ROI',
      value: `${data.marketing?.roi_metrics?.overall_roi || 0}%`,
      change: data.marketing?.roi_metrics?.roi_growth || 0,
      icon: <Target className="w-6 h-6" />,
      color: 'indigo'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCardComponent key={index} metric={metric} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            title="Run AI Analysis"
            description="Analyze user behavior"
            icon={<Zap className="w-5 h-5" />}
            onClick={() => {}}
          />
          <QuickActionButton
            title="Clear Cache"
            description="Optimize performance"
            icon={<Database className="w-5 h-5" />}
            onClick={() => {}}
          />
          <QuickActionButton
            title="Send Campaign"
            description="Launch marketing"
            icon={<Mail className="w-5 h-5" />}
            onClick={() => {}}
          />
          <QuickActionButton
            title="Export Data"
            description="Download reports"
            icon={<BarChart3 className="w-5 h-5" />}
            onClick={() => {}}
          />
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemStatusCard
          title="AI Systems Status"
          systems={[
            { name: 'Recommendation Engine', status: 'active', uptime: '99.9%' },
            { name: 'Virtual Try-On', status: 'active', uptime: '99.7%' },
            { name: 'Face Analysis', status: 'active', uptime: '99.8%' },
            { name: 'ML Training', status: 'training', uptime: '95.2%' }
          ]}
        />
        <SystemStatusCard
          title="Infrastructure Status"
          systems={[
            { name: 'Database', status: 'active', uptime: '99.9%' },
            { name: 'API Gateway', status: 'active', uptime: '99.8%' },
            { name: 'CDN', status: 'active', uptime: '99.9%' },
            { name: 'Cache Layer', status: 'warning', uptime: '98.5%' }
          ]}
        />
      </div>
    </div>
  )
}

const AnalyticsTab: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return <div>Loading analytics...</div>

  const salesData = data.sales_trends || []
  const customerData = data.customer_metrics || {}
  const productData = data.product_performance || []

  return (
    <div className="space-y-8">
      {/* Sales Chart */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip formatter={(value: any) => [`$${value}`, 'Revenue']} />
            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Customer Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Customer Segments</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={customerData.segments || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {(customerData.segments || []).map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={getSegmentColor(index)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Top Products</h3>
          <div className="space-y-4">
            {productData.slice(0, 5).map((product: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${product.revenue}</p>
                  <p className="text-sm text-gray-500">{product.units_sold} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

const AITab: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return <div>Loading AI data...</div>

  return (
    <div className="space-y-8">
      {/* AI Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Click-Through Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {data.performance?.click_through_rate || 0}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.performance?.conversion_rate || 0}%
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Model Accuracy</p>
              <p className="text-2xl font-bold text-purple-600">
                {data.model_accuracy || 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Types */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recommendation Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.recommendation_types || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="click_rate" fill="#8b5cf6" name="Click Rate %" />
            <Bar dataKey="conversion_rate" fill="#10b981" name="Conversion Rate %" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Model Training Status */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">ML Model Status</h3>
        <div className="space-y-4">
          {(data.models || []).map((model: any, index: number) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{model.name}</h4>
                <p className="text-sm text-gray-500">{model.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  model.status === 'active' 
                    ? 'bg-green-100 text-green-800'
                    : model.status === 'training'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {model.status}
                </span>
                <span className="text-sm text-gray-600">
                  Accuracy: {model.accuracy}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const VirtualTryOnTab: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return <div>Loading virtual try-on data...</div>

  return (
    <div className="space-y-8">
      {/* Usage Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Sessions</p>
              <p className="text-2xl font-bold text-pink-600">
                {data.total_sessions?.toLocaleString() || '0'}
              </p>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <Camera className="w-6 h-6 text-pink-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {data.conversion_rate || 0}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Session Time</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.avg_session_time || '0'}m
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Share Rate</p>
              <p className="text-2xl font-bold text-purple-600">
                {data.share_rate || 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Popular Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Most Tried Products</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Try-On Sessions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Conversion Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Share Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(data.popular_products || []).map((product: any, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-lg bg-gray-200 mr-3"></div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {product.category}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.sessions?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.conversion_rate}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.share_rate}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const MarketingTab: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return <div>Loading marketing data...</div>

  return (
    <div className="space-y-8">
      {/* Campaign Performance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.active_campaigns || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Mail className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Email Open Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {data.email_metrics?.open_rate || 0}%
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Marketing ROI</p>
              <p className="text-2xl font-bold text-purple-600">
                {data.roi_metrics?.overall_roi || 0}%
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Campaigns */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Campaigns</h3>
        <div className="space-y-4">
          {(data.recent_campaigns || []).map((campaign: any, index: number) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{campaign.name}</h4>
                  <p className="text-sm text-gray-500">{campaign.type}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    campaign.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : campaign.status === 'scheduled'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {campaign.status}
                  </span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Open Rate:</span>
                  <span className="ml-1 font-medium">{campaign.open_rate}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Click Rate:</span>
                  <span className="ml-1 font-medium">{campaign.click_rate}%</span>
                </div>
                <div>
                  <span className="text-gray-500">Conversions:</span>
                  <span className="ml-1 font-medium">{campaign.conversions}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const PerformanceTab: React.FC<{ data: any }> = ({ data }) => {
  if (!data) return <div>Loading performance data...</div>

  return (
    <div className="space-y-8">
      {/* Performance Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Overall Performance Score</h3>
        <div className="flex items-center justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-8 border-gray-200">
              <div 
                className="w-32 h-32 rounded-full border-8 border-green-500 absolute top-0 left-0"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + (data.performance_score || 0) * 0.5}% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%)`
                }}
              ></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold">{data.performance_score || 0}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            data.status === 'excellent'
              ? 'bg-green-100 text-green-800'
              : data.status === 'good'
              ? 'bg-blue-100 text-blue-800'
              : data.status === 'needs_improvement'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {data.status?.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Web Vitals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">LCP (ms)</p>
              <p className="text-2xl font-bold text-blue-600">
                {data.web_vitals?.avg_lcp || 0}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">FID (ms)</p>
              <p className="text-2xl font-bold text-green-600">
                {data.web_vitals?.avg_fid || 0}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">CLS</p>
              <p className="text-2xl font-bold text-purple-600">
                {data.web_vitals?.avg_cls || 0}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Optimization Recommendations</h3>
        <div className="space-y-4">
          {(data.recommendations || []).map((rec: any, index: number) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">{rec.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{rec.description}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.impact === 'high'
                        ? 'bg-red-100 text-red-800'
                        : rec.impact === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {rec.impact} impact
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      rec.effort === 'low'
                        ? 'bg-green-100 text-green-800'
                        : rec.effort === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {rec.effort} effort
                    </span>
                  </div>
                </div>
                <button className="ml-4 px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700">
                  Apply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper Components
const MetricCardComponent: React.FC<{ metric: MetricCard }> = ({ metric }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{metric.title}</p>
        <p className={`text-2xl font-bold text-${metric.color}-600`}>
          {metric.value}
        </p>
        {metric.change !== undefined && (
          <div className="flex items-center mt-1">
            {metric.change > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={`text-sm ${metric.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(metric.change)}%
            </span>
          </div>
        )}
      </div>
      <div className={`p-3 bg-${metric.color}-100 rounded-full`}>
        {metric.icon}
      </div>
    </div>
  </div>
)

const QuickActionButton: React.FC<{
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}> = ({ title, description, icon, onClick }) => (
  <button
    onClick={onClick}
    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors text-left"
  >
    <div className="flex items-center space-x-3">
      <div className="p-2 bg-purple-100 rounded-lg">
        {icon}
      </div>
      <div>
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  </button>
)

const SystemStatusCard: React.FC<{
  title: string
  systems: Array<{ name: string; status: string; uptime: string }>
}> = ({ title, systems }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-semibold mb-4">{title}</h3>
    <div className="space-y-3">
      {systems.map((system, index) => (
        <div key={index} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${
              system.status === 'active'
                ? 'bg-green-500'
                : system.status === 'warning'
                ? 'bg-yellow-500'
                : system.status === 'training'
                ? 'bg-blue-500'
                : 'bg-red-500'
            }`}></div>
            <span className="font-medium">{system.name}</span>
          </div>
          <div className="text-right">
            <span className="text-sm text-gray-600">{system.uptime}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
)

const getSegmentColor = (index: number): string => {
  const colors = ['#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6']
  return colors[index % colors.length]
}

export default AdminDashboard