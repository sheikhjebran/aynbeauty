'use client'

import { useEffect, useState } from 'react'
import { DesktopHomepage } from './desktop/homepage'
import { MobileHomepage } from './mobile/homepage'

export function ResponsiveLayout() {
  const [isMobile, setIsMobile] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
      setIsLoading(false)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold gradient-text">AynBeauty</h2>
          <p className="text-gray-600 mt-2">Loading your beauty destination...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {isMobile ? <MobileHomepage /> : <DesktopHomepage />}
    </>
  )
}