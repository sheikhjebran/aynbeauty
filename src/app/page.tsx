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

interface Banner {
  id: number
  title: string
  content: string
  image_url: string
  link_url: string
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
  const [banners, setBanners] = useState<Banner[]>([])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyData | null>(null)
  const [currentBanner, setCurrentBanner] = useState(0)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
    
    fetchHomepageData()
    if (token) {
      fetchPersonalizedData()
      fetchLoyaltyData()
    }
  }, [])

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [banners])

  const fetchHomepageData = async () => {
    try {
      // Fetch homepage content
      const contentResponse = await fetch('/api/content?type=homepage')
      if (contentResponse.ok) {
        const contentData = await contentResponse.json()
        setBanners(contentData.banners || [])
        setCampaigns(contentData.offers || [])
      }

      // Fetch featured products
      const productsResponse = await fetch('/api/products?featured=true&limit=8')
      if (productsResponse.ok) {
        const productsData = await productsResponse.json()
        setFeaturedProducts(productsData.products || [])
      }

      // Fetch trending products
      const trendingResponse = await fetch('/api/products?trending=true&limit=6')
      if (trendingResponse.ok) {
        const trendingData = await trendingResponse.json()
        setTrendingProducts(trendingData.products || [])
      }

    } catch (error) {
      console.error('Error fetching homepage data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPersonalizedData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/personalization', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setRecommendedProducts(data.recommendations || [])
      }
    } catch (error) {
      console.error('Error fetching personalized data:', error)
    }
  }

  const fetchLoyaltyData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/loyalty', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setLoyaltyData(data.loyalty)
      }
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
        alert('Product added to cart!')
      } else {
        alert('Failed to add product to cart')
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
          product_id: productId
        })
      })

      if (response.ok) {
        alert('Product added to wishlist!')
      } else {
        alert('Failed to add product to wishlist')
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
            <span className="text-lg font-bold text-gray-900">₹{product.discounted_price}</span>
            {product.price > product.discounted_price && (
              <span className="text-sm text-gray-500 line-through">₹{product.price}</span>
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
      {/* Hero Carousel - Tira Style */}
      {banners.length > 0 && (
        <section className="relative">
          <div className="relative h-[450px] md:h-[600px] overflow-hidden">
            {banners.map((banner, index) => (
              <div
                key={banner.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentBanner ? 'opacity-100 transform scale-100' : 'opacity-0 transform scale-105'
                }`}
              >
                <Image
                  src={banner.image_url || '/placeholder-banner.jpg'}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent">
                  <div className="container mx-auto px-4 h-full flex items-center">
                    <div className="max-w-xl text-white">
                      <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                        {banner.title}
                      </h1>
                      <p className="text-lg md:text-xl mb-8 opacity-90 leading-relaxed">
                        {banner.content}
                      </p>
                      {banner.link_url && (
                        <Link
                          href={banner.link_url}
                          className="inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
                        >
                          Shop Now
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Carousel Indicators */}
            {banners.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentBanner(index)}
                    className={`w-12 h-1 rounded-full transition-all duration-300 ${
                      index === currentBanner ? 'bg-white' : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Top Categories - Tira Style */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Top Categories</h2>
            <Link 
              href="/categories" 
              className="flex items-center text-gray-600 hover:text-black transition-colors group"
            >
              <span className="mr-2">View All</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: 'Makeup', image: '/images/categories/makeup.jpg', href: '/categories/makeup' },
              { name: 'Skincare', image: '/images/categories/skincare.jpg', href: '/categories/skincare' },
              { name: 'Hair', image: '/images/categories/hair.jpg', href: '/categories/hair-care' },
              { name: 'Fragrance', image: '/images/categories/fragrance.jpg', href: '/categories/fragrance' },
              { name: 'Bath & Body', image: '/images/categories/bath-body.jpg', href: '/categories/bath-body' },
              { name: 'Men', image: '/images/categories/men.jpg', href: '/categories/men' }
            ].map((category) => (
              <Link key={category.name} href={category.href}>
                <div className="group text-center cursor-pointer">
                  <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
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
                href="/products?trending=true" 
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