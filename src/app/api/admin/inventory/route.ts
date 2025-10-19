import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// Helper function to create slug
function createSlug(name: string): string {
  return name.toLowerCase()
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim();
}

// Middleware to verify admin access
async function verifyAdmin(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return { error: 'No token provided', status: 401 }
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any
    
    if (decoded.role !== 'admin') {
      return { error: 'Access denied. Admin role required.', status: 403 }
    }

    return { user: decoded }
  } catch (error) {
    return { error: 'Invalid token', status: 401 }
  }
}

// GET /api/admin/inventory - Get all products
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''

    // Build query conditions
    let whereClause = 'WHERE 1=1'
    const queryParams: any[] = []

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)'
      queryParams.push(`%${search}%`, `%${search}%`)
    }

    if (category) {
      whereClause += ' AND c.name = ?'
      queryParams.push(category)
    }

    // Get products
    const products = await executeQuery(`
      SELECT 
        p.id, p.name, p.description, p.price, p.discounted_price, p.stock_quantity, p.image_url, p.primary_image,
        p.is_trending, p.is_must_have, p.is_new_arrival, p.created_at, p.updated_at,
        c.name as category
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      ${whereClause}
      ORDER BY p.created_at DESC
    `, queryParams)

    return NextResponse.json({
      success: true,
      products
    })

  } catch (error) {
    console.error('Inventory fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inventory data' },
      { status: 500 }
    )
  }
}

// POST /api/admin/inventory - Add new product
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const {
      name,
      description,
      price,
      discounted_price,
      stock_quantity,
      category,
      image_urls = [],
      primary_image_index = 0,
      is_trending,
      is_must_have,
      is_new_arrival
    } = await request.json()

    // Validate required fields
    if (!name || !description || !price || !category) {
      return NextResponse.json(
        { error: 'Name, description, price, and category are required' },
        { status: 400 }
      )
    }

    // Map admin category names to database category names
    const categoryMapping: { [key: string]: string } = {
      'Skincare': 'Skincare',
      'Lips': 'Lips',
      'Bath & Body': 'Bath and Body',  // Map to actual database name
      'Fragrances': 'Fragrances',
      'Eyes': 'Eyes', 
      'Nails': 'Nails',
      'Combo Sets': 'Combo Sets'
    }

    const dbCategoryName = categoryMapping[category] || category

    // Get category ID using mapped name
    const categoryResult = await executeQuery(
      'SELECT id FROM categories WHERE name = ?',
      [dbCategoryName]
    ) as any[]

    if (categoryResult.length === 0) {
      return NextResponse.json(
        { error: `Invalid category: ${category} (mapped to: ${dbCategoryName})` },
        { status: 400 }
      )
    }

    const categoryId = categoryResult[0].id
    const slug = createSlug(name)
    
    // Get primary image URL if images are provided
    const primaryImageUrl = image_urls.length > 0 ? image_urls[primary_image_index] : null

    // Insert new product
    const result = await executeQuery(
      `INSERT INTO products (
        name, slug, description, price, discounted_price, stock_quantity, category_id, image_url, primary_image,
        is_trending, is_must_have, is_new_arrival, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name,
        slug,
        description,
        price,
        discounted_price || null,
        stock_quantity || 0,
        categoryId,
        primaryImageUrl, // For backward compatibility
        primaryImageUrl, // Set primary_image
        is_trending || false,
        is_must_have || false,
        is_new_arrival || false
      ]
    )

    const productId = (result as any).insertId

    // Insert product images into product_images table
    if (image_urls.length > 0) {
      for (let i = 0; i < image_urls.length; i++) {
        await executeQuery(
          `INSERT INTO product_images (product_id, image_url, is_primary, sort_order, created_at) 
           VALUES (?, ?, ?, ?, NOW())`,
          [productId, image_urls[i], i === primary_image_index, i]
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product added successfully',
      productId: productId
    })

  } catch (error: any) {
    console.error('Add product error:', error)
    
    // Check for duplicate entry error
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage?.includes('slug')) {
      return NextResponse.json(
        { error: 'Product already exists', message: 'A product with this name already exists. Please use a different name.' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to add product' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/inventory - Update product
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const {
      name,
      description,
      price,
      discounted_price,
      stock_quantity,
      category,
      image_urls = [],
      primary_image_index = 0,
      is_trending,
      is_must_have,
      is_new_arrival
    } = await request.json()

    // Map admin category names to database category names (same as POST method)
    const categoryMapping: { [key: string]: string } = {
      'Skincare': 'Skincare',
      'Lips': 'Lips',
      'Bath & Body': 'Bath and Body',  // Map to actual database name
      'Fragrances': 'Fragrances',
      'Eyes': 'Eyes', 
      'Nails': 'Nails',
      'Combo Sets': 'Combo Sets'
    }

    const dbCategoryName = categoryMapping[category] || category

    // Get category ID using mapped name
    const categoryResult = await executeQuery(
      'SELECT id FROM categories WHERE name = ?',
      [dbCategoryName]
    ) as any[]

    if (categoryResult.length === 0) {
      return NextResponse.json(
        { error: `Invalid category: ${category} (mapped to: ${dbCategoryName})` },
        { status: 400 }
      )
    }

    const categoryId = categoryResult[0].id
    const slug = createSlug(name)
    
    // Get primary image URL if images are provided
    const primaryImageUrl = image_urls.length > 0 ? image_urls[primary_image_index] : null

    // Update product
    await executeQuery(
      `UPDATE products 
       SET name = ?, slug = ?, description = ?, price = ?, discounted_price = ?, stock_quantity = ?, category_id = ?, 
           image_url = ?, primary_image = ?, is_trending = ?, is_must_have = ?, is_new_arrival = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        name,
        slug,
        description,
        price,
        discounted_price || null,
        stock_quantity,
        categoryId,
        primaryImageUrl, // For backward compatibility
        primaryImageUrl, // Set primary_image
        is_trending || false,
        is_must_have || false,
        is_new_arrival || false,
        productId
      ]
    )

    // Update product images if new images are provided
    if (image_urls.length > 0) {
      // Delete existing product images
      await executeQuery('DELETE FROM product_images WHERE product_id = ?', [productId])
      
      // Insert new product images
      for (let i = 0; i < image_urls.length; i++) {
        await executeQuery(
          `INSERT INTO product_images (product_id, image_url, is_primary, sort_order, created_at) 
           VALUES (?, ?, ?, ?, NOW())`,
          [productId, image_urls[i], i === primary_image_index, i]
        )
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Product updated successfully'
    })

  } catch (error: any) {
    console.error('Update product error:', error)
    
    // Check for duplicate entry error
    if (error.code === 'ER_DUP_ENTRY' && error.sqlMessage?.includes('slug')) {
      return NextResponse.json(
        { error: 'Product already exists', message: 'A product with this name already exists. Please use a different name.' },
        { status: 409 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

// DELETE /api/admin/inventory - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('id')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Delete product
    await executeQuery('DELETE FROM products WHERE id = ?', [productId])

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })

  } catch (error) {
    console.error('Delete product error:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}