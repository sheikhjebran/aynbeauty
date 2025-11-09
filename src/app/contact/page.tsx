'use client'

import { motion } from 'framer-motion'
import { PhoneIcon } from '@heroicons/react/24/outline'

export default function ContactPage() {

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-pink-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed">
              We're here to help! Reach out to us anytime.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information and Map */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Get In Touch</h2>
              
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8">
                <div className="flex items-start mb-8">
                  <PhoneIcon className="h-8 w-8 text-pink-600 mr-4 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Call Us</h3>
                    <a
                      href="tel:+917019449136"
                      className="text-2xl font-bold text-pink-600 hover:text-pink-700 transition-colors"
                    >
                      +91 7019449136
                    </a>
                    <p className="text-gray-600 mt-2">Available for your inquiries</p>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-pink-200">
                  <p className="text-gray-600 mb-4">
                    Whether you have questions about our products, need beauty advice, or want to partner with us – we're here to help!
                  </p>
                  <p className="text-gray-600">
                    Feel free to reach out via phone call for the fastest response.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="w-full h-full min-h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d248849.90089992387!2d77.46612515235655!3d12.953945613520993!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1762707739132!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '400px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full"
                ></iframe>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}