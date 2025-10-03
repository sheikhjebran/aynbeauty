import { NextRequest, NextResponse } from 'next/server'
import { testWhatsAppConnection, sendWhatsAppOTP } from '@/lib/whatsapp'

export async function POST(request: NextRequest) {
  try {
    const { phone, action } = await request.json()

    if (action === 'test-connection') {
      const result = await testWhatsAppConnection()
      return NextResponse.json(result)
    }

    if (action === 'send-test-otp') {
      if (!phone) {
        return NextResponse.json(
          { error: 'Phone number is required' },
          { status: 400 }
        )
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      const result = await sendWhatsAppOTP(phone, otp, 'Test User')
      
      return NextResponse.json({
        ...result,
        otp: result.success ? otp : undefined,
        debug: {
          originalPhone: phone,
          hasCredentials: {
            accountSid: !!process.env.TWILIO_ACCOUNT_SID,
            authToken: !!process.env.TWILIO_AUTH_TOKEN,
            whatsappFrom: !!process.env.TWILIO_WHATSAPP_FROM
          }
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action. Use "test-connection" or "send-test-otp"' },
      { status: 400 }
    )

  } catch (error) {
    console.error('WhatsApp test error:', error)
    return NextResponse.json(
      { error: 'Test failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}