import { NextRequest, NextResponse } from 'next/server'
import { executeQuery, getMany } from '@/lib/database'
import jwt from 'jsonwebtoken'

interface User {
  id: number
  email: string
}

// GET - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    const userId = decoded.id

    const query = `
      SELECT 
        w.id,
        w.product_id,
        w.created_at,
        p.name as product_name,
        p.price,
        p.original_price,
        p.slug,
        b.name as brand_name,
        pi.image_url,
        p.stock_quantity,
        COALESCE(AVG(pr.rating), 0) as avg_rating,
        COUNT(pr.id) as review_count
      FROM wishlist_items w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN brands b ON p.brand_id = b.id
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = TRUE
      LEFT JOIN product_reviews pr ON p.id = pr.product_id AND pr.is_approved = TRUE
      WHERE w.user_id = ? AND p.is_active = TRUE
      GROUP BY w.id, w.product_id, w.created_at, p.name, p.price, p.original_price, 
               p.slug, b.name, pi.image_url, p.stock_quantity
      ORDER BY w.created_at DESC
    `

    const wishlistItems = await getMany(query, [userId])

    return NextResponse.json({ 
      items: wishlistItems,
      total: wishlistItems.length 
    })

  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { message: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST - Add/Remove item from wishlist
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    const userId = decoded.id

    const { action, product_id } = await request.json()

    if (!action || !product_id) {
      return NextResponse.json(
        { message: 'Action and product_id are required' },
        { status: 400 }
      )
    }

    // Check if product exists
    const productExists = await getMany(
      'SELECT id FROM products WHERE id = ? AND is_active = TRUE',
      [product_id]
    )

    if (productExists.length === 0) {
      return NextResponse.json(
        { message: 'Product not found' },
        { status: 404 }
      )
    }

    if (action === 'add') {
      // Check if item already in wishlist
      const existingItem = await getMany(
        'SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?',
        [userId, product_id]
      )

      if (existingItem.length > 0) {
        return NextResponse.json(
          { message: 'Product already in wishlist' },
          { status: 409 }
        )
      }

      // Add to wishlist
      await executeQuery(
        'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
        [userId, product_id]
      )

      return NextResponse.json({ 
        message: 'Product added to wishlist',
        action: 'added'
      })

    } else if (action === 'remove') {
      // Remove from wishlist
      const result = await executeQuery(
        'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
        [userId, product_id]
      )

      return NextResponse.json({ 
        message: 'Product removed from wishlist',
        action: 'removed'
      })

    } else if (action === 'toggle') {
      // Check if item exists in wishlist
      const existingItem = await getMany(
        'SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?',
        [userId, product_id]
      )

      if (existingItem.length > 0) {
        // Remove from wishlist
        await executeQuery(
          'DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?',
          [userId, product_id]
        )
        return NextResponse.json({ 
          message: 'Product removed from wishlist',
          action: 'removed',
          inWishlist: false
        })
      } else {
        // Add to wishlist
        await executeQuery(
          'INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)',
          [userId, product_id]
        )
        return NextResponse.json({ 
          message: 'Product added to wishlist',
          action: 'added',
          inWishlist: true
        })
      }
    } else {
      return NextResponse.json(
        { message: 'Invalid action. Use add, remove, or toggle' },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('Error managing wishlist:', error)
    return NextResponse.json(
      { message: 'Failed to update wishlist' },
      { status: 500 }
    )
  }
}

// DELETE - Clear entire wishlist
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    const userId = decoded.id

    await executeQuery(
      'DELETE FROM wishlist_items WHERE user_id = ?',
      [userId]
    )

    return NextResponse.json({ 
      message: 'Wishlist cleared successfully' 
    })

  } catch (error) {
    console.error('Error clearing wishlist:', error)
    return NextResponse.json(
      { message: 'Failed to clear wishlist' },
      { status: 500 }
    )
  }
}