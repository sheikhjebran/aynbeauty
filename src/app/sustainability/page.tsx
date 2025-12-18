'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  GlobeAltIcon,
  HeartIcon,
  ArrowPathIcon,
  SunIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  SparklesIcon,
  BeakerIcon,
} from '@heroicons/react/24/outline'

export default function SustainabilityPage() {
  const initiatives = [
    {
      icon: SparklesIcon,
      title: 'Eco-Friendly Packaging',
      description: 'Transitioning to 100% recyclable and biodegradable packaging materials by 2026.',
      progress: 75,
      color: 'green'
    },
    {
      icon: ArrowPathIcon,
      title: 'Refill Programs',
      description: 'Partner with brands to offer refillable options for popular products.',
      progress: 45,
      color: 'blue'
    },
    {
      icon: SunIcon,
      title: 'Carbon Neutral Shipping',
      description: 'Offsetting 100% of shipping emissions through verified carbon credit programs.',
      progress: 90,
      color: 'yellow'
    },
    {
      icon: BeakerIcon,
      title: 'Water Conservation',
      description: 'Supporting brands that use water-efficient manufacturing processes.',
      progress: 60,
      color: 'cyan'
    }
  ]

  const partnerBrands = [
    {
      name: 'Clean Beauty Co.',
      commitment: 'Zero waste production',
      certification: 'B-Corp Certified'
    },
    {
      name: 'Green Glow',
      commitment: 'Plastic-free packaging',
      certification: 'Cradle to Cradle'
    },
    {
      name: 'Pure Earth',
      commitment: 'Carbon negative operations',
      certification: 'Climate Neutral'
    },
    {
      name: 'Eco Luxe',
      commitment: 'Fair trade ingredients',
      certification: 'Leaping Bunny'
    }
  ]

  const goals = [
    {
      year: '2025',
      title: 'Plastic-Free Packaging',
      description: 'Eliminate single-use plastics from all product packaging',
      status: 'in-progress'
    },
    {
      year: '2026',
      title: 'Carbon Neutral Operations',
      description: 'Achieve net-zero carbon emissions across all business operations',
      status: 'planned'
    },
    {
      year: '2027',
      title: 'Circular Economy Model',
      description: 'Implement take-back programs for used beauty containers',
      status: 'planned'
    },
    {
      year: '2028',
      title: 'Sustainable Supply Chain',
      description: '100% of suppliers meet our sustainability standards',
      status: 'planned'
    }
  ]

  const impactStats = [
    { number: '50K', label: 'Packages Recycled', icon: ArrowPathIcon },
    { number: '25 Tons', label: 'CO₂ Offset This Year', icon: SunIcon },
    { number: '100+', label: 'Sustainable Brands', icon: SparklesIcon },
    { number: '1M+', label: 'Plastic Items Avoided', icon: GlobeAltIcon },
  ]

  const tips = [
    {
      title: 'Choose Refillable Products',
      description: 'Look for beauty products that offer refill options to reduce packaging waste.',
      icon: '🔄'
    },
    {
      title: 'Use Every Drop',
      description: 'Cut open tubes and containers to use every bit of product before disposal.',
      icon: '💧'
    },
    {
      title: 'Recycle Properly',
      description: 'Clean containers before recycling and check local recycling guidelines.',
      icon: '♻️'
    },
    {
      title: 'Buy Consciously',
      description: 'Choose products with minimal packaging and sustainable ingredients.',
      icon: '🌱'
    },
    {
      title: 'Share & Swap',
      description: 'Organize beauty swaps with friends to reduce waste and try new products.',
      icon: '🤝'
    },
    {
      title: 'Support Sustainable Brands',
      description: 'Research and choose brands committed to environmental responsibility.',
      icon: '🌍'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-500 to-teal-600 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <Image
            src="/images/sustainability/hero-bg.jpg"
            alt="Sustainable Beauty"
            fill
            className="object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <SparklesIcon className="h-20 w-20 mx-auto mb-6 text-green-300" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Beautiful Planet,
              <span className="block text-green-300">Beautiful You</span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-8">
              At AYN Beauty, we're committed to making beauty sustainable. Join us in creating a more 
              beautiful world for future generations while looking and feeling your best today.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="bg-white text-green-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Our Commitments
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Sustainable Products
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Environmental Impact</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Measurable progress toward a more sustainable beauty industry.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {impactStats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Initiatives */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Green Initiatives</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're taking concrete steps to reduce our environmental footprint and promote sustainable beauty practices.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {initiatives.map((initiative, index) => (
              <motion.div
                key={initiative.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${initiative.color}-400 to-${initiative.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                  <initiative.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{initiative.title}</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{initiative.description}</p>
                
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{initiative.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r from-${initiative.color}-400 to-${initiative.color}-600 h-2 rounded-full transition-all duration-1000`}
                      style={{ width: `${initiative.progress}%` }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainable Partners */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Sustainable Brand Partners</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We carefully select brands that share our commitment to environmental responsibility and ethical practices.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerBrands.map((brand, index) => (
              <motion.div
                key={brand.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow text-center"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{brand.name}</h3>
                <p className="text-gray-600 text-sm mb-3">{brand.commitment}</p>
                <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">
                  {brand.certification}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Goals */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Sustainability Roadmap</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ambitious goals with clear timelines to create lasting positive change.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-green-500 to-teal-600 h-full hidden md:block"></div>
            
            <div className="space-y-12">
              {goals.map((goal, index) => (
                <motion.div
                  key={goal.year}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className={`bg-white rounded-2xl p-6 shadow-lg ${goal.status === 'in-progress' ? 'border-l-4 border-green-500' : ''}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="text-2xl font-bold text-green-600">{goal.year}</div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          goal.status === 'in-progress' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {goal.status === 'in-progress' ? 'In Progress' : 'Planned'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{goal.title}</h3>
                      <p className="text-gray-700">{goal.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="relative flex-shrink-0 w-16 h-16 hidden md:flex">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                      <SparklesIcon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tips for Customers */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-teal-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How You Can Help</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Small changes in your beauty routine can make a big difference for our planet.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-4xl mb-4">{tip.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{tip.title}</h3>
                <p className="text-gray-700 leading-relaxed">{tip.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Mission */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-teal-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            <UserGroupIcon className="h-16 w-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Sustainability Mission</h2>
            <p className="text-xl opacity-90 mb-8 leading-relaxed">
              Together, we can create a more sustainable future for beauty. Sign up for our Green Beauty newsletter 
              to stay updated on our progress and get tips for sustainable beauty practices.
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <div className="flex gap-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                />
                <button className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Shop Sustainable Products
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-colors">
                Learn More About Our Partners
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
