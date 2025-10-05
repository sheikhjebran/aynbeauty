import twilio from 'twilio';

// Initialize Twilio client with environment check
function createTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  
  if (!accountSid || !authToken) {
    console.warn('Twilio credentials not configured');
    return null;
  }
  
  return twilio(accountSid, authToken);
}

const client = createTwilioClient();

// WhatsApp message templates
export const whatsappTemplates = {
  otpVerification: (otp: string, userName: string) => `🌸 *AynBeauty Verification*

Hi ${userName}! 👋

Your verification code is: *${otp}*

⏰ This code will expire in 10 minutes
🔒 Don't share this code with anyone
💄 Welcome to AynBeauty!

If you didn't request this code, please ignore this message.`,

  welcomeMessage: (userName: string) => `🎉 *Welcome to AynBeauty!*

Hi ${userName}! 

Your account has been successfully verified! 

Explore our amazing collection of beauty products:
• Skincare essentials
• Makeup & cosmetics  
• Hair care products
• Fragrances & more

Start shopping: ${process.env.APP_URL}

Thank you for joining AynBeauty! 💄✨`
};

// Send WhatsApp message function
export async function sendWhatsAppMessage(to: string, message: string) {
  try {
    if (!client) {
      throw new Error('Twilio client not configured');
    }
    
    // Ensure the phone number is in international format
    const formattedPhone = formatPhoneNumber(to);
    
    console.log(`📱 Sending WhatsApp to: ${formattedPhone}`);
    
    const messageResponse = await client.messages.create({
      body: message,
      from: process.env.TWILIO_WHATSAPP_FROM, // Twilio WhatsApp sandbox number
      to: `whatsapp:${formattedPhone}`
    });

    console.log('✅ WhatsApp sent successfully:', messageResponse.sid);
    return { 
      success: true, 
      messageId: messageResponse.sid,
      status: messageResponse.status 
    };
  } catch (error) {
    console.error('❌ WhatsApp sending failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Send OTP via WhatsApp
export async function sendWhatsAppOTP(phone: string, otp: string, userName: string) {
  const message = whatsappTemplates.otpVerification(otp, userName);
  return await sendWhatsAppMessage(phone, message);
}

// Send welcome message via WhatsApp
export async function sendWelcomeWhatsApp(phone: string, userName: string) {
  const message = whatsappTemplates.welcomeMessage(userName);
  return await sendWhatsAppMessage(phone, message);
}

// Format phone number to international format
function formatPhoneNumber(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // If starts with 0, assume it's India and add country code
  if (cleaned.startsWith('0')) {
    cleaned = '91' + cleaned.substring(1);
  }
  
  // If doesn't start with country code, assume India
  if (!cleaned.startsWith('91') && cleaned.length === 10) {
    cleaned = '91' + cleaned;
  }
  
  return '+' + cleaned;
}

// Test WhatsApp connection
export async function testWhatsAppConnection() {
  try {
    if (!client) {
      throw new Error('Twilio client not configured');
    }
    
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      throw new Error('Twilio credentials not configured');
    }
    
    // Test with Twilio API
    const account = await client.api.accounts(process.env.TWILIO_ACCOUNT_SID).fetch();
    console.log('✅ Twilio connection successful:', account.friendlyName);
    return { success: true, account: account.friendlyName };
  } catch (error) {
    console.error('❌ Twilio connection failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}