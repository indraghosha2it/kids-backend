// utils/forgetPasswordOtpService.js
const nodemailer = require('nodemailer');

// Validate environment variables
const requiredEnvVars = ['INFO_SMTP_USER', 'INFO_SMTP_PASSWORD', 'INFO_SMTP_HOST', 'INFO_SMTP_PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    console.error('Please check your .env file');
  }
}

// ToyMart Brand Colors
const TOYMART_COLORS = {
  primary: '#4A8A90',    // Teal
  secondary: '#FFB6C1',  // Soft Pink
  accent: '#FFD93D',     // Yellow
  textDark: '#2D3A5C',   // Dark Blue
  textLight: '#6B7280',  // Gray
  white: '#FFFFFF',
  lightBg: '#FFF9F0',    // Warm Cream
  border: '#E5E7EB',
  warning: '#F59E0B'
};

// Create transporter for Hostinger SMTP (port 465 with SSL)
const transporter = nodemailer.createTransport({
  host: process.env.INFO_SMTP_HOST,
  port: parseInt(process.env.INFO_SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.INFO_SMTP_USER,
    pass: process.env.INFO_SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Email server connection error:', error);
    console.error('Please check your SMTP credentials in .env file');
  } else {
    console.log('✅ Forget Password Email Service is ready');
    console.log(`📧 Connected to: ${process.env.INFO_SMTP_HOST}`);
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send password reset OTP email
const sendPasswordResetOTP = async (email, otp, userName) => {
  // Validate email credentials first
  if (!process.env.INFO_SMTP_USER || !process.env.INFO_SMTP_PASSWORD) {
    throw new Error('Email credentials not configured. Please check your .env file.');
  }

  const mailOptions = {
    from: `"ToyMart Support" <${process.env.INFO_SMTP_USER}>`,
    to: email,
    subject: '🔐 Password Reset Request - ToyMart',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Fredoka+One&display=swap');
        </style>
      </head>
      <body style="font-family: 'Comic Neue', 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: ${TOYMART_COLORS.lightBg};">
        <div style="max-width: 600px; margin: 20px auto; background-color: ${TOYMART_COLORS.white}; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.1);">
          
          <!-- Header with ToyMart Branding -->
          <div style="background: linear-gradient(135deg, ${TOYMART_COLORS.primary} 0%, ${TOYMART_COLORS.secondary} 100%); padding: 35px 20px; text-align: center;">
            <div style="display: inline-block; background: white; border-radius: 50%; padding: 15px; margin-bottom: 15px;">
              <span style="font-size: 40px;">🔐</span>
            </div>
            <h1 style="color: ${TOYMART_COLORS.white}; margin: 0; font-size: 32px; font-family: 'Fredoka One', cursive;">ToyMart</h1>
            <p style="color: ${TOYMART_COLORS.white}; margin: 10px 0 0; opacity: 0.95; font-size: 14px;">Where every child's dream comes true! 🎈</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: ${TOYMART_COLORS.textDark}; margin-top: 0; font-family: 'Fredoka One', cursive; font-size: 24px;">Hello, ${userName}! 🧸</h2>
            
            <p style="color: ${TOYMART_COLORS.textLight}; line-height: 1.6; font-size: 16px;">We received a request to reset your password for your ToyMart account. Don't worry, we've got you covered!</p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, ${TOYMART_COLORS.lightBg} 0%, ${TOYMART_COLORS.white} 100%); border: 2px dashed ${TOYMART_COLORS.primary}; border-radius: 20px; padding: 25px; text-align: center; margin: 30px 0;">
              <p style="color: ${TOYMART_COLORS.textLight}; font-size: 14px; margin: 0 0 10px 0;">Your Password Reset Code</p>
              <h1 style="font-size: 52px; letter-spacing: 12px; color: ${TOYMART_COLORS.primary}; margin: 10px 0; font-family: 'Courier New', monospace; font-weight: bold;">${otp}</h1>
              <p style="color: ${TOYMART_COLORS.textLight}; font-size: 12px; margin-top: 10px;">Enter this code to reset your password</p>
            </div>
            
            <p style="color: ${TOYMART_COLORS.textLight}; line-height: 1.6;">This OTP is valid for <strong style="color: ${TOYMART_COLORS.primary};">10 minutes</strong>.</p>
            
            <div style="background-color: ${TOYMART_COLORS.lightBg}; border-left: 4px solid ${TOYMART_COLORS.warning}; padding: 15px; margin: 30px 0; border-radius: 12px;">
              <p style="color: ${TOYMART_COLORS.textLight}; margin: 0; font-size: 14px; line-height: 1.5;">
                <strong style="color: ${TOYMART_COLORS.primary};">🔒 Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account security is important to us.
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: ${TOYMART_COLORS.textLight}; font-size: 13px; margin: 5px 0;">
                Need help? Contact our support team at <a href="mailto:${process.env.INFO_SMTP_USER}" style="color: ${TOYMART_COLORS.primary};">${process.env.INFO_SMTP_USER}</a>
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: ${TOYMART_COLORS.lightBg}; padding: 25px 30px; text-align: center; border-top: 1px solid ${TOYMART_COLORS.border};">
            <p style="color: ${TOYMART_COLORS.textLight}; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} ToyMart. All rights reserved.<br>
              Making childhood magical, one toy at a time! 🎈
            </p>
            <p style="color: ${TOYMART_COLORS.textLight}; font-size: 11px; margin-top: 10px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: ${TOYMART_COLORS.primary}; text-decoration: none;">Visit our website</a> | 
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/contact" style="color: ${TOYMART_COLORS.primary}; text-decoration: none;">Contact Support</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    // Plain text version
    text: `
      Hello ${userName},
      
      We received a request to reset your password for your ToyMart account.
      
      Your password reset OTP is: ${otp}
      
      This OTP is valid for 10 minutes.
      
      If you didn't request this password reset, please ignore this email. Your account security is important to us.
      
      Need help? Contact our support team at: ${process.env.INFO_SMTP_USER}
      
      Visit us at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
    `
  };

  try {
    console.log(`📧 Attempting to send password reset OTP to: ${email}`);
    console.log(`📧 Using SMTP server: ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}`);
    console.log(`📧 From: ${process.env.INFO_SMTP_USER}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset OTP sent successfully to ${email}`);
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📧 Response: ${info.response}`);
    
    return true;
  } catch (error) {
    console.error('❌ Password reset email send error details:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    // More specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your SMTP username and password.');
    } else if (error.code === 'ESOCKET') {
      throw new Error(`Could not connect to SMTP server ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}. Please check your network and firewall settings.`);
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Connection to SMTP server timed out. Please check your network.');
    } else {
      throw new Error(`Failed to send password reset OTP: ${error.message}`);
    }
  }
};

module.exports = {
  generateOTP,
  sendPasswordResetOTP
};