import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

// GET /api/products/[id] - Get single product details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    // Get product details with related data
    const [product] = await executeQuery(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        b.description as brand_description,
        (SELECT AVG(pr.rating) FROM product_reviews pr WHERE pr.product_id = p.id) as avg_rating,
        (SELECT COUNT(*) FROM product_reviews pr WHERE pr.product_id = p.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ? AND p.is_active = TRUE
    `, [productId]) as any[]

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get product images
    const images = await executeQuery(`
      SELECT image_url, alt_text, sort_order
      FROM product_images
      WHERE product_id = ?
      ORDER BY sort_order
    `, [productId])

    // Get product variants (colors, sizes, etc.)
    const variants = await executeQuery(`
      SELECT *
      FROM product_variants
      WHERE product_id = ? AND is_active = TRUE
      ORDER BY sort_order
    `, [productId])

    // Get recent reviews
    const reviews = await executeQuery(`
      SELECT 
        pr.*,
        u.first_name,
        u.last_name
      FROM product_reviews pr
      LEFT JOIN users u ON pr.user_id = u.id
      WHERE pr.product_id = ? AND pr.is_approved = TRUE
      ORDER BY pr.created_at DESC
      LIMIT 5
    `, [productId])

    // Get related products
    const relatedProducts = await executeQuery(`
      SELECT 
        p.id,
        p.name,
        p.price,
        p.sale_price,
        (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) as main_image,
        (SELECT AVG(pr.rating) FROM product_reviews pr WHERE pr.product_id = p.id) as avg_rating
      FROM products p
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = TRUE
      ORDER BY RAND()
      LIMIT 4
    `, [product.category_id, productId])

    return NextResponse.json({
      product: {
        ...product,
        images,
        variants,
        reviews,
        related_products: relatedProducts
      }
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    const data = await request.json()
    
    const {
      name,
      description,
      price,
      sale_price,
      stock_quantity,
      is_active
    } = data

    await executeQuery(`
      UPDATE products 
      SET name = ?, description = ?, price = ?, sale_price = ?, 
          stock_quantity = ?, is_active = ?, updated_at = NOW()
      WHERE id = ?
    `, [name, description, price, sale_price, stock_quantity, is_active, productId])

    return NextResponse.json({ 
      success: true,
      message: 'Product updated successfully' 
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    // Soft delete by setting is_active to false
    await executeQuery(`
      UPDATE products 
      SET is_active = FALSE, updated_at = NOW()
      WHERE id = ?
    `, [productId])

    return NextResponse.json({ 
      success: true,
      message: 'Product deleted successfully' 
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}