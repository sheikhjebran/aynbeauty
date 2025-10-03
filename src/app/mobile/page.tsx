'use client'

import { useState, useEffect } from 'react'
import { 
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  ComputerDesktopIcon,
  CheckIcon,
  StarIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'

interface MobileFeature {
  id: string
  title: string
  description: string
  implemented: boolean
  priority: 'High' | 'Medium' | 'Low'
}

interface ResponsiveBreakpoint {
  name: string
  width: string
  icon: React.ComponentType<any>
  features: string[]
}

export default function MobileConsiderations() {
  const [selectedBreakpoint, setSelectedBreakpoint] = useState(0)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const mobileFeatures: MobileFeature[] = [
    {
      id: 'responsive-design',
      title: 'Responsive Grid System',
      description: 'Adaptive layouts that work seamlessly across all device sizes using Tailwind CSS breakpoints',
      implemented: true,
      priority: 'High'
    },
    {
      id: 'touch-optimization',
      title: 'Touch-Optimized Interface',
      description: 'Larger tap targets, swipe gestures, and touch-friendly navigation elements',
      implemented: true,
      priority: 'High'
    },
    {
      id: 'progressive-web-app',
      title: 'Progressive Web App (PWA)',
      description: 'App-like experience with offline capabilities, push notifications, and home screen installation',
      implemented: false,
      priority: 'High'
    },
    {
      id: 'mobile-navigation',
      title: 'Mobile-First Navigation',
      description: 'Collapsible hamburger menu with smooth animations and easy access to key features',
      implemented: true,
      priority: 'High'
    },
    {
      id: 'image-optimization',
      title: 'Optimized Image Loading',
      description: 'Lazy loading, WebP format, and responsive images for faster mobile performance',
      implemented: true,
      priority: 'High'
    },
    {
      id: 'geolocation',
      title: 'Location Services',
      description: 'Store locator, location-based offers, and delivery radius calculation',
      implemented: false,
      priority: 'Medium'
    },
    {
      id: 'biometric-auth',
      title: 'Biometric Authentication',
      description: 'Fingerprint and face recognition for secure and convenient login',
      implemented: false,
      priority: 'Medium'
    },
    {
      id: 'camera-integration',
      title: 'Camera Integration',
      description: 'Virtual try-on features, barcode scanning, and product image uploads',
      implemented: false,
      priority: 'Medium'
    },
    {
      id: 'offline-support',
      title: 'Offline Functionality',
      description: 'Cached product data, wishlist, and basic app functionality without internet',
      implemented: false,
      priority: 'Medium'
    },
    {
      id: 'push-notifications',
      title: 'Smart Push Notifications',
      description: 'Personalized offers, order updates, and re-engagement campaigns',
      implemented: false,
      priority: 'Low'
    },
    {
      id: 'social-sharing',
      title: 'Native Social Sharing',
      description: 'Share products directly to social media platforms with rich previews',
      implemented: true,
      priority: 'Low'
    },
    {
      id: 'haptic-feedback',
      title: 'Haptic Feedback',
      description: 'Tactile responses for interactions, cart additions, and notifications',
      implemented: false,
      priority: 'Low'
    }
  ]

  const breakpoints: ResponsiveBreakpoint[] = [
    {
      name: 'Mobile',
      width: '320px - 768px',
      icon: DevicePhoneMobileIcon,
      features: [
        'Single column layout',
        'Hamburger navigation menu',
        'Touch-optimized buttons (min 44px)',
        'Swipeable product carousels',
        'Sticky checkout button',
        'Simplified forms'
      ]
    },
    {
      name: 'Tablet',
      width: '768px - 1024px',
      icon: DeviceTabletIcon,
      features: [
        'Two column product grid',
        'Slide-out navigation drawer',
        'Enhanced search filters',
        'Picture-in-picture features',
        'Split-view layouts',
        'Gesture navigation support'
      ]
    },
    {
      name: 'Desktop',
      width: '1024px+',
      icon: ComputerDesktopIcon,
      features: [
        'Multi-column layouts',
        'Persistent navigation',
        'Hover interactions',
        'Advanced filtering sidebar',
        'Multi-step checkout',
        'Keyboard shortcuts'
      ]
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'Low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const implementedCount = mobileFeatures.filter(f => f.implemented).length
  const totalFeatures = mobileFeatures.length
  const implementationPercentage = Math.round((implementedCount / totalFeatures) * 100)

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mobile App Considerations</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Building a mobile-first beauty e-commerce experience with progressive web app capabilities 
            and native mobile features for seamless user engagement.
          </p>
          
          {/* Implementation Progress */}
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">Implementation Progress</span>
              <span className="text-sm font-medium text-gray-900">{implementedCount}/{totalFeatures}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-pink-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${implementationPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{implementationPercentage}% Complete</p>
          </div>
        </div>

        {/* Responsive Breakpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Responsive Design Breakpoints</h2>
          
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              {breakpoints.map((breakpoint, index) => {
                const IconComponent = breakpoint.icon
                return (
                  <button
                    key={breakpoint.name}
                    onClick={() => setSelectedBreakpoint(index)}
                    className={`flex-1 p-4 text-center transition-colors ${
                      selectedBreakpoint === index
                        ? 'bg-pink-50 text-pink-600 border-b-2 border-pink-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-8 w-8 mx-auto mb-2" />
                    <div className="font-medium">{breakpoint.name}</div>
                    <div className="text-xs opacity-75">{breakpoint.width}</div>
                  </button>
                )
              })}
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {breakpoints[selectedBreakpoint].name} Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {breakpoints[selectedBreakpoint].features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <CheckIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Mobile Features Grid */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Mobile Features Roadmap</h2>
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">Filter by:</span>
              <select className="text-sm border border-gray-300 rounded px-2 py-1">
                <option value="all">All Features</option>
                <option value="implemented">Implemented</option>
                <option value="planned">Planned</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mobileFeatures.map((feature) => (
              <div
                key={feature.id}
                className={`bg-white border rounded-lg p-6 transition-all hover:shadow-md ${
                  feature.implemented ? 'border-green-200' : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      feature.implemented ? 'bg-green-500' : 'bg-gray-300'
                    }`}></div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(feature.priority)}`}>
                      {feature.priority}
                    </span>
                  </div>
                  {feature.implemented && (
                    <CheckIcon className="h-5 w-5 text-green-600" />
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium ${
                    feature.implemented ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {feature.implemented ? 'Implemented' : 'Planned'}
                  </span>
                  {!feature.implemented && (
                    <button className="text-xs text-pink-600 hover:text-pink-700 font-medium">
                      View Details →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PWA Features Demo */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Progressive Web App Features</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Installation & Offline Support</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Add to Home Screen prompt</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Service Worker registration</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Offline product browsing</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Background sync for orders</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Native-like Features</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Push notifications</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Device camera access</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Geolocation services</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Share API integration</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Performance Metrics */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mobile Performance Targets</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">&lt; 3s</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Page Load Time</div>
              <div className="text-xs text-gray-600">First Contentful Paint</div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">90+</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Lighthouse Score</div>
              <div className="text-xs text-gray-600">Performance & PWA</div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">&lt; 100ms</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Touch Response</div>
              <div className="text-xs text-gray-600">Input Delay</div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">&lt; 500KB</div>
              <div className="text-sm font-medium text-gray-900 mb-1">Bundle Size</div>
              <div className="text-xs text-gray-600">Initial JavaScript</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}