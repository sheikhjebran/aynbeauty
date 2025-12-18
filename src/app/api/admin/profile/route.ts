import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

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

// GET /api/admin/profile - Get admin profile details
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const userId = authResult.user.userId

    // Get user profile
    const users = await executeQuery(
      'SELECT id, email, first_name, last_name, mobile, date_of_birth, gender, avatar_url, role, created_at, last_login_at FROM users WHERE id = ?',
      [userId]
    ) as any[]

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: users[0]
    })

  } catch (error) {
    console.error('Admin profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT /api/admin/profile - Update admin profile
export async function PUT(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const userId = authResult.user.userId
    const body = await request.json()
    const { first_name, last_name, mobile, date_of_birth, gender } = body

    // Update profile
    await executeQuery(
      `UPDATE users 
       SET first_name = ?, last_name = ?, mobile = ?, date_of_birth = ?, gender = ?, updated_at = NOW()
       WHERE id = ?`,
      [first_name, last_name, mobile, date_of_birth, gender, userId]
    )

    // Get updated profile
    const users = await executeQuery(
      'SELECT id, email, first_name, last_name, mobile, date_of_birth, gender, avatar_url, role, created_at FROM users WHERE id = ?',
      [userId]
    ) as any[]

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: users[0]
    })

  } catch (error) {
    console.error('Admin profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// POST /api/admin/profile/change-password - Change admin password
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAdmin(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }

    const userId = authResult.user.userId
    const body = await request.json()
    const { current_password, new_password, confirm_password } = body

    // Validate inputs
    if (!current_password || !new_password || !confirm_password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (new_password !== confirm_password) {
      return NextResponse.json(
        { error: 'New passwords do not match' },
        { status: 400 }
      )
    }

    if (new_password.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Get current user
    const users = await executeQuery(
      'SELECT id, password FROM users WHERE id = ?',
      [userId]
    ) as any[]

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const user = users[0]

    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(new_password, 10)

    // Update password
    await executeQuery(
      'UPDATE users SET password = ?, updated_at = NOW() WHERE id = ?',
      [hashedPassword, userId]
    )

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
