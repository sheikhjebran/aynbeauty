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
  // Check if this is an uploaded image (starts with /uploads)
  const isUploadedImage = src.startsWith('/uploads/')
  
  // For uploaded images, use regular img tag to bypass Next.js optimization
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