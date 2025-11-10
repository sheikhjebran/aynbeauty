'use client'

import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  ShieldCheckIcon,
  UserIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function TermsOfServicePage() {
  const lastUpdated = "November 10, 2024"

  const sections = [
    {
      id: 'overview',
      title: 'About These Terms',
      icon: DocumentTextIcon,
      content: 'Welcome to AYN Beauty. These simple terms explain how you can use our website and shop with us. By using AYN Beauty, you agree to follow these guidelines.'
    },
    {
      id: 'age-usage',
      title: 'Age & Usage',
      icon: UserIcon,
      content: 'You must be at least 18 years old to use our website. When you create an account, please provide accurate information. You\'re responsible for keeping your login details private and safe. We\'re not responsible for unauthorized access to your account if you share your password.'
    },
    {
      id: 'products-info',
      title: 'Product Information',
      icon: ShieldCheckIcon,
      content: 'We try our best to show accurate product details, images, and prices. However, we cannot guarantee everything is 100% error-free. If you spot any mistakes, please let us know. Product availability and prices can change without notice.'
    },
    {
      id: 'health-safety',
      title: 'Health & Safety',
      icon: ExclamationTriangleIcon,
      content: 'Beauty and skincare products can affect everyone differently. We recommend doing a patch test before full use. If you have sensitive skin or allergies, test the product on a small area first. Stop using if you experience any irritation. We\'re not responsible for any allergic reactions or skin issues. If you have health concerns, consult with a healthcare professional.'
    },
    {
      id: 'account-privacy',
      title: 'Your Account',
      icon: UserIcon,
      content: 'Keep your account information accurate and up-to-date. You\'re responsible for all activity on your account. Let us know immediately if someone else uses your account without permission. We can close your account if you break these rules. You can also delete your account anytime by contacting us.'
    },
    {
      id: 'orders',
      title: 'Placing Orders',
      icon: DocumentTextIcon,
      content: 'When you place an order, you\'re asking us to sell you a product. We can accept or reject any order. If there\'s a price mistake or the product is unavailable, we\'ll let you know. We accept payments through the methods shown at checkout. Orders are typically confirmed by email within 24 hours.'
    },
    {
      id: 'prohibited',
      title: 'What You Cannot Do',
      icon: ExclamationTriangleIcon,
      content: 'Don\'t use our website for illegal activities. Don\'t try to hack or damage our website. Don\'t copy or resell our content without permission. Don\'t provide false information when ordering. Don\'t try to interfere with our systems or introduce viruses. Respect our trademarks and logos.'
    },
    {
      id: 'limits',
      title: 'Our Limitations',
      icon: ShieldCheckIcon,
      content: 'We do our best to keep our website running smoothly, but we don\'t guarantee it will always be error-free or never go down for maintenance. We\'re not responsible for issues beyond our control. Our website may have links to other sites - we\'re not responsible for their content. Always read product labels and follow instructions carefully.'
    },
    {
      id: 'contact',
      title: 'Have Questions?',
      icon: DocumentTextIcon,
      content: 'If you have questions about these terms or anything else, reach out to us on WhatsApp at +91 9876543210 or through our contact page. We\'re happy to help!'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
            <p className="text-lg opacity-90 mb-2">Simple guidelines for using AYN Beauty</p>
            <p className="text-sm opacity-75">Last updated: {lastUpdated}</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 bg-pink-50 rounded-lg p-6 md:p-8"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Jump to Section:</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="text-pink-600 hover:text-pink-700 hover:underline font-medium"
                  >
                    • {section.title}
                  </a>
                ))}
              </div>
            </motion.div>

            {/* Terms Sections */}
            <div className="space-y-10">
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="scroll-mt-8"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <section.icon className="h-6 w-6 text-pink-600 flex-shrink-0 mt-1" />
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{section.title}</h2>
                  </div>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg ml-9">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-16 pt-12 border-t-2 border-gray-200"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Have Questions?</h2>
              <p className="text-gray-700 mb-6 leading-relaxed">
                We keep things simple and straightforward. If anything in these terms is unclear or you have questions about how we operate, reach out to us anytime.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-800 font-semibold mb-2">� Contact Us on WhatsApp:</p>
                <p className="text-gray-700">
                  WhatsApp: <span className="font-medium">+91 9876543210</span>
                </p>
                <p className="text-gray-600 text-sm mt-3">
                  We're here to help and want to make sure everything is clear and fair for everyone.
                </p>
              </div>
            </motion.div>

            {/* Final Note */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-12 p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded"
            >
              <p className="text-gray-800 text-sm">
                <span className="font-semibold">📌 Important:</span> These terms are meant to be straightforward and fair. We reserve the right to update them if our services change or if we need to stay compliant with local laws. We'll let you know if anything major changes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}