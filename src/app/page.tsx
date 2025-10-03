'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingBagIcon,
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

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className={className}
      onError={handleError}
    />
  )
}

interface Product {
  id: number
  name: string
  brand: string
  price: number
  discounted_price: number
  image_url: string
  category: string
  rating: number
  rating_count: number
  recommendation_reason?: string
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
  
  // Cart context
  const { addToCart: addToCartContext } = useCart()

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
      category: product.category_name || ''
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

  const addToCart = async (productId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to add items to cart')
        return
      }

      // Find the product from our local state
      const allProducts = [...featuredProducts, ...recommendedProducts, ...trendingProducts]
      const product = allProducts.find(p => p.id === productId)

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
        if (product) {
          addToCartContext({
            product_id: product.id,
            name: product.name,
            price: product.price,
            discounted_price: product.discounted_price,
            image: product.image_url || '',
          }, 1)
        }
        
        alert('Product added to cart!')
      } else {
        const errorData = await response.json()
        console.error('Cart API error:', errorData)
        alert(errorData.error || errorData.message || 'Failed to add product to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Failed to add product to cart')
    }
  }

  const addToWishlist = async (productId: number) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        alert('Please login to add items to wishlist')
        return
      }

      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'add',
          product_id: productId
        })
      })

      if (response.ok) {
        alert('Product added to wishlist!')
      } else if (response.status === 409) {
        alert('Product is already in your wishlist!')
      } else {
        const errorData = await response.json()
        console.error('Wishlist API error:', errorData)
        alert(errorData.error || errorData.message || 'Failed to add product to wishlist')
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      alert('Failed to add product to wishlist')
    }
  }

  const ProductCard = ({ product }: { product: Product }) => (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="aspect-square overflow-hidden">
            <Image
              src={product.image_url || '/placeholder-product.jpg'}
              alt={product.name}
              width={300}
              height={300}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        </Link>
        
        <button
          onClick={() => addToWishlist(product.id)}
          className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
        >
          <HeartIcon className="h-5 w-5 text-gray-600 hover:text-red-500" />
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
        <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
        
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <StarSolidIcon
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.rating_count})</span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
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
            onClick={() => addToCart(product.id)}
            className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition-colors"
          >
            <ShoppingBagIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

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
              { name: 'Fragrances', image: '/images/categories/fragrances.jpg', href: '/categories/fragrances' },
              { name: 'Eyes', image: '/images/categories/eyes.jpg', href: '/categories/eyes' },
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
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Maybelline', discount: 'Up to 40% off' },
              { name: 'L\'Oreal', discount: 'Buy 2, get 10% off' },
              { name: 'Lakme', discount: 'Up to 35% off' },
              { name: 'MAC', discount: 'Up to 25% off' },
              { name: 'Nykaa', discount: 'Up to 30% off' },
              { name: 'The Ordinary', discount: 'Up to 20% off' }
            ].map((brand) => (
              <Link key={brand.name} href={`/brands/${brand.name.toLowerCase().replace(' ', '-').replace('\'', '')}`}>
                <div className="group bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-xl font-bold text-gray-600">{brand.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{brand.name}</h3>
                  <p className="text-sm text-pink-600 font-medium">{brand.discount}</p>
                </div>
              </Link>
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
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Special Offer Banner */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto shadow-lg">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Beauty Club Membership
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our exclusive beauty club and get access to member-only deals, early access to sales, and personalized beauty recommendations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105">
                Join for Free
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-full font-semibold hover:border-gray-400 transition-colors">
                Learn More
              </button>
            </div>
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
              <ProductCard key={product.id} product={product} />
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
                <ProductCard key={product.id} product={product} />
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
              <h3 className="text-xl font-bold mb-4 text-gray-900">Free Shipping</h3>
              <p className="text-gray-600 leading-relaxed">Free shipping on orders above ₹499. Get your beauty essentials delivered to your doorstep.</p>
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
              <h3 className="text-xl font-bold mb-4 text-gray-900">Expert Support</h3>
              <p className="text-gray-600 leading-relaxed">Get personalized beauty advice from our experts. Your perfect look is just a message away.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}