import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// POST /api/auth/login - User login
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

    // Get user from database
    const users = await executeQuery(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as any[]

    console.log('Database query result:', users.length > 0 ? 'User found' : 'User not found')

    if (users.length === 0) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    const user = users[0]
    console.log('User role:', user.role)

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    console.log('Password validation:', isValidPassword ? 'Valid' : 'Invalid')

    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: userWithoutPassword,
      token,
      isAdmin: user.role === 'admin'
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Failed to login' },
      { status: 500 }
    )
  }
}