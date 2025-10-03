'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ScaleIcon,
  EyeIcon,
  HandRaisedIcon,
  SwatchIcon,
  BeakerIcon,
  InformationCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline'

export default function SizeGuidePage() {
  const [activeCategory, setActiveCategory] = useState<'makeup' | 'skincare' | 'tools' | 'fragrance'>('makeup')
  const [selectedShade, setSelectedShade] = useState('')

  const categories = [
    { id: 'makeup', label: 'Makeup', icon: SwatchIcon },
    { id: 'skincare', label: 'Skincare', icon: BeakerIcon },
    { id: 'tools', label: 'Tools & Accessories', icon: HandRaisedIcon },
    { id: 'fragrance', label: 'Fragrance', icon: ScaleIcon },
  ]

  const foundationShades = [
    { name: 'Fair 100', description: 'Very light with pink undertones', hex: '#F7D7C4' },
    { name: 'Fair 110', description: 'Very light with neutral undertones', hex: '#F4D1B3' },
    { name: 'Light 200', description: 'Light with pink undertones', hex: '#EBBC93' },
    { name: 'Light 220', description: 'Light with neutral undertones', hex: '#E8B584' },
    { name: 'Medium 300', description: 'Medium with warm undertones', hex: '#D49B6A' },
    { name: 'Medium 320', description: 'Medium with neutral undertones', hex: '#C9935A' },
    { name: 'Deep 400', description: 'Deep with warm undertones', hex: '#A67850' },
    { name: 'Deep 420', description: 'Deep with golden undertones', hex: '#9B6F47' },
  ]

  const skincareSizes = [
    { product: 'Cleansers', sizes: ['50ml (Travel)', '150ml (Standard)', '300ml (Family)'] },
    { product: 'Moisturizers', sizes: ['30ml (Travel)', '50ml (Standard)', '100ml (Value)'] },
    { product: 'Serums', sizes: ['15ml (Trial)', '30ml (Standard)', '50ml (Professional)'] },
    { product: 'Sunscreens', sizes: ['40ml (Travel)', '75ml (Standard)', '150ml (Family)'] },
    { product: 'Face Masks', sizes: ['Single Use', '3-Pack', '10-Pack'] },
  ]

  const brushSizes = [
    { type: 'Foundation Brush', size: '2.5cm width', usage: 'Full face coverage' },
    { type: 'Concealer Brush', size: '0.8cm width', usage: 'Spot concealing' },
    { type: 'Powder Brush', size: '4cm diameter', usage: 'Setting powder' },
    { type: 'Blush Brush', size: '3cm diameter', usage: 'Cheek color' },
    { type: 'Eyeshadow Brush', size: '1.2cm width', usage: 'Lid application' },
    { type: 'Liner Brush', size: '0.3cm tip', usage: 'Precise lines' },
  ]

  const fragranceSizes = [
    { size: '7.5ml', type: 'Travel/Sample', duration: '2-3 weeks', price: '₹500-800' },
    { size: '30ml', type: 'Personal', duration: '2-3 months', price: '₹1,500-3,000' },
    { size: '50ml', type: 'Standard', duration: '4-6 months', price: '₹2,500-5,000' },
    { size: '100ml', type: 'Value', duration: '8-12 months', price: '₹4,000-8,000' },
  ]

  const measurementTips = [
    {
      title: 'Find Your Undertone',
      steps: [
        'Look at your wrist veins in natural light',
        'Blue/purple veins = Cool undertone',
        'Green veins = Warm undertone',
        'Both colors = Neutral undertone'
      ],
      icon: EyeIcon
    },
    {
      title: 'Test Foundation Shade',
      steps: [
        'Apply on your jawline, not your hand',
        'Check in natural daylight',
        'Blend and wait 15 minutes',
        'Perfect match will disappear into skin'
      ],
      icon: SwatchIcon
    },
    {
      title: 'Measure Skincare Needs',
      steps: [
        'Pea-size amount for face moisturizer',
        '2-3 drops for face serum',
        'Nickel-size for sunscreen coverage',
        'Dime-size for cleanser application'
      ],
      icon: BeakerIcon
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-500 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Size Guide</h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Find your perfect match with our comprehensive size and shade guides for all beauty products.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Shade Matcher */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Shade Finder</h2>
            <p className="text-gray-600 mb-6">Enter a shade you currently use to find your match in our products</p>
            <div className="flex gap-4">
              <input
                type="text"
                value={selectedShade}
                onChange={(e) => setSelectedShade(e.target.value)}
                placeholder="e.g., MAC NC25, Fenty 220, Maybelline 128"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center">
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                Find Match
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="bg-gray-100 rounded-lg p-1 inline-flex flex-wrap">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as any)}
                  className={`flex items-center px-6 py-3 rounded-md font-medium transition-all m-1 ${
                    activeCategory === category.id
                      ? 'bg-white text-purple-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <category.icon className="h-5 w-5 mr-2" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Based on Active Category */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {activeCategory === 'makeup' && (
            <motion.div
              key="makeup"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Foundation Shade Guide */}
              <div className="mb-16">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Foundation Shade Guide</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Shade Palette */}
                  <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Available Shades</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {foundationShades.map((shade, index) => (
                        <motion.div
                          key={shade.name}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.1 * index }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div
                            className="w-full h-12 rounded-lg mb-3"
                            style={{ backgroundColor: shade.hex }}
                          ></div>
                          <h4 className="font-semibold text-gray-900 text-sm">{shade.name}</h4>
                          <p className="text-xs text-gray-600 mt-1">{shade.description}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Undertone Guide */}
                  <div className="space-y-6">
                    <div className="bg-pink-50 border border-pink-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-pink-900 mb-4">Cool Undertones</h4>
                      <p className="text-pink-800 mb-3">Best for you if you have:</p>
                      <ul className="text-pink-700 space-y-1 text-sm">
                        <li>• Blue or purple veins</li>
                        <li>• Silver jewelry looks better</li>
                        <li>• Pink or red skin flush</li>
                        <li>• Fair to light skin tones</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-yellow-900 mb-4">Warm Undertones</h4>
                      <p className="text-yellow-800 mb-3">Best for you if you have:</p>
                      <ul className="text-yellow-700 space-y-1 text-sm">
                        <li>• Green veins</li>
                        <li>• Gold jewelry looks better</li>
                        <li>• Golden or olive skin flush</li>
                        <li>• Medium to deep skin tones</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Neutral Undertones</h4>
                      <p className="text-gray-800 mb-3">Best for you if you have:</p>
                      <ul className="text-gray-700 space-y-1 text-sm">
                        <li>• Both blue and green veins</li>
                        <li>• Both metals look good</li>
                        <li>• Balanced skin tone</li>
                        <li>• Works with most shades</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lip Color Guide */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Lip Color Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-red-300 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-gray-900">Cool Reds</h4>
                    <p className="text-sm text-gray-600">Blue-based reds, berry tones</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-orange-300 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-gray-900">Warm Reds</h4>
                    <p className="text-sm text-gray-600">Orange-based reds, coral tones</p>
                  </div>
                  <div className="text-center">
                    <div className="w-20 h-20 bg-pink-300 rounded-full mx-auto mb-4"></div>
                    <h4 className="font-semibold text-gray-900">Neutrals</h4>
                    <p className="text-sm text-gray-600">Universal nudes, mauve tones</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeCategory === 'skincare' && (
            <motion.div
              key="skincare"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-12"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Skincare Product Sizes</h2>
                <div className="space-y-6">
                  {skincareSizes.map((category, index) => (
                    <motion.div
                      key={category.product}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="border border-gray-200 rounded-xl p-6"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">{category.product}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {category.sizes.map((size, sizeIndex) => (
                          <div key={sizeIndex} className="bg-gray-50 rounded-lg p-4 text-center">
                            <p className="font-medium text-gray-900">{size}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Application Amounts</h3>
                  <div className="space-y-3 text-blue-800">
                    <div className="flex justify-between">
                      <span>Cleanser:</span>
                      <span className="font-medium">Dime-size</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Toner:</span>
                      <span className="font-medium">2-3 drops</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Serum:</span>
                      <span className="font-medium">2-3 drops</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Moisturizer:</span>
                      <span className="font-medium">Pea-size</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunscreen:</span>
                      <span className="font-medium">Nickel-size</span>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-4">Usage Duration</h3>
                  <div className="space-y-3 text-green-800">
                    <div className="flex justify-between">
                      <span>30ml moisturizer:</span>
                      <span className="font-medium">1-2 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>30ml serum:</span>
                      <span className="font-medium">2-3 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>150ml cleanser:</span>
                      <span className="font-medium">2-3 months</span>
                    </div>
                    <div className="flex justify-between">
                      <span>75ml sunscreen:</span>
                      <span className="font-medium">1 month</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeCategory === 'tools' && (
            <motion.div
              key="tools"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Brush & Tool Sizes</h2>
                <div className="space-y-6">
                  {brushSizes.map((brush, index) => (
                    <motion.div
                      key={brush.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="flex items-center justify-between border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                    >
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{brush.type}</h3>
                        <p className="text-gray-600">{brush.usage}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-semibold text-purple-600">{brush.size}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeCategory === 'fragrance' && (
            <motion.div
              key="fragrance"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Fragrance Sizes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {fragranceSizes.map((fragrance, index) => (
                    <motion.div
                      key={fragrance.size}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="text-center border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="w-16 h-20 bg-gradient-to-b from-purple-400 to-pink-400 rounded-lg mx-auto mb-4 flex items-end justify-center">
                        <div className="w-8 h-3 bg-gray-300 rounded-t-sm"></div>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{fragrance.size}</h3>
                      <p className="text-purple-600 font-semibold mb-2">{fragrance.type}</p>
                      <p className="text-sm text-gray-600 mb-2">Lasts: {fragrance.duration}</p>
                      <p className="text-sm text-gray-500">{fragrance.price}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Measurement Tips */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Expert Tips</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional advice to help you choose the perfect products for your needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {measurementTips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-50 rounded-2xl p-6"
              >
                <div className="flex items-center mb-4">
                  <tip.icon className="h-8 w-8 text-purple-600 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900">{tip.title}</h3>
                </div>
                <ol className="space-y-2">
                  {tip.steps.map((step, stepIndex) => (
                    <li key={stepIndex} className="flex items-start">
                      <span className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                        {stepIndex + 1}
                      </span>
                      <span className="text-gray-700 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Section */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
            <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
              Our beauty experts are here to help you find your perfect match. Get personalized recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Virtual Consultation
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-colors">
                Contact Expert
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}