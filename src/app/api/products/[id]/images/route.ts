import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'

// GET product images
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    // First check if product_images table exists and has data
    const images = await executeQuery(
      'SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order, id',
      [productId]
    ) as any[]

    // If no images in product_images table, check main products table
    if (images.length === 0) {
      const product = await executeQuery(
        'SELECT image_url, primary_image FROM products WHERE id = ?',
        [productId]
      ) as any[]

      if (product.length > 0 && product[0].image_url) {
        return NextResponse.json({
          success: true,
          images: [{
            id: null,
            product_id: productId,
            image_url: product[0].image_url,
            is_primary: true,
            sort_order: 0
          }]
        })
      }
    }

    return NextResponse.json({
      success: true,
      images: images
    })

  } catch (error) {
    console.error('Error fetching product images:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product images' },
      { status: 500 }
    )
  }
}

// DELETE a specific product image
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // Delete the image record
    await executeQuery(
      'DELETE FROM product_images WHERE id = ? AND product_id = ?',
      [imageId, params.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Image deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting product image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete image' },
      { status: 500 }
    )
  }
}

// PUT to update primary image
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { imageId } = body

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: 'Image ID is required' },
        { status: 400 }
      )
    }

    // First, set all images for this product to not primary
    await executeQuery(
      'UPDATE product_images SET is_primary = FALSE WHERE product_id = ?',
      [params.id]
    )

    // Then set the selected image as primary
    await executeQuery(
      'UPDATE product_images SET is_primary = TRUE WHERE id = ? AND product_id = ?',
      [imageId, params.id]
    )

    return NextResponse.json({
      success: true,
      message: 'Primary image updated successfully'
    })

  } catch (error) {
    console.error('Error updating primary image:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update primary image' },
      { status: 500 }
    )
  }
}