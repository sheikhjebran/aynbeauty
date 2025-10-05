import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'
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

interface ProductReview extends RowDataPacket {
  id: number
  product_id: number
  user_id: number
  rating: number
  title: string
  comment: string
  is_verified_purchase: boolean
  is_approved: boolean
  helpful_count: number
  created_at: string
  user_name: string
  user_avatar?: string
}

interface ReviewStats extends RowDataPacket {
  product_id: number
  average_rating: number
  total_reviews: number
  rating_1: number
  rating_2: number
  rating_3: number
  rating_4: number
  rating_5: number
}

// GET: Fetch reviews for a product or user
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const productId = url.searchParams.get('product_id')
    const userId = url.searchParams.get('user_id')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    const sortBy = url.searchParams.get('sort') || 'newest'

    const connection = await pool.getConnection()
    
    try {
      if (productId) {
        // Get reviews for a specific product
        const reviews = await getProductReviews(parseInt(productId), limit, offset, sortBy, connection)
        const stats = await getProductReviewStats(parseInt(productId), connection)
        
        return NextResponse.json({
          reviews,
          stats,
          pagination: {
            limit,
            offset,
            hasMore: reviews.length === limit
          }
        })

      } else if (userId) {
        // Get reviews by a specific user
        const reviews = await getUserReviews(parseInt(userId), limit, offset, connection)
        
        return NextResponse.json({
          reviews,
          pagination: {
            limit,
            offset,
            hasMore: reviews.length === limit
          }
        })

      } else {
        return NextResponse.json({ message: 'Product ID or User ID required' }, { status: 400 })
      }

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { message: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST: Create a new review
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, product_id, rating, title, comment, review_id } = body

    const connection = await pool.getConnection()

    try {
      if (action === 'create_review') {
        // Validate input
        if (!product_id || !rating || rating < 1 || rating > 5) {
          return NextResponse.json({ message: 'Invalid review data' }, { status: 400 })
        }

        // Check if user already reviewed this product
        const [existingReview] = await connection.execute(
          'SELECT id FROM product_reviews WHERE user_id = ? AND product_id = ?',
          [user.id, product_id]
        ) as [any[], any]

        if (existingReview.length > 0) {
          return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 })
        }

        // Check if user purchased this product
        const [purchase] = await connection.execute(
          `SELECT 1 FROM order_items oi
           JOIN orders o ON oi.order_id = o.id
           WHERE o.user_id = ? AND oi.product_id = ? AND o.status = 'delivered'`,
          [user.id, product_id]
        ) as [any[], any]

        const isVerifiedPurchase = purchase.length > 0

        // Create the review
        const [result] = await connection.execute(
          `INSERT INTO product_reviews 
           (user_id, product_id, rating, title, comment, is_verified_purchase, is_approved) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [user.id, product_id, rating, title || '', comment || '', isVerifiedPurchase, true]
        ) as [OkPacket, any]

        // Update product rating
        await updateProductRating(product_id, connection)

        // Award loyalty points for review
        await awardReviewPoints(user.id, connection)

        return NextResponse.json({ 
          message: 'Review submitted successfully',
          reviewId: result.insertId,
          isVerifiedPurchase
        })

      } else if (action === 'mark_helpful') {
        // Mark review as helpful
        await markReviewHelpful(user.id, review_id, connection)
        
        return NextResponse.json({ message: 'Review marked as helpful' })

      } else {
        return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
      }

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error processing review:', error)
    return NextResponse.json(
      { message: 'Failed to process review' },
      { status: 500 }
    )
  }
}

// PUT: Update review (only by author)
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { review_id, rating, title, comment } = body

    const connection = await pool.getConnection()

    try {
      // Check if review belongs to user
      const [review] = await connection.execute(
        'SELECT product_id FROM product_reviews WHERE id = ? AND user_id = ?',
        [review_id, user.id]
      ) as [any[], any]

      if (review.length === 0) {
        return NextResponse.json({ message: 'Review not found or not authorized' }, { status: 404 })
      }

      // Update review
      await connection.execute(
        `UPDATE product_reviews 
         SET rating = ?, title = ?, comment = ?, updated_at = NOW()
         WHERE id = ? AND user_id = ?`,
        [rating, title || '', comment || '', review_id, user.id]
      )

      // Update product rating
      await updateProductRating(review[0].product_id, connection)

      return NextResponse.json({ message: 'Review updated successfully' })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { message: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE: Delete review (only by author or admin)
export async function DELETE(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const reviewId = url.searchParams.get('review_id')

    if (!reviewId) {
      return NextResponse.json({ message: 'Review ID required' }, { status: 400 })
    }

    const connection = await pool.getConnection()

    try {
      // Check if review belongs to user or user is admin
      const [review] = await connection.execute(
        'SELECT product_id, user_id FROM product_reviews WHERE id = ?',
        [reviewId]
      ) as [any[], any]

      if (review.length === 0) {
        return NextResponse.json({ message: 'Review not found' }, { status: 404 })
      }

      if (review[0].user_id !== user.id && user.email !== 'admin@aynbeauty.com') {
        return NextResponse.json({ message: 'Not authorized' }, { status: 403 })
      }

      // Delete review
      await connection.execute(
        'DELETE FROM product_reviews WHERE id = ?',
        [reviewId]
      )

      // Update product rating
      await updateProductRating(review[0].product_id, connection)

      return NextResponse.json({ message: 'Review deleted successfully' })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { message: 'Failed to delete review' },
      { status: 500 }
    )
  }
}

async function getProductReviews(productId: number, limit: number, offset: number, sortBy: string, connection: any) {
  let orderClause = 'pr.created_at DESC'
  
  switch (sortBy) {
    case 'oldest':
      orderClause = 'pr.created_at ASC'
      break
    case 'rating_high':
      orderClause = 'pr.rating DESC, pr.created_at DESC'
      break
    case 'rating_low':
      orderClause = 'pr.rating ASC, pr.created_at DESC'
      break
    case 'helpful':
      orderClause = 'pr.helpful_count DESC, pr.created_at DESC'
      break
    default:
      orderClause = 'pr.created_at DESC'
  }

  const [reviews] = await connection.execute(
    `SELECT pr.*, u.first_name, u.last_name, u.avatar_url,
            CONCAT(u.first_name, ' ', u.last_name) as user_name
     FROM product_reviews pr
     JOIN users u ON pr.user_id = u.id
     WHERE pr.product_id = ? AND pr.is_approved = 1
     ORDER BY ${orderClause}
     LIMIT ? OFFSET ?`,
    [productId, limit, offset]
  ) as [ProductReview[], any]

  return reviews
}

async function getUserReviews(userId: number, limit: number, offset: number, connection: any) {
  const [reviews] = await connection.execute(
    `SELECT pr.*, p.name as product_name, p.image_url as product_image
     FROM product_reviews pr
     JOIN products p ON pr.product_id = p.id
     WHERE pr.user_id = ? AND pr.is_approved = 1
     ORDER BY pr.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, limit, offset]
  ) as [ProductReview[], any]

  return reviews
}

async function getProductReviewStats(productId: number, connection: any) {
  const [stats] = await connection.execute(
    `SELECT 
       COUNT(*) as total_reviews,
       AVG(rating) as average_rating,
       SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) as rating_1,
       SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) as rating_2,
       SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) as rating_3,
       SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) as rating_4,
       SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) as rating_5
     FROM product_reviews 
     WHERE product_id = ? AND is_approved = 1`,
    [productId]
  ) as [ReviewStats[], any]

  return stats[0] || {
    total_reviews: 0,
    average_rating: 0,
    rating_1: 0,
    rating_2: 0,
    rating_3: 0,
    rating_4: 0,
    rating_5: 0
  }
}

async function updateProductRating(productId: number, connection: any) {
  const [result] = await connection.execute(
    `SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
     FROM product_reviews 
     WHERE product_id = ? AND is_approved = 1`,
    [productId]
  ) as [any[], any]

  if (result.length > 0) {
    await connection.execute(
      'UPDATE products SET rating = ?, rating_count = ? WHERE id = ?',
      [result[0].avg_rating || 0, result[0].review_count || 0, productId]
    )
  }
}

async function markReviewHelpful(userId: number, reviewId: number, connection: any) {
  // Check if user already marked this review as helpful
  const [existing] = await connection.execute(
    'SELECT id FROM review_helpful WHERE user_id = ? AND review_id = ?',
    [userId, reviewId]
  ) as [any[], any]

  if (existing.length === 0) {
    // Mark as helpful
    await connection.execute(
      'INSERT INTO review_helpful (user_id, review_id) VALUES (?, ?)',
      [userId, reviewId]
    )

    // Update helpful count
    await connection.execute(
      'UPDATE product_reviews SET helpful_count = helpful_count + 1 WHERE id = ?',
      [reviewId]
    )
  }
}

async function awardReviewPoints(userId: number, connection: any) {
  try {
    // Award 50 points for writing a review
    await connection.execute(
      `INSERT INTO loyalty_point_transactions 
       (user_id, points, transaction_type, description) 
       VALUES (?, 50, 'earned', 'Product review bonus')`,
      [userId]
    )

    // Update user's total points
    await connection.execute(
      `UPDATE loyalty_accounts 
       SET current_points = current_points + 50,
           total_points = total_points + 50
       WHERE user_id = ?`,
      [userId]
    )
  } catch (error) {
    console.error('Error awarding review points:', error)
  }
}