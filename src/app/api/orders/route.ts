import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/db'
import jwt from 'jsonwebtoken'

interface User {
  id: number
  email: string
}

// GET - Get user's orders
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    const userId = decoded.id

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const offset = (page - 1) * limit

    let whereClause = 'WHERE o.user_id = ?'
    const queryParams: any[] = [userId]

    if (status) {
      whereClause += ' AND o.status = ?'
      queryParams.push(status)
    }

    // Get orders with items
    const ordersQuery = `
      SELECT 
        o.*,
        GROUP_CONCAT(
          JSON_OBJECT(
            'id', oi.id,
            'product_name', oi.product_name,
            'variant_name', oi.variant_name,
            'quantity', oi.quantity,
            'unit_price', oi.unit_price,
            'total_price', oi.total_price
          )
        ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `

    queryParams.push(limit, offset)
    const orders = await executeQuery(ordersQuery, queryParams)

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `
    
    const [{ total }] = await executeQuery(countQuery, queryParams.slice(0, -2))

    // Parse items JSON
    const formattedOrders = orders.map((order: any) => ({
      ...order,
      items: order.items ? JSON.parse(`[${order.items}]`) : []
    }))

    return NextResponse.json({
      orders: formattedOrders,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { message: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as User
    const userId = decoded.id

    const {
      shipping_address,
      billing_address,
      payment_method,
      payment_reference,
      items
    } = await request.json()

    if (!shipping_address || !billing_address || !payment_method || !items || items.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate totals
    let subtotal = 0
    for (const item of items) {
      const [product] = await executeQuery(
        'SELECT price FROM products WHERE id = ? AND is_active = TRUE',
        [item.product_id]
      )
      
      if (!product) {
        return NextResponse.json(
          { message: `Product ${item.product_id} not found` },
          { status: 404 }
        )
      }
      
      subtotal += product.price * item.quantity
    }

    const shippingAmount = subtotal >= 299 ? 0 : 49
    const taxAmount = 0 // Add tax calculation if needed
    const discountAmount = 0 // Add discount calculation if needed
    const totalAmount = subtotal + shippingAmount + taxAmount - discountAmount

    // Generate order number
    const orderNumber = `AYN${Date.now()}${Math.random().toString(36).substr(2, 3).toUpperCase()}`

    // Create order
    const [orderResult] = await executeQuery(
      `INSERT INTO orders (
        user_id, order_number, status, payment_status, payment_method, payment_reference,
        subtotal, tax_amount, shipping_amount, discount_amount, total_amount,
        shipping_address, billing_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        orderNumber,
        'pending',
        payment_reference ? 'paid' : 'pending',
        payment_method,
        payment_reference || null,
        subtotal,
        taxAmount,
        shippingAmount,
        discountAmount,
        totalAmount,
        JSON.stringify(shipping_address),
        JSON.stringify(billing_address)
      ]
    )

    const orderId = (orderResult as any).insertId

    // Create order items
    for (const item of items) {
      const [product] = await executeQuery(
        'SELECT name, price FROM products WHERE id = ?',
        [item.product_id]
      )

      let variantName = null
      if (item.variant_id) {
        const [variant] = await executeQuery(
          'SELECT name FROM product_variants WHERE id = ?',
          [item.variant_id]
        )
        variantName = variant?.name
      }

      await executeQuery(
        `INSERT INTO order_items (
          order_id, product_id, variant_id, product_name, variant_name,
          quantity, unit_price, total_price
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id,
          item.variant_id || null,
          product.name,
          variantName,
          item.quantity,
          product.price,
          product.price * item.quantity
        ]
      )

      // Update product stock
      await executeQuery(
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
        [item.quantity, item.product_id]
      )
    }

    // Clear user's cart
    await executeQuery(
      'DELETE FROM cart_items WHERE user_id = ?',
      [userId]
    )

    return NextResponse.json({
      message: 'Order created successfully',
      order: {
        id: orderId,
        order_number: orderNumber,
        total_amount: totalAmount,
        status: 'pending'
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { message: 'Failed to create order' },
      { status: 500 }
    )
  }
}