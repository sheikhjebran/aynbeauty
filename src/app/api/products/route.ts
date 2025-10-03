import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        b.name as brand_name,
        b.slug as brand_slug,
        (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) as main_image,
        (SELECT AVG(pr.rating) FROM product_reviews pr WHERE pr.product_id = p.id) as avg_rating,
        (SELECT COUNT(*) FROM product_reviews pr WHERE pr.product_id = p.id) as review_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.is_active = TRUE
    `

    const params: any[] = []

    if (category) {
      query += ` AND c.slug = ?`
      params.push(category)
    }

    if (brand) {
      query += ` AND b.slug = ?`
      params.push(brand)
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ? OR b.name LIKE ?)`
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    // Get total count for pagination
    const countQuery = query.replace(
      'SELECT p.*, c.name as category_name, c.slug as category_slug, b.name as brand_name, b.slug as brand_slug, (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) as main_image, (SELECT AVG(pr.rating) FROM product_reviews pr WHERE pr.product_id = p.id) as avg_rating, (SELECT COUNT(*) FROM product_reviews pr WHERE pr.product_id = p.id) as review_count',
      'SELECT COUNT(*) as total'
    )

    const [countResult] = await executeQuery(countQuery, params) as any[]
    const total = countResult.total

    // Add pagination
    query += ` ORDER BY p.created_at DESC LIMIT ? OFFSET ?`
    params.push(limit, offset)

    const products = await executeQuery(query, params)

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST /api/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    const {
      name,
      description,
      price,
      sale_price,
      sku,
      category_id,
      brand_id,
      stock_quantity,
      images
    } = data

    // Insert product
    const result = await executeQuery(
      `INSERT INTO products (name, description, price, sale_price, sku, category_id, brand_id, stock_quantity)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, description, price, sale_price, sku, category_id, brand_id, stock_quantity]
    ) as any

    const productId = result.insertId

    // Insert images if provided
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        await executeQuery(
          `INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
           VALUES (?, ?, ?, ?)`,
          [productId, images[i].url, images[i].alt || name, i]
        )
      }
    }

    return NextResponse.json({ 
      success: true, 
      productId,
      message: 'Product created successfully' 
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}