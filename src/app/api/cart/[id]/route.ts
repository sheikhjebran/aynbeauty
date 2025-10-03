import { NextRequest, NextResponse } from 'next/server'
import { executeQuery, getOne } from '@/lib/database'
import jwt from 'jsonwebtoken'

interface User {
  id: number
  email: string
}

// PUT /api/cart/[id] - Update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const cartItemId = parseInt(params.id)
    const { quantity } = await request.json()

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: 'Valid quantity is required' },
        { status: 400 }
      )
    }

    // Check if cart item belongs to user
    const cartItem = await getOne(`
      SELECT ci.id, ci.product_id, p.stock_quantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = ? AND ci.user_id = ?
    `, [cartItemId, userId]) as any

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Check stock availability
    if (quantity > cartItem.stock_quantity) {
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Update quantity
    await executeQuery(`
      UPDATE cart_items 
      SET quantity = ?, updated_at = NOW()
      WHERE id = ?
    `, [quantity, cartItemId])

    return NextResponse.json({ 
      success: true,
      message: 'Cart item updated' 
    })
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart/[id] - Remove cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const cartItemId = parseInt(params.id)

    // Check if cart item belongs to user
    const cartItem = await getOne(`
      SELECT id FROM cart_items 
      WHERE id = ? AND user_id = ?
    `, [cartItemId, userId]) as any

    if (!cartItem) {
      return NextResponse.json(
        { error: 'Cart item not found' },
        { status: 404 }
      )
    }

    // Remove cart item
    await executeQuery(`
      DELETE FROM cart_items WHERE id = ?
    `, [cartItemId])

    return NextResponse.json({ 
      success: true,
      message: 'Cart item removed' 
    })
  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}