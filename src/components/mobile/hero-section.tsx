'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export function MobileHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      image: 'https://picsum.photos/800/600?random=18',
      title: 'New Beauty Arrivals',
      subtitle: 'Discover the latest in makeup & skincare',
      cta: 'Shop Now',
      gradient: 'from-pink-500/80 to-purple-600/80'
    },
    {
      id: 2,
      image: 'https://picsum.photos/800/600?random=19',
      title: 'Premium Skincare',
      subtitle: 'Glow with our bestselling products',
      cta: 'Explore',
      gradient: 'from-blue-500/80 to-teal-600/80'
    },
    {
      id: 3,
      image: 'https://picsum.photos/800/600?random=20',
      title: 'Makeup Essentials',
      subtitle: 'Create your perfect look',
      cta: 'Get Started',
      gradient: 'from-orange-500/80 to-red-600/80'
    }
  ]

  // Auto-advance slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="relative h-96 overflow-hidden">
      {/* Slides */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={slide.id} className="w-full flex-shrink-0 relative">
            {/* Background Image */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-100 to-secondary-100">
              {/* Placeholder for image */}
              <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200"></div>
            </div>

            {/* Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient}`}></div>

            {/* Content */}
            <div className="relative h-full flex items-center justify-center px-6">
              <div className="text-center text-white max-w-sm">
                <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-lg mb-6 opacity-90">
                  {slide.subtitle}
                </p>
                <button className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                  {slide.cta}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide
                ? 'bg-white w-6'
                : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Navigation Arrows (hidden on mobile, shown on tablet+) */}
      <div className="hidden sm:block">
        <button
          onClick={() => goToSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => goToSlide((currentSlide + 1) % slides.length)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition-colors"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Quick Actions Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4">
        <div className="flex justify-center space-x-4">
          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
            💄 Makeup
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
            ✨ Skincare
          </button>
          <button className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium border border-white/30 hover:bg-white/30 transition-colors">
            🌸 Fragrance
          </button>
        </div>
      </div>
    </div>
  )
}