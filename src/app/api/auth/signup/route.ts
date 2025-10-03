import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/database'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { first_name, last_name, email, mobile, password, otp_method } = await request.json()

    if (!first_name || !last_name || !email || !mobile || !password) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const [existingUser] = await executeQuery(`
      SELECT id FROM users WHERE email = ? OR mobile = ?
    `, [email, mobile]) as any[]

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or mobile number already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Create user (initially unverified)
    const result = await executeQuery(`
      INSERT INTO users (
        first_name, last_name, email, mobile, password, 
        email_verification_token, email_verification_expires, 
        is_active, email_verified, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [
      first_name, last_name, email, mobile, hashedPassword,
      otp, otpExpiry, false, false
    ]) as any

    // Send OTP based on method
    if (otp_method === 'email') {
      await sendEmailOTP(email, otp, first_name)
    } else if (otp_method === 'whatsapp') {
      await sendWhatsAppOTP(mobile, otp, first_name)
    }

    return NextResponse.json({
      success: true,
      message: `OTP sent to your ${otp_method}`,
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

async function sendEmailOTP(email: string, otp: string, firstName: string) {
  // For now, just log the OTP (in production, use a real email service)
  console.log(`Email OTP for ${email}: ${otp}`)
  
  // In production, you would integrate with services like:
  // - SendGrid
  // - AWS SES  
  // - Nodemailer with SMTP
  
  // Example email content:
  const emailContent = `
    Hi ${firstName},
    
    Your verification code for AYN Beauty is: ${otp}
    
    This code will expire in 10 minutes.
    
    Best regards,
    AYN Beauty Team
  `
  
  // TODO: Implement actual email sending
  return Promise.resolve()
}

async function sendWhatsAppOTP(mobile: string, otp: string, firstName: string) {
  // For now, just log the OTP (in production, use WhatsApp Business API)
  console.log(`WhatsApp OTP for ${mobile}: ${otp}`)
  
  // In production, you would integrate with:
  // - WhatsApp Business API
  // - Twilio WhatsApp API
  // - Meta WhatsApp Business Platform
  
  try {
    // Example WhatsApp message format:
    const message = `Hi ${firstName}! Your AYN Beauty verification code is: ${otp}. Valid for 10 minutes.`
    
    // TODO: Implement actual WhatsApp API call
    // const response = await fetch('https://api.whatsapp.com/send', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     messaging_product: 'whatsapp',
    //     to: mobile,
    //     type: 'text',
    //     text: { body: message }
    //   })
    // })
    
    return Promise.resolve()
  } catch (error) {
    console.error('WhatsApp OTP error:', error)
    throw error
  }
}