import React from 'react'
import Image from 'next/image'
import { useImageCache } from '@/contexts/ImageCacheContext'

interface ProductImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  priority?: boolean
}

export function ProductImage({ 
  src, 
  alt, 
  width = 300, 
  height = 300, 
  className = "", 
  fill = false,
  priority = false 
}: ProductImageProps) {
  const { getImageUrl } = useImageCache()
  
  // Check if this is an uploaded image (starts with /uploads)
  const isUploadedImage = src.startsWith('/uploads/')
  
  // For uploaded images, add cache-busting parameter and use regular img tag
  if (isUploadedImage) {
    const cacheBustSrc = getImageUrl(src)
    
    return (
      <img
        src={cacheBustSrc}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}}
      />
    )
  }
  
  // For other images, use Next.js Image component
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      fill={fill}
      priority={priority}
    />
  )
}