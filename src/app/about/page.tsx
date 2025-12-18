'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import { motion } from 'framer-motion'

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              About
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                AYN Beauty
              </span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              Bringing globally loved skincare products to you
            </p>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-300/20 rounded-full blur-lg"></div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p className="text-xl font-semibold text-gray-900">
                At AYN Beauty, we believe that beautiful skin knows no borders.
              </p>
              
              <p>
                Our journey began with one simple goal: to bring some of the globally loved skincare products accessible to you. 
                Being a licensed Aesthetician, I saw how the right skincare can transform not only your skin but also your confidence. 
                With AYN Beauty, you're not just buying skincare, you are getting the support of someone who truly understands skin.
              </p>
              
              <p>
                After exploring global beauty trends that couldn't be found locally, we decided making them easily accessible to our skincare lovers. 
                Each product is chosen with care and quality checked by us before bringing it to our beauties.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Start Your Skincare Journey</h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Discover carefully curated global skincare products that are quality checked and ready for you.
            </p>
            <a
              href="/"
              className="inline-block bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors"
            >
              Shop Now
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
