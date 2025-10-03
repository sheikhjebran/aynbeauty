import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import { RowDataPacket } from 'mysql2'
import jwt from 'jsonwebtoken'

// Helper function to verify JWT token and admin access
async function verifyAdminToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    // Check if user is admin (in production, check role from database)
    if (decoded.email !== 'admin@aynbeauty.com') {
      return null
    }

    return decoded
  } catch (error) {
    return null
  }
}

interface SalesMetrics extends RowDataPacket {
  total_revenue: number
  total_orders: number
  average_order_value: number
  conversion_rate: number
  period: string
}

interface CustomerMetrics extends RowDataPacket {
  total_customers: number
  new_customers: number
  returning_customers: number
  customer_lifetime_value: number
  churn_rate: number
}

interface ProductMetrics extends RowDataPacket {
  product_id: number
  product_name: string
  category: string
  units_sold: number
  revenue: number
  profit_margin: number
  return_rate: number
  rating: number
}

interface UserBehaviorMetrics extends RowDataPacket {
  page_views: number
  unique_visitors: number
  bounce_rate: number
  session_duration: number
  pages_per_session: number
}

// GET: Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const url = new URL(request.url)
    const type = url.searchParams.get('type') || 'overview'
    const period = url.searchParams.get('period') || '30d'
    const startDate = url.searchParams.get('start_date')
    const endDate = url.searchParams.get('end_date')

    const connection = await dbConnect.getConnection()
    
    try {
      let analytics = {}

      switch (type) {
        case 'overview':
          analytics = await getOverviewAnalytics(period, connection)
          break

        case 'sales':
          analytics = await getSalesAnalytics(period, startDate, endDate, connection)
          break

        case 'customers':
          analytics = await getCustomerAnalytics(period, connection)
          break

        case 'products':
          analytics = await getProductAnalytics(period, connection)
          break

        case 'behavior':
          analytics = await getUserBehaviorAnalytics(period, connection)
          break

        case 'loyalty':
          analytics = await getLoyaltyAnalytics(period, connection)
          break

        case 'marketing':
          analytics = await getMarketingAnalytics(period, connection)
          break

        case 'inventory':
          analytics = await getInventoryAnalytics(connection)
          break

        case 'financial':
          analytics = await getFinancialAnalytics(period, connection)
          break

        case 'cohort':
          analytics = await getCohortAnalysis(connection)
          break

        case 'funnel':
          analytics = await getFunnelAnalysis(period, connection)
          break

        case 'real_time':
          analytics = await getRealTimeAnalytics(connection)
          break

        default:
          return NextResponse.json({ message: 'Invalid analytics type' }, { status: 400 })
      }

      return NextResponse.json({
        ...analytics,
        period,
        generated_at: new Date().toISOString(),
        cache_duration: 300 // 5 minutes
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { message: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}

// POST: Generate custom reports
export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdminToken(request)
    if (!admin) {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { report_type, filters, dimensions, metrics, date_range } = body

    const connection = await dbConnect.getConnection()

    try {
      const customReport = await generateCustomReport(
        report_type,
        filters,
        dimensions,
        metrics,
        date_range,
        connection
      )

      // Save report configuration for future use
      const [reportResult] = await connection.execute(
        `INSERT INTO custom_reports 
         (admin_id, report_name, configuration, created_at) 
         VALUES (?, ?, ?, NOW())`,
        [admin.id, `Custom Report ${new Date().toISOString()}`, JSON.stringify(body)]
      ) as [any, any]

      return NextResponse.json({
        report_id: reportResult.insertId,
        data: customReport,
        generated_at: new Date().toISOString()
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error generating custom report:', error)
    return NextResponse.json(
      { message: 'Failed to generate custom report' },
      { status: 500 }
    )
  }
}

async function getOverviewAnalytics(period: string, connection: any) {
  const dateFilter = getPeriodFilter(period)

  // Get key metrics
  const [salesMetrics] = await connection.execute(
    `SELECT 
       COUNT(*) as total_orders,
       SUM(total_amount) as total_revenue,
       AVG(total_amount) as average_order_value,
       COUNT(DISTINCT user_id) as unique_customers
     FROM orders 
     WHERE order_status = 'delivered' ${dateFilter}`,
    []
  ) as [SalesMetrics[], any]

  const [customerMetrics] = await connection.execute(
    `SELECT 
       COUNT(DISTINCT u.id) as total_customers,
       COUNT(DISTINCT CASE WHEN u.created_at ${dateFilter.replace('AND', 'AND u.created_at')} THEN u.id END) as new_customers
     FROM users u`,
    []
  ) as [CustomerMetrics[], any]

  const [productMetrics] = await connection.execute(
    `SELECT 
       COUNT(DISTINCT p.id) as total_products,
       COUNT(DISTINCT CASE WHEN p.stock_quantity <= 10 THEN p.id END) as low_stock_products,
       AVG(p.rating) as average_rating
     FROM products p`,
    []
  ) as [any[], any]

  const [behaviorMetrics] = await connection.execute(
    `SELECT 
       COUNT(*) as total_sessions,
       AVG(duration_seconds) as avg_session_duration,
       COUNT(DISTINCT user_id) as unique_visitors
     FROM user_behavior ub 
     WHERE ub.created_at ${dateFilter.replace('AND', 'AND ub.created_at')}`,
    []
  ) as [UserBehaviorMetrics[], any]

  return {
    sales: salesMetrics[0],
    customers: customerMetrics[0],
    products: productMetrics[0],
    behavior: behaviorMetrics[0],
    trends: await getTrendData(period, connection)
  }
}

async function getSalesAnalytics(period: string, startDate: string | null, endDate: string | null, connection: any) {
  const dateFilter = startDate && endDate 
    ? `AND created_at BETWEEN '${startDate}' AND '${endDate}'`
    : getPeriodFilter(period)

  // Daily sales trend
  const [dailySales] = await connection.execute(
    `SELECT 
       DATE(created_at) as date,
       COUNT(*) as orders,
       SUM(total_amount) as revenue,
       AVG(total_amount) as avg_order_value
     FROM orders 
     WHERE order_status = 'delivered' ${dateFilter}
     GROUP BY DATE(created_at)
     ORDER BY date`,
    []
  )

  // Sales by category
  const [categoryBreakdown] = await connection.execute(
    `SELECT 
       c.name as category,
       COUNT(oi.id) as items_sold,
       SUM(oi.price * oi.quantity) as revenue,
       AVG(oi.price) as avg_price
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     JOIN categories c ON p.category_id = c.id
     JOIN orders o ON oi.order_id = o.id
     WHERE o.order_status = 'delivered' ${dateFilter.replace('created_at', 'o.created_at')}
     GROUP BY c.id, c.name
     ORDER BY revenue DESC`,
    []
  )

  // Top selling products
  const [topProducts] = await connection.execute(
    `SELECT 
       p.id, p.name, p.brand, c.name as category,
       COUNT(oi.id) as units_sold,
       SUM(oi.price * oi.quantity) as revenue
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     JOIN categories c ON p.category_id = c.id
     JOIN orders o ON oi.order_id = o.id
     WHERE o.order_status = 'delivered' ${dateFilter.replace('created_at', 'o.created_at')}
     GROUP BY p.id, p.name, p.brand, c.name
     ORDER BY revenue DESC
     LIMIT 20`,
    []
  )

  // Revenue goals and forecasting
  const forecast = await generateSalesForecast(dailySales, connection)

  return {
    daily_trends: dailySales,
    category_breakdown: categoryBreakdown,
    top_products: topProducts,
    forecast,
    period_summary: await getSalesSummary(period, connection)
  }
}

async function getCustomerAnalytics(period: string, connection: any) {
  const dateFilter = getPeriodFilter(period)

  // Customer acquisition
  const [acquisition] = await connection.execute(
    `SELECT 
       DATE(created_at) as date,
       COUNT(*) as new_customers
     FROM users 
     WHERE created_at ${dateFilter.replace('AND', 'AND created_at')}
     GROUP BY DATE(created_at)
     ORDER BY date`,
    []
  )

  // Customer segments
  const [segments] = await connection.execute(
    `SELECT 
       CASE 
         WHEN order_count >= 10 THEN 'VIP'
         WHEN order_count >= 5 THEN 'Loyal'
         WHEN order_count >= 2 THEN 'Regular'
         ELSE 'New'
       END as segment,
       COUNT(*) as customer_count,
       AVG(total_spent) as avg_lifetime_value
     FROM (
       SELECT 
         u.id,
         COUNT(o.id) as order_count,
         COALESCE(SUM(o.total_amount), 0) as total_spent
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id AND o.order_status = 'delivered'
       GROUP BY u.id
     ) customer_stats
     GROUP BY segment`,
    []
  )

  // Customer lifetime value analysis
  const [clvAnalysis] = await connection.execute(
    `SELECT 
       AVG(total_spent) as avg_clv,
       MIN(total_spent) as min_clv,
       MAX(total_spent) as max_clv,
       STDDEV(total_spent) as clv_std_dev
     FROM (
       SELECT 
         u.id,
         COALESCE(SUM(o.total_amount), 0) as total_spent
       FROM users u
       LEFT JOIN orders o ON u.id = o.user_id AND o.order_status = 'delivered'
       GROUP BY u.id
     ) customer_clv`,
    []
  )

  // Geographic distribution
  const [geographic] = await connection.execute(
    `SELECT 
       shipping_city as city,
       shipping_state as state,
       COUNT(DISTINCT o.user_id) as customers,
       SUM(o.total_amount) as revenue
     FROM orders o
     WHERE o.order_status = 'delivered' ${dateFilter.replace('AND', 'AND o.')}
     GROUP BY shipping_city, shipping_state
     ORDER BY revenue DESC
     LIMIT 20`,
    []
  )

  return {
    acquisition_trends: acquisition,
    customer_segments: segments,
    lifetime_value: clvAnalysis[0],
    geographic_distribution: geographic,
    retention_analysis: await getRetentionAnalysis(connection)
  }
}

async function getProductAnalytics(period: string, connection: any) {
  const dateFilter = getPeriodFilter(period)

  // Product performance
  const [productPerformance] = await connection.execute(
    `SELECT 
       p.id, p.name, p.brand, c.name as category,
       p.view_count,
       p.rating,
       p.rating_count,
       COUNT(oi.id) as units_sold,
       SUM(oi.price * oi.quantity) as revenue,
       AVG(oi.price) as avg_selling_price,
       p.stock_quantity,
       (COUNT(oi.id) / p.view_count) * 100 as conversion_rate
     FROM products p
     JOIN categories c ON p.category_id = c.id
     LEFT JOIN order_items oi ON p.id = oi.product_id
     LEFT JOIN orders o ON oi.order_id = o.id AND o.order_status = 'delivered' ${dateFilter.replace('AND', 'AND o.created_at')}
     GROUP BY p.id, p.name, p.brand, c.name, p.view_count, p.rating, p.rating_count, p.stock_quantity
     ORDER BY revenue DESC
     LIMIT 50`,
    []
  )

  // Category analysis
  const [categoryAnalysis] = await connection.execute(
    `SELECT 
       c.name as category,
       COUNT(DISTINCT p.id) as product_count,
       AVG(p.rating) as avg_rating,
       SUM(p.view_count) as total_views,
       COUNT(oi.id) as total_units_sold,
       SUM(oi.price * oi.quantity) as total_revenue
     FROM categories c
     JOIN products p ON c.id = p.category_id
     LEFT JOIN order_items oi ON p.id = oi.product_id
     LEFT JOIN orders o ON oi.order_id = o.id AND o.order_status = 'delivered'
     GROUP BY c.id, c.name
     ORDER BY total_revenue DESC`,
    []
  )

  // Inventory alerts
  const [inventoryAlerts] = await connection.execute(
    `SELECT 
       p.id, p.name, p.brand, c.name as category,
       p.stock_quantity,
       CASE 
         WHEN p.stock_quantity = 0 THEN 'Out of Stock'
         WHEN p.stock_quantity <= 5 THEN 'Critical'
         WHEN p.stock_quantity <= 20 THEN 'Low Stock'
         ELSE 'Normal'
       END as alert_level
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.stock_quantity <= 20
     ORDER BY p.stock_quantity ASC`,
    []
  )

  return {
    product_performance: productPerformance,
    category_analysis: categoryAnalysis,
    inventory_alerts: inventoryAlerts,
    trending_products: await getTrendingProducts(connection),
    recommendation_performance: await getRecommendationMetrics(connection)
  }
}

async function getUserBehaviorAnalytics(period: string, connection: any) {
  const dateFilter = getPeriodFilter(period)

  // Page views and sessions
  const [pageAnalytics] = await connection.execute(
    `SELECT 
       page_url,
       COUNT(*) as total_views,
       COUNT(DISTINCT user_id) as unique_visitors,
       AVG(duration_seconds) as avg_time_on_page,
       COUNT(DISTINCT session_id) as sessions
     FROM user_behavior 
     WHERE created_at ${dateFilter.replace('AND', 'AND created_at')}
     GROUP BY page_url
     ORDER BY total_views DESC
     LIMIT 50`,
    []
  )

  // User flow analysis
  const [userFlow] = await connection.execute(
    `SELECT 
       ub1.page_url as from_page,
       ub2.page_url as to_page,
       COUNT(*) as transition_count
     FROM user_behavior ub1
     JOIN user_behavior ub2 ON ub1.user_id = ub2.user_id 
       AND ub1.session_id = ub2.session_id 
       AND ub2.created_at > ub1.created_at
     WHERE ub1.created_at ${dateFilter.replace('AND', 'AND ub1.created_at')}
     GROUP BY ub1.page_url, ub2.page_url
     HAVING transition_count > 10
     ORDER BY transition_count DESC
     LIMIT 100`,
    []
  )

  // Device and browser analytics
  const [deviceAnalytics] = await connection.execute(
    `SELECT 
       'Desktop' as device_type,
       COUNT(*) as sessions,
       AVG(duration_seconds) as avg_session_duration
     FROM user_behavior 
     WHERE created_at ${dateFilter.replace('AND', 'AND created_at')}
     UNION ALL
     SELECT 
       'Mobile' as device_type,
       COUNT(*) as sessions,
       AVG(duration_seconds) as avg_session_duration
     FROM user_behavior 
     WHERE created_at ${dateFilter.replace('AND', 'AND created_at')}`,
    []
  )

  return {
    page_analytics: pageAnalytics,
    user_flow: userFlow,
    device_breakdown: deviceAnalytics,
    conversion_funnel: await getConversionFunnel(connection),
    search_analytics: await getSearchAnalytics(period, connection)
  }
}

async function getLoyaltyAnalytics(period: string, connection: any) {
  const dateFilter = getPeriodFilter(period)

  // Loyalty program performance
  const [loyaltyOverview] = await connection.execute(
    `SELECT 
       lt.name as tier,
       COUNT(la.user_id) as member_count,
       AVG(la.current_points) as avg_points,
       SUM(la.total_points) as total_points_earned
     FROM loyalty_accounts la
     JOIN loyalty_tiers lt ON la.tier_id = lt.id
     GROUP BY lt.id, lt.name
     ORDER BY lt.min_points`,
    []
  )

  // Points transactions
  const [pointsActivity] = await connection.execute(
    `SELECT 
       DATE(created_at) as date,
       transaction_type,
       SUM(points) as total_points,
       COUNT(*) as transaction_count
     FROM loyalty_point_transactions 
     WHERE created_at ${dateFilter.replace('AND', 'AND created_at')}
     GROUP BY DATE(created_at), transaction_type
     ORDER BY date`,
    []
  )

  // Reward redemptions
  const [rewardRedemptions] = await connection.execute(
    `SELECT 
       lr.name as reward_name,
       COUNT(*) as redemption_count,
       SUM(lr.required_points) as points_redeemed
     FROM loyalty_point_transactions lpt
     JOIN loyalty_rewards lr ON lpt.description LIKE CONCAT('%', lr.name, '%')
     WHERE lpt.transaction_type = 'redeemed' ${dateFilter.replace('AND', 'AND lpt.created_at')}
     GROUP BY lr.name
     ORDER BY redemption_count DESC`,
    []
  )

  return {
    tier_distribution: loyaltyOverview,
    points_activity: pointsActivity,
    reward_redemptions: rewardRedemptions,
    program_roi: await calculateLoyaltyROI(connection)
  }
}

async function getMarketingAnalytics(period: string, connection: any) {
  const dateFilter = getPeriodFilter(period)

  // Campaign performance
  const [campaignPerformance] = await connection.execute(
    `SELECT 
       c.name as campaign_name,
       c.campaign_type,
       c.discount_percentage,
       COUNT(DISTINCT o.user_id) as customers_reached,
       COUNT(o.id) as orders_generated,
       SUM(o.total_amount) as revenue_generated,
       (SUM(o.total_amount) - SUM(o.total_amount * c.discount_percentage / 100)) as net_revenue
     FROM campaigns c
     LEFT JOIN orders o ON o.created_at BETWEEN c.start_date AND c.end_date 
       AND o.order_status = 'delivered'
     WHERE c.start_date ${dateFilter.replace('AND', 'AND c.start_date')}
     GROUP BY c.id, c.name, c.campaign_type, c.discount_percentage
     ORDER BY revenue_generated DESC`,
    []
  )

  // Email marketing metrics (mock data - integrate with email service)
  const emailMetrics = {
    emails_sent: 15000,
    open_rate: 0.24,
    click_rate: 0.08,
    conversion_rate: 0.03,
    unsubscribe_rate: 0.01
  }

  // Social media metrics (mock data - integrate with social APIs)
  const socialMetrics = {
    followers_growth: 1200,
    engagement_rate: 0.06,
    reach: 45000,
    impressions: 120000
  }

  return {
    campaign_performance: campaignPerformance,
    email_metrics: emailMetrics,
    social_metrics: socialMetrics,
    attribution_analysis: await getAttributionAnalysis(connection)
  }
}

// Helper functions

function getPeriodFilter(period: string): string {
  switch (period) {
    case '7d':
      return 'AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)'
    case '30d':
      return 'AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
    case '90d':
      return 'AND created_at >= DATE_SUB(NOW(), INTERVAL 90 DAY)'
    case '1y':
      return 'AND created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)'
    default:
      return 'AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)'
  }
}

async function getTrendData(period: string, connection: any) {
  // Calculate growth trends for key metrics
  const [trends] = await connection.execute(
    `SELECT 
       'revenue' as metric,
       SUM(total_amount) as current_value,
       LAG(SUM(total_amount)) OVER (ORDER BY WEEK(created_at)) as previous_value
     FROM orders 
     WHERE order_status = 'delivered' 
     AND created_at >= DATE_SUB(NOW(), INTERVAL 60 DAY)
     GROUP BY WEEK(created_at)
     ORDER BY WEEK(created_at) DESC
     LIMIT 2`,
    []
  )

  return trends
}

async function generateSalesForecast(historicalData: any[], connection: any) {
  // Simple linear regression forecast (in production, use more sophisticated ML models)
  if (historicalData.length < 7) return { forecast: [], confidence: 0 }

  const recentTrend = historicalData.slice(-7)
  const avgGrowth = recentTrend.reduce((sum, day, index) => {
    if (index === 0) return 0
    return sum + (day.revenue - recentTrend[index - 1].revenue) / recentTrend[index - 1].revenue
  }, 0) / (recentTrend.length - 1)

  const forecast = []
  let lastValue = recentTrend[recentTrend.length - 1].revenue

  for (let i = 1; i <= 7; i++) {
    lastValue = lastValue * (1 + avgGrowth)
    forecast.push({
      date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      predicted_revenue: Math.round(lastValue),
      confidence: Math.max(0.5, 0.9 - i * 0.05)
    })
  }

  return { forecast, methodology: 'Linear Trend Analysis' }
}

// Additional helper functions would be implemented here...
async function getSalesSummary(period: string, connection: any) { return {} }
async function getRetentionAnalysis(connection: any) { return {} }
async function getTrendingProducts(connection: any) { return [] }
async function getRecommendationMetrics(connection: any) { return {} }
async function getConversionFunnel(connection: any) { return {} }
async function getSearchAnalytics(period: string, connection: any) { return {} }
async function calculateLoyaltyROI(connection: any) { return {} }
async function getAttributionAnalysis(connection: any) { return {} }
async function getInventoryAnalytics(connection: any) { return {} }
async function getFinancialAnalytics(period: string, connection: any) { return {} }
async function getCohortAnalysis(connection: any) { return {} }
async function getFunnelAnalysis(period: string, connection: any) { return {} }
async function getRealTimeAnalytics(connection: any) { return {} }
async function generateCustomReport(reportType: string, filters: any, dimensions: any, metrics: any, dateRange: any, connection: any) { return {} }