'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Product {
  id: number
  name: string
  brand: string
  price: number
  comparePrice?: number
  image: string
  rating: number
  reviewCount: number
  isNew?: boolean
  isExclusive?: boolean
  shades?: string[]
}

export function DesktopOnOurRadar() {
  const [products, setProducts] = useState<Product[]>([])

  // Sample products similar to Tira's "On Our Radar" section
  const sampleProducts: Product[] = [
    {
      id: 1,
      name: 'Jelly Wow Hydrating Lip Oil - Berry Involved',
      brand: 'Sheglam',
      price: 499,
      image: 'https://picsum.photos/300/300?random=4',
      rating: 4.5,
      reviewCount: 234,
      shades: ['Berry Involved', 'Pink Dreams', 'Coral Kiss']
    },
    {
      id: 2,
      name: 'Xtraordin-airy Mattereal Mousse Foundation - Classic Ivory',
      brand: 'Lakme',
      price: 499,
      comparePrice: 999,
      image: 'https://picsum.photos/300/300?random=5',
      rating: 4.2,
      reviewCount: 567,
      shades: ['Classic Ivory', 'Golden Beige', 'Warm Honey']
    },
    {
      id: 3,
      name: 'Matte Foundation - 02',
      brand: 'Charmacy Milano',
      price: 1011,
      comparePrice: 1099,
      image: 'https://picsum.photos/300/300?random=6',
      rating: 4.7,
      reviewCount: 189,
      shades: ['02', '03', '04', '05']
    },
    {
      id: 4,
      name: 'Infallible Full Wear Concealer 317',
      brand: "L'Oreal Paris",
      price: 594,
      comparePrice: 849,
      image: 'https://picsum.photos/300/300?random=7',
      rating: 4.4,
      reviewCount: 342,
      isNew: true
    },
    {
      id: 5,
      name: "Soft'Lit Naturally Luminous Foundation - 240",
      brand: 'FENTY BEAUTY',
      price: 4375,
      image: 'https://picsum.photos/300/300?random=8',
      rating: 4.8,
      reviewCount: 756,
      isExclusive: true
    },
    {
      id: 6,
      name: 'Faux Filter Color Corrector - Peach',
      brand: 'Huda Beauty',
      price: 3000,
      image: 'https://picsum.photos/300/300?random=9',
      rating: 4.6,
      reviewCount: 423
    }
  ]

  useEffect(() => {
    setProducts(sampleProducts)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const calculateDiscount = (price: number, comparePrice: number) => {
    return Math.round(((comparePrice - price) / comparePrice) * 100)
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">On Our Radar</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trending products everyone's talking about
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-50">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      NEW
                    </span>
                  )}
                  {product.isExclusive && (
                    <span className="bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      ONLY ON AYNBEAUTY
                    </span>
                  )}
                  {product.comparePrice && (
                    <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                      {calculateDiscount(product.price, product.comparePrice)}% OFF
                    </span>
                  )}
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-200 opacity-0 group-hover:opacity-100">
                  <svg className="h-4 w-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                {/* Quick View */}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="w-full bg-white text-primary-600 font-semibold py-2 px-4 rounded-full hover:bg-primary-50 transition-colors shadow-lg">
                    Quick View
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                {/* Brand */}
                <p className="text-sm text-primary-600 font-medium mb-1">{product.brand}</p>
                
                {/* Product Name */}
                <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 leading-tight">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-1 text-xs text-gray-500">({product.reviewCount})</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(product.price)}
                    </span>
                    {product.comparePrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.comparePrice)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Shades */}
                {product.shades && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-1">Available shades:</p>
                    <div className="flex space-x-1">
                      {product.shades.slice(0, 3).map((shade, index) => (
                        <div
                          key={index}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: `hsl(${index * 60}, 50%, 60%)` }}
                        />
                      ))}
                      {product.shades.length > 3 && (
                        <div className="w-4 h-4 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
                          <span className="text-xs text-gray-600">+{product.shades.length - 3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center px-8 py-3 bg-primary-600 text-white font-semibold rounded-full hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
          >
            View All Products
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
export { DesktopOnOurRadar as OnOurRadar }