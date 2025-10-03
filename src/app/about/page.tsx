'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  HeartIcon,
  SparklesIcon,
  GlobeAltIcon,
  UserGroupIcon,
  TrophyIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  StarIcon,
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  const stats = [
    { number: '1M+', label: 'Happy Customers', icon: HeartIcon },
    { number: '500+', label: 'Brand Partners', icon: GlobeAltIcon },
    { number: '50K+', label: 'Products', icon: SparklesIcon },
    { number: '100+', label: 'Cities Served', icon: UserGroupIcon },
  ]

  const values = [
    {
      icon: HeartIcon,
      title: 'Authenticity',
      description: 'We believe in genuine beauty that comes from within. Every product we offer is 100% authentic and sourced directly from trusted brands.',
      color: 'pink'
    },
    {
      icon: SparklesIcon,
      title: 'Innovation',
      description: 'Staying ahead of beauty trends, we continuously introduce cutting-edge products and technologies to enhance your beauty journey.',
      color: 'purple'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality',
      description: 'Quality is non-negotiable. We carefully curate every product to ensure it meets our high standards and your expectations.',
      color: 'blue'
    },
    {
      icon: UserGroupIcon,
      title: 'Inclusivity',
      description: 'Beauty is for everyone. We celebrate diversity and offer products for all skin tones, types, and beauty preferences.',
      color: 'green'
    }
  ]

  const team = [
    {
      name: 'Priya Sharma',
      role: 'Founder & CEO',
      image: '/images/team/priya.jpg',
      bio: 'Former beauty industry executive with 15+ years of experience. Passionate about making quality beauty accessible to all.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Rahul Patel',
      role: 'Chief Technology Officer',
      image: '/images/team/rahul.jpg',
      bio: 'Tech innovator focused on creating seamless digital beauty experiences. Previously at leading e-commerce companies.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Anjali Gupta',
      role: 'Head of Product Curation',
      image: '/images/team/anjali.jpg',
      bio: 'Beauty expert and makeup artist with a keen eye for trends. Ensures every product meets our quality standards.',
      social: { linkedin: '#', instagram: '#' }
    },
    {
      name: 'Vikram Singh',
      role: 'VP of Customer Experience',
      image: '/images/team/vikram.jpg',
      bio: 'Customer service champion dedicated to creating exceptional experiences for every AYN Beauty customer.',
      social: { linkedin: '#', twitter: '#' }
    }
  ]

  const milestones = [
    {
      year: '2020',
      title: 'The Beginning',
      description: 'AYN Beauty was founded with a vision to democratize beauty in India',
      icon: LightBulbIcon
    },
    {
      year: '2021',
      title: 'First 100K Customers',
      description: 'Reached our first major milestone with 100,000 happy customers',
      icon: UserGroupIcon
    },
    {
      year: '2022',
      title: 'National Expansion',
      description: 'Expanded to serve customers across all major Indian cities',
      icon: GlobeAltIcon
    },
    {
      year: '2023',
      title: 'Brand Partnerships',
      description: 'Partnered with 500+ premium beauty brands worldwide',
      icon: HeartIcon
    },
    {
      year: '2024',
      title: 'Beauty Tech Innovation',
      description: 'Launched AR try-on and AI-powered beauty recommendations',
      icon: SparklesIcon
    },
    {
      year: '2025',
      title: 'Million Customers',
      description: 'Celebrating 1 million+ customers and counting',
      icon: TrophyIcon
    }
  ]

  const awards = [
    {
      title: 'Best E-commerce Platform 2024',
      organization: 'Indian Beauty Awards',
      year: '2024'
    },
    {
      title: 'Startup of the Year',
      organization: 'Tech Excellence Awards',
      year: '2023'
    },
    {
      title: 'Customer Choice Award',
      organization: 'Digital Commerce Summit',
      year: '2023'
    }
  ]

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
              Beauty for
              <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Every You
              </span>
            </h1>
            <p className="text-xl md:text-2xl opacity-90 leading-relaxed mb-8">
              At AYN Beauty, we believe that beauty is not one-size-fits-all. It's personal, it's diverse, and it's uniquely yours. 
              Our mission is to celebrate every shade, every style, and every story.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Our Story
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-pink-600 transition-colors">
                Meet the Team
              </button>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-yellow-300/20 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-300/20 rounded-full blur-lg"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
                <p>
                  AYN Beauty was born from a simple yet powerful idea: beauty should be accessible, authentic, and celebrating individuality. 
                  In 2020, our founder Priya Sharma noticed a gap in the Indian beauty market - limited access to diverse, high-quality products 
                  that catered to the unique needs of Indian consumers.
                </p>
                <p>
                  Starting from a small office in Mumbai with just five team members, we set out to revolutionize how India shops for beauty. 
                  We partnered directly with brands, ensuring authenticity and competitive pricing. Our focus wasn't just on selling products; 
                  it was about building a community where everyone could find their perfect match.
                </p>
                <p>
                  Today, AYN Beauty serves over a million customers across India, offering 50,000+ products from 500+ brands. 
                  But our mission remains the same: to make every person feel beautiful, confident, and empowered in their own unique way.
                </p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-w-4 aspect-h-5 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl overflow-hidden">
                <Image
                  src="/images/about/our-story.jpg"
                  alt="Our Story"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-yellow-400 rounded-full blur-xl opacity-60"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-pink-400 rounded-full blur-xl opacity-40"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These core principles guide everything we do, from product selection to customer service.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`w-16 h-16 bg-gradient-to-br from-${value.color}-400 to-${value.color}-600 rounded-2xl flex items-center justify-center mb-6`}>
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                <p className="text-gray-700 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From a small startup to India's leading beauty destination - here's how we grew.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-pink-500 to-purple-600 h-full hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-8' : 'md:text-left md:pl-8'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-2xl font-bold text-pink-600 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                      <p className="text-gray-700">{milestone.description}</p>
                    </div>
                  </div>
                  
                  {/* Timeline Node */}
                  <div className="relative flex-shrink-0 w-16 h-16 hidden md:flex">
                    <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <milestone.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind AYN Beauty who work tirelessly to bring you the best beauty experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group"
              >
                <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-pink-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">{member.bio}</p>
                  <div className="flex space-x-3">
                    {Object.entries(member.social).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-pink-100 transition-colors"
                      >
                        <span className="text-xs font-medium text-gray-600">{platform[0].toUpperCase()}</span>
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Recognition & Awards</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're honored to be recognized by industry leaders for our commitment to excellence.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {awards.map((award, index) => (
              <motion.div
                key={award.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 text-center"
              >
                <TrophyIcon className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{award.title}</h3>
                <p className="text-gray-700 mb-2">{award.organization}</p>
                <p className="text-yellow-600 font-semibold">{award.year}</p>
              </motion.div>
            ))}
          </div>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Join Our Beauty Community</h2>
            <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
              Become part of the AYN Beauty family and discover products that celebrate your unique beauty. 
              Follow us on social media for beauty tips, tutorials, and exclusive offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-pink-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                Shop Now
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-pink-600 transition-colors">
                Follow Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}