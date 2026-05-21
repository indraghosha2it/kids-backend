// utils/welcomeEmailService.js
const nodemailer = require('nodemailer');

// ToyMart Brand Colors
const TOYMART_COLORS = {
  primary: '#4A8A90',    // Teal
  secondary: '#FFB6C1',  // Soft Pink
  accent: '#FFD93D',     // Yellow
  textDark: '#2D3A5C',   // Dark Blue
  textLight: '#6B7280',  // Gray
  white: '#FFFFFF',
  lightBg: '#FFF9F0',    // Warm Cream
  border: '#E5E7EB'
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
 * @param {string} name - Customer name (contactPerson)
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
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Fredoka+One&display=swap');
        body { 
          font-family: 'Comic Neue', 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: ${TOYMART_COLORS.textDark}; 
          margin: 0;
          padding: 0;
          background-color: ${TOYMART_COLORS.lightBg};
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: ${TOYMART_COLORS.white};
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, ${TOYMART_COLORS.primary} 0%, ${TOYMART_COLORS.secondary} 100%);
          padding: 35px 20px;
          text-align: center;
        }
        .header h1 {
          color: ${TOYMART_COLORS.white};
          margin: 0;
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-family: 'Fredoka One', cursive;
        }
        .header h1 span:first-child {
          font-size: 40px;
        }
        .content {
          padding: 35px 30px;
          text-align: left;
        }
        .welcome-message {
          font-size: 16px;
          margin-bottom: 25px;
        }
        .benefits-box {
          background: ${TOYMART_COLORS.lightBg};
          border-left: 4px solid ${TOYMART_COLORS.primary};
          padding: 20px;
          margin: 25px 0;
          border-radius: 16px;
        }
        .benefits-box h3 {
          margin: 0 0 15px 0;
          color: ${TOYMART_COLORS.primary};
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Fredoka One', cursive;
          font-size: 18px;
        }
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .benefits-list li {
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid ${TOYMART_COLORS.border};
        }
        .benefits-list li:last-child {
          border-bottom: none;
        }
        .benefits-list li span:first-child {
          font-size: 22px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, ${TOYMART_COLORS.primary} 0%, ${TOYMART_COLORS.secondary} 100%);
          color: ${TOYMART_COLORS.white};
          padding: 14px 35px;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
          font-family: 'Fredoka One', cursive;
          font-size: 16px;
          transition: transform 0.3s ease;
        }
        .button:hover {
          transform: scale(1.05);
        }
        .footer {
          background: ${TOYMART_COLORS.lightBg};
          padding: 25px;
          text-align: center;
          font-size: 12px;
          color: ${TOYMART_COLORS.textLight};
          border-top: 1px solid ${TOYMART_COLORS.border};
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          color: ${TOYMART_COLORS.primary};
          text-decoration: none;
          margin: 0 10px;
          font-weight: bold;
        }
        .highlight {
          color: ${TOYMART_COLORS.primary};
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>
            <span>🧸</span>
            <span>Welcome to ToyMart!</span>
            <span>🎈</span>
          </h1>
          <p style="color: ${TOYMART_COLORS.white}; margin: 10px 0 0; opacity: 0.95;">Where every child's dream comes true!</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <p>Dear <strong>${name}</strong>,</p>
            <p>🎉 <span class="highlight">Welcome to the ToyMart family!</span> We're absolutely thrilled to have you on board!</p>
            <p>Your account has been successfully created and verified. Get ready for a magical journey filled with amazing toys, exciting deals, and endless fun!</p>
          </div>
          
          <div class="benefits-box">
            <h3>
              <span>✨</span>
              <span>What Awaits You at ToyMart</span>
            </h3>
            <ul class="benefits-list">
              <li><span>🎁</span> <span><strong>Exclusive Deals</strong> - Special discounts on premium toys</span></li>
              <li><span>🚀</span> <span><strong>Fast Delivery</strong> - Quick shipping across Bangladesh</span></li>
              <li><span>🛡️</span> <span><strong>Safe & Certified</strong> - All toys meet international safety standards</span></li>
              <li><span>⭐</span> <span><strong>24/7 Support</strong> - Our team is always here to help</span></li>
              <li><span>🎪</span> <span><strong>New Arrivals</strong> - Fresh toys added every week</span></li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${frontendUrl}/customer/dashboard" class="button">
              🚀 Go to Your Dashboard →
            </a>
          </div>
          
          <div style="margin-top: 25px; padding: 20px; background: ${TOYMART_COLORS.lightBg}; border-radius: 16px;">
            <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>📞 Need Help?</strong></p>
            <p style="margin: 0; font-size: 14px;">Our friendly customer support team is here for you!</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">
              📧 <a href="mailto:${process.env.INFO_SMTP_USER}" style="color: ${TOYMART_COLORS.primary};">${process.env.INFO_SMTP_USER}</a><br>
              📞 +880 1234 567890
            </p>
          </div>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Facebook</a> | 
            <a href="#">Instagram</a> | 
            <a href="#">YouTube</a>
          </div>
          <p>&copy; ${currentYear} ToyMart. All rights reserved.</p>
          <p>Making childhood magical, one toy at a time! 🎈</p>
          <p>
            <a href="${frontendUrl}/privacy" style="color: ${TOYMART_COLORS.textLight};">Privacy Policy</a> | 
            <a href="${frontendUrl}/terms" style="color: ${TOYMART_COLORS.textLight};">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await transporter.sendMail({
      from: `"ToyMart" <${process.env.INFO_SMTP_USER}>`,
      to: email,
      subject: `🧸 Welcome to ToyMart, ${name}! 🎈`,
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
 * Send welcome email for Google signup users
 * @param {string} email - Customer email
 * @param {string} name - Customer name
 * @param {boolean} requiresProfileCompletion - Whether profile needs completion
 */
const sendGoogleWelcomeEmail = async (email, name, requiresProfileCompletion = true) => {
  console.log('📧 Sending Google welcome email to:', email);
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const currentYear = new Date().getFullYear();

  const profileNote = requiresProfileCompletion ? `
    <div style="margin: 25px 0; padding: 20px; background: ${TOYMART_COLORS.lightBg}; border-left: 4px solid ${TOYMART_COLORS.accent}; border-radius: 16px;">
      <h3 style="margin: 0 0 10px 0; color: ${TOYMART_COLORS.primary}; display: flex; align-items: center; gap: 8px; font-family: 'Fredoka One', cursive;">
        <span>📝</span>
        <span>Complete Your Profile</span>
      </h3>
      <p style="margin: 0; font-size: 14px; color: ${TOYMART_COLORS.textLight};">Please visit your dashboard to complete your profile information so we can personalize your toy recommendations and provide the best shopping experience for you and your little ones!</p>
    </div>
  ` : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@400;700&family=Fredoka+One&display=swap');
        body { 
          font-family: 'Comic Neue', 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: ${TOYMART_COLORS.textDark}; 
          margin: 0;
          padding: 0;
          background-color: ${TOYMART_COLORS.lightBg};
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: ${TOYMART_COLORS.white};
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1);
        }
        .header {
          background: linear-gradient(135deg, ${TOYMART_COLORS.primary} 0%, ${TOYMART_COLORS.secondary} 100%);
          padding: 35px 20px;
          text-align: center;
        }
        .header h1 {
          color: ${TOYMART_COLORS.white};
          margin: 0;
          font-size: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-family: 'Fredoka One', cursive;
        }
        .header h1 span:first-child {
          font-size: 40px;
        }
        .content {
          padding: 35px 30px;
          text-align: left;
        }
        .welcome-message {
          font-size: 16px;
          margin-bottom: 25px;
        }
        .benefits-box {
          background: ${TOYMART_COLORS.lightBg};
          border-left: 4px solid ${TOYMART_COLORS.primary};
          padding: 20px;
          margin: 25px 0;
          border-radius: 16px;
        }
        .benefits-box h3 {
          margin: 0 0 15px 0;
          color: ${TOYMART_COLORS.primary};
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: 'Fredoka One', cursive;
          font-size: 18px;
        }
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .benefits-list li {
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 12px;
          border-bottom: 1px solid ${TOYMART_COLORS.border};
        }
        .benefits-list li:last-child {
          border-bottom: none;
        }
        .benefits-list li span:first-child {
          font-size: 22px;
        }
        .google-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: ${TOYMART_COLORS.lightBg};
          padding: 8px 16px;
          border-radius: 50px;
          font-size: 13px;
          margin: 10px 0;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, ${TOYMART_COLORS.primary} 0%, ${TOYMART_COLORS.secondary} 100%);
          color: ${TOYMART_COLORS.white};
          padding: 14px 35px;
          text-decoration: none;
          border-radius: 50px;
          font-weight: bold;
          margin: 20px 0;
          text-align: center;
          font-family: 'Fredoka One', cursive;
          font-size: 16px;
          transition: transform 0.3s ease;
        }
        .button:hover {
          transform: scale(1.05);
        }
        .footer {
          background: ${TOYMART_COLORS.lightBg};
          padding: 25px;
          text-align: center;
          font-size: 12px;
          color: ${TOYMART_COLORS.textLight};
          border-top: 1px solid ${TOYMART_COLORS.border};
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          color: ${TOYMART_COLORS.primary};
          text-decoration: none;
          margin: 0 10px;
          font-weight: bold;
        }
        .highlight {
          color: ${TOYMART_COLORS.primary};
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>
            <span>🔐</span>
            <span>Welcome to ToyMart!</span>
            <span>🎈</span>
          </h1>
          <p style="color: ${TOYMART_COLORS.white}; margin: 10px 0 0; opacity: 0.95;">Where every child's dream comes true!</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <p>Dear <strong>${name}</strong>,</p>
            <div class="google-badge">
              <span>🔐</span>
              <span>You've signed up with <strong>Google</strong></span>
            </div>
            <p>🎉 <span class="highlight">Welcome to the ToyMart family!</span> We're so excited to have you join our community of happy families!</p>
            <p>Your account has been successfully created with Google Sign-In. Get ready to explore our magical world of toys!</p>
          </div>
          
          ${profileNote}
          
          <div class="benefits-box">
            <h3>
              <span>✨</span>
              <span>Your ToyMart Benefits</span>
            </h3>
            <ul class="benefits-list">
              <li><span>🎁</span> <span><strong>Exclusive Deals</strong> - Special discounts on premium toys</span></li>
              <li><span>🚀</span> <span><strong>Fast Delivery</strong> - Quick shipping across Bangladesh</span></li>
              <li><span>🛡️</span> <span><strong>Safe & Certified</strong> - All toys meet international safety standards</span></li>
              <li><span>⭐</span> <span><strong>24/7 Support</strong> - Our team is always here to help</span></li>
              <li><span>🎪</span> <span><strong>New Arrivals</strong> - Fresh toys added every week</span></li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${frontendUrl}/customer/dashboard" class="button">
              🚀 Go to Your Dashboard →
            </a>
          </div>
          
          <div style="margin-top: 25px; padding: 20px; background: ${TOYMART_COLORS.lightBg}; border-radius: 16px;">
            <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>📞 Need Help?</strong></p>
            <p style="margin: 0; font-size: 14px;">Our friendly customer support team is here for you!</p>
            <p style="margin: 10px 0 0 0; font-size: 14px;">
              📧 <a href="mailto:${process.env.INFO_SMTP_USER}" style="color: ${TOYMART_COLORS.primary};">${process.env.INFO_SMTP_USER}</a><br>
              📞 +880 1234 567890
            </p>
          </div>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Facebook</a> | 
            <a href="#">Instagram</a> | 
            <a href="#">YouTube</a>
          </div>
          <p>&copy; ${currentYear} ToyMart. All rights reserved.</p>
          <p>Making childhood magical, one toy at a time! 🎈</p>
          <p>
            <a href="${frontendUrl}/privacy" style="color: ${TOYMART_COLORS.textLight};">Privacy Policy</a> | 
            <a href="${frontendUrl}/terms" style="color: ${TOYMART_COLORS.textLight};">Terms of Service</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await transporter.sendMail({
      from: `"ToyMart" <${process.env.INFO_SMTP_USER}>`,
      to: email,
      subject: `🧸 Welcome to ToyMart, ${name}! 🎈`,
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