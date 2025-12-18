import React from 'react'
import Image from 'next/image'

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
  // Handle null or undefined src
  if (!src || typeof src !== 'string') {
    return (
      <div 
        className={className}
        style={fill ? { width: '100%', height: '100%', backgroundColor: '#f0f0f0' } : { width, height, backgroundColor: '#f0f0f0' }}
      />
    )
  }

  // Check if this is an uploaded image (starts with /uploads or /api/images)
  const isUploadedImage = src.startsWith('/uploads/') || src.startsWith('/api/images/')
  
  // For uploaded images, use regular img tag without cache busting
  // to prevent flickering from URL changes on re-renders
  if (isUploadedImage) {
    return (
      <img
        src={src}
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