import { NextRequest, NextResponse } from 'next/server'
import { executeQuery, getMany, getOne } from '@/lib/database'
import jwt from 'jsonwebtoken'

interface User {
  id: number
  email: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CART API DEBUG ===')
    
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    console.log('Token received:', token ? 'Yes' : 'No')
    
    if (!token) {
      console.log('❌ No token provided')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    const userId = decoded.id
    console.log('User ID:', userId)

    const body = await request.json()
    console.log('Request body:', body)
    
    const { product_id, quantity = 1 } = body

    // Check if product exists and is in stock
    console.log('Checking product exists...')
    const product = await getOne(`
      SELECT stock_quantity, is_active, price 
      FROM products 
      WHERE id = ?
    `, [product_id]) as any

    console.log('Product found:', product)

    if (!product || !product.is_active) {
      console.log('❌ Product not found or inactive')
      return NextResponse.json(
        { error: 'Product not found or inactive' },
        { status: 404 }
      )
    }

    if (product.stock_quantity < quantity) {
      console.log('❌ Insufficient stock')
      return NextResponse.json(
        { error: 'Insufficient stock' },
        { status: 400 }
      )
    }

    // Check if item already exists in cart
    console.log('Checking existing cart item...')
    const existingItem = await getOne(`
      SELECT id, quantity 
      FROM cart_items 
      WHERE user_id = ? AND product_id = ?
    `, [userId, product_id]) as any

    console.log('Existing item:', existingItem)

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + quantity
      console.log('Updating quantity to:', newQuantity)
      
      if (product.stock_quantity < newQuantity) {
        console.log('❌ Insufficient stock for new quantity')
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
      
      console.log('✅ Cart item updated')
    } else {
      // Add new item
      console.log('Adding new cart item...')
      await executeQuery(`
        INSERT INTO cart_items (user_id, product_id, quantity, price, created_at, updated_at)
        VALUES (?, ?, ?, ?, NOW(), NOW())
      `, [userId, product_id, quantity, product.price])
      
      console.log('✅ New cart item added')
    }

    return NextResponse.json({ 
      success: true,
      message: 'Item added to cart' 
    })
  } catch (error) {
    console.error('❌ Cart API Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to add item to cart',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}