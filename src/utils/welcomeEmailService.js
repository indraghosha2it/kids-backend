// utils/welcomeEmailService.js
const nodemailer = require('nodemailer');

// Jute Craftify Brand Colors
const JUTE_COLORS = {
  primary: '#6B4F3A',    // Earthy Brown
  secondary: '#F5E6D3',  // Natural Beige
  accent: '#3A7D44',     // Green
  textDark: '#2C2420',   // Dark Text
  textLight: '#8B7355',  // Light Text
  white: '#FFFFFF',
  lightBg: '#FAF7F2',
  border: '#E5D5C0'
};

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.INFO_SMTP_HOST,
  port: parseInt(process.env.INFO_SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.INFO_SMTP_USER,
    pass: process.env.INFO_SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Welcome Email Service - Configuration error:', error.message);
  } else {
    console.log('✅ Welcome Email Service is ready');
  }
});

/**
 * Send welcome email to newly registered customer (Regular Signup)
 * @param {string} email - Customer email
 * @param {string} name - Customer name (companyName or contactPerson)
 */
const sendWelcomeEmail = async (email, name) => {
  console.log('📧 Sending welcome email to:', email);
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const currentYear = new Date().getFullYear();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: ${JUTE_COLORS.textDark}; 
          margin: 0;
          padding: 0;
          background-color: ${JUTE_COLORS.lightBg};
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: ${JUTE_COLORS.white};
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, ${JUTE_COLORS.primary} 0%, #8B6B51 100%);
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          color: ${JUTE_COLORS.white};
          margin: 0;
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .header h1 span:first-child {
          font-size: 36px;
        }
        .content {
          padding: 30px;
          text-align: left;
        }
        .welcome-message {
          font-size: 16px;
          margin-bottom: 25px;
        }
        .benefits-box {
          background: ${JUTE_COLORS.secondary};
          border-left: 4px solid ${JUTE_COLORS.primary};
          padding: 20px;
          margin: 25px 0;
          border-radius: 8px;
        }
        .benefits-box h3 {
          margin: 0 0 15px 0;
          color: ${JUTE_COLORS.primary};
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .benefits-list li {
          padding: 8px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid ${JUTE_COLORS.border};
        }
        .benefits-list li:last-child {
          border-bottom: none;
        }
        .benefits-list li span:first-child {
          font-size: 20px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, ${JUTE_COLORS.primary} 0%, #8B6B51 100%);
          color: ${JUTE_COLORS.white};
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          background: ${JUTE_COLORS.lightBg};
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: ${JUTE_COLORS.textLight};
          border-top: 1px solid ${JUTE_COLORS.border};
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          color: ${JUTE_COLORS.primary};
          text-decoration: none;
          margin: 0 10px;
        }
        .highlight {
          color: ${JUTE_COLORS.primary};
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>
            <span>🌾</span>
            <span>Welcome to Jute Craftify!</span>
          </h1>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for choosing <span class="highlight">Jute Craftify</span>! We're thrilled to have you as part of our jute wholesale community.</p>
            <p>Your account has been successfully created and verified. You now have access to exclusive wholesale pricing on premium jute products, bulk ordering, and much more.</p>
          </div>
          
          <div class="benefits-box">
            <h3>
              <span>✨</span>
              <span>Your Member Benefits</span>
            </h3>
            <ul class="benefits-list">
              <li><span>🚀</span> <span><strong>Bulk Discounts</strong> - Special pricing for bulk orders</span></li>
              <li><span>✨</span> <span><strong>Quality Guaranteed</strong> - Premium jute products</span></li>
              <li><span>🌍</span> <span><strong>Global Shipping</strong> - Fast delivery worldwide</span></li>
              <li><span>🏷️</span> <span><strong>Wholesale Prices</strong> - Factory direct pricing</span></li>
              <li><span>🌿</span> <span><strong>Eco-Friendly</strong> - Sustainable jute products</span></li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${frontendUrl}/customer/dashboard" class="button">
              Go to Your Dashboard →
            </a>
          </div>
          
          <div style="margin-top: 25px; padding: 15px; background: ${JUTE_COLORS.secondary}; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>📞 Need Help?</strong></p>
            <p style="margin: 0; font-size: 14px;">Contact our support team:</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              📧 <a href="mailto:${process.env.INFO_SMTP_USER}" style="color: ${JUTE_COLORS.primary};">${process.env.INFO_SMTP_USER}</a><br>
              📞 +8801305-785685
            </p>
          </div>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Facebook</a> | 
            <a href="#">Instagram</a> | 
            <a href="#">LinkedIn</a>
          </div>
          <p>&copy; ${currentYear} Jute Craftify. All rights reserved.</p>
          <p>34/6, Mongla, Khulna, Bangladesh</p>
          <p>
            <a href="${frontendUrl}/privacy" style="color: ${JUTE_COLORS.textLight};">Privacy Policy</a> | 
            <a href="${frontendUrl}/terms" style="color: ${JUTE_COLORS.textLight};">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await transporter.sendMail({
      from: `"Jute Craftify" <${process.env.INFO_SMTP_USER}>`,
      to: email,
      subject: `🌾 Welcome to Jute Craftify, ${name}!`,
      html: htmlContent
    });
    
    console.log('✅ Welcome email sent to:', email, 'Message ID:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email for Google signup users (Same design as regular signup)
 * @param {string} email - Customer email
 * @param {string} name - Customer name
 * @param {boolean} requiresProfileCompletion - Whether profile needs completion
 */
const sendGoogleWelcomeEmail = async (email, name, requiresProfileCompletion = true) => {
  console.log('📧 Sending Google welcome email to:', email);
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const currentYear = new Date().getFullYear();

  // Create profile completion note if needed
  const profileNote = requiresProfileCompletion ? `
    <div style="margin: 25px 0; padding: 20px; background: ${JUTE_COLORS.secondary}; border-left: 4px solid ${JUTE_COLORS.accent}; border-radius: 8px;">
      <h3 style="margin: 0 0 10px 0; color: ${JUTE_COLORS.accent}; display: flex; align-items: center; gap: 8px;">
        <span>📝</span>
        <span>Complete Your Profile</span>
      </h3>
      <p style="margin: 0; font-size: 14px; color: ${JUTE_COLORS.textLight};">Please visit your dashboard to complete your profile information including company details, address, and contact information to start ordering premium jute products.</p>
    </div>
  ` : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: ${JUTE_COLORS.textDark}; 
          margin: 0;
          padding: 0;
          background-color: ${JUTE_COLORS.lightBg};
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: ${JUTE_COLORS.white};
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, ${JUTE_COLORS.primary} 0%, #8B6B51 100%);
          padding: 30px 20px;
          text-align: center;
        }
        .header h1 {
          color: ${JUTE_COLORS.white};
          margin: 0;
          font-size: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .header h1 span:first-child {
          font-size: 36px;
        }
        .content {
          padding: 30px;
          text-align: left;
        }
        .welcome-message {
          font-size: 16px;
          margin-bottom: 25px;
        }
        .benefits-box {
          background: ${JUTE_COLORS.secondary};
          border-left: 4px solid ${JUTE_COLORS.primary};
          padding: 20px;
          margin: 25px 0;
          border-radius: 8px;
        }
        .benefits-box h3 {
          margin: 0 0 15px 0;
          color: ${JUTE_COLORS.primary};
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .benefits-list li {
          padding: 8px 0;
          display: flex;
          align-items: center;
          gap: 10px;
          border-bottom: 1px solid ${JUTE_COLORS.border};
        }
        .benefits-list li:last-child {
          border-bottom: none;
        }
        .benefits-list li span:first-child {
          font-size: 20px;
        }
        .google-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${JUTE_COLORS.lightBg};
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 13px;
          margin: 10px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, ${JUTE_COLORS.primary} 0%, #8B6B51 100%);
          color: ${JUTE_COLORS.white};
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
        }
        .footer {
          background: ${JUTE_COLORS.lightBg};
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: ${JUTE_COLORS.textLight};
          border-top: 1px solid ${JUTE_COLORS.border};
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          color: ${JUTE_COLORS.primary};
          text-decoration: none;
          margin: 0 10px;
        }
        .highlight {
          color: ${JUTE_COLORS.primary};
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>
            <span>🔐</span>
            <span>Welcome to Jute Craftify!</span>
          </h1>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <p>Dear <strong>${name}</strong>,</p>
            <p>You've successfully signed up with <span class="highlight">Google</span>. Welcome to <span class="highlight">Jute Craftify</span>!</p>
            <p>Your account has been created and you now have access to our wholesale platform where you can browse premium jute products, place bulk orders, and manage your business.</p>
          </div>
          
          ${profileNote}
          
          <div class="benefits-box">
            <h3>
              <span>✨</span>
              <span>Your Member Benefits</span>
            </h3>
            <ul class="benefits-list">
              <li><span>🚀</span> <span><strong>Bulk Discounts</strong> - Special pricing for bulk orders</span></li>
              <li><span>✨</span> <span><strong>Quality Guaranteed</strong> - Premium jute products</span></li>
              <li><span>🌍</span> <span><strong>Global Shipping</strong> - Fast delivery worldwide</span></li>
              <li><span>🏷️</span> <span><strong>Wholesale Prices</strong> - Factory direct pricing</span></li>
              <li><span>🌿</span> <span><strong>Eco-Friendly</strong> - Sustainable jute products</span></li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${frontendUrl}/customer/dashboard" class="button">
              Go to Your Dashboard →
            </a>
          </div>
          
          <div style="margin-top: 25px; padding: 15px; background: ${JUTE_COLORS.secondary}; border-radius: 8px;">
            <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>📞 Need Help?</strong></p>
            <p style="margin: 0; font-size: 14px;">Contact our support team:</p>
            <p style="margin: 5px 0 0 0; font-size: 14px;">
              📧 <a href="mailto:${process.env.INFO_SMTP_USER}" style="color: ${JUTE_COLORS.primary};">${process.env.INFO_SMTP_USER}</a><br>
              📞 +8801305-785685
            </p>
          </div>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Facebook</a> | 
            <a href="#">Instagram</a> | 
            <a href="#">LinkedIn</a>
          </div>
          <p>&copy; ${currentYear} Jute Craftify. All rights reserved.</p>
          <p>34/6, Mongla, Khulna, Bangladesh</p>
          <p>
            <a href="${frontendUrl}/privacy" style="color: ${JUTE_COLORS.textLight};">Privacy Policy</a> | 
            <a href="${frontendUrl}/terms" style="color: ${JUTE_COLORS.textLight};">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await transporter.sendMail({
      from: `"Jute Craftify" <${process.env.INFO_SMTP_USER}>`,
      to: email,
      subject: `🌾 Welcome to Jute Craftify, ${name}!`,
      html: htmlContent
    });
    
    console.log('✅ Google welcome email sent to:', email, 'Message ID:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Google welcome email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendGoogleWelcomeEmail
};
