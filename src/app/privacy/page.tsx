'use client'

import { motion } from 'framer-motion'
import {
  ShieldCheckIcon,
  LockClosedIcon,
  EyeIcon,
  UserIcon,
  CogIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline'

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 15, 2024"

  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: UserIcon,
      content: [
        {
          subtitle: 'Personal Information',
          text: 'We collect information you provide directly to us, such as when you create an account, make a purchase, subscribe to our newsletter, or contact us for support. This may include your name, email address, phone number, shipping address, billing address, and payment information.'
        },
        {
          subtitle: 'Usage Information',
          text: 'We automatically collect certain information about your use of our website and services, including your IP address, browser type, device information, pages visited, time spent on pages, and referring website.'
        },
        {
          subtitle: 'Cookies and Tracking',
          text: 'We use cookies, web beacons, and similar tracking technologies to collect information about your browsing behavior and preferences to improve your experience on our website.'
        }
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: CogIcon,
      content: [
        {
          subtitle: 'Service Provision',
          text: 'We use your information to provide, maintain, and improve our services, process transactions, send order confirmations, and provide customer support.'
        },
        {
          subtitle: 'Communication',
          text: 'We may use your contact information to send you promotional emails, newsletters, and updates about our products and services. You can opt out of these communications at any time.'
        },
        {
          subtitle: 'Personalization',
          text: 'We use information about your preferences and browsing behavior to personalize your experience, recommend products, and display relevant advertisements.'
        },
        {
          subtitle: 'Analytics and Improvement',
          text: 'We analyze usage data to understand how our services are used, identify trends, and improve our website and services.'
        }
      ]
    },
    {
      id: 'information-sharing',
      title: 'How We Share Your Information',
      icon: EyeIcon,
      content: [
        {
          subtitle: 'Service Providers',
          text: 'We may share your information with third-party service providers who help us operate our business, such as payment processors, shipping companies, email service providers, and analytics providers.'
        },
        {
          subtitle: 'Business Transfers',
          text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to applicable privacy laws.'
        },
        {
          subtitle: 'Legal Requirements',
          text: 'We may disclose your information if required by law, court order, or government request, or if we believe disclosure is necessary to protect our rights or the safety of others.'
        },
        {
          subtitle: 'Consent',
          text: 'We will not sell, rent, or share your personal information with third parties for their marketing purposes without your explicit consent.'
        }
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: LockClosedIcon,
      content: [
        {
          subtitle: 'Security Measures',
          text: 'We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
        },
        {
          subtitle: 'Encryption',
          text: 'We use industry-standard encryption to protect sensitive information, such as payment details, during transmission and storage.'
        },
        {
          subtitle: 'Access Controls',
          text: 'Access to personal information is restricted to authorized personnel who need the information to perform their job functions.'
        },
        {
          subtitle: 'Regular Monitoring',
          text: 'We regularly monitor our systems for potential vulnerabilities and conduct security assessments to ensure the ongoing protection of your data.'
        }
      ]
    },
    {
      id: 'your-rights',
      title: 'Your Rights and Choices',
      icon: ShieldCheckIcon,
      content: [
        {
          subtitle: 'Access and Correction',
          text: 'You have the right to access, update, or correct your personal information. You can do this by logging into your account or contacting us directly.'
        },
        {
          subtitle: 'Data Portability',
          text: 'You have the right to request a copy of your personal information in a structured, commonly used, and machine-readable format.'
        },
        {
          subtitle: 'Deletion',
          text: 'You have the right to request deletion of your personal information, subject to certain exceptions such as legal obligations or legitimate business interests.'
        },
        {
          subtitle: 'Opt-Out',
          text: 'You can opt out of receiving promotional communications from us by following the unsubscribe instructions in our emails or contacting us directly.'
        },
        {
          subtitle: 'Cookie Preferences',
          text: 'You can manage your cookie preferences through your browser settings or our cookie preference center.'
        }
      ]
    },
    {
      id: 'data-retention',
      title: 'Data Retention',
      icon: DocumentTextIcon,
      content: [
        {
          subtitle: 'Retention Period',
          text: 'We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.'
        },
        {
          subtitle: 'Account Information',
          text: 'If you close your account, we may retain certain information for legitimate business purposes, such as fraud prevention and legal compliance.'
        },
        {
          subtitle: 'Automated Deletion',
          text: 'We have automated processes in place to delete or anonymize personal information when it is no longer needed for the purposes for which it was collected.'
        }
      ]
    },
    {
      id: 'international-transfers',
      title: 'International Data Transfers',
      icon: ExclamationTriangleIcon,
      content: [
        {
          subtitle: 'Cross-Border Processing',
          text: 'Your information may be processed and stored in countries other than your country of residence, including the United States, where our servers are located.'
        },
        {
          subtitle: 'Adequate Protection',
          text: 'When we transfer your information internationally, we ensure appropriate safeguards are in place to protect your privacy rights, such as standard contractual clauses or adequacy decisions.'
        },
        {
          subtitle: 'EU-US Privacy Framework',
          text: 'We comply with applicable privacy frameworks and regulations governing international data transfers, including the EU-US Privacy Framework for European data subjects.'
        }
      ]
    },
    {
      id: 'children-privacy',
      title: "Children's Privacy",
      icon: UserIcon,
      content: [
        {
          subtitle: 'Age Restrictions',
          text: 'Our services are not intended for children under the age of 13 (or 16 in some jurisdictions). We do not knowingly collect personal information from children under these ages.'
        },
        {
          subtitle: 'Parental Notice',
          text: 'If we become aware that we have collected personal information from a child under the applicable age limit, we will take steps to delete such information and terminate the child\'s account.'
        },
        {
          subtitle: 'Parental Rights',
          text: 'Parents or guardians who believe their child has provided personal information to us can contact us to request access, correction, or deletion of such information.'
        }
      ]
    }
  ]

  const quickActions = [
    {
      title: 'Update Your Information',
      description: 'Access and modify your account details',
      icon: UserIcon,
      action: 'Manage Account'
    },
    {
      title: 'Privacy Settings',
      description: 'Control your privacy preferences',
      icon: CogIcon,
      action: 'Adjust Settings'
    },
    {
      title: 'Download Your Data',
      description: 'Request a copy of your personal information',
      icon: DocumentTextIcon,
      action: 'Request Data'
    },
    {
      title: 'Delete Account',
      description: 'Permanently remove your account and data',
      icon: ExclamationTriangleIcon,
      action: 'Delete Account'
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
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use AYN Beauty's services.
            </p>
            <div className="text-lg opacity-75">
              Last updated: {lastUpdated}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Quick Privacy Actions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Manage your privacy settings and data with these quick actions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <action.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                <button className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors">
                  {action.action} →
                </button>
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
      <section className="py-20 bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <EnvelopeIcon className="h-16 w-16 mx-auto mb-6 text-purple-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Questions About Your Privacy?</h2>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              If you have any questions about this Privacy Policy or how we handle your personal information, 
              please don't hesitate to contact us. We're here to help and ensure your privacy rights are protected.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Privacy Officer</h3>
                <p className="text-gray-600 mb-2">privacy@aynbeauty.com</p>
                <p className="text-gray-600">Response within 24 hours</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Data Protection</h3>
                <p className="text-gray-600 mb-2">dpo@aynbeauty.com</p>
                <p className="text-gray-600">For EU data subjects</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-800 transition-all duration-300">
                Contact Privacy Team
              </button>
              <button className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-purple-600 hover:text-white transition-colors">
                View Cookie Policy
              </button>
            </div>
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
            <h3 className="text-2xl font-bold mb-4">Policy Updates</h3>
            <p className="text-gray-300 leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices, 
              technology, legal requirements, or other factors. We will notify you of any material changes 
              by posting the updated policy on our website and, where required by law, by sending you a 
              notification. Your continued use of our services after such changes indicates your acceptance 
              of the updated policy.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}