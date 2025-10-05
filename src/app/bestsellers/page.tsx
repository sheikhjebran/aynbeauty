'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function BestsellersPage() {
  const router = useRouter()
  
  useEffect(() => {
    // Redirect to products page with bestsellers filter (trending products)
    router.replace('/products?trending=true')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Bestsellers...</h1>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-600 mx-auto"></div>
      </div>
    </div>
  )
}