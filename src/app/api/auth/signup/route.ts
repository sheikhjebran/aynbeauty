import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { first_name, last_name, email, mobile, password } = await request.json()

    if (!first_name || !last_name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const [existingUser] = await executeQuery(`
      SELECT id FROM users WHERE email = ? OR phone = ?
    `, [email, mobile]) as any[]

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or mobile number already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user (immediately active)
    const result = await executeQuery(`
      INSERT INTO users (
        first_name, last_name, email, phone, password, 
        is_active, email_verified, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      first_name, last_name, email, mobile, hashedPassword,
      true, true // User is immediately active and verified
    ]) as any

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please sign in.',
      user_id: result.insertId
    })

  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}