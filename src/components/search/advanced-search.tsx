'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon, XMarkIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline'

interface AdvancedSearchProps {
  onFiltersChange?: (filters: SearchFilters) => void
  className?: string
}

export interface SearchFilters {
  search: string
  category: string
  brand: string
  minPrice: string
  maxPrice: string
  rating: string
  inStock: boolean
  onSale: boolean
  featured: boolean
  sortBy: string
}

const sortOptions = [
  { value: 'relevance', label: 'Best Match' },
  { value: 'newest', label: 'Newest First' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'popularity', label: 'Most Popular' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' }
]

export function AdvancedSearch({ onFiltersChange, className = '' }: AdvancedSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<string[]>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  
  const [filters, setFilters] = useState<SearchFilters>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    inStock: searchParams.get('inStock') === 'true',
    onSale: searchParams.get('onSale') === 'true',
    featured: searchParams.get('featured') === 'true',
    sortBy: searchParams.get('sort') || 'relevance'
  })

  // Debounced update function
  const debouncedUpdateURL = useCallback((newFilters: SearchFilters) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([k, v]) => {
        if (typeof v === 'boolean' ? v : v && v !== '') {
          params.set(k === 'sortBy' ? 'sort' : k, v.toString())
        }
      })
      
      const newUrl = `${window.location.pathname}?${params.toString()}`
      router.push(newUrl, { scroll: false })
    }, 500) // 500ms debounce delay
  }, [router])

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    onFiltersChange?.(filters)
  }, [filters, onFiltersChange])

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.flat_categories || [])
        setBrands(data.brands || [])
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error)
    }
  }

  const updateFilter = (key: keyof SearchFilters, value: string | boolean) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    
    // Use debouncing for search input to prevent flickering
    if (key === 'search') {
      debouncedUpdateURL(newFilters)
    } else {
      // Immediate update for other filters like dropdowns, checkboxes
      const params = new URLSearchParams()
      Object.entries(newFilters).forEach(([k, v]) => {
        if (typeof v === 'boolean' ? v : v && v !== '') {
          params.set(k === 'sortBy' ? 'sort' : k, v.toString())
        }
      })
      
      const newUrl = `${window.location.pathname}?${params.toString()}`
      router.push(newUrl, { scroll: false })
    }
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      search: '',
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      inStock: false,
      onSale: false,
      featured: false,
      sortBy: 'relevance'
    }
    setFilters(clearedFilters)
    router.push(window.location.pathname, { scroll: false })
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => 
    key !== 'search' && key !== 'sortBy' && value && value !== '' && value !== false
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Form submission is handled by updateFilter calls
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      <form onSubmit={handleSubmit} className="p-4">
        {/* Main Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => updateFilter('search', e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
            />
            {filters.search && (
              <button
                type="button"
                onClick={() => updateFilter('search', '')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`flex items-center gap-2 px-4 py-3 border rounded-md transition-colors ${
                showAdvanced || hasActiveFilters
                  ? 'bg-pink-50 border-pink-300 text-pink-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <AdjustmentsHorizontalIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Filters</span>
              {hasActiveFilters && (
                <span className="bg-pink-600 text-white text-xs rounded-full px-2 py-1 ml-1">
                  {Object.values(filters).filter(v => v && v !== '' && v !== false && v !== 'relevance').length}
                </span>
              )}
            </button>
            
            <select
              value={filters.sortBy}
              onChange={(e) => updateFilter('sortBy', e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 font-medium hover:border-pink-400 transition-colors"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="text-gray-900">
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => updateFilter('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 hover:border-pink-400 transition-colors"
                >
                  <option value="" className="text-gray-900">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.id || category.name} value={category.name} className="text-gray-900">
                      {category.name ? category.name.charAt(0).toUpperCase() + category.name.slice(1) : 'Unknown Category'}
                    </option>
                  ))}
                </select>
              </div>

              {/* Brand Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  value={filters.brand}
                  onChange={(e) => updateFilter('brand', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-white text-gray-900 hover:border-pink-400 transition-colors"
                >
                  <option value="" className="text-gray-900">All Brands</option>
                  {brands.map((brand) => (
                    <option key={brand} value={brand} className="text-gray-900">
                      {brand}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Price (₹)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  placeholder="10000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => updateFilter('rating', rating === parseInt(filters.rating) ? '' : rating.toString())}
                    className={`flex items-center gap-1 px-3 py-2 border rounded-md transition-colors ${
                      filters.rating === rating.toString()
                        ? 'bg-yellow-50 border-yellow-300 text-yellow-700'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>{rating}</span>
                    <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-xs">& up</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quick Filters
              </label>
              <div className="flex flex-wrap gap-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.inStock}
                    onChange={(e) => updateFilter('inStock', e.target.checked)}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">In Stock</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.onSale}
                    onChange={(e) => updateFilter('onSale', e.target.checked)}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">On Sale</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.featured}
                    onChange={(e) => updateFilter('featured', e.target.checked)}
                    className="rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-pink-600 hover:text-pink-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </form>
    </div>
  )
}