'use client'

import { useState, useEffect, useCallback, memo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  StarIcon,
  HeartIcon,
  SparklesIcon,
  TrophyIcon,
  FireIcon,
  GiftIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

// Import Hero Section components
import { DesktopHeroSection } from '@/components/desktop/hero-section'
import { MobileHeroSection } from '@/components/mobile/hero-section'
import { useCart } from '@/contexts/CartContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { useToast } from '@/components/ui/Toast'
import Toast from '@/components/ui/Toast'
import { ProductImage } from '@/components/ui/ProductImage'

// Category Image Component with Error Handling
const CategoryImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError) {
      setHasError(true)
      // Fallback to a default category image
      setImgSrc('/images/categories/skincare.jpg')
    }
  }

  // Handle null or invalid src
  if (!src || typeof src !== 'string') {
    return (
      <div className={`${className} bg-gray-200`} />
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={className}
      onError={handleError}
      unoptimized={imgSrc.startsWith('/uploads') || imgSrc.startsWith('/api/images')}
    />
  )
}

interface Product {
  id: number
  name: string
  description: string
  brand: string
  price: number
  discounted_price: number
  image_url: string
  category: string
  rating: number
  rating_count: number
  recommendation_reason?: string
  is_trending?: number
  is_must_have?: number
  is_new_arrival?: number
}

interface Campaign {
  id: number
  name: string
  description: string
  banner_image: string
  discount_percentage: number
}

interface LoyaltyData {
  current_points: number
  tier_name: string
  discount_percentage: number
}

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  // Cart and Toast context
  const { addToCart: addToCartContext } = useCart()
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)

    fetchHomepageData()
    if (token) {
      fetchPersonalizedData()
      fetchLoyaltyData()
    }
  }, [])

  // Helper function to convert product prices from strings to numbers
  const convertProductPrices = (products: any[]): Product[] => {
    return products.map(product => ({
      ...product,
      price: parseFloat(product.price),
      discounted_price: product.discounted_price ? parseFloat(product.discounted_price) : null,
      rating: parseFloat(product.rating) || 0,
      rating_count: parseInt(product.rating_count) || 0,
      brand: product.category_name || '',
      category: product.category_name || '',
      is_trending: product.is_trending || 0,
      is_must_have: product.is_must_have || 0,
      is_new_arrival: product.is_new_arrival || 0
    }))
  }

  const fetchHomepageData = async () => {
    try {
      // Fetch homepage content
      const contentResponse = await fetch('/api/content?type=homepage')
      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setCampaigns(contentData.offers || [])
      }

      // Fetch featured products
      const productsResponse = await fetch('/api/products?featured=true&limit=8')
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setFeaturedProducts(convertProductPrices(productsData.products || []))
      }

      // Fetch trending products
      const trendingResponse = await fetch('/api/products?trending=true&limit=6')
      if (trendingResponse.ok) {
        const trendingData = await trendingResponse.json()
        setTrendingProducts(convertProductPrices(trendingData.products || []))
      }

    } catch (error) {
      console.error('Error fetching homepage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPersonalizedData = async () => {
    try {
      // Temporarily disabled to prevent errors
      console.log('Personalization API temporarily disabled')
    } catch (error) {
      console.error('Error fetching personalized data:', error)
    }
  }

  const fetchLoyaltyData = async () => {
    try {
      // Temporarily disabled to prevent errors
      console.log('Loyalty API temporarily disabled')
    } catch (error) {
      console.error('Error fetching loyalty data:', error)
    }
  }

  const [addingToCartIds, setAddingToCartIds] = useState<Set<number>>(new Set())
  const [addingToWishlistIds, setAddingToWishlistIds] = useState<Set<number>>(new Set())

  const addToCart = useCallback(async (e: React.MouseEvent, productId: number, productData?: Product) => {
    e.preventDefault()
    e.stopPropagation()

    setAddingToCartIds(prev => {
      // Prevent duplicate clicks
      if (prev.has(productId)) return prev
      return new Set(prev).add(productId)
    })

    try {
      const token = localStorage.getItem('token')

      if (token) {
        // User is logged in - use API
        const response = await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            product_id: productId,
            quantity: 1
          })
        })

        if (response.ok) {
          // Update local cart context if we have product data
          if (productData) {
            addToCartContext({
              product_id: productData.id,
              name: productData.name,
              price: productData.price,
              discounted_price: productData.discounted_price,
              image: productData.image_url || '',
            }, 1)
          }

          addToast(`${productData?.name || 'Product'} added to cart!`, 'success', 3000)
        } else {
          const errorData = await response.json()
          console.error('Cart API error:', errorData)
          addToast(errorData.error || errorData.message || 'Failed to add product to cart', 'error', 3000)
        }
      } else {
        // Guest user - use context only
        if (productData) {
          addToCartContext({
            product_id: productData.id,
            name: productData.name,
            price: productData.price,
            discounted_price: productData.discounted_price,
            image: productData.image_url || '',
          }, 1)

          addToast(`${productData.name} added to cart!`, 'success', 3000)
        }
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      addToast('Failed to add product to cart', 'error', 3000)
    } finally {
      setAddingToCartIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }, [addToCartContext, addToast])

  const { addToWishlist: addToWishlistContext, isInWishlist } = useWishlist()

  const addToWishlist = useCallback(async (e: React.MouseEvent, productId: number, product?: Product) => {
    e.preventDefault()
    e.stopPropagation()

    setAddingToWishlistIds(prev => {
      // Prevent duplicate clicks
      if (prev.has(productId)) return prev
      return new Set(prev).add(productId)
    })

    try {
      // Use context to add to wishlist (supports both guest and authenticated users)
      await addToWishlistContext({
        product_id: productId,
        name: product?.name || 'Product',
        price: product?.price || 0,
        discounted_price: product?.discounted_price,
        image: product?.image_url || '/images/placeholder.jpg'
      })

      addToast('Added to wishlist!', 'success', 3000)
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      addToast('Failed to add to wishlist', 'error', 3000)
    } finally {
      setAddingToWishlistIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(productId)
        return newSet
      })
    }
  }, [addToWishlistContext, addToast])

  const ProductCard = memo(({ product, onAddToCart, onAddToWishlist, isAddingToCart, isAddingToWishlist }: {
    product: Product
    onAddToCart: (e: React.MouseEvent, productId: number, productData?: Product) => void
    onAddToWishlist: (e: React.MouseEvent, productId: number, productData?: Product) => void
    isAddingToCart: boolean
    isAddingToWishlist: boolean
  }) => (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <ProductImage
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>

        <button
          onClick={(e) => onAddToWishlist(e, product.id, product)}
          disabled={isAddingToWishlist}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors disabled:opacity-70"
        >
          {isAddingToWishlist ? (
            <div className="h-5 w-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          ) : (
            <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
          )}
        </button>

        {product.recommendation_reason && (
          <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs px-2 py-1 rounded">
            {product.recommendation_reason}
          </div>
        )}
      </div>

      <div className="p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-heading font-semibold text-gray-900 hover:text-pink-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Product Description */}
        {product.description && (
          <p className="text-xs text-gray-600 mt-2 leading-relaxed overflow-hidden"
            style={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical'
            }}>
            {product.description}
          </p>
        )}

        <p className="text-sm text-gray-600 mt-2">{product.brand}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-2">
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

        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarSolidIcon
                key={i}
                className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                  }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.rating_count})</span>
        </div>

        <div className="flex flex-col gap-3 mt-3">
          <div className="flex items-center gap-2 flex-wrap">
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
            onClick={(e) => onAddToCart(e, product.id, product)}
            disabled={isAddingToCart}
            className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors disabled:bg-pink-400 disabled:cursor-not-allowed font-medium text-sm"
          >
            {isAddingToCart ? (
              <div className="flex items-center justify-center gap-2">
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Adding...</span>
              </div>
            ) : (
              'Add to Cart'
            )}
          </button>
        </div>
      </div>
    </div>
  ), (prevProps, nextProps) => {
    // Custom comparison function for React.memo
    return (
      prevProps.product.id === nextProps.product.id &&
      prevProps.isAddingToCart === nextProps.isAddingToCart &&
      prevProps.isAddingToWishlist === nextProps.isAddingToWishlist
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200"></div>
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-200 h-80 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Hero Section with Video Banner */}
      <div className="hidden md:block">
        <DesktopHeroSection />
      </div>
      <div className="block md:hidden">
        <MobileHeroSection />
      </div>

      {/* Top Categories - Tira Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Top Categories</h2>
            <Link
              href="/products"
              className="flex items-center text-gray-600 hover:text-black transition-colors group"
            >
              <span className="mr-2">View All</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {[
              { name: 'Skincare', image: '/images/categories/skincare.jpg', href: '/categories/skincare' },
              { name: 'Lips', image: '/images/categories/lips.jpg', href: '/categories/lips' },
              { name: 'Bath and Body', image: '/images/categories/bath-body.jpg', href: '/categories/bath-and-body' },
              { name: 'Fragrances', image: '/images/categories/fragrances.jpg', href: '/categories/fragrance' },
              { name: 'Eyes', image: '/images/categories/eyes.jpeg', href: '/categories/eyes' },
              { name: 'Nails', image: '/images/categories/nails.jpg', href: '/categories/nails' },
              { name: 'Combo Sets', image: '/images/categories/combo-sets.jpg', href: '/categories/combo-sets' }
            ].map((category) => (
              <Link key={category.name} href={category.href}>
                <div className="group text-center cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                    <CategoryImage
                      src={category.image}
                      alt={category.name}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Brands - Only On AYN Style */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Only On AYN</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { name: 'Brand 1', discount: 'Up to 40% off', image: '/images/brands/brand.jpeg' },
              { name: 'Brand 2', discount: 'Buy 2, get 10% off', image: '/images/brands/brand.jpeg' },
              { name: 'Brand 3', discount: 'Up to 35% off', image: '/images/brands/brand.jpeg' },
              { name: 'Brand 4', discount: 'Up to 25% off', image: '/images/brands/brand.jpeg' }
            ].map((brand) => (
              <div key={brand.name}>
                <div className="group bg-white rounded-xl p-4 md:p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
                  <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-100 rounded-full mx-auto mb-3 md:mb-4 flex items-center justify-center overflow-hidden">
                    <Image
                      src={brand.image}
                      alt={brand.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 md:mb-2 text-sm md:text-base">{brand.name}</h3>
                  <p className="text-xs md:text-sm text-pink-600 font-medium">{brand.discount}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loyalty Status (for logged in users) */}
      {isLoggedIn && loyaltyData && (
        <section className="bg-gradient-to-r from-pink-600 to-purple-600 text-white py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <TrophyIcon className="h-8 w-8" />
                <div>
                  <p className="font-semibold">{loyaltyData.tier_name} Member</p>
                  <p className="text-sm opacity-90">{loyaltyData.current_points} points available</p>
                </div>
              </div>
              <Link
                href="/loyalty"
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
              >
                View Rewards
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Active Campaigns */}
      {campaigns.length > 0 && (
        <section className="py-8 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="relative rounded-lg overflow-hidden group">
                  <Image
                    src={campaign.banner_image || '/placeholder-campaign.jpg'}
                    alt={campaign.name}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="heading-sm mb-2">{campaign.name}</h3>
                      <p className="text-sm opacity-90 mb-3">{campaign.description}</p>
                      {campaign.discount_percentage && (
                        <div className="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                          {campaign.discount_percentage}% OFF
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Trending Now - Tira Style */}
      {trendingProducts.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Trending Now</h2>
              <Link
                href="/products"
                className="flex items-center text-gray-600 hover:text-black transition-colors group"
              >
                <span className="mr-2">View All</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {trendingProducts.slice(0, 10).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  isAddingToCart={addingToCartIds.has(product.id)}
                  isAddingToWishlist={addingToWishlistIds.has(product.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Offer Banner */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl max-w-6xl mx-auto shadow-2xl">
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&h=600&fit=crop"
                alt="Beauty Banner"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-pink-900/80 to-purple-900/70"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
              <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Discover Your
                <span className="block text-pink-300">Perfect Look</span>
              </h2>
              <p className="text-xl md:text-2xl text-pink-100 mb-10 max-w-3xl mx-auto leading-relaxed">
                Explore our curated collection of premium beauty products and transform your skincare routine with expert-recommended essentials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/products"
                  className="bg-white text-pink-900 px-10 py-4 rounded-full font-bold text-lg hover:bg-pink-50 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Shop Collection
                </Link>
                <Link
                  href="/products"
                  className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300"
                >
                  Browse Categories
                </Link>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-pink-400/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </section>

      {/* Featured Products - Clean Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Must-Have Products</h2>
            <Link
              href="/products"
              className="flex items-center text-gray-600 hover:text-black transition-colors group"
            >
              <span className="mr-2">Shop All</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                isAddingToCart={addingToCartIds.has(product.id)}
                isAddingToWishlist={addingToWishlistIds.has(product.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Recommendations */}
      {isLoggedIn && recommendedProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <SparklesIcon className="h-8 w-8 text-pink-600" />
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Just For You</h2>
              </div>
              <Link
                href="/products"
                className="flex items-center text-gray-600 hover:text-black transition-colors group"
              >
                <span className="mr-2">View All</span>
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {recommendedProducts.slice(0, 10).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                  onAddToWishlist={addToWishlist}
                  isAddingToCart={addingToCartIds.has(product.id)}
                  isAddingToWishlist={addingToWishlistIds.has(product.id)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Beauty Services - Tira Style */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12">Why Choose AYN Beauty</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <GiftIcon className="h-10 w-10 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Delivery Across India</h3>
              <p className="text-gray-600 leading-relaxed">Fast and reliable delivery across India. Get your beauty essentials delivered to your doorstep within 3-5 business days.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <SparklesIcon className="h-10 w-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Authentic Products</h3>
              <p className="text-gray-600 leading-relaxed">100% authentic products from trusted brands. Beauty you can trust, every time.</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <TrophyIcon className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Quality Products</h3>
              <p className="text-gray-600 leading-relaxed">Carefully curated selection of premium beauty products. Every item tested for quality and authenticity.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
