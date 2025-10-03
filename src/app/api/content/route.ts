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

interface ContentBlock extends RowDataPacket {
  id: number
  title: string
  content: string
  content_type: string
  page_location: string
  display_order: number
  is_active: boolean
  image_url?: string
  link_url?: string
  start_date?: string
  end_date?: string
  target_audience: string
  created_at: string
  updated_at: string
}

interface Campaign extends RowDataPacket {
  id: number
  name: string
  description: string
  campaign_type: string
  status: string
  start_date: string
  end_date: string
  target_audience: string
  discount_percentage?: number
  banner_image?: string
  created_at: string
}

interface BlogPost extends RowDataPacket {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  featured_image: string
  author: string
  status: string
  tags: string
  meta_title: string
  meta_description: string
  published_at: string
  created_at: string
}

// GET: Fetch content based on type and location
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const contentType = url.searchParams.get('type')
    const location = url.searchParams.get('location')
    const slug = url.searchParams.get('slug')

    const connection = await dbConnect.getConnection()
    
    try {
      let data = {}

      if (contentType === 'homepage') {
        // Get homepage content blocks
        const [banners] = await connection.execute(
          `SELECT * FROM content_blocks 
           WHERE page_location = 'homepage_banner' 
           AND is_active = 1 
           AND (start_date IS NULL OR start_date <= NOW())
           AND (end_date IS NULL OR end_date >= NOW())
           ORDER BY display_order ASC`,
          []
        ) as [ContentBlock[], any]

        const [featured] = await connection.execute(
          `SELECT * FROM content_blocks 
           WHERE page_location = 'homepage_featured' 
           AND is_active = 1 
           ORDER BY display_order ASC`,
          []
        ) as [ContentBlock[], any]

        const [offers] = await connection.execute(
          `SELECT * FROM campaigns 
           WHERE status = 'active' 
           AND start_date <= NOW() 
           AND end_date >= NOW()
           ORDER BY created_at DESC 
           LIMIT 3`,
          []
        ) as [Campaign[], any]

        data = { banners, featured, offers }

      } else if (contentType === 'blog') {
        if (slug) {
          // Get specific blog post
          const [posts] = await connection.execute(
            `SELECT * FROM blog_posts 
             WHERE slug = ? AND status = 'published'`,
            [slug]
          ) as [BlogPost[], any]
          data = { post: posts[0] || null }
        } else {
          // Get all published blog posts
          const [posts] = await connection.execute(
            `SELECT id, title, slug, excerpt, featured_image, author, 
                    published_at, tags
             FROM blog_posts 
             WHERE status = 'published'
             ORDER BY published_at DESC 
             LIMIT 20`,
            []
          ) as [BlogPost[], any]
          data = { posts }
        }

      } else if (contentType === 'campaigns') {
        const [campaigns] = await connection.execute(
          `SELECT * FROM campaigns 
           WHERE status = 'active' 
           AND start_date <= NOW() 
           AND end_date >= NOW()
           ORDER BY created_at DESC`,
          []
        ) as [Campaign[], any]
        data = { campaigns }

      } else if (location) {
        // Get content for specific page location
        const [content] = await connection.execute(
          `SELECT * FROM content_blocks 
           WHERE page_location = ? 
           AND is_active = 1 
           AND (start_date IS NULL OR start_date <= NOW())
           AND (end_date IS NULL OR end_date >= NOW())
           ORDER BY display_order ASC`,
          [location]
        ) as [ContentBlock[], any]
        data = { content }

      } else {
        // Get all active content
        const [content] = await connection.execute(
          `SELECT * FROM content_blocks 
           WHERE is_active = 1 
           ORDER BY page_location, display_order ASC`,
          []
        ) as [ContentBlock[], any]
        data = { content }
      }

      return NextResponse.json(data)

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { message: 'Failed to fetch content' },
      { status: 500 }
    )
  }
}

// POST: Create/Update content (Admin only)
export async function POST(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin (you might want to add role checking)
    if (user.email !== 'admin@aynbeauty.com') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { type, data } = body

    const connection = await dbConnect.getConnection()

    try {
      let result

      switch (type) {
        case 'content_block':
          result = await createContentBlock(data, connection)
          break

        case 'campaign':
          result = await createCampaign(data, connection)
          break

        case 'blog_post':
          result = await createBlogPost(data, connection)
          break

        default:
          return NextResponse.json({ message: 'Invalid content type' }, { status: 400 })
      }

      return NextResponse.json({ 
        message: 'Content created successfully',
        id: result.insertId 
      })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { message: 'Failed to create content' },
      { status: 500 }
    )
  }
}

// PUT: Update content (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const user = await verifyToken(request)
    if (!user || user.email !== 'admin@aynbeauty.com') {
      return NextResponse.json({ message: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { type, id, data } = body

    const connection = await dbConnect.getConnection()

    try {
      switch (type) {
        case 'content_block':
          await updateContentBlock(id, data, connection)
          break

        case 'campaign':
          await updateCampaign(id, data, connection)
          break

        case 'blog_post':
          await updateBlogPost(id, data, connection)
          break

        default:
          return NextResponse.json({ message: 'Invalid content type' }, { status: 400 })
      }

      return NextResponse.json({ message: 'Content updated successfully' })

    } finally {
      connection.release()
    }

  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { message: 'Failed to update content' },
      { status: 500 }
    )
  }
}

async function createContentBlock(data: any, connection: any) {
  const {
    title,
    content,
    content_type,
    page_location,
    display_order,
    image_url,
    link_url,
    start_date,
    end_date,
    target_audience
  } = data

  const [result] = await connection.execute(
    `INSERT INTO content_blocks 
     (title, content, content_type, page_location, display_order, 
      image_url, link_url, start_date, end_date, target_audience, is_active) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
    [title, content, content_type, page_location, display_order || 0, 
     image_url, link_url, start_date, end_date, target_audience || 'all']
  ) as [OkPacket, any]

  return result
}

async function createCampaign(data: any, connection: any) {
  const {
    name,
    description,
    campaign_type,
    start_date,
    end_date,
    target_audience,
    discount_percentage,
    banner_image
  } = data

  const [result] = await connection.execute(
    `INSERT INTO campaigns 
     (name, description, campaign_type, status, start_date, end_date, 
      target_audience, discount_percentage, banner_image) 
     VALUES (?, ?, ?, 'active', ?, ?, ?, ?, ?)`,
    [name, description, campaign_type, start_date, end_date, 
     target_audience || 'all', discount_percentage, banner_image]
  ) as [OkPacket, any]

  return result
}

async function createBlogPost(data: any, connection: any) {
  const {
    title,
    slug,
    excerpt,
    content,
    featured_image,
    author,
    tags,
    meta_title,
    meta_description,
    status,
    published_at
  } = data

  const [result] = await connection.execute(
    `INSERT INTO blog_posts 
     (title, slug, excerpt, content, featured_image, author, 
      tags, meta_title, meta_description, status, published_at) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, slug, excerpt, content, featured_image, author, 
     tags, meta_title, meta_description, status || 'draft', published_at]
  ) as [OkPacket, any]

  return result
}

async function updateContentBlock(id: number, data: any, connection: any) {
  const fields: string[] = []
  const values: any[] = []

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`)
      values.push(data[key])
    }
  })

  if (fields.length === 0) return

  values.push(id)

  await connection.execute(
    `UPDATE content_blocks SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  )
}

async function updateCampaign(id: number, data: any, connection: any) {
  const fields: string[] = []
  const values: any[] = []

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`)
      values.push(data[key])
    }
  })

  if (fields.length === 0) return

  values.push(id)

  await connection.execute(
    `UPDATE campaigns SET ${fields.join(', ')} WHERE id = ?`,
    values
  )
}

async function updateBlogPost(id: number, data: any, connection: any) {
  const fields: string[] = []
  const values: any[] = []

  Object.keys(data).forEach(key => {
    if (data[key] !== undefined) {
      fields.push(`${key} = ?`)
      values.push(data[key])
    }
  })

  if (fields.length === 0) return

  values.push(id)

  await connection.execute(
    `UPDATE blog_posts SET ${fields.join(', ')}, updated_at = NOW() WHERE id = ?`,
    values
  )
}