import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

// GET /api/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('include_products') === 'true'

    let query = `
      SELECT 
        c.*,
        pc.name as parent_name,
        (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = TRUE) as product_count
      FROM categories c
      LEFT JOIN categories pc ON c.parent_id = pc.id
      WHERE c.is_active = TRUE
      ORDER BY c.sort_order, c.name
    `

    const categories = await executeQuery(query) as any[]

    // If requested, include sample products for each category
    if (includeProducts) {
      for (const category of categories) {
        const products = await executeQuery(`
          SELECT 
            p.id,
            p.name,
            p.price,
            p.sale_price,
            (SELECT pi.image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY pi.sort_order LIMIT 1) as image_url
          FROM products p
          WHERE p.category_id = ? AND p.is_active = TRUE
          ORDER BY p.created_at DESC
          LIMIT 4
        `, [category.id])
        
        category.sample_products = products
      }
    }

    // Organize into hierarchical structure
    const categoryMap = new Map()
    const rootCategories: any[] = []

    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    categories.forEach(category => {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id)
        if (parent) {
          parent.children.push(categoryMap.get(category.id))
        }
      } else {
        rootCategories.push(categoryMap.get(category.id))
      }
    })

    return NextResponse.json({
      categories: rootCategories,
      flat_categories: Array.from(categoryMap.values())
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}