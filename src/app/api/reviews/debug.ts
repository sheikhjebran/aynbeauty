import { NextRequest, NextResponse } from 'next/server'
import pool from '@/lib/database'
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

export async function POST(request: NextRequest) {
  try {
    console.log('=== REVIEW API DEBUG ===')
    
    const user = await verifyToken(request)
    console.log('User from token:', user)
    
    if (!user) {
      console.log('❌ Unauthorized - no valid token')
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    console.log('Request body:', body)
    
    const { action, product_id, rating, comment } = body

    if (action !== 'create_review') {
      console.log('❌ Invalid action:', action)
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 })
    }

    // Validate input
    if (!product_id || !rating || rating < 1 || rating > 5) {
      console.log('❌ Invalid review data:', { product_id, rating })
      return NextResponse.json({ message: 'Invalid review data' }, { status: 400 })
    }

    console.log('✅ Validation passed, attempting database connection...')
    
    const connection = await pool.getConnection()
    console.log('✅ Database connection obtained')

    try {
      // Check if user already reviewed this product
      console.log('Checking for existing review...')
      const [existingReview] = await connection.execute(
        'SELECT id FROM product_reviews WHERE user_id = ? AND product_id = ?',
        [user.id, product_id]
      ) as [any[], any]

      if (existingReview.length > 0) {
        console.log('❌ User already reviewed this product')
        return NextResponse.json({ message: 'You have already reviewed this product' }, { status: 400 })
      }

      console.log('✅ No existing review found, creating new review...')
      
      // Create the review
      const [result] = await connection.execute(
        `INSERT INTO product_reviews 
         (user_id, product_id, rating, comment, is_approved) 
         VALUES (?, ?, ?, ?, ?)`,
        [user.id, product_id, rating, comment || '', true]
      ) as [any, any]

      console.log('✅ Review created successfully:', result)

      return NextResponse.json({ 
        success: true,
        message: 'Review created successfully',
        reviewId: result.insertId
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('❌ Error processing review:', error)
    return NextResponse.json(
      { 
        message: 'Failed to process review',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}