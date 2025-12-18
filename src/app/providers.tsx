'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { ImageCacheProvider } from '@/contexts/ImageCacheContext'
import { ErrorBoundary } from '@/components/error-boundary'
import { HydrationBoundary } from '@/components/hydration-boundary'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <HydrationBoundary>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <ImageCacheProvider>
                {children}
              </ImageCacheProvider>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </HydrationBoundary>
    </ErrorBoundary>
  )
}