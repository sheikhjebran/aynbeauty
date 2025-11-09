'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Product {
  id: number
  name: string
  description: string
  price: number | string
  discounted_price?: number | string
  image_url?: string
  primary_image?: string
  category_name: string
  brand_name?: string
  brand?: string
  avg_rating?: number | string
  rating?: number | string
  review_count?: number
  rating_count?: number
  is_trending?: number
  is_must_have?: number
  is_new_arrival?: number
}

export default function CategoryPage() {
  const params = useParams()
  const categorySlug = params.category as string
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const categoryNames: { [key: string]: string } = {
    'skincare': 'Skincare',
    'lips': 'Lips',
    'bath-and-body': 'Bath and Body',  // Updated to match database
    'fragrance': 'Fragrances',
    'eyes': 'Eyes',
    'nails': 'Nails',
    'combo-sets': 'Combo Sets'
  }

  const categoryName = categoryNames[categorySlug] || 'Products'
  
  // Normalize category slug for API calls - no need to change anything since we should match database slugs
  const normalizeCategory = (slug: string): string => {
    // The URL slug should match database slug exactly
    return slug
  }

  useEffect(() => {
    fetchProducts()
  }, [categorySlug])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const normalizedCategory = normalizeCategory(categorySlug)
      console.log(`Fetching products for category: ${categorySlug} -> ${normalizedCategory}`)
      const response = await fetch(`/api/products?category=${normalizedCategory}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      console.log(`Received ${data.products?.length || 0} products for category ${normalizedCategory}`)
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow p-4">
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-pink-600">
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">{categoryName}</span>
              </div>
            </li>
          </ol>
        </nav>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{categoryName}</h1>
          <p className="mt-2 text-lg text-gray-600">
            Discover our collection of {categoryName.toLowerCase()} products
          </p>
        </div>

        {/* Products Grid */}
        {error ? (
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.76 0L3.054 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-4 4-4-4m-6 4l4 4 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Coming Soon!</h3>
            <p className="text-gray-600 mb-4">
              We're working hard to bring you amazing {categoryName.toLowerCase()} products.
            </p>
            <p className="text-sm text-gray-500">
              Check back soon or explore our other categories in the meantime.
            </p>
            <div className="mt-6">
              <Link 
                href="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200">
                    {(product.primary_image || product.image_url) ? (
                      <img
                        src={product.primary_image || product.image_url}
                        alt={product.name}
                        className="h-48 w-full object-cover object-center group-hover:opacity-75"
                      />
                    ) : (
                      <div className="h-48 w-full flex items-center justify-center bg-gray-100">
                        <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                  <h3 className="text-sm font-medium text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  {/* Brand */}
                  {(product.brand_name || product.brand) && (
                    <p className="text-xs text-gray-500 mb-2">{product.brand_name || product.brand}</p>
                  )}
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.is_trending === 1 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                        🔥 Trending
                      </span>
                    )}
                    {product.is_must_have === 1 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        ⭐ Must Have
                      </span>
                    )}
                    {product.is_new_arrival === 1 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        ✨ New
                      </span>
                    )}
                  </div>

                  {/* Price Display */}
                  <div className="flex items-center space-x-2 mb-3">
                    {(() => {
                      const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price
                      const discountedPrice = product.discounted_price 
                        ? (typeof product.discounted_price === 'string' ? parseFloat(product.discounted_price) : product.discounted_price)
                        : null
                      
                      return discountedPrice && discountedPrice < price ? (
                        <>
                          <span className="text-lg font-bold text-red-600">₹{discountedPrice.toLocaleString()}</span>
                          <span className="text-sm text-gray-500 line-through">₹{price.toLocaleString()}</span>
                          <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded">
                            {Math.round(((price - discountedPrice) / price) * 100)}% OFF
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900">₹{price.toLocaleString()}</span>
                      )
                    })()}
                  </div>

                  {/* Rating */}
                  {(product.avg_rating || product.rating) && (
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        {(() => {
                          const rating = product.avg_rating || product.rating
                          const ratingNum = typeof rating === 'string' ? parseFloat(rating) : (rating || 0)
                          return [...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(ratingNum) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))
                        })()}
                      </div>
                      <span className="ml-2 text-sm text-gray-600">
                        {(() => {
                          const rating = product.avg_rating || product.rating || 0
                          const ratingNum = typeof rating === 'string' ? parseFloat(rating) : rating
                          return ratingNum.toFixed(1)
                        })()}
                      </span>
                      <span className="ml-1 text-sm text-gray-600">
                        ({product.review_count || product.rating_count || 0})
                      </span>
                    </div>
                  )}

                  <button className="w-full bg-pink-600 text-white py-2 px-4 rounded-md hover:bg-pink-700 transition-colors text-sm font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}