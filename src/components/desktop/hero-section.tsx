'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface HeroSlide {
  id: number
  title?: string
  subtitle?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  image?: string
  video?: string
  bgColor: string
}

export function DesktopHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const heroSlides = [
    {
      id: 1,
      title: 'Discover Your Perfect Beauty Match',
      subtitle: 'Explore premium beauty products from top brands',
      description: 'Find everything from makeup to skincare at AynBeauty',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      video: '/images/banners/welcome-banner.mp4',
      bgColor: 'from-pink-500 to-purple-600'
    },
    {
      id: 2,
      title: 'New Arrivals Just Dropped',
      subtitle: 'Be the first to try the latest beauty innovations',
      description: 'Discover trending products from your favorite brands',
      buttonText: 'Explore New',
      buttonLink: '/new-arrivals',
      image: '/images/banners/new-arrivals.jpg',
    },
    {
      id: 3,
      title: 'Bestsellers Everyone Loves',
      subtitle: 'Shop the most popular beauty products',
      description: 'Join thousands of happy customers',
      buttonText: 'Shop Bestsellers',
      buttonLink: '/bestsellers',
      image: '/images/banners/bestsellers.jpg',
    },
    {
      id: 4,
      title: 'Premium Skincare Collection',
      subtitle: 'Transform your skin with expert-recommended products',
      description: 'Discover the best skincare solutions for your needs',
      buttonText: 'Explore Skincare',
      buttonLink: '/categories/skincare',
      image: '/images/banners/banner3.jpeg'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [heroSlides.length])

  return (
    <section className="relative h-[600px] overflow-hidden">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Background */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bgColor} opacity-90`} />
          
          {/* Background Video/Image */}
          <div className="absolute inset-0">
            {slide.video ? (
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src={slide.video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : slide.image ? (
              <Image
                src={slide.image}
                alt={slide.title || 'Banner image'}
                fill
                className="object-cover"
                priority={index === 0}
              />
            ) : null}
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <div className="max-w-3xl">
                  {slide.title && (
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                      {slide.title}
                    </h1>
                  )}
                  {slide.subtitle && (
                    <p className="text-xl md:text-2xl text-white/90 mb-4">
                      {slide.subtitle}
                    </p>
                  )}
                {slide.description && (
                  <p className="text-lg text-white/80 mb-8 max-w-2xl">
                    {slide.description}
                  </p>
                )}
                {slide.buttonText && slide.buttonLink && (
                  <Link
                    href={slide.buttonLink}
                    className="inline-flex items-center px-8 py-4 bg-white text-primary-600 font-semibold rounded-full hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-300"
                  >
                    {slide.buttonText}
                    <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white scale-125'
                  : 'bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => setCurrentSlide(currentSlide === 0 ? heroSlides.length - 1 : currentSlide - 1)}
        className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => setCurrentSlide((currentSlide + 1) % heroSlides.length)}
        className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-32 left-20 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s' }} />
    </section>
  )
}

// Export alias for convenience
export { DesktopHeroSection as HeroSection }