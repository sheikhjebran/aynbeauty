import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

// POST /api/auth/register - User registration
export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, phone } = await request.json()

    // Validate input
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'All required fields must be provided' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const [existingUser] = await executeQuery(
      'SELECT id FROM users WHERE email = ?',
      [email]
    ) as any[]

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const result = await executeQuery(
      `INSERT INTO users (email, password, first_name, last_name, phone, role)
       VALUES (?, ?, ?, ?, ?, 'customer')`,
      [email, hashedPassword, firstName, lastName, phone]
    ) as any

    const userId = result.insertId

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, role: 'customer' },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Get user data (without password)
    const [user] = await executeQuery(
      'SELECT id, email, first_name, last_name, phone, role, created_at FROM users WHERE id = ?',
      [userId]
    ) as any[]

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user,
      token
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    )
  }
}