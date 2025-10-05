'use client'

import { ReactNode } from 'react'
import { AuthProvider } from '@/contexts/AuthContext'
import { CartProvider } from '@/contexts/CartContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { ImageCacheProvider } from '@/contexts/ImageCacheContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <ImageCacheProvider>
            {children}
          </ImageCacheProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}