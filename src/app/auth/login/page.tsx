'use client'

import { Suspense } from 'react'
import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthLoginRedirectContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const redirectUrl = searchParams?.get('redirect')
    if (redirectUrl) {
      router.push(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
    } else {
      router.push('/login')
    }
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-gray-600">Redirecting to sign in...</p>
      </div>
    </div>
  )
}

export default function AuthLoginRedirectPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    }>
      <AuthLoginRedirectContent />
    </Suspense>
  )
}
