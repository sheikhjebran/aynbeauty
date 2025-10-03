'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Category {
  id: number
  name: string
  slug: string
  image: string
  productCount: number
}

export function DesktopCategories() {
  const categories: Category[] = [
    {
      id: 1,
      name: 'SkinCare',
      slug: 'skincare',
      image: 'https://picsum.photos/300/300?random=1',
      productCount: 856
    },
    {
      id: 2,
      name: 'Lips',
      slug: 'lips',
      image: 'https://picsum.photos/300/300?random=2',
      productCount: 324
    },
    {
      id: 3,
      name: 'Bath & Body',
      slug: 'bath-body',
      image: 'https://picsum.photos/300/300?random=3',
      productCount: 567
    },
    {
      id: 4,
      name: 'Fragrances',
      slug: 'fragrances',
      image: 'https://picsum.photos/300/300?random=4',
      productCount: 389
    },
    {
      id: 5,
      name: 'Eyes',
      slug: 'eyes',
      image: 'https://picsum.photos/300/300?random=5',
      productCount: 298
    },
    {
      id: 6,
      name: 'Nails',
      slug: 'nails',
      image: 'https://picsum.photos/300/300?random=6',
      productCount: 156
    },
    {
      id: 7,
      name: 'Combo Sets',
      slug: 'combo-sets',
      image: 'https://picsum.photos/300/300?random=7',
      productCount: 89
    }
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Top Categories</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find what you're looking for in our curated categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="group"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Category Image */}
                <div className="relative h-full">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-bold text-lg mb-1 text-center">{category.name}</h3>
                    <p className="text-sm text-white/80 text-center">
                      {category.productCount} products
                    </p>
                  </div>
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="bg-white/90 text-primary-600 px-6 py-2 rounded-full font-semibold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    Shop Now
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Categories */}
        <div className="text-center mt-12">
          <Link
            href="/categories"
            className="inline-flex items-center px-8 py-3 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl border border-primary-200"
          >
            View All Categories
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

// Export alias for convenience
export { DesktopCategories as Categories }