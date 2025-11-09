'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TruckIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  GiftIcon,
  CheckCircleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline'

export default function ShippingReturnsPage() {
  const [activeTab, setActiveTab] = useState<'shipping' | 'returns' | 'exchange'>('shipping')
  const [trackingNumber, setTrackingNumber] = useState('')

  const shippingOptions = [
    {
      name: 'Standard Delivery',
      duration: 'Free delivery',
      cost: 'Free on orders ₹499+',
      description: 'Regular delivery across India',
      icon: TruckIcon,
      color: 'blue'
    },
    {
      name: 'Express Delivery',
      duration: 'Available in Bangalore only',
      cost: '₹99',
      description: 'Fast delivery to Bangalore',
      icon: ClockIcon,
      color: 'green'
    }
  ]

  const returnProcess = [
    {
      step: 1,
      title: 'Initiate Return',
      description: 'Contact us within 30 days of delivery',
      icon: '📱'
    },
    {
      step: 2,
      title: 'Pack Securely',
      description: 'Use original packaging if available',
      icon: '📦'
    },
    {
      step: 3,
      title: 'Schedule Pickup',
      description: 'We arrange free pickup from your location',
      icon: '🚚'
    },
    {
      step: 4,
      title: 'Quality Check',
      description: 'Items are inspected upon receipt',
      icon: '🔍'
    },
    {
      step: 5,
      title: 'Refund Processed',
      description: 'Money back within 5-7 business days',
      icon: '💳'
    }
  ]

  const returnableItems = [
    { item: 'Unopened makeup products', allowed: true },
    { item: 'Skincare with original seals', allowed: true },
    { item: 'Hair tools in original packaging', allowed: true },
    { item: 'Damaged/defective items', allowed: true },
    { item: 'Wrong item delivered', allowed: true },
    { item: 'Opened/used makeup products', allowed: false },
    { item: 'Personal care items (used)', allowed: false },
    { item: 'Sale/clearance items', allowed: false },
    { item: 'Custom/personalized products', allowed: false },
  ]

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault()
    if (trackingNumber.trim()) {
      // Redirect to tracking page or show tracking info
      window.open(`/track-order?tracking=${trackingNumber}`, '_blank')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Shipping & Returns</h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Fast, reliable delivery and hassle-free returns for your beauty essentials.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Order Tracking */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Track Your Order</h2>
            <form onSubmit={handleTrackOrder} className="flex gap-4">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter your order number or tracking ID"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Track
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* Navigation Tabs */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex">
              {[
                { id: 'shipping', label: 'Shipping Info', icon: TruckIcon },
                { id: 'returns', label: 'Returns', icon: ArrowPathIcon }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-6 py-3 rounded-md font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Based on Active Tab */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {activeTab === 'shipping' && (
            <motion.div
              key="shipping"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Shipping Options */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Delivery Options</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {shippingOptions.map((option, index) => (
                    <motion.div
                      key={option.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow"
                    >
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${option.color}-100 flex items-center justify-center`}>
                        <option.icon className={`h-8 w-8 text-${option.color}-600`} />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{option.name}</h3>
                      <p className="text-2xl font-bold text-blue-600 mb-2">{option.duration}</p>
                      <p className="text-lg text-gray-600 mb-3">{option.cost}</p>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Shipping Benefits */}
              <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Shipping Benefits</h3>
                  <div className="space-y-4">
                    {[
                      'Free shipping on orders above ₹499',
                      'Real-time tracking updates',
                      'Secure packaging for fragile items',
                      'Cash on Delivery available',
                      'Weekend delivery options',
                      'Express delivery to 300+ cities'
                    ].map((benefit, index) => (
                      <div key={index} className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                        <span className="text-gray-700">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'returns' && (
            <motion.div
              key="returns"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Return Process */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Return Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  {returnProcess.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      className="text-center"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">{step.icon}</span>
                        </div>
                        {index < returnProcess.length - 1 && (
                          <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform translate-x-3"></div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Return Policy */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">What Can Be Returned?</h3>
                  <div className="space-y-3">
                    {returnableItems.map((item, index) => (
                      <div key={index} className="flex items-center">
                        {item.allowed ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500 mr-3" />
                        )}
                        <span className={item.allowed ? 'text-gray-700' : 'text-gray-500'}>{item.item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <ShieldCheckIcon className="h-6 w-6 text-green-600 mr-3" />
                      <h4 className="text-lg font-semibold text-green-900">30-Day Return Policy</h4>
                    </div>
                    <p className="text-green-800">
                      Return unused items within 30 days of delivery for a full refund. Original packaging preferred but not required.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <CurrencyRupeeIcon className="h-6 w-6 text-blue-600 mr-3" />
                      <h4 className="text-lg font-semibold text-blue-900">Refund Timeline</h4>
                    </div>
                    <ul className="text-blue-800 space-y-2">
                      <li>• Credit/Debit Card: 5-7 business days</li>
                      <li>• UPI/Wallet: 2-3 business days</li>
                      <li>• Cash on Delivery: 7-10 business days</li>
                    </ul>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <div className="flex items-center mb-4">
                      <InformationCircleIcon className="h-6 w-6 text-purple-600 mr-3" />
                      <h4 className="text-lg font-semibold text-purple-900">Important Notes</h4>
                    </div>
                    <ul className="text-purple-800 space-y-2 text-sm">
                      <li>• Free return pickup across India</li>
                      <li>• Original invoice required</li>
                      <li>• Items must be in resalable condition</li>
                      <li>• Hygiene products cannot be returned once opened</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Need Help with Your Order?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Our customer support team is here to help with any shipping or return questions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </a>
              <a
                href="tel:+911800123456"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-pink-600 transition-colors"
              >
                Call: +91 1800-123-456
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}