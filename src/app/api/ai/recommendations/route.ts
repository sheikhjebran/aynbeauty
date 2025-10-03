import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/database'
import { RowDataPacket } from 'mysql2'
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

interface UserProfile extends RowDataPacket {
  user_id: number
  age_range: string
  skin_type: string
  hair_type: string
  preferred_categories: string[]
  price_sensitivity: string
  brand_loyalty: number
  purchase_frequency: string
}

interface ProductVector extends RowDataPacket {
  product_id: number
  category_vector: number[]
  price_tier: number
  rating_score: number
  popularity_score: number
  seasonal_relevance: number
}

interface RecommendationResult extends RowDataPacket {
  product_id: number
  name: string
  brand: string
  price: number
  discounted_price: number
  image_url: string
  category: string
  rating: number
  confidence_score: number
  recommendation_reason: string
  ai_tags: string[]
}

// GET: Get AI-powered recommendations
export async function GET(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    const url = new URL(request.url)
    const recommendationType = url.searchParams.get('type') || 'general'
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const skinType = url.searchParams.get('skin_type')
    const occasion = url.searchParams.get('occasion')
    const budget = url.searchParams.get('budget')

    const connection = await dbConnect.getConnection()
    
    try {
      let recommendations: RecommendationResult[] = []

      switch (recommendationType) {
        case 'personalized':
          if (user) {
            recommendations = await getPersonalizedRecommendations(user.id, limit, connection)
          } else {
            recommendations = await getGeneralRecommendations(limit, connection)
          }
          break

        case 'skin_match':
          recommendations = await getSkinTypeRecommendations(skinType || 'normal', limit, connection)
          break

        case 'occasion':
          recommendations = await getOccasionRecommendations(occasion || 'daily', limit, connection)
          break

        case 'budget':
          recommendations = await getBudgetRecommendations(budget || 'medium', limit, connection)
          break

        case 'trending':
          recommendations = await getTrendingRecommendations(limit, connection)
          break

        case 'routine':
          if (user) {
            recommendations = await getRoutineRecommendations(user.id, limit, connection)
          }
          break

        case 'seasonal':
          recommendations = await getSeasonalRecommendations(limit, connection)
          break

        default:
          recommendations = await getGeneralRecommendations(limit, connection)
      }

      // Apply AI scoring and ranking
      const rankedRecommendations = await applyAIScoring(recommendations, user?.id, connection)

      return NextResponse.json({
        recommendations: rankedRecommendations,
        type: recommendationType,
        timestamp: new Date().toISOString(),
        algorithm_version: '2.1'
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error generating AI recommendations:', error)
    return NextResponse.json(
      { message: 'Failed to generate recommendations' },
      { status: 500 }
    )
  }
}

// POST: Train AI model with user feedback
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, product_id, feedback_type, rating, interaction_data } = body

    const connection = await dbConnect.getConnection()

    try {
      switch (action) {
        case 'feedback':
          await recordRecommendationFeedback(user.id, product_id, feedback_type, rating, connection)
          break

        case 'interaction':
          await recordInteractionData(user.id, interaction_data, connection)
          break

        case 'preference_update':
          await updateUserPreferences(user.id, body.preferences, connection)
          break

        default:
          return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
      }

      // Trigger model retraining (async)
      await scheduleModelRetraining(user.id, connection)

      return NextResponse.json({ message: 'Feedback recorded successfully' })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error recording AI feedback:', error)
    return NextResponse.json(
      { message: 'Failed to record feedback' },
      { status: 500 }
    )
  }
}

async function getPersonalizedRecommendations(userId: number, limit: number, connection: any): Promise<RecommendationResult[]> {
  // Advanced collaborative filtering + content-based recommendations
  const [recommendations] = await connection.execute(
    `SELECT DISTINCT
       p.id as product_id, p.name, p.brand, p.price, p.discounted_price, 
       p.image_url, c.name as category, p.rating,
       (
         -- User preference score
         COALESCE(up.category_preference_score, 0) * 0.3 +
         -- Collaborative filtering score
         COALESCE(cf.similarity_score, 0) * 0.25 +
         -- Content similarity score
         COALESCE(cs.content_score, 0) * 0.2 +
         -- Popularity score
         (p.rating * p.rating_count / 100) * 0.1 +
         -- Recency score
         (DATEDIFF(NOW(), p.created_at) / -365) * 0.05 +
         -- Price preference score
         COALESCE(pp.price_score, 0) * 0.1
       ) as confidence_score,
       CASE 
         WHEN up.category_preference_score > 0.7 THEN 'Based on your preferences'
         WHEN cf.similarity_score > 0.6 THEN 'Customers like you also bought'
         WHEN cs.content_score > 0.5 THEN 'Similar to items you loved'
         WHEN p.rating >= 4.5 THEN 'Highly rated choice'
         ELSE 'Trending now'
       END as recommendation_reason
     FROM products p
     JOIN categories c ON p.category_id = c.id
     LEFT JOIN (
       SELECT product_id, AVG(interaction_score) / 10 as category_preference_score
       FROM product_interactions 
       WHERE user_id = ?
       GROUP BY product_id
     ) up ON p.id = up.product_id
     LEFT JOIN (
       SELECT pi2.product_id, AVG(pi2.interaction_score) / 20 as similarity_score
       FROM product_interactions pi1
       JOIN product_interactions pi2 ON pi1.product_id = pi2.product_id
       WHERE pi1.user_id = ? AND pi2.user_id != ?
       GROUP BY pi2.product_id
     ) cf ON p.id = cf.product_id
     LEFT JOIN (
       SELECT p2.id as product_id, 0.5 as content_score
       FROM products p2
       JOIN categories c2 ON p2.category_id = c2.id
       WHERE c2.id IN (
         SELECT DISTINCT c3.id 
         FROM product_interactions pi3
         JOIN products p3 ON pi3.product_id = p3.id
         JOIN categories c3 ON p3.category_id = c3.id
         WHERE pi3.user_id = ?
       )
     ) cs ON p.id = cs.product_id
     LEFT JOIN (
       SELECT p4.id as product_id,
              CASE 
                WHEN p4.discounted_price BETWEEN 
                  (SELECT AVG(discounted_price) * 0.8 FROM products p5 JOIN order_items oi ON p5.id = oi.product_id JOIN orders o ON oi.order_id = o.id WHERE o.user_id = ?) AND
                  (SELECT AVG(discounted_price) * 1.2 FROM products p6 JOIN order_items oi2 ON p6.id = oi2.product_id JOIN orders o2 ON oi2.order_id = o2.id WHERE o2.user_id = ?)
                THEN 0.8
                ELSE 0.3
              END as price_score
       FROM products p4
     ) pp ON p.id = pp.product_id
     WHERE p.is_active = 1 
     AND p.stock_quantity > 0
     AND p.id NOT IN (
       SELECT product_id FROM order_items oi
       JOIN orders o ON oi.order_id = o.id
       WHERE o.user_id = ? AND o.order_status = 'delivered'
       AND o.created_at > DATE_SUB(NOW(), INTERVAL 6 MONTH)
     )
     ORDER BY confidence_score DESC, p.rating DESC
     LIMIT ?`,
    [userId, userId, userId, userId, userId, userId, userId, limit]
  ) as [RecommendationResult[], any]

  return recommendations
}

async function getSkinTypeRecommendations(skinType: string, limit: number, connection: any): Promise<RecommendationResult[]> {
  const [recommendations] = await connection.execute(
    `SELECT 
       p.id as product_id, p.name, p.brand, p.price, p.discounted_price, 
       p.image_url, c.name as category, p.rating,
       (p.rating * 0.4 + (p.rating_count / 10) * 0.3 + st.skin_match_score * 0.3) as confidence_score,
       CONCAT('Perfect for ', ?, ' skin') as recommendation_reason
     FROM products p
     JOIN categories c ON p.category_id = c.id
     JOIN product_skin_types st ON p.id = st.product_id
     WHERE st.skin_type = ? 
     AND p.is_active = 1 
     AND p.stock_quantity > 0
     ORDER BY confidence_score DESC
     LIMIT ?`,
    [skinType, skinType, limit]
  ) as [RecommendationResult[], any]

  return recommendations
}

async function getOccasionRecommendations(occasion: string, limit: number, connection: any): Promise<RecommendationResult[]> {
  const occasionMap: { [key: string]: string[] } = {
    'daily': ['Moisturizer', 'Cleanser', 'Sunscreen', 'Foundation'],
    'party': ['Lipstick', 'Eyeshadow', 'Highlighter', 'Mascara'],
    'office': ['BB Cream', 'Concealer', 'Lip Balm', 'Primer'],
    'wedding': ['Foundation', 'Setting Spray', 'Lipstick', 'Blush'],
    'travel': ['Cleanser', 'Moisturizer', 'Travel Kit', 'Makeup Remover']
  }

  const categories = occasionMap[occasion] || occasionMap['daily']
  const placeholders = categories.map(() => '?').join(',')

  const [recommendations] = await connection.execute(
    `SELECT 
       p.id as product_id, p.name, p.brand, p.price, p.discounted_price, 
       p.image_url, c.name as category, p.rating,
       (p.rating * 0.5 + (p.view_count / 100) * 0.3 + (p.purchase_count / 10) * 0.2) as confidence_score,
       CONCAT('Perfect for ', ?) as recommendation_reason
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE c.name IN (${placeholders})
     AND p.is_active = 1 
     AND p.stock_quantity > 0
     ORDER BY confidence_score DESC
     LIMIT ?`,
    [occasion, ...categories, limit]
  ) as [RecommendationResult[], any]

  return recommendations
}

async function getBudgetRecommendations(budget: string, limit: number, connection: any): Promise<RecommendationResult[]> {
  const budgetRanges: { [key: string]: [number, number] } = {
    'low': [0, 500],
    'medium': [500, 1500],
    'high': [1500, 5000],
    'luxury': [5000, 50000]
  }

  const [minPrice, maxPrice] = budgetRanges[budget] || budgetRanges['medium']

  const [recommendations] = await connection.execute(
    `SELECT 
       p.id as product_id, p.name, p.brand, p.price, p.discounted_price, 
       p.image_url, c.name as category, p.rating,
       (p.rating * 0.6 + (p.rating_count / 50) * 0.4) as confidence_score,
       CONCAT('Best value in ', ? ,' range') as recommendation_reason
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.discounted_price BETWEEN ? AND ?
     AND p.is_active = 1 
     AND p.stock_quantity > 0
     ORDER BY confidence_score DESC, p.discounted_price ASC
     LIMIT ?`,
    [budget, minPrice, maxPrice, limit]
  ) as [RecommendationResult[], any]

  return recommendations
}

async function getTrendingRecommendations(limit: number, connection: any): Promise<RecommendationResult[]> {
  const [recommendations] = await connection.execute(
    `SELECT 
       p.id as product_id, p.name, p.brand, p.price, p.discounted_price, 
       p.image_url, c.name as category, p.rating,
       (
         (p.view_count / 100) * 0.4 +
         (p.purchase_count / 10) * 0.4 +
         p.rating * 0.2
       ) as confidence_score,
       'Trending this week' as recommendation_reason
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.is_active = 1 
     AND p.stock_quantity > 0
     AND p.last_viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
     ORDER BY confidence_score DESC
     LIMIT ?`,
    [limit]
  ) as [RecommendationResult[], any]

  return recommendations
}

async function getRoutineRecommendations(userId: number, limit: number, connection: any): Promise<RecommendationResult[]> {
  // AI-powered routine builder based on user's current products
  const [recommendations] = await connection.execute(
    `SELECT 
       p.id as product_id, p.name, p.brand, p.price, p.discounted_price, 
       p.image_url, c.name as category, p.rating,
       0.8 as confidence_score,
       'Complete your routine' as recommendation_reason
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE c.name IN (
       SELECT DISTINCT routine_category 
       FROM beauty_routines br
       WHERE br.category NOT IN (
         SELECT DISTINCT c2.name 
         FROM order_items oi
         JOIN products p2 ON oi.product_id = p2.id
         JOIN categories c2 ON p2.category_id = c2.id
         JOIN orders o ON oi.order_id = o.id
         WHERE o.user_id = ?
       )
     )
     AND p.is_active = 1 
     AND p.stock_quantity > 0
     ORDER BY p.rating DESC
     LIMIT ?`,
    [userId, limit]
  ) as [RecommendationResult[], any]

  return recommendations
}

async function getSeasonalRecommendations(limit: number, connection: any): Promise<RecommendationResult[]> {
  const currentMonth = new Date().getMonth() + 1
  const season = currentMonth >= 3 && currentMonth <= 5 ? 'spring' :
                currentMonth >= 6 && currentMonth <= 8 ? 'summer' :
                currentMonth >= 9 && currentMonth <= 11 ? 'autumn' : 'winter'

  const [recommendations] = await connection.execute(
    `SELECT 
       p.id as product_id, p.name, p.brand, p.price, p.discounted_price, 
       p.image_url, c.name as category, p.rating,
       (p.rating * 0.5 + s.seasonal_score * 0.5) as confidence_score,
       CONCAT('Perfect for ', ?) as recommendation_reason
     FROM products p
     JOIN categories c ON p.category_id = c.id
     JOIN seasonal_products s ON p.id = s.product_id
     WHERE s.season = ?
     AND p.is_active = 1 
     AND p.stock_quantity > 0
     ORDER BY confidence_score DESC
     LIMIT ?`,
    [season, season, limit]
  ) as [RecommendationResult[], any]

  return recommendations
}

async function getGeneralRecommendations(limit: number, connection: any): Promise<RecommendationResult[]> {
  const [recommendations] = await connection.execute(
    `SELECT 
       p.id as product_id, p.name, p.brand, p.price, p.discounted_price, 
       p.image_url, c.name as category, p.rating,
       (p.rating * 0.6 + (p.rating_count / 100) * 0.4) as confidence_score,
       'Popular choice' as recommendation_reason
     FROM products p
     JOIN categories c ON p.category_id = c.id
     WHERE p.is_active = 1 
     AND p.stock_quantity > 0
     AND p.rating >= 4.0
     ORDER BY confidence_score DESC, p.created_at DESC
     LIMIT ?`,
    [limit]
  ) as [RecommendationResult[], any]

  return recommendations
}

async function applyAIScoring(recommendations: RecommendationResult[], userId: number | undefined, connection: any): Promise<RecommendationResult[]> {
  // Apply additional AI scoring and add AI tags
  return recommendations.map(rec => ({
    ...rec,
    ai_tags: generateAITags(rec),
    confidence_score: Math.min(rec.confidence_score * getBoostFactor(rec), 1.0)
  }))
}

function generateAITags(product: RecommendationResult): string[] {
  const tags: string[] = []
  
  if (product.confidence_score > 0.8) tags.push('AI Recommended')
  if (product.rating >= 4.5) tags.push('Top Rated')
  if (product.price > product.discounted_price) tags.push('On Sale')
  if (product.category.toLowerCase().includes('organic')) tags.push('Natural')
  if (product.brand.toLowerCase().includes('luxury')) tags.push('Premium')
  
  return tags
}

function getBoostFactor(product: RecommendationResult): number {
  let boost = 1.0
  
  // Boost high-rated products
  if (product.rating >= 4.5) boost += 0.1
  
  // Boost discounted products
  if (product.price > product.discounted_price) boost += 0.05
  
  // Boost popular categories
  const popularCategories = ['Foundation', 'Lipstick', 'Moisturizer', 'Cleanser']
  if (popularCategories.includes(product.category)) boost += 0.05
  
  return boost
}

async function recordRecommendationFeedback(userId: number, productId: number, feedbackType: string, rating: number, connection: any) {
  await connection.execute(
    `INSERT INTO ai_recommendation_feedback 
     (user_id, product_id, feedback_type, rating, created_at) 
     VALUES (?, ?, ?, ?, NOW())`,
    [userId, productId, feedbackType, rating]
  )
}

async function recordInteractionData(userId: number, interactionData: any, connection: any) {
  await connection.execute(
    `INSERT INTO ai_interaction_logs 
     (user_id, interaction_type, data, created_at) 
     VALUES (?, ?, ?, NOW())`,
    [userId, interactionData.type, JSON.stringify(interactionData)]
  )
}

async function updateUserPreferences(userId: number, preferences: any, connection: any) {
  const fields: string[] = []
  const values: any[] = []

  Object.keys(preferences).forEach(key => {
    if (preferences[key] !== undefined) {
      fields.push(`${key} = ?`)
      values.push(preferences[key])
    }
  })

  if (fields.length === 0) return

  values.push(userId)

  await connection.execute(
    `UPDATE user_preferences SET ${fields.join(', ')}, updated_at = NOW() WHERE user_id = ?`,
    values
  )
}

async function scheduleModelRetraining(userId: number, connection: any) {
  // Queue model retraining job (this would typically trigger a background job)
  await connection.execute(
    `INSERT INTO ai_training_queue (user_id, priority, created_at) 
     VALUES (?, 'normal', NOW())
     ON DUPLICATE KEY UPDATE updated_at = NOW()`,
    [userId]
  )
}