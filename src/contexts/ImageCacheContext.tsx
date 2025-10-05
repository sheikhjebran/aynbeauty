import React, { createContext, useContext, useState, useCallback } from 'react'

interface ImageCacheContextType {
  imageVersion: number
  refreshImages: () => void
  getImageUrl: (url: string) => string
}

const ImageCacheContext = createContext<ImageCacheContextType | undefined>(undefined)

export function ImageCacheProvider({ children }: { children: React.ReactNode }) {
  const [imageVersion, setImageVersion] = useState(Date.now())

  const refreshImages = useCallback(() => {
    setImageVersion(Date.now())
  }, [])

  const getImageUrl = useCallback((url: string) => {
    if (url.startsWith('/uploads/')) {
      return `${url}?v=${imageVersion}`
    }
    return url
  }, [imageVersion])

  return (
    <ImageCacheContext.Provider value={{ imageVersion, refreshImages, getImageUrl }}>
      {children}
    </ImageCacheContext.Provider>
  )
}

export function useImageCache() {
  const context = useContext(ImageCacheContext)
  if (context === undefined) {
    throw new Error('useImageCache must be used within an ImageCacheProvider')
  }
  return context
}