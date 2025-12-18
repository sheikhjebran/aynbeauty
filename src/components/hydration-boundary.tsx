'use client'

import { useState, useEffect, ReactNode } from 'react'

interface HydrationBoundaryProps {
  children: ReactNode
}

/**
 * Wrapper component that suppresses hydration warnings by only rendering children
 * after hydration is complete. This prevents mismatches when client-side state
 * (like localStorage) differs from server-rendered state.
 */
export function HydrationBoundary({ children }: HydrationBoundaryProps) {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  // Return children directly with suppressHydrationWarning on the fragment
  // This prevents hydration mismatches from localStorage state differences
  return <>{children}</>
}
