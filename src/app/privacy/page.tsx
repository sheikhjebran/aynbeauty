'use client'

import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  LockClosedIcon,
  UserIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function PrivacyPolicyPage() {
  const lastUpdated = "November 10, 2024"

  const sections = [
    {
      id: 'overview',
      title: 'What This Policy Says',
      icon: DocumentTextIcon,
      content: `We take your privacy seriously. This simple page explains what information we collect, how we use it, and how we keep it safe. We don't sell your data to anyone. We only use it to serve you better.`
    },
    {
      id: 'what-we-collect',
      title: 'What Information We Collect',
      icon: UserIcon,
      content: 'When you use AYN Beauty, we collect:\n\n• Your name, email, and phone number\n• Your shipping and billing address\n• Payment information (processed securely)\n• What products you browse and buy\n• How you use our website (using cookies)\n\nWe only collect information you provide or that helps us serve you better.'
    },
    {
      id: 'why-we-collect',
      title: 'Why We Collect Your Information',
      icon: ShieldCheckIcon,
      content: 'We use your information to:\n\n• Process your orders\n• Send order updates and confirmations\n• Improve our products and website\n• Send you offers and updates (you can opt out)\n• Prevent fraud and keep your account safe\n• Answer your questions when you contact us'
    },
    {
      id: 'how-we-protect',
      title: 'How We Protect Your Information',
      icon: LockClosedIcon,
      content: 'Your security matters to us:\n\n• We use encryption for payment information\n• Only authorized staff can access your data\n• We have security measures in place to prevent hacking\n• Payment processing is handled by trusted third parties\n• We regularly check our systems for vulnerabilities\n\nNo online system is 100% safe, but we do our best to protect you.'
    },
    {
      id: 'who-we-share',
      title: 'Who We Share Your Information With',
      icon: UserIcon,
      content: 'We only share your information when necessary:\n\n• Payment processors (to process your payments)\n• Shipping companies (to deliver your orders)\n• Email service (to send you order updates)\n• Only if required by law\n\nWe do NOT sell your data to anyone. We do NOT share your information with other companies for marketing.'
    },
    {
      id: 'your-choices',
      title: 'Your Choices',
      icon: UserIcon,
      content: 'You have control:\n\n• You can update your account information anytime\n• You can opt out of promotional emails (unsubscribe link in every email)\n• You can request to see what data we have about you\n• You can ask us to delete your account\n• You can control cookies through your browser settings'
    },
    {
      id: 'cookies',
      title: 'Cookies & Tracking',
      icon: ExclamationTriangleIcon,
      content: `We use cookies to remember you and improve your experience. Cookies are small files stored on your device. They help us:\n\n• Remember your login so you don't have to sign in every time\n• See what you're interested in\n• Show you relevant products\n\nYou can turn off cookies in your browser if you prefer, but some features might not work properly.`
    },
    {
      id: 'age',
      title: 'Age Requirements',
      icon: UserIcon,
      content: `You must be at least 18 years old to use AYN Beauty. If you're under 18, get a parent or guardian's permission first. If we find out a child under 18 created an account, we'll delete it immediately.`
    },
    {
      id: 'contact',
      title: 'Questions or Concerns?',
      icon: DocumentTextIcon,
      content: `If you have any questions about your privacy or how we handle your information:\n\n� WhatsApp: +917019449136\n\nWe'll respond to your questions promptly and help resolve any concerns.`
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <ShieldCheckIcon className="h-20 w-20 mx-auto mb-6 text-purple-300" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Privacy Policy</h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-8">
              Your privacy is important to us. We keep things simple and straightforward.
            </p>
            <div className="text-lg opacity-75">
              Last updated: {lastUpdated}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Contents</h2>
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sections.map((section, index) => (
                  <motion.a
                    key={section.id}
                    href={`#${section.id}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    className="flex items-center gap-3 p-4 rounded-lg hover:bg-white transition-colors group"
                  >
                    <section.icon className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-700 group-hover:text-purple-600 transition-colors">
                      {section.title}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-16">
            {sections.map((section, sectionIndex) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * sectionIndex }}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <div className="bg-gray-50 rounded-xl p-8">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                    {section.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <ShieldCheckIcon className="h-16 w-16 mx-auto mb-6 text-purple-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Have Questions?</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              If you have any questions about our privacy practices, feel free to reach out to us.
            </p>
            
            <div className="bg-white rounded-xl p-8 shadow-lg mb-8">
              <p className="text-lg text-gray-700 mb-2">
                <span className="font-semibold">💬 WhatsApp:</span> +917019449136
              </p>
              <p className="text-gray-600">We're available to help you anytime</p>
            </div>
            
            <button className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-800 transition-all duration-300">
              Contact Us
            </button>
          </motion.div>
        </div>
      </section>

      {/* Updates Notice */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-2xl font-bold mb-4">We May Update This Policy</h3>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time. When we make important changes, 
              we'll let you know by updating the date at the top and posting the new version here. 
              Your use of our services means you agree to these updates.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

