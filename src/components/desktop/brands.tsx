'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Brand {
  id: number
  name: string
  slug: string
  logo: string
  description: string
  productCount: number
  isFeatured: boolean
}

export function DesktopBrands() {
  const brands: Brand[] = [
    {
      id: 1,
      name: "L'Oreal Paris",
      slug: 'loreal-paris',
      logo: 'https://picsum.photos/200/100?random=10',
      description: 'Because you\'re worth it',
      productCount: 234,
      isFeatured: true
    },
    {
      id: 2,
      name: 'Maybelline New York',
      slug: 'maybelline-new-york',
      logo: 'https://picsum.photos/200/100?random=11',
      description: 'Make it happen',
      productCount: 189,
      isFeatured: true
    },
    {
      id: 3,
      name: 'FENTY BEAUTY',
      slug: 'fenty-beauty',
      logo: 'https://picsum.photos/200/100?random=12',
      description: 'Beauty for all',
      productCount: 156,
      isFeatured: true
    },
    {
      id: 4,
      name: 'Huda Beauty',
      slug: 'huda-beauty',
      logo: 'https://picsum.photos/200/100?random=13',
      description: 'Makeup by Huda Kattan',
      productCount: 143,
      isFeatured: true
    },
    {
      id: 5,
      name: 'MAC',
      slug: 'mac',
      logo: 'https://picsum.photos/200/100?random=14',
      description: 'All ages, all races, all genders',
      productCount: 267,
      isFeatured: true
    },
    {
      id: 6,
      name: 'COSRX',
      slug: 'cosrx',
      logo: 'https://picsum.photos/200/100?random=15',
      description: 'Cosmetics + RX',
      productCount: 98,
      isFeatured: true
    },
    {
      id: 7,
      name: 'Minimalist',
      slug: 'minimalist',
      logo: 'https://picsum.photos/200/100?random=16',
      description: 'Skincare made simple',
      productCount: 76,
      isFeatured: true
    },
    {
      id: 8,
      name: 'Lakme',
      slug: 'lakme',
      logo: 'https://picsum.photos/200/100?random=17',
      description: 'Express the real you',
      productCount: 201,
      isFeatured: true
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Brands</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Shop from your favorite beauty brands
          </p>
        </div>

        {/* Brands Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="group"
            >
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 hover:border-primary-200">
                {/* Brand Logo */}
                <div className="aspect-[2/1] relative mb-4 bg-gray-50 rounded-xl overflow-hidden">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                  />
                </div>

                {/* Brand Info */}
                <div className="text-center">
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {brand.description}
                  </p>
                  <p className="text-xs text-primary-600 font-medium">
                    {brand.productCount} products
                  </p>
                </div>

                {/* Hover Effect */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-semibold text-center">
                    Shop Brand
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Brands */}
        <div className="text-center mt-12">
          <Link
            href="/brands"
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View All Brands
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
export { DesktopBrands as Brands }