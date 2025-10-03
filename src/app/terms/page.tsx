'use client'

import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  ScaleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  UserIcon,
  CreditCardIcon,
  TruckIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'

export default function TermsOfServicePage() {
  const lastUpdated = "January 15, 2024"

  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: DocumentTextIcon,
      content: [
        {
          subtitle: 'Agreement to Terms',
          text: 'By accessing or using AYN Beauty\'s website, mobile application, or services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.'
        },
        {
          subtitle: 'Capacity to Contract',
          text: 'You must be at least 18 years old or the age of majority in your jurisdiction to use our services. If you are under 18, you may only use our services with the involvement and consent of a parent or guardian.'
        },
        {
          subtitle: 'Modifications',
          text: 'We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services after changes are posted constitutes acceptance of the modified terms.'
        }
      ]
    },
    {
      id: 'account-registration',
      title: 'Account Registration',
      icon: UserIcon,
      content: [
        {
          subtitle: 'Account Creation',
          text: 'To access certain features of our services, you may be required to create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.'
        },
        {
          subtitle: 'Account Security',
          text: 'You are responsible for safeguarding the password and all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account or any other breach of security.'
        },
        {
          subtitle: 'Account Termination',
          text: 'We may terminate or suspend your account at any time for any reason, including violation of these terms. You may also delete your account at any time through your account settings or by contacting customer support.'
        }
      ]
    },
    {
      id: 'products-services',
      title: 'Products and Services',
      icon: TruckIcon,
      content: [
        {
          subtitle: 'Product Information',
          text: 'We strive to provide accurate descriptions, images, and pricing for all products. However, we do not warrant that product descriptions, images, or other content is accurate, complete, reliable, current, or error-free.'
        },
        {
          subtitle: 'Availability',
          text: 'All products are subject to availability. We reserve the right to discontinue any product at any time without notice. Prices and availability are subject to change without notice.'
        },
        {
          subtitle: 'Age Restrictions',
          text: 'Some products may have age restrictions. You represent that you meet any age requirements for the products you purchase and that you will not provide age-restricted products to minors.'
        }
      ]
    },
    {
      id: 'ordering-payment',
      title: 'Ordering and Payment',
      icon: CreditCardIcon,
      content: [
        {
          subtitle: 'Order Acceptance',
          text: 'Your order is an offer to buy a product. All orders are subject to acceptance by us, and we may refuse or cancel any order for any reason, including suspected fraud, errors in product information, or unavailability.'
        },
        {
          subtitle: 'Payment Terms',
          text: 'Payment is due immediately upon order placement. We accept various forms of payment as indicated on our website. You authorize us to charge your selected payment method for the total amount of your order, including applicable taxes and shipping costs.'
        },
        {
          subtitle: 'Pricing Errors',
          text: 'In the event of a pricing error, we reserve the right to correct the price and cancel orders placed at the incorrect price, even if payment has been processed.'
        },
        {
          subtitle: 'Taxes',
          text: 'You are responsible for all applicable taxes related to your purchase. Tax amounts will be calculated and displayed during checkout based on your billing and shipping addresses.'
        }
      ]
    },
    {
      id: 'shipping-delivery',
      title: 'Shipping and Delivery',
      icon: TruckIcon,
      content: [
        {
          subtitle: 'Shipping Methods',
          text: 'We offer various shipping options as displayed during checkout. Shipping times are estimates and may vary based on product availability, shipping method, and destination.'
        },
        {
          subtitle: 'Risk of Loss',
          text: 'Risk of loss and title for products purchased from us pass to you upon delivery to the shipping carrier. We are not responsible for delays, damage, or loss that occurs during shipping.'
        },
        {
          subtitle: 'International Shipping',
          text: 'For international orders, customers are responsible for all customs duties, taxes, and fees. Delivery times for international orders may vary significantly due to customs processing.'
        },
        {
          subtitle: 'Delivery Issues',
          text: 'If you experience delivery issues, please contact us immediately. We will work with our shipping partners to resolve delivery problems, but we cannot guarantee resolution of issues beyond our control.'
        }
      ]
    },
    {
      id: 'returns-refunds',
      title: 'Returns and Refunds',
      icon: ScaleIcon,
      content: [
        {
          subtitle: 'Return Policy',
          text: 'Most products may be returned within 30 days of delivery in original, unopened condition. Some products, including personalized items and certain beauty products, may not be eligible for return due to health and safety regulations.'
        },
        {
          subtitle: 'Return Process',
          text: 'To initiate a return, contact our customer service team for a return authorization. Products must be returned in original packaging with all accessories and documentation.'
        },
        {
          subtitle: 'Refund Processing',
          text: 'Refunds will be processed to the original payment method within 5-10 business days after we receive and inspect the returned items. Original shipping costs are non-refundable unless the return is due to our error.'
        },
        {
          subtitle: 'Damaged or Defective Items',
          text: 'If you receive damaged or defective products, contact us immediately. We will provide a prepaid return label and full refund or replacement at no cost to you.'
        }
      ]
    },
    {
      id: 'prohibited-uses',
      title: 'Prohibited Uses',
      icon: ExclamationTriangleIcon,
      content: [
        {
          subtitle: 'Unlawful Activities',
          text: 'You may not use our services for any unlawful purposes or to solicit others to perform unlawful acts. You agree to comply with all applicable laws and regulations when using our services.'
        },
        {
          subtitle: 'Intellectual Property',
          text: 'You may not reproduce, duplicate, copy, sell, resell, or exploit any portion of our services without our express written permission. Our trademarks, logos, and content are protected by intellectual property laws.'
        },
        {
          subtitle: 'System Integrity',
          text: 'You may not attempt to interfere with, compromise the security of, or decipher any transmissions to or from our servers. This includes introducing viruses, worms, or other malicious code.'
        },
        {
          subtitle: 'False Information',
          text: 'You may not provide false, inaccurate, or misleading information when creating an account or making purchases. This includes using false identities or payment information.'
        }
      ]
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers and Limitations',
      icon: ShieldCheckIcon,
      content: [
        {
          subtitle: 'Service Availability',
          text: 'We do not guarantee that our services will be available at all times or that they will be uninterrupted, secure, or error-free. We may suspend or discontinue services for maintenance or other reasons.'
        },
        {
          subtitle: 'Product Disclaimers',
          text: 'Beauty products may cause allergic reactions or skin sensitivities. We recommend patch testing before use and consulting with healthcare professionals if you have concerns about product compatibility.'
        },
        {
          subtitle: 'Limitation of Liability',
          text: 'Our liability for any damages arising from your use of our services is limited to the amount you paid for the specific product or service that gave rise to the claim, and shall not exceed $100 in any event.'
        },
        {
          subtitle: 'Third-Party Content',
          text: 'Our website may contain links to third-party websites or content. We are not responsible for the accuracy, content, or privacy practices of these third-party sites.'
        }
      ]
    },
    {
      id: 'dispute-resolution',
      title: 'Dispute Resolution',
      icon: ChatBubbleLeftRightIcon,
      content: [
        {
          subtitle: 'Governing Law',
          text: 'These terms are governed by and construed in accordance with the laws of [State/Country], without regard to conflict of law principles.'
        },
        {
          subtitle: 'Dispute Resolution Process',
          text: 'Most disputes can be resolved through our customer service team. We encourage you to contact us first to resolve any issues before pursuing legal action.'
        },
        {
          subtitle: 'Arbitration',
          text: 'Any disputes that cannot be resolved through customer service may be subject to binding arbitration in accordance with the rules of [Arbitration Organization], unless prohibited by applicable law.'
        },
        {
          subtitle: 'Class Action Waiver',
          text: 'You agree that any arbitration or legal proceeding shall be limited to the dispute between you and AYN Beauty individually. You waive any right to participate in class action lawsuits or class-wide arbitration.'
        }
      ]
    }
  ]

  const keyHighlights = [
    {
      title: 'Account Responsibility',
      description: 'You are responsible for maintaining account security and all activities under your account.',
      icon: UserIcon
    },
    {
      title: 'Return Window',
      description: '30-day return policy for most products in original, unopened condition.',
      icon: ScaleIcon
    },
    {
      title: 'Payment Processing',
      description: 'Payment is due immediately upon order placement. We reserve the right to cancel orders.',
      icon: CreditCardIcon
    },
    {
      title: 'Service Changes',
      description: 'We may modify these terms at any time. Continued use indicates acceptance.',
      icon: DocumentTextIcon
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <ScaleIcon className="h-20 w-20 mx-auto mb-6 text-indigo-300" />
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Terms of Service</h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-8">
              These terms govern your use of AYN Beauty's services. Please read them carefully as they contain important information about your rights and obligations.
            </p>
            <div className="text-lg opacity-75">
              Last updated: {lastUpdated}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Key Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Terms at a Glance</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Here are the most important points from our terms of service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyHighlights.map((highlight, index) => (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <highlight.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{highlight.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Table of Contents</h2>
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
                    <section.icon className="h-5 w-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                    <span className="text-gray-700 group-hover:text-indigo-600 transition-colors">
                      {section.title}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
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
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{section.title}</h2>
                </div>

                <div className="space-y-8">
                  {section.content.map((item, itemIndex) => (
                    <motion.div
                      key={itemIndex}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.1 * itemIndex }}
                      className="bg-gray-50 rounded-xl p-6"
                    >
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{item.subtitle}</h3>
                      <p className="text-gray-700 leading-relaxed">{item.text}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <ChatBubbleLeftRightIcon className="h-16 w-16 mx-auto mb-6 text-indigo-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Questions About These Terms?</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              If you have any questions about these Terms of Service or need clarification on any provisions, 
              our legal and customer service teams are here to help.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Legal Inquiries</h3>
                <p className="text-gray-600 mb-2">legal@aynbeauty.com</p>
                <p className="text-gray-600">For terms and legal questions</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Customer Support</h3>
                <p className="text-gray-600 mb-2">support@aynbeauty.com</p>
                <p className="text-gray-600">For account and order questions</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-3 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-800 transition-all duration-300">
                Contact Legal Team
              </button>
              <button className="border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-indigo-600 hover:text-white transition-colors">
                View Privacy Policy
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Effective Date Notice */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <ExclamationTriangleIcon className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
            <h3 className="text-2xl font-bold mb-4">Terms Updates</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              These Terms of Service are effective as of {lastUpdated}. We may update these terms 
              from time to time to reflect changes in our services, legal requirements, or business practices. 
              We will notify you of any material changes by posting the updated terms on our website and, 
              where required, by sending you a notification.
            </p>
            <p className="text-gray-400 text-sm">
              Your continued use of our services after any changes indicates your acceptance of the updated terms.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}