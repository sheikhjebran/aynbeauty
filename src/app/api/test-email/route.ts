import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Generate a test OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // For now, just return the OTP in the response for testing
    console.log(`🧪 TEST EMAIL OTP for ${email}: ${otp}`)

    return NextResponse.json({
      success: true,
      message: `Test OTP generated for ${email}`,
      otp: otp, // Only for testing - remove in production
      debug: {
        email_user: process.env.EMAIL_USER,
        email_host: process.env.EMAIL_HOST,
        email_port: process.env.EMAIL_PORT,
        has_password: !!process.env.EMAIL_PASS,
        password_length: process.env.EMAIL_PASS?.length || 0
      }
    })

  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json(
      { error: 'Test failed' },
      { status: 500 }
    )
  }
}