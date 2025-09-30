'use client'

import { useState, useEffect } from 'react'
import { MobileHeader } from './header'
import { MobileHeroSection } from './hero-section'
import { MobileOnOurRadar } from './on-our-radar'
import { MobileCategories } from './categories'
import { MobileBrands } from './brands'
import { MobileFeaturedProducts } from './featured-products'
import { MobileNewArrivals } from './new-arrivals'
import { MobileBestsellers } from './bestsellers'
import { MobileTopShelf } from './top-shelf'
import { MobileFooter } from './footer'

export function MobileHomepage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center px-4">
          <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4 mx-auto"></div>
          <p className="text-gray-600 text-sm">Loading AynBeauty...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <MobileHeader />
      
      {/* Main Content */}
      <main className="pb-16">
        {/* Hero Section */}
        <MobileHeroSection />
        
        {/* Featured Sections */}
        <div className="space-y-8">
          {/* On Our Radar */}
          <MobileOnOurRadar />
          
          {/* Categories */}
          <MobileCategories />
          
          {/* New Arrivals */}
          <MobileNewArrivals />
          
          {/* Bestsellers */}
          <MobileBestsellers />
          
          {/* Featured Products */}
          <MobileFeaturedProducts />
          
          {/* Brands */}
          <MobileBrands />
          
          {/* Top Shelf */}
          <MobileTopShelf />
        </div>
      </main>
      
      {/* Mobile Footer */}
      <MobileFooter />
    </div>
  )
}