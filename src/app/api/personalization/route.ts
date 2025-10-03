import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import { RowDataPacket, OkPacket } from 'mysql2'
import jwt from 'jsonwebtoken'

// Helper function to verify JWT token
async function verifyToken(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    return decoded
  } catch (error) {
    return null
  }
}

interface UserBehavior extends RowDataPacket {
  id: number
  user_id: number
  product_id: number
  action_type: string
  page_url: string
  session_id: string
  created_at: string
}

interface UserPreference extends RowDataPacket {
  id: number
  user_id: number
  category_id: number
  brand_id: number
  price_range_min: number
  price_range_max: number
  preferred_colors: string
  skin_type: string
  hair_type: string
  updated_at: string
}

interface RecommendedProduct extends RowDataPacket {
  id: number
  name: string
  brand: string
  price: number
  discounted_price: number
  image_url: string
  category: string
  rating: number
  rating_count: number
  recommendation_reason: string
  score: number
}

// GET: Get personalized recommendations and user insights
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const connection = await dbConnect.getConnection()
    
    try {
      // Get user preferences
      const [preferences] = await connection.execute(
        `SELECT up.*, c.name as category_name, b.name as brand_name
         FROM user_preferences up
         LEFT JOIN categories c ON up.category_id = c.id
         LEFT JOIN brands b ON up.brand_id = b.id
         WHERE up.user_id = ?`,
        [user.id]
      ) as [UserPreference[], any]

      // Get recent user behavior
      const [recentBehavior] = await connection.execute(
        `SELECT ub.*, p.name as product_name, p.image_url
         FROM user_behavior ub
         LEFT JOIN products p ON ub.product_id = p.id
         WHERE ub.user_id = ? 
         ORDER BY ub.created_at DESC 
         LIMIT 50`,
        [user.id]
      ) as [UserBehavior[], any]

      // Get personalized product recommendations
      const recommendations = await getPersonalizedRecommendations(user.id, connection)

      // Get trending products in user's preferred categories
      const trendingProducts = await getTrendingProducts(user.id, connection)

      // Get similar products based on recently viewed items
      const similarProducts = await getSimilarProducts(user.id, connection)

      // Get user insights
      const insights = await getUserInsights(user.id, connection)

      return NextResponse.json({
        preferences: preferences[0] || null,
        recentBehavior,
        recommendations,
        trendingProducts,
        similarProducts,
        insights
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error fetching personalization data:', error)
    return NextResponse.json(
      { message: 'Failed to fetch personalization data' },
      { status: 500 }
    )
  }
}

// POST: Track user behavior and update preferences
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, data } = body

    const connection = await dbConnect.getConnection()

    try {
      switch (action) {
        case 'track_behavior':
          await trackUserBehavior(user.id, data, connection)
          break

        case 'update_preferences':
          await updateUserPreferences(user.id, data, connection)
          break

        case 'track_purchase':
          await trackPurchaseBehavior(user.id, data, connection)
          break

        case 'track_search':
          await trackSearchBehavior(user.id, data, connection)
          break

        default:
          return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
      }

      return NextResponse.json({ message: 'Behavior tracked successfully' })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error tracking behavior:', error)
    return NextResponse.json(
      { message: 'Failed to track behavior' },
      { status: 500 }
    )
  }
}

async function trackUserBehavior(userId: number, data: any, connection: any) {
  const {
    product_id,
    action_type, // 'view', 'click', 'add_to_cart', 'add_to_wishlist', 'share'
    page_url,
    session_id,
    duration_seconds
  } = data

  await connection.execute(
    `INSERT INTO user_behavior 
     (user_id, product_id, action_type, page_url, session_id, duration_seconds) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [userId, product_id, action_type, page_url, session_id, duration_seconds || null]
  )

  // Update product interaction score
  if (product_id) {
    await connection.execute(
      `INSERT INTO product_interactions (user_id, product_id, interaction_score, last_interaction)
       VALUES (?, ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
       interaction_score = interaction_score + ?, 
       last_interaction = NOW()`,
      [userId, product_id, getInteractionScore(action_type), getInteractionScore(action_type)]
    )
  }
}

async function updateUserPreferences(userId: number, data: any, connection: any) {
  const {
    category_id,
    brand_id,
    price_range_min,
    price_range_max,
    preferred_colors,
    skin_type,
    hair_type
  } = data

  await connection.execute(
    `INSERT INTO user_preferences 
     (user_id, category_id, brand_id, price_range_min, price_range_max, 
      preferred_colors, skin_type, hair_type) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     category_id = VALUES(category_id),
     brand_id = VALUES(brand_id),
     price_range_min = VALUES(price_range_min),
     price_range_max = VALUES(price_range_max),
     preferred_colors = VALUES(preferred_colors),
     skin_type = VALUES(skin_type),
     hair_type = VALUES(hair_type),
     updated_at = NOW()`,
    [userId, category_id, brand_id, price_range_min, price_range_max, 
     preferred_colors, skin_type, hair_type]
  )
}

async function trackPurchaseBehavior(userId: number, data: any, connection: any) {
  const { order_id, products } = data

  for (const product of products) {
    await connection.execute(
      `INSERT INTO user_behavior 
       (user_id, product_id, action_type, page_url, session_id) 
       VALUES (?, ?, 'purchase', '/checkout/success', ?)`,
      [userId, product.product_id, `order_${order_id}`]
    )

    // High score for purchases
    await connection.execute(
      `INSERT INTO product_interactions (user_id, product_id, interaction_score, last_interaction)
       VALUES (?, ?, 50, NOW())
       ON DUPLICATE KEY UPDATE 
       interaction_score = interaction_score + 50, 
       last_interaction = NOW()`,
      [userId, product.product_id]
    )
  }
}

async function trackSearchBehavior(userId: number, data: any, connection: any) {
  const { query, filters, results_count } = data

  await connection.execute(
    `INSERT INTO search_history (user_id, search_query, filters, results_count) 
     VALUES (?, ?, ?, ?)`,
    [userId, query, JSON.stringify(filters), results_count]
  )
}

async function getPersonalizedRecommendations(userId: number, connection: any) {
  // Complex recommendation algorithm considering:
  // 1. User's purchase history
  // 2. Browsing behavior
  // 3. Similar users' preferences
  // 4. Product popularity
  // 5. User's preferences

  const [recommendations] = await connection.execute(
    `SELECT DISTINCT
       p.id, p.name, p.brand, p.price, p.discounted_price, 
       p.image_url, c.name as category, p.rating, p.rating_count,
       CASE 
         WHEN pi.interaction_score > 0 THEN 'Based on your activity'
         WHEN up.category_id = p.category_id THEN 'Matches your preferences'
         WHEN p.rating >= 4.0 THEN 'Highly rated'
         ELSE 'Popular choice'
       END as recommendation_reason,
       (
         COALESCE(pi.interaction_score, 0) * 0.3 +
         COALESCE(p.rating * 10, 0) * 0.3 +
         COALESCE(p.purchase_count, 0) * 0.2 +
         CASE WHEN up.category_id = p.category_id THEN 20 ELSE 0 END * 0.2
       ) as score
     FROM products p
     JOIN categories c ON p.category_id = c.id
     LEFT JOIN user_preferences up ON up.user_id = ?
     LEFT JOIN product_interactions pi ON pi.user_id = ? AND pi.product_id = p.id
     WHERE p.is_active = 1
     AND p.stock_quantity > 0
     AND p.id NOT IN (
       SELECT product_id FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = ? AND o.order_status = 'delivered'
     )
     ORDER BY score DESC, p.created_at DESC
     LIMIT 12`,
    [userId, userId, userId]
  ) as [RecommendedProduct[], any]

  return recommendations
}

async function getTrendingProducts(userId: number, connection: any) {
  const [trending] = await connection.execute(
    `SELECT p.id, p.name, p.brand, p.price, p.discounted_price, 
            p.image_url, c.name as category, p.rating, p.rating_count,
            'Trending now' as recommendation_reason
     FROM products p
     JOIN categories c ON p.category_id = c.id
     LEFT JOIN user_preferences up ON up.user_id = ?
     WHERE p.is_active = 1 
     AND p.stock_quantity > 0
     AND (up.category_id IS NULL OR p.category_id = up.category_id)
     ORDER BY p.view_count DESC, p.purchase_count DESC
     LIMIT 8`,
    [userId]
  ) as [RecommendedProduct[], any]

  return trending
}

async function getSimilarProducts(userId: number, connection: any) {
  const [similar] = await connection.execute(
    `SELECT DISTINCT p.id, p.name, p.brand, p.price, p.discounted_price, 
            p.image_url, c.name as category, p.rating, p.rating_count,
            'Similar to items you viewed' as recommendation_reason
     FROM products p
     JOIN categories c ON p.category_id = c.id
     JOIN user_behavior ub ON p.category_id IN (
       SELECT DISTINCT p2.category_id 
       FROM user_behavior ub2 
       JOIN products p2 ON ub2.product_id = p2.id
       WHERE ub2.user_id = ? AND ub2.action_type IN ('view', 'click')
       AND ub2.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
     )
     WHERE p.is_active = 1 
     AND p.stock_quantity > 0
     AND p.id NOT IN (
       SELECT DISTINCT product_id 
       FROM user_behavior 
       WHERE user_id = ? AND product_id IS NOT NULL
     )
     ORDER BY p.rating DESC, p.view_count DESC
     LIMIT 6`,
    [userId, userId]
  ) as [RecommendedProduct[], any]

  return similar
}

async function getUserInsights(userId: number, connection: any) {
  // Get user behavior insights
  const [behaviorStats] = await connection.execute(
    `SELECT 
       COUNT(*) as total_actions,
       COUNT(DISTINCT product_id) as products_viewed,
       COUNT(DISTINCT DATE(created_at)) as active_days,
       AVG(duration_seconds) as avg_session_duration
     FROM user_behavior 
     WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
    [userId]
  ) as [any[], any]

  // Get favorite categories
  const [favoriteCategories] = await connection.execute(
    `SELECT c.name, COUNT(*) as interaction_count
     FROM user_behavior ub
     JOIN products p ON ub.product_id = p.id
     JOIN categories c ON p.category_id = c.id
     WHERE ub.user_id = ? AND ub.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
     GROUP BY c.id, c.name
     ORDER BY interaction_count DESC
     LIMIT 3`,
    [userId]
  ) as [any[], any]

  // Get preferred price range based on behavior
  const [priceRange] = await connection.execute(
    `SELECT 
       MIN(p.discounted_price) as min_price,
       MAX(p.discounted_price) as max_price,
       AVG(p.discounted_price) as avg_price
     FROM user_behavior ub
     JOIN products p ON ub.product_id = p.id
     WHERE ub.user_id = ? AND ub.action_type IN ('view', 'add_to_cart')
     AND ub.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`,
    [userId]
  ) as [any[], any]

  return {
    behaviorStats: behaviorStats[0] || {},
    favoriteCategories,
    priceRange: priceRange[0] || {}
  }
}

function getInteractionScore(actionType: string): number {
  const scores = {
    'view': 1,
    'click': 2,
    'add_to_cart': 10,
    'add_to_wishlist': 5,
    'share': 3,
    'purchase': 50,
    'review': 15
  }
  return scores[actionType as keyof typeof scores] || 1
}