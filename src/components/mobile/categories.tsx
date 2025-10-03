'use client'

import Link from 'next/link'

export function MobileCategories() {
  const categories = [
    {
      id: 1,
      name: 'All Products',
      href: '/categories/all-products',
      icon: '�️',
      color: 'from-pink-400 to-rose-500',
      description: 'Everything Beauty'
    },
    {
      id: 2,
      name: 'SkinCare',
      href: '/categories/skincare',
      icon: '✨',
      color: 'from-blue-400 to-cyan-500',
      description: 'Cleanse, Treat, Moisturize'
    },
    {
      id: 3,
      name: 'Lips',
      href: '/categories/lips',
      icon: '💄',
      color: 'from-red-400 to-pink-500',
      description: 'Lipstick, Gloss, Balm'
    },
    {
      id: 4,
      name: 'Eyes',
      href: '/categories/eyes',
      icon: '👁️',
      color: 'from-purple-400 to-indigo-500',
      description: 'Mascara, Shadow, Liner'
    },
    {
      id: 5,
      name: 'Bath & Body',
      href: '/categories/bath-body',
      icon: '🛁',
      color: 'from-teal-400 to-emerald-500',
      description: 'Body Care, Shower'
    },
    {
      id: 6,
      name: 'Fragrances',
      href: '/categories/fragrances',
      icon: '🌺',
      color: 'from-amber-400 to-orange-500',
      description: 'Perfumes, Body Sprays'
    },
    {
      id: 7,
      name: 'Nails',
      href: '/categories/nails',
      icon: '�',
      color: 'from-violet-400 to-purple-500',
      description: 'Polish, Care, Art'
    },
    {
      id: 8,
      name: 'Combo Sets',
      href: '/categories/combo-sets',
      icon: '🎁',
      color: 'from-green-400 to-emerald-500',
      description: 'Gift Sets, Bundles'
    }
  ]

  return (
    <section className="px-4 py-6">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop by Category</h2>
        <p className="text-gray-600 text-sm">
          Discover products tailored to your needs
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group-hover:scale-105">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
              
              {/* Content */}
              <div className="relative p-6 text-center">
                {/* Icon */}
                <div className="text-4xl mb-3">
                  {category.icon}
                </div>
                
                {/* Category Name */}
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                
                {/* Description */}
                <p className="text-xs text-gray-500">
                  {category.description}
                </p>
              </div>

              {/* Hover Arrow */}
              <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center">
                  <svg className="h-3 w-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Popular Subcategories */}
      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Popular Right Now</h3>
        <div className="flex flex-wrap gap-2">
          {[
            'Foundation',
            'Lipstick',
            'Mascara',
            'Moisturizer',
            'Sunscreen',
            'Serum',
            'Blush',
            'Eyeliner'
          ].map((item) => (
            <Link
              key={item}
              href={`/search?q=${item.toLowerCase()}`}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-primary-100 hover:text-primary-700 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}