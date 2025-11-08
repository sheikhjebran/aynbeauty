import { NextRequest, NextResponse } from 'next/server'
import mysql from 'mysql2/promise'

interface GuestCheckoutRequest {
  customer: {
    first_name: string
    last_name: string
    email: string
    phone: string
    address_line_1: string
    address_line_2?: string
    city: string
    state: string
    postal_code: string
    country: string
  }
  items: Array<{
    id: number
    product_id: number
    product_name: string
    price: number
    quantity: number
  }>
}

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'aynbeauty',
}

/**
 * POST /api/guest/checkout
 * Creates a guest order without authentication
 */
export async function POST(request: NextRequest) {
  try {
    const body: GuestCheckoutRequest = await request.json()

    // Validate request data
    if (!body.customer || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { message: 'Invalid request. Customer and items are required.' },
        { status: 400 }
      )
    }

    const { customer, items } = body

    // Validate customer data
    const validation = validateCustomerData(customer)
    if (!validation.valid) {
      return NextResponse.json(
        { message: 'Validation failed', errors: validation.errors },
        { status: 400 }
      )
    }

    // Create database connection
    const connection = await mysql.createConnection(dbConfig)

    try {
      // Generate order ID
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`

      // Calculate totals
      const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      const shipping = subtotal >= 299 ? 0 : 49
      const total = subtotal + shipping

      // Create guest user if doesn't exist
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE email = ? LIMIT 1',
        [customer.email]
      )

      let userId: number | null = null
      if (Array.isArray(existingUser) && existingUser.length === 0) {
        // Create guest user with temporary record
        const [result] = await connection.execute(
          `INSERT INTO users (email, first_name, last_name, phone, address_line_1, address_line_2, city, state, postal_code, country, is_guest, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())`,
          [
            customer.email,
            customer.first_name,
            customer.last_name,
            customer.phone,
            customer.address_line_1,
            customer.address_line_2 || null,
            customer.city,
            customer.state,
            customer.postal_code,
            customer.country
          ]
        )
        userId = (result as any).insertId
      } else if (Array.isArray(existingUser) && existingUser.length > 0) {
        const user = existingUser[0] as any
        userId = user.id
      }

      // Create order
      const [orderResult] = await connection.execute(
        `INSERT INTO orders (order_id, user_id, subtotal, shipping, total, status, payment_method, payment_status, notes, created_at)
         VALUES (?, ?, ?, ?, ?, 'pending', 'whatsapp', 'pending', ?, NOW())`,
        [
          orderId,
          userId,
          subtotal.toFixed(2),
          shipping.toFixed(2),
          total.toFixed(2),
          `Guest order - ${customer.first_name} ${customer.last_name}`
        ]
      )

      const insertedOrderId = (orderResult as any).insertId

      // Insert order items
      for (const item of items) {
        await connection.execute(
          `INSERT INTO order_items (order_id, product_id, quantity, price)
           VALUES (?, ?, ?, ?)`,
          [insertedOrderId, item.product_id, item.quantity, item.price.toFixed(2)]
        )
      }

      // Generate WhatsApp message
      const whatsappMessage = generateWhatsAppMessage(customer, items, orderId, subtotal, shipping, total)

      // Encode for WhatsApp link
      const encodedMessage = encodeURIComponent(whatsappMessage)
      const whatsappLink = `https://wa.me/919999999999?text=${encodedMessage}`

      return NextResponse.json(
        {
          success: true,
          orderId,
          whatsappLink,
          message: whatsappMessage,
          total: total.toFixed(2)
        },
        { status: 201 }
      )
    } finally {
      await connection.end()
    }
  } catch (error) {
    console.error('Guest checkout error:', error)
    return NextResponse.json(
      { message: 'Failed to process guest order', error: String(error) },
      { status: 500 }
    )
  }
}

/**
 * Validate customer data
 */
function validateCustomerData(customer: any): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!customer.first_name?.trim()) errors.push('First name is required')
  if (!customer.last_name?.trim()) errors.push('Last name is required')
  if (!customer.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
    errors.push('Valid email is required')
  }
  if (!customer.phone?.trim() || !/^[6-9]\d{9}$/.test(customer.phone.replace(/\D/g, ''))) {
    errors.push('Valid 10-digit phone number is required')
  }
  if (!customer.address_line_1?.trim()) errors.push('Address is required')
  if (!customer.city?.trim()) errors.push('City is required')
  if (!customer.state?.trim()) errors.push('State is required')
  if (!customer.postal_code?.trim() || !/^\d{6}$/.test(customer.postal_code.replace(/\s/g, ''))) {
    errors.push('Valid 6-digit postal code is required')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Generate WhatsApp message with order details
 */
function generateWhatsAppMessage(
  customer: any,
  items: any[],
  orderId: string,
  subtotal: number,
  shipping: number,
  total: number
): string {
  const itemsList = items
    .map(item => `• ${item.product_name} x${item.quantity} - ₹${(item.price * item.quantity).toFixed(2)}`)
    .join('\n')

  const address = [
    customer.address_line_1,
    customer.address_line_2 && customer.address_line_2,
    `${customer.city}, ${customer.state} ${customer.postal_code}`,
    customer.country
  ]
    .filter(Boolean)
    .join(', ')

  const message = `
*Order from AynBeauty* 🎀

*Customer Details:*
Name: ${customer.first_name} ${customer.last_name}
Email: ${customer.email}
Phone: ${customer.phone}

*Delivery Address:*
${address}

*Order Items:*
${itemsList}

*Order Summary:*
Subtotal: ₹${subtotal.toFixed(2)}
Shipping: ₹${shipping.toFixed(2)}
Total: ₹${total.toFixed(2)}

Order ID: ${orderId}

Please confirm this order. Thank you! 🙏
  `.trim()

  return message
}
