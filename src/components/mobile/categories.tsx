'use client'

import Link from 'next/link'

export function MobileCategories() {
  const categories = [
    {
      id: 1,
      name: 'SkinCare',
      href: '/categories/skincare',
      icon: '✨',
      color: 'from-blue-400 to-cyan-500',
      description: 'Cleanse, Treat, Moisturize'
    },
    {
      id: 2,
      name: 'Lips',
      href: '/categories/lips',
      icon: '💄',
      color: 'from-red-400 to-pink-500',
      description: 'Lipstick, Gloss, Balm'
    },
    {
      id: 3,
      name: 'Eyes',
      href: '/categories/eyes',
      icon: '👁️',
      color: 'from-purple-400 to-indigo-500',
      description: 'Mascara, Shadow, Liner'
    },
    {
      id: 4,
      name: 'Bath & Body',
      href: '/categories/bath-body',
      icon: '🛁',
      color: 'from-teal-400 to-emerald-500',
      description: 'Body Care, Shower'
    },
    {
      id: 5,
      name: 'Fragrances',
      href: '/categories/fragrances',
      icon: '🌺',
      color: 'from-amber-400 to-orange-500',
      description: 'Perfumes, Body Sprays'
    },
    {
      id: 6,
      name: 'Nails',
      href: '/categories/nails',
      icon: '💅',
      color: 'from-violet-400 to-purple-500',
      description: 'Polish, Care, Art'
    },
    {
      id: 7,
      name: 'Combo Sets',
      href: '/categories/combo-sets',
      icon: '🎁',
      color: 'from-green-400 to-emerald-500',
      description: 'Gift Sets, Bundles'
    }
  ]

  return (
    <section className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Shop by Category</h2>
        <p className="text-gray-600 text-sm">
          Discover products tailored to your needs
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={category.href}
            className="group block"
          >
            <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group-hover:scale-105">
              <div className={'absolute inset-0 bg-gradient-to-br ' + category.color + ' opacity-10 group-hover:opacity-20 transition-opacity'}></div>
              
              <div className="relative p-6 text-center">
                <div className="text-4xl mb-3">
                  {category.icon}
                </div>
                
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-xs text-gray-500">
                  {category.description}
                </p>
              </div>

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

      <div className="mt-8">
        <h3 className="font-semibold text-gray-900 mb-4">Popular Right Now</h3>
        <div className="flex flex-wrap gap-2">
          {['Foundation', 'Lipstick', 'Moisturizer', 'Mascara', 'Sunscreen', 'Perfume'].map((item) => (
            <span
              key={item}
              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors cursor-pointer"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
