import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const { email, otp_method } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Find user
    const [user] = await executeQuery(`
      SELECT id, first_name, mobile FROM users WHERE email = ?
    `, [email]) as any[]

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Update user with new OTP
    await executeQuery(`
      UPDATE users 
      SET email_verification_token = ?, 
          email_verification_expires = ?
      WHERE id = ?
    `, [otp, otpExpiry, user.id])

    // Send OTP based on method
    if (otp_method === 'email') {
      await sendEmailOTP(email, otp, user.first_name)
    } else if (otp_method === 'whatsapp') {
      await sendWhatsAppOTP(user.mobile, otp, user.first_name)
    }

    return NextResponse.json({
      success: true,
      message: `OTP resent to your ${otp_method}`
    })

  } catch (error) {
    console.error('Resend OTP error:', error)
    return NextResponse.json(
      { error: 'Failed to resend OTP' },
      { status: 500 }
    )
  }
}

async function sendEmailOTP(email: string, otp: string, firstName: string) {
  console.log(`Email OTP for ${email}: ${otp}`)
  return Promise.resolve()
}

async function sendWhatsAppOTP(mobile: string, otp: string, firstName: string) {
  console.log(`WhatsApp OTP for ${mobile}: ${otp}`)
  return Promise.resolve()
}