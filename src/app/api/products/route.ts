import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

// GET /api/products - Get all products with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const brand = searchParams.get('brand')
    const search = searchParams.get('search')
    const trending = searchParams.get('trending')
    const featured = searchParams.get('featured')
    const sort = searchParams.get('sort') || 'newest'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const rating = searchParams.get('rating')
    const inStock = searchParams.get('inStock')
    const onSale = searchParams.get('onSale')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    let query = `
      SELECT 
        p.id, p.name, p.description, p.price, p.discounted_price, p.stock_quantity,
        p.image_url, p.primary_image, p.is_trending, p.is_must_have, p.is_new_arrival,
        p.created_at, p.updated_at,
        c.name as category_name,
        c.slug as category_slug,
        COALESCE(b.name, 'Unknown') as brand,
        COALESCE(AVG(pr.rating), 0) as rating,
        COUNT(pr.id) as rating_count
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = TRUE
      WHERE 1=1
    `

    const params: any[] = []

    if (category) {
      query += ` AND c.slug = ?`
      params.push(category)
    }

    if (brand) {
      query += ` AND b.name = ?`
      params.push(brand)
    }

    if (search) {
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`
      params.push(`%${search}%`, `%${search}%`)
    }

    if (minPrice) {
      query += ` AND p.price >= ?`
      params.push(parseFloat(minPrice))
    }

    if (maxPrice) {
      query += ` AND p.price <= ?`
      params.push(parseFloat(maxPrice))
    }

    if (inStock === 'true') {
      query += ` AND p.stock_quantity > 0`
    }

    if (onSale === 'true') {
      query += ` AND p.discounted_price IS NOT NULL AND p.discounted_price < p.price`
    }

    if (trending === 'true') {
      query += ` AND p.is_trending = 1`
    }

    if (featured === 'true') {
      query += ` AND p.is_must_have = 1`
    }

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total FROM (
        SELECT DISTINCT p.id, COALESCE(AVG(pr.rating), 0) as rating
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = TRUE
        WHERE 1=1
    `
    
    const countParams: any[] = []

    if (category) {
      countQuery += ` AND c.slug = ?`
      countParams.push(category)
    }

    if (brand) {
      countQuery += ` AND b.name = ?`
      countParams.push(brand)
    }

    if (search) {
      countQuery += ` AND (p.name LIKE ? OR p.description LIKE ?)`
      countParams.push(`%${search}%`, `%${search}%`)
    }

    if (minPrice) {
      countQuery += ` AND p.price >= ?`
      countParams.push(parseFloat(minPrice))
    }

    if (maxPrice) {
      countQuery += ` AND p.price <= ?`
      countParams.push(parseFloat(maxPrice))
    }

    if (inStock === 'true') {
      countQuery += ` AND p.stock_quantity > 0`
    }

    if (onSale === 'true') {
      countQuery += ` AND p.discounted_price IS NOT NULL AND p.discounted_price < p.price`
    }

    if (trending === 'true') {
      countQuery += ` AND p.is_trending = 1`
    }

    if (featured === 'true') {
      countQuery += ` AND p.is_must_have = 1`
    }
    
    countQuery += ` GROUP BY p.id`
    
    if (rating) {
      countQuery += ` HAVING rating >= ?`
      countParams.push(parseFloat(rating))
    }
    
    countQuery += `) as filtered_products`

    const [countResult] = await executeQuery(countQuery, countParams) as any[]
    const total = countResult.total

    // Add GROUP BY and sorting
    query += ` GROUP BY p.id, p.name, p.description, p.price, p.discounted_price, p.stock_quantity, p.image_url, p.primary_image, p.is_trending, p.is_must_have, p.is_new_arrival, p.created_at, p.updated_at, c.name, c.slug, b.name`
    
    // Apply rating filter after GROUP BY
    if (rating) {
      query += ` HAVING rating >= ?`
      params.push(parseFloat(rating))
    }
    
    // Add sorting
    switch (sort) {
      case 'price-low':
        query += ` ORDER BY p.price ASC`
        break
      case 'price-high':
        query += ` ORDER BY p.price DESC`
        break
      case 'rating':
        query += ` ORDER BY rating DESC, p.created_at DESC`
        break
      case 'name-asc':
        query += ` ORDER BY p.name ASC`
        break
      case 'name-desc':
        query += ` ORDER BY p.name DESC`
        break
      case 'popularity':
        query += ` ORDER BY rating_count DESC, rating DESC`
        break
      case 'relevance':
      case 'best-match':
        if (search) {
          query += ` ORDER BY (CASE WHEN p.name LIKE ? THEN 1 ELSE 2 END), rating DESC`
          params.push(`%${search}%`)
        } else {
          query += ` ORDER BY p.is_trending DESC, p.is_must_have DESC, rating DESC`
        }
        break
      case 'newest':
      default:
        query += ` ORDER BY p.created_at DESC`
        break
    }
    
    query += ` LIMIT ? OFFSET ?`
    params.push(Number(limit), Number(offset))

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