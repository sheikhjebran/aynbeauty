'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface MobileSlide {
  id: number
  title?: string
  subtitle?: string
  cta?: string
  gradient?: string
  image?: string
  video?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'stretch'
}

export function MobileHeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 2,
      video: '/images/banners/mobile_banner.mp4',
      title: '',
      subtitle: '',
      gradient: '',
      image: undefined,
      cta: undefined,
      objectFit: 'cover'
    },
    {
      id: 3,
      image: '/images/banners/bestsellers.jpeg',
      title: '',
      subtitle: '',
      description: '',
      cta: '',
      gradient: '',
      video: undefined,
      objectFit: 'cover'
    },
    {
      id: 1,
      title: '',
      subtitle: '',
      description: '',
      image: '/images/banners/mobile_banner1.jpeg',
      gradient: '',
      video: undefined,
      cta: undefined,
      objectFit: 'cover'
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
    <div className="relative w-full overflow-hidden">
      {/* Mobile: Responsive height */}
      <div className="h-[60vh] min-h-[350px] max-h-[500px] sm:h-[70vh] sm:min-h-[400px] sm:max-h-[600px]">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="w-full flex-shrink-0 relative">
              {/* Background Video/Image */}
              <div className="absolute inset-0 bg-gray-900">
                {slide.video ? (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className={`w-full h-full ${slide.objectFit === 'contain' ? 'object-contain' :
                        slide.objectFit === 'fill' ? 'object-fill' :
                          slide.objectFit === 'stretch' ? 'w-full h-full' :
                            'object-cover'
                      }`}
                    style={{ objectPosition: 'center 40%' }}
                  >
                    <source src={slide.video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : slide.image ? (
                  <Image
                    src={slide.image}
                    alt={slide.title || 'Banner image'}
                    fill
                    className={`w-full h-full ${slide.objectFit === 'contain' ? 'object-contain' :
                        slide.objectFit === 'fill' ? 'object-fill' :
                          slide.objectFit === 'stretch' ? 'w-full h-full' :
                            'object-cover'
                      }`}
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 100vw"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200"></div>
                )}
              </div>

              {/* Gradient Overlay */}
              {slide.gradient && <div className={`absolute inset-0 bg-gradient-to-t ${slide.gradient}`}></div>}

              {/* Content */}
              {(slide.title || slide.subtitle || slide.cta) && (
                <div className="relative h-full flex items-center justify-center px-6">
                  <div className="text-center text-white max-w-sm">
                    {slide.title && (
                      <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                        {slide.title}
                      </h1>
                    )}
                    {slide.subtitle && (
                      <p className="text-lg mb-6 opacity-90">
                        {slide.subtitle}
                      </p>
                    )}
                    {slide.cta && (
                      <button className="bg-white text-gray-900 font-semibold px-8 py-3 rounded-full hover:bg-gray-100 transition-colors shadow-lg">
                        {slide.cta}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentSlide
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


    </div>
  )
}