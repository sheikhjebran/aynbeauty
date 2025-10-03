import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id

    const reviews = await executeQuery(`
      SELECT 
        pr.id,
        pr.user_id,
        pr.rating,
        pr.comment,
        pr.created_at,
        CONCAT(u.first_name, ' ', u.last_name) as user_name
      FROM product_reviews pr
      LEFT JOIN users u ON pr.user_id = u.id
      WHERE pr.product_id = ?
      ORDER BY pr.created_at DESC
    `, [productId]) as any[]

    // Calculate average rating
    const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = reviews.length > 0 ? ratingSum / reviews.length : 0

    return NextResponse.json({
      success: true,
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1))
    })

  } catch (error) {
    console.error('Reviews fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}