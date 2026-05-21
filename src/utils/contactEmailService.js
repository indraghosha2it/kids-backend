// utils/contactEmailService.js
const nodemailer = require('nodemailer');

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

const TIMEZONE = 'Asia/Dhaka';

// Create transporter
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
    console.error('❌ Contact Email Service - Configuration error:', error.message);
  } else {
    console.log('✅ Contact Email Service is ready');
    console.log(`📧 Using account: ${process.env.INFO_SMTP_USER}`);
  }
});

/**
 * Format date
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIMEZONE
  });
};

/**
 * Send contact form submission emails (customer + admin)
 */
const sendContactFormEmails = async (formData) => {
  console.log('📧 Sending contact form emails...');
  console.log('📧 Customer email:', formData.email);
  console.log('📧 Admin email:', process.env.INFO_EMAIL_FROM);

  try {
    const {
      name,
      email,
      phone,
      subject,
      message
    } = formData;

    if (!email) {
      throw new Error('Customer email is required');
    }

    const currentDate = formatDate(new Date());

    // 1. Send confirmation email to CUSTOMER
    const customerEmailResult = await transporter.sendMail({
      from: `"ToyMart" <${process.env.INFO_EMAIL_FROM}>`,
      to: email,
      subject: `🎈 Thank You for Contacting ToyMart - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
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
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .header {
              background: linear-gradient(135deg, ${TOYMART_COLORS.primary} 0%, ${TOYMART_COLORS.secondary} 100%);
              padding: 30px 20px;
              text-align: center;
            }
            .header h1 {
              color: ${TOYMART_COLORS.white};
              margin: 0;
              font-size: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
            }
            .content {
              padding: 30px;
              text-align: left;
            }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              margin: 25px 0 15px 0;
              display: flex;
              align-items: center;
              gap: 8px;
              color: ${TOYMART_COLORS.textDark};
              border-bottom: 2px solid ${TOYMART_COLORS.border};
              padding-bottom: 10px;
            }
            .info-box {
              background: ${TOYMART_COLORS.lightBg};
              padding: 20px;
              border-radius: 12px;
              margin: 15px 0;
              border-left: 4px solid ${TOYMART_COLORS.primary};
            }
            .info-row {
              display: flex;
              margin-bottom: 12px;
              border-bottom: 1px solid ${TOYMART_COLORS.border};
              padding-bottom: 8px;
            }
            .info-label {
              width: 100px;
              font-weight: 600;
              color: ${TOYMART_COLORS.textLight};
            }
            .info-value {
              flex: 1;
              color: ${TOYMART_COLORS.textDark};
            }
            .message-box {
              background: #F9FAFB;
              padding: 20px;
              border-radius: 12px;
              margin: 15px 0;
              border: 1px solid ${TOYMART_COLORS.border};
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid ${TOYMART_COLORS.border};
              text-align: left;
            }
            .signature {
              background: linear-gradient(135deg, ${TOYMART_COLORS.primary}10, ${TOYMART_COLORS.secondary}10);
              padding: 15px;
              border-radius: 12px;
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>🎈</span>
                <span>Thank You for Contacting ToyMart</span>
              </h1>
            </div>
            
            <div class="content">
              <p style="margin-bottom: 20px; font-size: 16px;">Dear <strong>${name}</strong>,</p>
              
              <p style="margin-bottom: 20px; font-size: 16px;">
                Thank you for reaching out to <strong>ToyMart</strong>! We have received your inquiry and our customer support team will get back to you within <strong>24 hours</strong>.
              </p>

              <div class="section-title">
                <span>📋</span>
                <span>Inquiry Summary</span>
              </div>
              
              <div class="info-box">
                <div class="info-row">
                  <div class="info-label">Date:</div>
                  <div class="info-value">${currentDate}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Subject:</div>
                  <div class="info-value"><strong>${subject}</strong></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Name:</div>
                  <div class="info-value">${name}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Email:</div>
                  <div class="info-value">${email}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Phone:</div>
                  <div class="info-value">${phone}</div>
                </div>
              </div>

              <div class="section-title">
                <span>💬</span>
                <span>Your Message</span>
              </div>
              
              <div class="message-box">
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
              </div>

              <div class="signature">
                <p style="margin-bottom: 5px; font-size: 16px;">What happens next?</p>
                <p style="margin: 0; font-size: 14px;">
                  1️⃣ Our team will review your message<br>
                  2️⃣ We'll respond within 24 hours<br>
                  3️⃣ Get ready for some toy magic! 🎪
                </p>
              </div>

              <div class="footer">
                <p style="margin-bottom: 5px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: ${TOYMART_COLORS.primary};">
                  The ToyMart Team
                </p>
                <p style="font-size: 12px; color: ${TOYMART_COLORS.textLight}; margin-top: 15px;">
                  📧 ${process.env.INFO_EMAIL_FROM}<br>
                  📞 +880 1234 567890<br>
                  🌐 www.toymart.com
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Customer confirmation email sent to:', email, 'Message ID:', customerEmailResult.messageId);

    // 2. Send notification email to ADMIN
    const adminEmailResult = await transporter.sendMail({
      from: `"ToyMart Contact" <${process.env.INFO_EMAIL_FROM}>`,
      to: process.env.INFO_EMAIL_FROM,
      subject: `🎪 New Contact Form Submission - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              line-height: 1.6; 
              color: ${TOYMART_COLORS.textDark}; 
              margin: 0;
              padding: 20px;
              background-color: ${TOYMART_COLORS.lightBg};
            }
            .container {
              max-width: 700px;
              margin: 0 auto;
              background-color: ${TOYMART_COLORS.white};
              border-radius: 16px;
              overflow: hidden;
              box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            .header {
              background: linear-gradient(135deg, ${TOYMART_COLORS.primary} 0%, ${TOYMART_COLORS.secondary} 100%);
              padding: 25px 30px;
              text-align: center;
            }
            .header h1 {
              color: ${TOYMART_COLORS.white};
              margin: 0;
              font-size: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
            }
            .badge {
              display: inline-block;
              background: ${TOYMART_COLORS.accent};
              color: ${TOYMART_COLORS.textDark};
              padding: 4px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: bold;
              margin-top: 10px;
            }
            .content {
              padding: 30px;
              text-align: left;
            }
            .section-title {
              font-size: 18px;
              font-weight: 600;
              margin: 25px 0 15px 0;
              display: flex;
              align-items: center;
              gap: 8px;
              color: ${TOYMART_COLORS.textDark};
              border-bottom: 2px solid ${TOYMART_COLORS.border};
              padding-bottom: 10px;
            }
            .info-grid {
              background: ${TOYMART_COLORS.lightBg};
              padding: 20px;
              border-radius: 12px;
              margin: 15px 0;
            }
            .info-row {
              display: flex;
              margin-bottom: 12px;
              border-bottom: 1px solid ${TOYMART_COLORS.border};
              padding-bottom: 8px;
            }
            .info-label {
              width: 100px;
              font-weight: 600;
              color: ${TOYMART_COLORS.textLight};
            }
            .info-value {
              flex: 1;
              color: ${TOYMART_COLORS.textDark};
            }
            .message-box {
              background: #F9FAFB;
              padding: 20px;
              border-radius: 12px;
              margin: 20px 0;
              border: 1px solid ${TOYMART_COLORS.border};
            }
            .action-buttons {
              margin: 30px 0;
              text-align: center;
            }
            .button {
              background: ${TOYMART_COLORS.primary};
              color: white;
              padding: 10px 25px;
              text-decoration: none;
              border-radius: 25px;
              display: inline-block;
              font-weight: bold;
              font-size: 14px;
              margin: 0 10px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid ${TOYMART_COLORS.border};
              text-align: left;
              font-size: 13px;
              color: ${TOYMART_COLORS.textLight};
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>🎪</span>
                <span>New Contact Form Submission</span>
              </h1>
              <div class="badge">ACTION REQUIRED</div>
            </div>
            
            <div class="content">
              <p style="margin-bottom: 20px;">A new message has been submitted on ToyMart website.</p>

              <div class="section-title">
                <span>👤</span>
                <span>Customer Information</span>
              </div>
              
              <div class="info-grid">
                <div class="info-row">
                  <div class="info-label">Name:</div>
                  <div class="info-value"><strong>${name}</strong></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Email:</div>
                  <div class="info-value">
                    <a href="mailto:${email}" style="color: ${TOYMART_COLORS.primary};">${email}</a>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-label">Phone:</div>
                  <div class="info-value"><a href="tel:${phone}" style="color: ${TOYMART_COLORS.primary};">${phone}</a></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Subject:</div>
                  <div class="info-value"><strong>${subject}</strong></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Submitted:</div>
                  <div class="info-value">${currentDate}</div>
                </div>
              </div>

              <div class="section-title">
                <span>💬</span>
                <span>Customer Message</span>
              </div>
              
              <div class="message-box">
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
              </div>

              <div class="action-buttons">
                <a href="mailto:${email}" class="button">📧 Reply to Customer</a>
                <a href="tel:${phone}" class="button">📞 Call Customer</a>
              </div>
              
              <div class="footer">
                <p>⚠️ This is an automated notification from ToyMart contact form. Please respond within 24 hours.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Admin notification email sent to:', process.env.INFO_EMAIL_FROM, 'Message ID:', adminEmailResult.messageId);

    return { success: true };
  } catch (error) {
    console.error('❌ Contact form email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactFormEmails
};