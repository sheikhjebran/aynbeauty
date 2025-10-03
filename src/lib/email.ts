import nodemailer from 'nodemailer';

// Debug email configuration
console.log('Email Configuration:', {
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS ? `${process.env.EMAIL_PASS.substring(0, 4)}...` : 'undefined'
});

// Create reusable transporter object
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail service
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Email templates
export const emailTemplates = {
  otpVerification: (otp: string, userName: string) => ({
    subject: 'AynBeauty - Verify Your Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Account - AynBeauty</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { background: #667eea; color: white; font-size: 32px; font-weight: bold; padding: 15px 30px; text-align: center; border-radius: 8px; margin: 20px 0; letter-spacing: 5px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌸 AynBeauty</h1>
            <p>Verify Your Account</p>
          </div>
          <div class="content">
            <h2>Hello ${userName}!</h2>
            <p>Welcome to AynBeauty! Please use the following OTP code to verify your account:</p>
            
            <div class="otp-code">${otp}</div>
            
            <p><strong>Important:</strong></p>
            <ul>
              <li>This OTP will expire in 10 minutes</li>
              <li>Do not share this code with anyone</li>
              <li>If you didn't create an account, please ignore this email</li>
            </ul>
            
            <p>Thank you for choosing AynBeauty! We're excited to have you as part of our beauty community.</p>
            
            <div class="footer">
              <p>© 2025 AynBeauty. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Hello ${userName}!
      
      Welcome to AynBeauty! Your verification code is: ${otp}
      
      This OTP will expire in 10 minutes. Do not share this code with anyone.
      
      If you didn't create an account, please ignore this email.
      
      Thank you for choosing AynBeauty!
    `
  })
};

// Send email function
export async function sendEmail(to: string, template: { subject: string; html: string; text: string }) {
  try {
    const mailOptions = {
      from: `"AynBeauty" <${process.env.EMAIL_USER}>`,
      to,
      subject: template.subject,
      text: template.text,
      html: template.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Send OTP email
export async function sendOTPEmail(email: string, otp: string, userName: string) {
  // Test transporter connection first
  try {
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully');
  } catch (verifyError) {
    console.error('❌ SMTP connection verification failed:', verifyError);
    throw new Error('Email service connection failed');
  }

  const template = emailTemplates.otpVerification(otp, userName);
  return await sendEmail(email, template);
}