import { NextRequest, NextResponse } from 'next/server'
import { executeQuery, getMany, getOne } from '@/lib/database'
import jwt from 'jsonwebtoken'

interface User {
  id: number
  email: string
}

// GET /api/cart - Get user's cart items
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    const userId = decoded.id

    const cartItems = await getMany(`
      SELECT 
        ci.*,
        p.name as product_name,
        p.price,
        p.discounted_price,
        p.sku,
        p.stock_quantity,
        p.slug as product_slug,
        (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) as image_url,
        b.name as brand_name
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE ci.user_id = ?
      ORDER BY ci.created_at DESC
    `, [userId]) as any[]

    // Calculate totals
    const subtotal = cartItems.reduce((total: number, item: any) => {
      const price = item.sale_price || item.price
      return total + (price * item.quantity)
    }, 0)

    return NextResponse.json({
      items: cartItems,
      summary: {
        subtotal,
        itemCount: cartItems.reduce((count: number, item: any) => count + item.quantity, 0),
        shipping: 0, // Calculate based on your shipping rules
        tax: subtotal * 0.18, // Example 18% tax
        total: subtotal + (subtotal * 0.18)
      }
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    const userId = decoded.id

    const { product_id, quantity = 1 } = await request.json()

    // Check if product exists and is in stock
    const product = await getOne(`
      SELECT stock_quantity, is_active, price 
      FROM products 
      WHERE id = ?
    `, [product_id]) as any

    if (!product || !product.is_active) {
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      )
    }

    if (product.stock_quantity < quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    const existingItem = await getOne(`
      SELECT id, quantity 
      FROM cart_items 
      WHERE user_id = ? AND product_id = ?
    `, [userId, product_id]) as any

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      if (product.stock_quantity < newQuantity) {
        return NextResponse.json(
          { error: 'Insufficient stock for requested quantity' },
          { status: 400 }
        )
      }

      await executeQuery(`
        UPDATE cart_items 
        SET quantity = ?, updated_at = NOW()
        WHERE id = ?
      `, [newQuantity, existingItem.id])
    } else {
      // Add new item
      await executeQuery(`
        INSERT INTO cart_items (user_id, product_id, quantity, price, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `, [userId, product_id, quantity, product.price])
    }

    return NextResponse.json({ 
      success: true,
      message: 'Item added to cart' 
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Clear cart
export async function DELETE(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    const userId = decoded.id

    await executeQuery(`
      DELETE FROM cart_items WHERE user_id = ?
    `, [userId])

    return NextResponse.json({ 
      success: true,
      message: 'Cart cleared' 
    })
  } catch (error) {
    console.error('Error clearing cart:', error)
    return NextResponse.json(
      { error: 'Failed to clear cart' },
      { status: 500 }
    )
  }
}