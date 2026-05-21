



// // utils/emailOtpService.js
// const nodemailer = require('nodemailer');

// // Validate environment variables
// const requiredEnvVars = ['INFO_SMTP_USER', 'INFO_SMTP_PASSWORD', 'INFO_SMTP_HOST', 'INFO_SMTP_PORT'];
// for (const envVar of requiredEnvVars) {
//   if (!process.env[envVar]) {
//     console.error(`❌ Missing required environment variable: ${envVar}`);
//     console.error('Please check your .env file');
//   }
// }

// // Jute Craftify Brand Colors
// const JUTE_COLORS = {
//   primary: '#6B4F3A',
//   secondary: '#F5E6D3',
//   accent: '#3A7D44',
//   textDark: '#2C2420',
//   textLight: '#8B7355',
//   white: '#FFFFFF',
//   lightBg: '#FAF7F2',
//   border: '#E5D5C0'
// };

// // Create transporter for Hostinger SMTP (port 465 with SSL)
// const transporter = nodemailer.createTransport({
//   host: process.env.INFO_SMTP_HOST,
//   port: parseInt(process.env.INFO_SMTP_PORT) || 465,
//   secure: true,
//   auth: {
//     user: process.env.INFO_SMTP_USER,
//     pass: process.env.INFO_SMTP_PASSWORD
//   },
//   tls: {
//     rejectUnauthorized: false
//   },
//   debug: true,
//   logger: true
// });

// // Verify connection configuration
// transporter.verify(function(error, success) {
//   if (error) {
//     console.error('❌ Email server connection error:', error);
//     console.error('Please check your SMTP credentials in .env file');
//   } else {
//     console.log('✅ Email server is ready to send messages');
//     console.log(`📧 Connected to: ${process.env.INFO_SMTP_HOST}`);
//   }
// });

// // Generate 6-digit OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Send OTP email with Jute Craftify branding
// const sendOTPEmail = async (email, otp, companyName) => {
//   if (!process.env.INFO_SMTP_USER || !process.env.INFO_SMTP_PASSWORD) {
//     throw new Error('Email credentials not configured. Please check your .env file.');
//   }

//   const mailOptions = {
//     from: `"Jute Craftify Support" <${process.env.INFO_SMTP_USER}>`,
//     to: email,
//     subject: 'Verify Your Email - Jute Craftify',
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       </head>
//       <body style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: ${JUTE_COLORS.lightBg};">
//         <div style="max-width: 600px; margin: 20px auto; background-color: ${JUTE_COLORS.white}; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
//           <!-- Header -->
//           <div style="background: linear-gradient(135deg, ${JUTE_COLORS.primary} 0%, #8B6B51 100%); padding: 30px 20px; text-align: center;">
//             <h1 style="color: ${JUTE_COLORS.white}; margin: 0; font-size: 28px;">Jute Craftify</h1>
//             <p style="color: ${JUTE_COLORS.white}; margin: 10px 0 0; opacity: 0.9;">Premium Jute Products - Wholesale Marketplace</p>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 40px 30px;">
//             <h2 style="color: ${JUTE_COLORS.textDark}; margin-top: 0;">Welcome, ${companyName}!</h2>
            
//             <p style="color: ${JUTE_COLORS.textLight}; line-height: 1.6;">Thank you for registering with Jute Craftify. To complete your registration, please verify your email address using the OTP below:</p>
            
//             <!-- OTP Box -->
//             <div style="background-color: ${JUTE_COLORS.secondary}; border: 2px dashed ${JUTE_COLORS.primary}; border-radius: 12px; padding: 20px; text-align: center; margin: 30px 0;">
//               <h1 style="font-size: 48px; letter-spacing: 10px; color: ${JUTE_COLORS.primary}; margin: 0; font-family: 'Courier New', monospace;">${otp}</h1>
//             </div>
            
//             <p style="color: ${JUTE_COLORS.textLight}; line-height: 1.6;">This OTP is valid for <strong style="color: ${JUTE_COLORS.accent};">10 minutes</strong>.</p>
            
//             <div style="background-color: ${JUTE_COLORS.secondary}; border-left: 4px solid ${JUTE_COLORS.accent}; padding: 15px; margin: 30px 0;">
//               <p style="color: ${JUTE_COLORS.textLight}; margin: 0; font-size: 14px;">
//                 <strong>⚠️ Important:</strong> If you didn't request this registration, please ignore this email. Your account will not be activated without verification.
//               </p>
//             </div>
//           </div>
          
//           <!-- Footer -->
//           <div style="background-color: ${JUTE_COLORS.lightBg}; padding: 20px 30px; text-align: center; border-top: 1px solid ${JUTE_COLORS.border};">
//             <p style="color: #999999; font-size: 12px; margin: 0;">
//               &copy; ${new Date().getFullYear()} Jute Craftify. All rights reserved.<br>
//               <a href="https://jutecraftify.com" style="color: ${JUTE_COLORS.primary}; text-decoration: none;">www.jutecraftify.com</a>
//             </p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `,
//     text: `
//       Welcome to Jute Craftify, ${companyName}!
      
//       Thank you for registering. Please verify your email address using this OTP: ${otp}
      
//       This OTP is valid for 10 minutes.
      
//       If you didn't request this registration, please ignore this email.
      
//       Visit us at: https://jutecraftify.com
//     `
//   };

//   try {
//     console.log(`📧 Attempting to send OTP email to: ${email}`);
//     console.log(`📧 Using SMTP server: ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}`);
    
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ OTP email sent successfully to ${email}`);
//     console.log(`📧 Message ID: ${info.messageId}`);
    
//     return true;
//   } catch (error) {
//     console.error('❌ Email send error details:', {
//       error: error.message,
//       code: error.code,
//       command: error.command,
//       response: error.response,
//       responseCode: error.responseCode
//     });
    
//     if (error.code === 'EAUTH') {
//       throw new Error('Email authentication failed. Please check your SMTP username and password.');
//     } else if (error.code === 'ESOCKET') {
//       throw new Error(`Could not connect to SMTP server ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}. Please check your network and firewall settings.`);
//     } else if (error.code === 'ETIMEDOUT') {
//       throw new Error('Connection to SMTP server timed out. Please check your network.');
//     } else {
//       throw new Error(`Failed to send OTP email: ${error.message}`);
//     }
//   }
// };

// module.exports = {
//   generateOTP,
//   sendOTPEmail
// };


// utils/emailOtpService.js
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
  primary: '#4A8A90',
  secondary: '#FFB6C1',
  accent: '#FFD93D',
  textDark: '#2D3A5C',
  textLight: '#6B7280',
  white: '#FFFFFF',
  lightBg: '#FFF9F0',
  border: '#E5E7EB',
  success: '#10B981',
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
    console.log('✅ Email server is ready to send messages');
    console.log(`📧 Connected to: ${process.env.INFO_SMTP_HOST}`);
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email with ToyMart branding
const sendOTPEmail = async (email, otp, contactPerson) => {
  if (!process.env.INFO_SMTP_USER || !process.env.INFO_SMTP_PASSWORD) {
    throw new Error('Email credentials not configured. Please check your .env file.');
  }

  const mailOptions = {
    from: `"ToyMart" <${process.env.INFO_SMTP_USER}>`,
    to: email,
    subject: '🎈 Verify Your Email - ToyMart',
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
      <body style="font-family: 'Comic Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: ${TOYMART_COLORS.lightBg};">
        <div style="max-width: 600px; margin: 20px auto; background-color: ${TOYMART_COLORS.white}; border-radius: 24px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.1);">
          
          <!-- Header with ToyMart Branding -->
          <div style="background: linear-gradient(135deg, ${TOYMART_COLORS.primary} 0%, ${TOYMART_COLORS.secondary} 100%); padding: 35px 20px; text-align: center;">
            <div style="display: inline-block; background: white; border-radius: 50%; padding: 15px; margin-bottom: 15px;">
              <span style="font-size: 40px;">🧸</span>
            </div>
            <h1 style="color: ${TOYMART_COLORS.white}; margin: 0; font-size: 32px; font-family: 'Fredoka One', cursive;">ToyMart</h1>
            <p style="color: ${TOYMART_COLORS.white}; margin: 10px 0 0; opacity: 0.95; font-size: 14px;">Where every child's dream comes true! 🎈</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: ${TOYMART_COLORS.textDark}; margin-top: 0; font-family: 'Fredoka One', cursive; font-size: 24px;">Welcome to ToyMart, ${contactPerson}! 🎪</h2>
            
            <p style="color: ${TOYMART_COLORS.textLight}; line-height: 1.6; margin-bottom: 20px;">
              Thank you for joining the ToyMart family! We're so excited to have you on board. 
              To complete your registration and start your toy adventure, please verify your email address using the OTP below:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, ${TOYMART_COLORS.lightBg} 0%, ${TOYMART_COLORS.white} 100%); border: 2px dashed ${TOYMART_COLORS.primary}; border-radius: 20px; padding: 25px; text-align: center; margin: 30px 0;">
              <p style="color: ${TOYMART_COLORS.textLight}; font-size: 14px; margin-bottom: 10px;">Your Verification Code</p>
              <h1 style="font-size: 52px; letter-spacing: 12px; color: ${TOYMART_COLORS.primary}; margin: 10px 0; font-family: 'Courier New', monospace; font-weight: bold;">${otp}</h1>
              <p style="color: ${TOYMART_COLORS.textLight}; font-size: 12px; margin-top: 10px;">Enter this code to verify your email</p>
            </div>
            
            <p style="color: ${TOYMART_COLORS.textLight}; line-height: 1.6;">
              This OTP is valid for <strong style="color: ${TOYMART_COLORS.primary};">10 minutes</strong>.
            </p>
            
            <!-- Benefits Section -->
            <div style="background: ${TOYMART_COLORS.lightBg}; border-radius: 16px; padding: 20px; margin: 30px 0;">
              <p style="color: ${TOYMART_COLORS.textDark}; font-weight: bold; margin-bottom: 15px; text-align: center;">✨ What awaits you at ToyMart? ✨</p>
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="padding: 8px 0;">🎁</td>
                  <td style="padding: 8px 0; color: ${TOYMART_COLORS.textDark};">Exclusive toy deals & discounts</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">🚀</td>
                  <td style="padding: 8px 0; color: ${TOYMART_COLORS.textDark};">Fast delivery across Bangladesh</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">🛡️</td>
                  <td style="padding: 8px 0; color: ${TOYMART_COLORS.textDark};">100% safe & certified toys</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;">⭐</td>
                  <td style="padding: 8px 0; color: ${TOYMART_COLORS.textDark};">24/7 customer support</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: ${TOYMART_COLORS.secondary}20; border-left: 4px solid ${TOYMART_COLORS.warning}; padding: 15px; margin: 20px 0; border-radius: 8px;">
              <p style="color: ${TOYMART_COLORS.textLight}; margin: 0; font-size: 13px;">
                <strong>⚠️ Important:</strong> If you didn't request this registration, please ignore this email. 
                Your account will not be activated without verification.
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
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://toymart.com'}" style="color: ${TOYMART_COLORS.primary}; text-decoration: none;">Visit our website</a> | 
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://toymart.com'}/contact" style="color: ${TOYMART_COLORS.primary}; text-decoration: none;">Contact Support</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to ToyMart, ${contactPerson}!
      
      Thank you for joining the ToyMart family! We're so excited to have you on board.
      
      Your OTP verification code is: ${otp}
      
      This code is valid for 10 minutes.
      
      What awaits you at ToyMart?
      ✨ Exclusive toy deals & discounts
      ✨ Fast delivery across Bangladesh  
      ✨ 100% safe & certified toys
      ✨ 24/7 customer support
      
      If you didn't request this registration, please ignore this email.
      
      Visit us at: ${process.env.NEXT_PUBLIC_APP_URL || 'https://toymart.com'}
    `
  };

  try {
    console.log(`📧 Attempting to send OTP email to: ${email}`);
    console.log(`📧 Using SMTP server: ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ OTP email sent successfully to ${email}`);
    console.log(`📧 Message ID: ${info.messageId}`);
    
    return true;
  } catch (error) {
    console.error('❌ Email send error details:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your SMTP username and password.');
    } else if (error.code === 'ESOCKET') {
      throw new Error(`Could not connect to SMTP server ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}. Please check your network and firewall settings.`);
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Connection to SMTP server timed out. Please check your network.');
    } else {
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};