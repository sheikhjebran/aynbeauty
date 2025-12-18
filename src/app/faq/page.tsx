'use client'

// Force dynamic rendering to avoid digest mismatches
export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  TruckIcon,
  CreditCardIcon,
  UserCircleIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const categories = [
    { id: 'all', label: 'All Questions', icon: QuestionMarkCircleIcon },
    { id: 'orders', label: 'Orders', icon: ShoppingBagIcon },
    { id: 'shipping', label: 'Shipping', icon: TruckIcon },
    { id: 'payment', label: 'Payment', icon: CreditCardIcon },
    { id: 'account', label: 'Account', icon: UserCircleIcon },
    { id: 'products', label: 'Products', icon: HeartIcon },
  ]

  const faqs = [
    {
      id: 1,
      category: 'orders',
      question: 'How do I place an order?',
      answer: 'Placing an order is simple! Browse our products, add items to your cart, and proceed to checkout. You can pay using credit/debit cards, UPI, wallets, or cash on delivery. You\'ll receive an order confirmation email once your order is placed.'
    },
    {
      id: 2,
      category: 'orders',
      question: 'Can I modify or cancel my order?',
      answer: 'You can modify or cancel your order within 1 hour of placing it by contacting our customer support. After this window, we begin processing your order and changes may not be possible. For urgent requests, call our helpline immediately.'
    },
    {
      id: 3,
      category: 'orders',
      question: 'How do I track my order?',
      answer: 'Once your order is shipped, you\'ll receive a tracking link via SMS and email. You can also track your order by logging into your account and visiting the "My Orders" section. Our tracking system provides real-time updates on your shipment\'s location.'
    },
    {
      id: 4,
      category: 'shipping',
      question: 'What are the shipping charges?',
      answer: 'We offer free shipping on orders above ₹499. For orders below this amount, standard shipping costs ₹49. Express delivery is available for ₹99, and same-day delivery costs ₹199 (available in select cities).'
    },
    {
      id: 5,
      category: 'shipping',
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3-5 business days, express delivery takes 1-2 business days, and same-day delivery is completed within 24 hours. Delivery times may vary during festivals and peak seasons. Remote areas may take 5-7 business days.'
    },
    {
      id: 6,
      category: 'shipping',
      question: 'Do you deliver internationally?',
      answer: 'Currently, we only deliver within India. We\'re working on expanding our international shipping soon. You can sign up for our newsletter to be notified when international shipping becomes available.'
    },
    {
      id: 7,
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit and debit cards (Visa, Mastercard, RuPay), UPI payments, digital wallets (Paytm, PhonePe, Google Pay), net banking, and cash on delivery. All online payments are secured with 256-bit SSL encryption.'
    },
    {
      id: 8,
      category: 'payment',
      question: 'Is it safe to pay online?',
      answer: 'Yes, absolutely! We use industry-standard encryption and secure payment gateways. Your payment information is never stored on our servers. All transactions are processed through PCI DSS compliant payment partners.'
    },
    {
      id: 9,
      category: 'payment',
      question: 'When will my payment be charged?',
      answer: 'For prepaid orders, payment is charged immediately upon order confirmation. For cash on delivery, payment is collected when your order is delivered. If you cancel a prepaid order, refunds are processed within 5-7 business days.'
    },
    {
      id: 10,
      category: 'account',
      question: 'How do I create an account?',
      answer: 'Click on "Sign Up" in the top menu, enter your email and create a password. You can also sign up using your Google or Facebook account. Verify your email address to activate your account and start shopping.'
    },
    {
      id: 11,
      category: 'account',
      question: 'I forgot my password. How do I reset it?',
      answer: 'Click on "Forgot Password" on the login page, enter your registered email address, and we\'ll send you a password reset link. Follow the instructions in the email to create a new password. The reset link is valid for 24 hours.'
    },
    {
      id: 12,
      category: 'account',
      question: 'How do I update my account information?',
      answer: 'Log into your account and visit the "Profile" section to update your personal information, shipping addresses, and contact details. Changes are saved automatically. For email changes, you\'ll need to verify the new email address.'
    },
    {
      id: 13,
      category: 'products',
      question: 'How do I know if a product is right for me?',
      answer: 'Each product page includes detailed descriptions, ingredients, and customer reviews. Use our virtual try-on feature for makeup, and check our size guide for shade matching. Our beauty experts are available for personalized consultations via chat.'
    },
    {
      id: 14,
      category: 'products',
      question: 'Are your products authentic?',
      answer: 'Yes, we guarantee 100% authentic products. We source directly from brands and authorized distributors. All products come with authenticity certificates, and we offer a money-back guarantee if you receive any counterfeit items.'
    },
    {
      id: 15,
      category: 'products',
      question: 'Do you offer samples or trial sizes?',
      answer: 'Yes! Many products are available in travel or sample sizes. You can also request samples for certain high-end products. Our Beauty Box subscription includes monthly samples of new and trending products.'
    },
    {
      id: 16,
      category: 'orders',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy on unopened products in original packaging. Used or opened personal care items cannot be returned for hygiene reasons. Defective or damaged items can be returned regardless of condition within 30 days.'
    },
    {
      id: 17,
      category: 'products',
      question: 'How should I store my beauty products?',
      answer: 'Store products in a cool, dry place away from direct sunlight. Keep skincare products sealed and follow expiry dates. Some products may require refrigeration - check individual product instructions. Avoid storing products in bathrooms with high humidity.'
    },
    
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id)
  }

  const popularQuestions = [
    'How do I track my order?',
    'What is your return policy?',
    'Do you offer free shipping?',
    'How do I find my shade?',
    'Are your products authentic?',
    'What payment methods do you accept?'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-8">
              Find quick answers to common questions about orders, shipping, products, and more.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for answers..."
                  className="w-full px-6 py-4 pr-14 text-gray-900 bg-white rounded-full focus:outline-none focus:ring-4 focus:ring-white/30 text-lg"
                />
                <MagnifyingGlassIcon className="absolute right-5 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Questions */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Questions</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {popularQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  onClick={() => setSearchQuery(question)}
                  className="px-4 py-2 bg-gray-100 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 rounded-full text-sm font-medium transition-colors"
                >
                  {question}
                </motion.button>
              ))}
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
                  onClick={() => setActiveCategory(category.id)}
                  className={`flex items-center px-4 py-2 rounded-md font-medium transition-all m-1 ${
                    activeCategory === category.id
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <category.icon className="h-4 w-4 mr-2" />
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No results found</h3>
                <p className="text-gray-600">Try adjusting your search or browse different categories.</p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 * index }}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                      <ChevronDownIcon
                        className={`h-5 w-5 text-gray-500 transform transition-transform ${
                          openFAQ === faq.id ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    
                    <AnimatePresence>
                      {openFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-4 border-t border-gray-100">
                            <p className="text-gray-700 leading-relaxed pt-4">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Still Need Help Section */}
      <section className="py-16 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto mb-6 opacity-90" />
            <h2 className="text-3xl font-bold mb-6">Still Need Help?</h2>
            <p className="text-xl opacity-90 mb-8">
              Can't find what you're looking for? Our support team is here to help you 24/7.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <ChatBubbleLeftRightIcon className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm opacity-90 mb-4">Chat with our experts</p>
                <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Start Chat
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <svg className="h-8 w-8 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                </svg>
                <h3 className="font-semibold mb-2">WhatsApp</h3>
                <p className="text-sm opacity-90 mb-4">+91 7019449136</p>
                <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Chat Now
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
              >
                <svg className="h-8 w-8 mx-auto mb-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm opacity-90 mb-4">support@aynbeauty.com</p>
                <button className="bg-white text-indigo-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Send Email
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Topics */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Help Topics</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive help guides for detailed information on various topics.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Order Management', description: 'Learn how to place, track, and manage your orders', icon: ShoppingBagIcon, link: '/help/orders' },
              { title: 'Shipping & Delivery', description: 'Everything about our delivery options and timelines', icon: TruckIcon, link: '/shipping' },
              { title: 'Returns & Exchanges', description: 'Our return policy and how to initiate returns', icon: 'return', link: '/shipping#returns' },
              { title: 'Payment & Billing', description: 'Payment methods, refunds, and billing information', icon: CreditCardIcon, link: '/help/payment' },
              { title: 'Account & Profile', description: 'Managing your account, preferences, and settings', icon: UserCircleIcon, link: '/help/account' },
              { title: 'Product Information', description: 'Find details about ingredients, usage, and authenticity', icon: HeartIcon, link: '/help/products' },
            ].map((topic, index) => (
              <motion.a
                key={topic.title}
                href={topic.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-50 hover:bg-gray-100 rounded-xl p-6 transition-colors group"
              >
                <topic.icon className="h-10 w-10 text-indigo-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{topic.title}</h3>
                <p className="text-gray-600 text-sm">{topic.description}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
