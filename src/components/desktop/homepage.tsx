'use client'

import { useState, useEffect } from 'react'
import { DesktopHeader } from './header'
import { HeroSection } from './hero-section'
import { OnOurRadar } from './on-our-radar'
import { Categories } from './categories'
import { Brands } from './brands'
import { FeaturedProducts } from './featured-products'
import { NewArrivals } from './new-arrivals'
import { Bestsellers } from './bestsellers'
import { TopShelf } from './top-shelf'
import { DesktopFooter } from './footer'

export function DesktopHomepage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading AynBeauty...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <DesktopHeader />
      
      {/* Main Content with top padding to compensate for fixed header */}
      <main className="pt-32">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Sections */}
        <div className="space-y-16 py-16">
          {/* On Our Radar */}
          <OnOurRadar />
          
          {/* Top Categories */}
          <Categories />
          
          {/* New Arrivals */}
          <NewArrivals />
          
          {/* Bestsellers */}
          <Bestsellers />
          
          {/* Featured Products */}
          <FeaturedProducts />
          
          {/* Popular Brands */}
          <Brands />
          
          {/* Top Shelf */}
          <TopShelf />
        </div>
      </main>
      
      {/* Footer */}
      <DesktopFooter />
    </div>
  )
}