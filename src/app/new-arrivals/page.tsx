'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function NewArrivalsPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to products page with new arrivals filter
    router.replace('/products?new_arrivals=true')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading New Arrivals...</h1>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
      </div>
    </div>
  )
}