import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

/**
 * Unified Login API for both Admin and Users
 * POST /api/login
 * 
 * Request body:
 * {
 *   email: string
 *   password: string
 * }
 * 
 * Response:
 * {
 *   success: true,
 *   message: "Login successful",
 *   user: { id, email, first_name, last_name, role, ... },
 *   token: string,
 *   isAdmin: boolean  // true if user.role === 'admin'
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Query user from database
    const users = await executeQuery(
      `SELECT id, email, password, first_name, last_name, phone, role, 
              is_active, email_verified, created_at
       FROM users 
       WHERE email = ?`,
      [email]
    ) as any[]

    if (users.length === 0) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const user = users[0]

    // Check if account is active
    if (!user.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact support.' },
        { status: 401 }
      )
    }

    // Check if email is verified
    if (!user.email_verified) {
      return NextResponse.json(
        { error: 'Please verify your email before signing in' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Update last login timestamp
    await executeQuery(
      'UPDATE users SET last_login = NOW() WHERE id = ?',
      [user.id]
    )

    // Prepare user response (exclude password)
    const userResponse = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
      role: user.role,
      is_active: user.is_active,
      email_verified: user.email_verified,
      created_at: user.created_at
    }

    // Determine if user is admin
    const isAdmin = user.role === 'admin'

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userResponse,
      token,
      isAdmin,
      // Include redirect hint for frontend
      redirectTo: isAdmin ? '/admin' : '/'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Failed to login. Please try again.' },
      { status: 500 }
    )
  }
}
