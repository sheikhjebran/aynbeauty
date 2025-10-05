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
  // Check if this is an uploaded image (starts with /uploads or /api/images)
  const isUploadedImage = src.startsWith('/uploads/') || src.startsWith('/api/images/')
  
  // For uploaded images, always use regular img tag with aggressive cache busting
  if (isUploadedImage) {
    // Use current timestamp for aggressive cache busting
    const separator = src.includes('?') ? '&' : '?'
    const cacheBustSrc = `${src}${separator}cb=${Date.now()}`
    
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