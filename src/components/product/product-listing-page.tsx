'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDownIcon, FunnelIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/20/solid'
import { AdvancedSearch } from '@/components/search'
import { WishlistButton } from '@/components/wishlist'

interface Product {
  id: number
  name: string
  description: string
  price: number
  discounted_price?: number
  brand: string
  category: string
  image_url?: string
  primary_image?: string
  images?: string[]
  rating: number
  rating_count: number
  is_featured: boolean
  is_trending: boolean
  is_must_have: boolean
  is_new_arrival: boolean
  stock_quantity: number
}

interface ProductListingPageProps {
  category?: string
  searchParams?: { [key: string]: string | string[] | undefined }
}

const sortOptions = [
  { value: 'best-match', label: 'Best Match' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
]

export function ProductListingPage({ category, searchParams }: ProductListingPageProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalProducts, setTotalProducts] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Get current filters from URL
  const currentSort = urlSearchParams.get('sort') || 'newest'
  const currentSearch = urlSearchParams.get('search') || ''
  const currentBrand = urlSearchParams.get('brand') || ''
  const currentMinPrice = urlSearchParams.get('minPrice') || ''
  const currentMaxPrice = urlSearchParams.get('maxPrice') || ''
  const currentRating = urlSearchParams.get('rating') || ''
  const currentInStock = urlSearchParams.get('inStock') === 'true'
  const currentOnSale = urlSearchParams.get('onSale') === 'true'
  const currentFeatured = urlSearchParams.get('featured') === 'true'

  // Debounce search parameter
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearch(currentSearch)
    }, 150) // 150ms debounce - reduced for faster response
    
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [currentSearch])

  // Fetch products when debounced search or other parameters change
  useEffect(() => {
    fetchProducts()
  }, [category, debouncedSearch, currentBrand, currentSort, currentMinPrice, currentMaxPrice, currentRating, currentInStock, currentOnSale, currentFeatured, currentPage])

  // Fetch filters on mount
  useEffect(() => {
    fetchFilters()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (category) params.append('category', category)
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (currentBrand) params.append('brand', currentBrand)
      if (currentSort) params.append('sort', currentSort)
      if (currentMinPrice) params.append('minPrice', currentMinPrice)
      if (currentMaxPrice) params.append('maxPrice', currentMaxPrice)
      if (currentRating) params.append('rating', currentRating)
      if (currentInStock) params.append('inStock', 'true')
      if (currentOnSale) params.append('onSale', 'true')
      if (currentFeatured) params.append('featured', 'true')
      params.append('page', currentPage.toString())
      params.append('limit', '20')

      const response = await fetch(`/api/products?${params}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      
      const data = await response.json()
      setProducts(data.products)
      setTotalProducts(data.total)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const fetchFilters = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        // Use flat_categories to get all categories as objects
        setCategories(data.flat_categories || [])
        
        // For brands, we'll need a separate API call or extract from products
        setBrands([]) // Temporarily empty until we have a brands API
      }
    } catch (err) {
      console.error('Failed to fetch filters:', err)
    }
  }

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(urlSearchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page') // Reset page when changing filters
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    if (currentSearch) params.set('search', currentSearch)
    router.push(`${window.location.pathname}?${params.toString()}`)
  }

  const formatPrice = (price: number) => {
    const validPrice = Number(price) || 0
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(validPrice)
  }

  const formatRating = (rating: any) => {
    const validRating = Number(rating) || 0
    return validRating > 0 ? validRating.toFixed(1) : '0.0'
  }

  const calculateDiscountPercentage = (originalPrice: number, discountedPrice: number) => {
    if (!originalPrice || !discountedPrice || discountedPrice >= originalPrice) return 0
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
  }

  const renderStars = (rating: number) => {
    const validRating = Number(rating) || 0
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < Math.floor(validRating) ? 'text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600 font-medium">
          {validRating > 0 ? validRating.toFixed(1) : '0.0'}
        </span>
      </div>
    )
  }

  const totalPages = Math.ceil(totalProducts / 20)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {category ? category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'All Products'}
        </h1>
        <p className="text-gray-600">
          {totalProducts} product{totalProducts !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Advanced Search */}
      <div className="mb-6">
        <AdvancedSearch />
      </div>

      {/* Filters and Sorting */}
      <div className="mb-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Mobile Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="lg:hidden flex items-center gap-2 bg-white border-2 border-gray-400 rounded-md px-4 py-2 hover:border-pink-400"
        >
          <FunnelIcon className="h-5 w-5" />
          Filters
        </button>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={currentSort}
              onChange={(e) => updateFilters('sort', e.target.value)}
              className="appearance-none bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold border-2 border-pink-400 rounded-lg px-4 py-3 pr-10 shadow-lg hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-3 focus:ring-pink-300 focus:border-pink-500 transition-all duration-200"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-white text-gray-800 font-normal">
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute right-3 top-4 h-5 w-5 text-white pointer-events-none" />
          </div>

          {/* View Mode Toggle */}
          <div className="flex border-2 border-gray-400 rounded-md">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'bg-white text-gray-600'}`}
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'bg-white text-gray-600'}`}
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <div className={`w-full lg:w-64 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white border-2 border-gray-300 rounded-lg p-6 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-pink-600 hover:text-pink-700"
              >
                Clear All
              </button>
            </div>

            {/* Categories Filter */}
            {!category && categories.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.slice(0, 5).map((cat) => (
                    <label key={cat.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        value={cat.slug}
                        onChange={(e) => router.push(`/category/${e.target.value}`)}
                        className="text-pink-600 focus:ring-pink-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Brand Filter */}
            {brands.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Brands</h4>
                <div className="space-y-2">
                  {brands.slice(0, 8).map((brand) => (
                    <label key={brand} className="flex items-center">
                      <input
                        type="radio"
                        name="brand"
                        value={brand}
                        checked={currentBrand === brand}
                        onChange={(e) => updateFilters('brand', e.target.checked ? e.target.value : '')}
                        className="text-pink-600 focus:ring-pink-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Rating Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center">
                    <input
                      type="radio"
                      name="rating"
                      value={rating.toString()}
                      checked={currentRating === rating.toString()}
                      onChange={(e) => updateFilters('rating', e.target.checked ? e.target.value : '')}
                      className="text-pink-600 focus:ring-pink-500"
                    />
                    <div className="ml-2 flex items-center">
                      {renderStars(rating)}
                      <span className="ml-1 text-sm text-gray-600">& up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <>
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }`}>
                {products.map((product) => (
                  <div key={product.id} className={`bg-white border-2 border-gray-300 rounded-lg overflow-hidden hover:shadow-lg hover:border-pink-300 transition-all relative ${
                    viewMode === 'list' ? 'flex' : ''
                  }`}>
                    {/* Wishlist Button */}
                    <div className="absolute top-2 right-2 z-10">
                      <WishlistButton productId={product.id} size="sm" />
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <div className={`relative ${viewMode === 'list' ? 'w-48 h-48' : 'aspect-square'}`}>
                        <Image
                          src={product.images?.[0] || product.primary_image || product.image_url || `https://picsum.photos/300/300?random=${product.id}`}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                        
                        {/* Discount Badge */}
                        {product.discounted_price && product.discounted_price < product.price && (
                          <div className="absolute top-2 right-12 bg-red-500 text-white px-2 py-1 text-xs rounded font-medium">
                            {calculateDiscountPercentage(product.price, product.discounted_price)}% OFF
                          </div>
                        )}
                        
                        {product.stock_quantity === 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white font-semibold">Out of Stock</span>
                          </div>
                        )}
                      </div>
                    </Link>
                      
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <Link href={`/products/${product.id}`}>
                        <h3 className="font-medium text-gray-900 mb-1 line-clamp-2 hover:text-pink-600">{product.name}</h3>
                      </Link>
                      
                      {/* Product Description */}
                      {product.description && (
                        <p className="text-xs text-gray-600 mt-2 mb-2 leading-relaxed overflow-hidden" 
                           style={{
                             display: '-webkit-box',
                             WebkitLineClamp: 3,
                             WebkitBoxOrient: 'vertical'
                           }}>
                          {product.description}
                        </p>
                      )}
                      
                      <p className="text-sm text-gray-600 mb-2">{product.brand}</p>
                      
                      {/* Tags - moved below description to match home page */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {product.is_trending && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                            🔥 Trending
                          </span>
                        )}
                        {product.is_must_have && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                            ⭐ Must Have
                          </span>
                        )}
                        {product.is_new_arrival && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            ✨ New
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`h-4 w-4 ${i < Math.floor(Number(product.rating) || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.rating_count || 0})
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        {product.discounted_price && product.discounted_price < product.price ? (
                          <>
                            <span className="text-lg font-bold text-pink-600">₹{product.discounted_price}</span>
                            <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                              {Math.round(((product.price - product.discounted_price) / product.price) * 100)}% OFF
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-gray-900">₹{product.price}</span>
                        )}
                      </div>

                      <button
                        disabled={product.stock_quantity === 0}
                        className={`w-full py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                          product.stock_quantity === 0
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-pink-600 text-white hover:bg-pink-700'
                        }`}
                      >
                        {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border-2 border-gray-400 rounded-md hover:bg-gray-50 hover:border-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-md ${
                            currentPage === page
                              ? 'bg-pink-600 text-white border-2 border-pink-600'
                              : 'text-gray-500 bg-white border-2 border-gray-400 hover:bg-gray-50 hover:border-pink-400'
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                      className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border-2 border-gray-400 rounded-md hover:bg-gray-50 hover:border-pink-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
    </div>
  )
}