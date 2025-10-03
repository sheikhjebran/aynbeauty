import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import jwt from 'jsonwebtoken'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      )
    }

    // Find user and verify OTP
    const [user] = await executeQuery(`
      SELECT id, email, first_name, last_name, phone, 
             email_verification_token, email_verification_expires
      FROM users 
      WHERE email = ? AND email_verification_token = ?
    `, [email, otp]) as any[]

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      )
    }

    // Check if OTP has expired
    const now = new Date()
    const expiryTime = new Date(user.email_verification_expires)
    
    if (now > expiryTime) {
      return NextResponse.json(
        { error: 'OTP has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Activate user account and clear verification tokens
    await executeQuery(`
      UPDATE users 
      SET is_active = true, 
          email_verified = true, 
          email_verification_token = NULL,
          email_verification_expires = NULL,
          updated_at = NOW()
      WHERE id = ?
    `, [user.id])

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    const userResponse = {
      id: user.id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      mobile: user.phone
    }

    return NextResponse.json({
      success: true,
      token,
      user: userResponse,
      message: 'Account verified successfully!'
    })

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify OTP' },
      { status: 500 }
    )
  }
}