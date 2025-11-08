// Debug API to check categories in database
import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

// Prevent static generation of this dynamic route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Get all categories with their names and slugs
    const categories = await executeQuery(
      'SELECT id, name, slug FROM categories ORDER BY name',
      []
    ) as any[]

    // Also get products by category to see what's actually stored
    const productsByCategory = await executeQuery(
      `SELECT 
        p.id, p.name as product_name, 
        c.id as category_id, c.name as category_name, c.slug as category_slug
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       ORDER BY c.name, p.name`,
      []
    ) as any[]

    return NextResponse.json({
      success: true,
      categories,
      productsByCategory
    })
  } catch (error) {
    console.error('Debug categories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}