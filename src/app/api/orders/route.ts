import { NextRequest, NextResponse } from 'next/server'
import { executeQuery, getMany, insert } from '@/lib/database'
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

    const finalQueryParams = [...queryParams, limit, offset]
    const orders = await getMany(ordersQuery, finalQueryParams)

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM orders o
      ${whereClause}
    `
    
    const countResult = await getMany(countQuery, queryParams)
    const total = countResult[0]?.total || 0

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
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      const products = await getMany(
        'SELECT price FROM products WHERE id = ? AND is_active = TRUE',
        [item.product_id]
      )
      
      if (!products || products.length === 0) {
        return NextResponse.json(
          { message: `Product ${item.product_id} not found` },
          { status: 404 }
        )
      }
      
      const product = products[0]
      subtotal += product.price * item.quantity
    }

    const shippingAmount = subtotal >= 299 ? 0 : 49
    const taxAmount = 0 // Add tax calculation if needed
    const discountAmount = 0 // Add discount calculation if needed
    const totalAmount = subtotal + shippingAmount + taxAmount - discountAmount

    // Generate order number
    const orderNumber = `AYN${Date.now()}${Math.random().toString(36).substr(2, 3).toUpperCase()}`

    // Create order
    const orderResult = await insert('orders', {
      user_id: userId,
      order_number: orderNumber,
      status: 'pending',
      payment_status: payment_reference ? 'paid' : 'pending',
      payment_method: payment_method,
      payment_reference: payment_reference || null,
      subtotal: subtotal,
      tax_amount: taxAmount,
      shipping_amount: shippingAmount,
      discount_amount: discountAmount,
      total_amount: totalAmount,
      shipping_address: JSON.stringify(shipping_address),
      billing_address: JSON.stringify(billing_address)
    })

    const orderId = orderResult.insertId

    // Create order items
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      
      const products = await getMany(
        'SELECT name, price FROM products WHERE id = ?',
        [item.product_id]
      )
      
      if (!products || products.length === 0) {
        continue // Skip if product not found
      }
      
      const product = products[0]

      let variantName = null
      if (item.variant_id) {
        const variants = await getMany(
          'SELECT name FROM product_variants WHERE id = ?',
          [item.variant_id]
        )
        if (variants && variants.length > 0) {
          variantName = variants[0].name
        }
      }

      await insert('order_items', {
        order_id: orderId,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: product.name,
        variant_name: variantName,
        quantity: item.quantity,
        unit_price: product.price,
        total_price: product.price * item.quantity
      })

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