import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { revalidatePath } from 'next/cache'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    console.log('Upload request received, parsing form data...')
    
    // Log request size for debugging
    const contentLength = request.headers.get('content-length')
    console.log('Request content-length:', contentLength)
    
    const formData = await request.formData()
    const files = formData.getAll('images') as File[]
    
    console.log(`Received ${files.length} files for upload`)
    
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: 'No files uploaded' },
        { status: 400 }
      )
    }

    // Validate minimum and maximum files
    if (files.length < 1) {
      return NextResponse.json(
        { error: 'Please upload at least 1 image' },
        { status: 400 }
      )
    }

    if (files.length > 5) {
      return NextResponse.json(
        { error: 'Maximum 5 images allowed' },
        { status: 400 }
      )
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    const maxSize = 100 * 1024 * 1024 // 100MB per file
    const uploadedImages = []

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      // Validate file type
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { error: `Invalid file type for ${file.name}. Only JPEG, PNG, and WebP are allowed.` },
          { status: 400 }
        )
      }

      // Validate file size
      if (file.size > maxSize) {
        return NextResponse.json(
          { error: `File ${file.name} is too large. Maximum size is 100MB.` },
          { status: 400 }
        )
      }

      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2)
      const extension = path.extname(file.name)
      const filename = `product_${timestamp}_${randomString}_${i}${extension}`
      
      // Save file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const filepath = path.join(uploadsDir, filename)
      
      await writeFile(filepath, buffer)
      
      // Add to uploaded images array
      uploadedImages.push({
        url: `/api/images/products/${filename}`,
        filename: filename,
        originalName: file.name,
        size: file.size
      })
    }
    
    // Revalidate paths to refresh cached images
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/inventory')
    
    return NextResponse.json({
      success: true,
      images: uploadedImages,
      count: uploadedImages.length,
      message: `${uploadedImages.length} image(s) uploaded successfully`,
      timestamp: Date.now() // For cache busting
    })

  } catch (error) {
    console.error('Upload error:', error)
    
    // Check if this is a payload too large error
    if (error instanceof Error) {
      if (error.message.includes('PayloadTooLargeError') || 
          error.message.includes('request entity too large') ||
          error.message.includes('413')) {
        return NextResponse.json(
          { 
            error: 'File(s) too large. Server configuration limits request size. Please contact administrator.',
            code: 'PAYLOAD_TOO_LARGE',
            details: 'This is a server configuration issue, not an application limit.'
          },
          { status: 413 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to upload images' },
      { status: 500 }
    )
  }
}