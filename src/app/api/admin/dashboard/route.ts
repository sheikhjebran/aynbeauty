import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'

// Prevent static generation of this dynamic route
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

// GET /api/admin/dashboard - Get dashboard stats
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    // Get dashboard statistics
    const [
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      lowStockProducts,
      topSellingProducts
    ] = await Promise.all([
      // Total users
      executeQuery('SELECT COUNT(*) as count FROM users WHERE role = "customer"'),
      
      // Total products
      executeQuery('SELECT COUNT(*) as count FROM products'),
      
      // Total orders
      executeQuery('SELECT COUNT(*) as count FROM orders'),
      
      // Total revenue (include all orders except cancelled and pending)
      executeQuery(`
        SELECT COALESCE(SUM(total_amount), 0) as total 
        FROM orders 
        WHERE payment_status = 'paid' OR status IN ('completed', 'delivered', 'shipped', 'processing', 'confirmed')
      `),
      
      // Recent orders (last 10)
      executeQuery(`
        SELECT o.*, u.first_name, u.last_name, u.email 
        FROM orders o 
        JOIN users u ON o.user_id = u.id 
        ORDER BY o.created_at DESC 
        LIMIT 10
      `),
      
      // Low stock products (less than 10 items)
      executeQuery(`
        SELECT id, name, stock_quantity, price 
        FROM products 
        WHERE stock_quantity < 10 
        ORDER BY stock_quantity ASC
      `),
      
      // Top selling products
      executeQuery(`
        SELECT p.id, p.name, p.price, p.stock_quantity,
               COALESCE(SUM(oi.quantity), 0) as total_sold
        FROM products p
        LEFT JOIN order_items oi ON p.id = oi.product_id
        LEFT JOIN orders o ON oi.order_id = o.id
        WHERE o.payment_status = 'paid' OR o.status IN ('completed', 'delivered', 'shipped', 'processing', 'confirmed') OR o.id IS NULL
        GROUP BY p.id, p.name, p.price, p.stock_quantity
        ORDER BY total_sold DESC
        LIMIT 10
      `)
    ]) as any[]

    const dashboardData = {
      stats: {
        totalUsers: (totalUsers[0] as any).count,
        totalProducts: (totalProducts[0] as any).count,
        totalOrders: (totalOrders[0] as any).count,
        totalRevenue: (totalRevenue[0] as any).total
      },
      recentOrders,
      lowStockProducts,
      topSellingProducts
    }

    return NextResponse.json({
      success: true,
      data: dashboardData
    })

  } catch (error) {
    console.error('Admin dashboard error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}