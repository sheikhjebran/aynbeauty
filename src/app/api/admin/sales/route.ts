import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'

export const dynamic = 'force-dynamic'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

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

// GET /api/admin/sales - Get comprehensive sales analytics
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const { searchParams } = new URL(request.url)
    const dateFilter = searchParams.get('dateFilter') || '30' // Default last 30 days

    let dateCondition = ''
    if (dateFilter === 'today') {
      dateCondition = 'AND DATE(o.created_at) = CURDATE()'
    } else if (dateFilter === '7') {
      dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    } else if (dateFilter === '30') {
      dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    } else if (dateFilter === '90') {
      dateCondition = 'AND o.created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)'
    } else if (dateFilter === 'year') {
      dateCondition = 'AND YEAR(o.created_at) = YEAR(CURDATE())'
    } else if (dateFilter === 'all') {
      dateCondition = ''
    }

    // Get sales analytics
    const [
      totalSalesData,
      salesPerProduct,
      salesPerDay,
      revenuePerProduct,
      revenuePerDay,
      topCustomers,
      salesByCategory
    ] = await Promise.all([
      // Total sales summary
      executeQuery(`
        SELECT 
          COUNT(DISTINCT o.id) as total_orders,
          COALESCE(SUM(o.total_amount), 0) as total_revenue,
          COALESCE(SUM(oi.quantity), 0) as total_items_sold,
          COALESCE(AVG(o.total_amount), 0) as average_order_value
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE (o.payment_status = 'paid' OR o.status IN ('completed', 'delivered', 'shipped', 'processing', 'confirmed'))
        ${dateCondition}
      `),

      // Sales count per product
      executeQuery(`
        SELECT 
          p.id,
          p.name,
          p.sku,
          p.price,
          p.stock_quantity,
          COALESCE(SUM(oi.quantity), 0) as units_sold,
          COALESCE(SUM(oi.total_price), 0) as revenue,
          COUNT(DISTINCT o.id) as number_of_orders
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id 
          AND (o.payment_status = 'paid' OR o.status IN ('completed', 'delivered', 'shipped', 'processing', 'confirmed'))
          ${dateCondition.replace('o.created_at', 'o.created_at')}
        GROUP BY p.id, p.name, p.sku, p.price, p.stock_quantity
        HAVING units_sold > 0
        ORDER BY units_sold DESC
        LIMIT 50
      `),

      // Sales per day
      executeQuery(`
        SELECT 
          DATE(o.created_at) as sale_date,
          COUNT(DISTINCT o.id) as orders_count,
          COALESCE(SUM(oi.quantity), 0) as items_sold,
          COALESCE(SUM(o.total_amount), 0) as daily_revenue
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        WHERE (o.payment_status = 'paid' OR o.status IN ('completed', 'delivered', 'shipped', 'processing', 'confirmed'))
        ${dateCondition}
        GROUP BY DATE(o.created_at)
        ORDER BY sale_date DESC
        LIMIT 90
      `),

      // Revenue per product
      executeQuery(`
        SELECT 
          p.id,
          p.name,
          p.price,
          COALESCE(SUM(oi.quantity), 0) as units_sold,
          COALESCE(SUM(oi.total_price), 0) as total_revenue,
          COALESCE(AVG(oi.unit_price), 0) as average_selling_price
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id 
          AND (o.payment_status = 'paid' OR o.status IN ('completed', 'delivered', 'shipped', 'processing', 'confirmed'))
          ${dateCondition.replace('o.created_at', 'o.created_at')}
        GROUP BY p.id, p.name, p.price
        HAVING total_revenue > 0
        ORDER BY total_revenue DESC
        LIMIT 50
      `),

      // Revenue per day
      executeQuery(`
        SELECT 
          DATE(o.created_at) as date,
          COALESCE(SUM(o.total_amount), 0) as revenue,
          COALESCE(SUM(o.subtotal), 0) as subtotal,
          COALESCE(SUM(o.tax_amount), 0) as tax,
          COALESCE(SUM(o.shipping_amount), 0) as shipping
        FROM orders o
        WHERE (o.payment_status = 'paid' OR o.status IN ('completed', 'delivered', 'shipped', 'processing', 'confirmed'))
        ${dateCondition}
        GROUP BY DATE(o.created_at)
        ORDER BY date DESC
        LIMIT 90
      `),

      // Top customers by revenue
      executeQuery(`
        SELECT 
          u.id,
          u.first_name,
          u.last_name,
          u.email,
          COUNT(DISTINCT o.id) as total_orders,
          COALESCE(SUM(o.total_amount), 0) as total_spent
        FROM users u
        INNER JOIN orders o ON u.id = o.user_id
        WHERE (o.payment_status = 'paid' OR o.status IN ('completed', 'delivered', 'shipped', 'processing', 'confirmed'))
        ${dateCondition}
        GROUP BY u.id, u.first_name, u.last_name, u.email
        ORDER BY total_spent DESC
        LIMIT 20
      `),

      // Sales by category
      executeQuery(`
        SELECT 
          c.id,
          c.name as category_name,
          COUNT(DISTINCT o.id) as orders_count,
          COALESCE(SUM(oi.quantity), 0) as units_sold,
          COALESCE(SUM(oi.total_price), 0) as revenue
        FROM categories c
        INNER JOIN products p ON p.category_id = c.id
        INNER JOIN order_items oi ON oi.product_id = p.id
        INNER JOIN orders o ON o.id = oi.order_id
        WHERE (o.payment_status = 'paid' OR o.status IN ('completed', 'delivered', 'shipped', 'processing', 'confirmed'))
        ${dateCondition}
        GROUP BY c.id, c.name
        ORDER BY revenue DESC
      `)
    ]) as any[]

    const salesData = {
      summary: totalSalesData[0] || {
        total_orders: 0,
        total_revenue: 0,
        total_items_sold: 0,
        average_order_value: 0
      },
      salesPerProduct,
      salesPerDay,
      revenuePerProduct,
      revenuePerDay,
      topCustomers,
      salesByCategory
    }

    return NextResponse.json({
      success: true,
      data: salesData
    })

  } catch (error) {
    console.error('Sales analytics error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sales data' },
      { status: 500 }
    )
  }
}
