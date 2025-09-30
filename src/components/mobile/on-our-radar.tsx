'use client'

import { useState } from 'react'
import Image from 'next/image'

export function MobileOnOurRadar() {
  const [wishlist, setWishlist] = useState<number[]>([])

  const toggleWishlist = (productId: number) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    )
  }

  const products = [
    {
      id: 1,
      name: 'Rare Beauty Soft Pinch Liquid Blush',
      brand: 'Rare Beauty',
      price: 2290,
      originalPrice: 2490,
      rating: 4.8,
      reviews: 1234,
      image: 'https://picsum.photos/300/300?random=21',
      badge: 'Bestseller',
      shades: ['Joy', 'Bliss', 'Hope', 'Grace']
    },
    {
      id: 2,
      name: "FENTY BEAUTY Gloss Bomb Universal Lip Luminizer",
      brand: 'FENTY BEAUTY',
      price: 1990,
      rating: 4.9,
      reviews: 2156,
      image: 'https://picsum.photos/300/300?random=22',
      badge: 'New',
      shades: ['Fu$$y', 'Fenty Glow', 'Sweet Mouth', 'Hot Chocolit']
    },
    {
      id: 3,
      name: 'Charlotte Tilbury Pillow Talk Lipstick',
      brand: 'Charlotte Tilbury',
      price: 3200,
      rating: 4.7,
      reviews: 987,
      image: 'https://picsum.photos/300/300?random=23',
      badge: 'Trending',
      shades: ['Original', 'Medium', 'Intense', 'Big Talk']
    },
    {
      id: 4,
      name: 'Huda Beauty Easy Bake Loose Powder',
      brand: 'Huda Beauty',
      price: 2799,
      originalPrice: 3100,
      rating: 4.6,
      reviews: 756,
      image: 'https://picsum.photos/300/300?random=24',
      badge: 'Sale',
      shades: ['Banana Bread', 'Sugar Cookie', 'Pound Cake', 'Cake Mix']
    }
  ]

  return (
    <section className="px-4 py-6">
      {/* Section Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">On Our Radar</h2>
        <p className="text-gray-600 text-sm">
          Trending products everyone's talking about
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 gap-3">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Product Image */}
            <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-purple-50">
              {/* Placeholder for product image */}
              <div className="w-full h-full bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100"></div>
              
              {/* Badge */}
              {product.badge && (
                <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-medium ${
                  product.badge === 'Bestseller' ? 'bg-green-100 text-green-800' :
                  product.badge === 'New' ? 'bg-blue-100 text-blue-800' :
                  product.badge === 'Trending' ? 'bg-purple-100 text-purple-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {product.badge}
                </div>
              )}

              {/* Wishlist Button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-2 right-2 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors"
              >
                <svg 
                  className={`h-4 w-4 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>

              {/* Quick Add Button */}
              <button className="absolute bottom-2 right-2 bg-primary-600 text-white p-2 rounded-full shadow-md hover:bg-primary-700 transition-colors">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>

            {/* Product Info */}
            <div className="p-3">
              {/* Brand */}
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
                {product.brand}
              </p>

              {/* Product Name */}
              <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2 leading-tight">
                {product.name}
              </h3>

              {/* Rating */}
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`h-3 w-3 ${
                        i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  {product.rating} ({product.reviews})
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <span className="font-bold text-gray-900 text-sm">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <span className="text-xs font-medium text-green-600">
                    {Math.round((1 - product.price / product.originalPrice) * 100)}% off
                  </span>
                )}
              </div>

              {/* Shade Selector */}
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">{product.shades.length} shades</p>
                <div className="flex space-x-1">
                  {product.shades.slice(0, 3).map((shade, index) => (
                    <div
                      key={shade}
                      className="w-4 h-4 rounded-full border border-gray-200 bg-gradient-to-r from-pink-200 to-purple-200"
                      style={{
                        background: `hsl(${index * 60 + 320}, 50%, 70%)`
                      }}
                    />
                  ))}
                  {product.shades.length > 3 && (
                    <div className="w-4 h-4 rounded-full border border-gray-200 bg-gray-100 flex items-center justify-center">
                      <span className="text-xs text-gray-600">+</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="mt-6 text-center">
        <button className="bg-primary-600 text-white px-8 py-3 rounded-full font-medium hover:bg-primary-700 transition-colors">
          View All Trending
        </button>
      </div>
    </section>
  )
}