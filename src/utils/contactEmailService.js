

// // utils/contactEmailService.js
// const nodemailer = require('nodemailer');

// // Jute Craftify Brand Colors
// const JUTE_COLORS = {
//   primary: '#6B4F3A',    // Earthy Brown
//   secondary: '#F5E6D3',  // Natural Beige
//   accent: '#3A7D44',     // Green
//   textDark: '#2C2420',   // Dark Text
//   textLight: '#8B7355',  // Light Text
//   white: '#FFFFFF',
//   lightBg: '#FAF7F2',
//   border: '#E5D5C0'
// };

// // Create transporter using INFO email configuration
// const transporter = nodemailer.createTransport({
//   host: process.env.INFO_SMTP_HOST,
//   port: parseInt(process.env.INFO_SMTP_PORT) || 465,
//   secure: true,
//   auth: {
//     user: process.env.INFO_SMTP_USER,
//     pass: process.env.INFO_SMTP_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// // Verify connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('❌ Contact Email Service - Configuration error:', error.message);
//   } else {
//     console.log('✅ Contact Email Service is ready');
//     console.log(`📧 Using account: ${process.env.INFO_SMTP_USER}`);
//   }
// });

// /**
//  * Format date
//  */
// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true
//   });
// };

// /**
//  * Generate inquiry type badge color
//  */
// const getInquiryTypeColor = (type) => {
//   const colors = {
//     wholesale: JUTE_COLORS.primary,
//     custom: JUTE_COLORS.accent,
//     sample: '#4A90E2',
//     partnership: JUTE_COLORS.accent,
//     other: JUTE_COLORS.primary
//   };
//   return colors[type] || JUTE_COLORS.primary;
// };

// /**
//  * Generate inquiry type label
//  */
// const getInquiryTypeLabel = (type) => {
//   const labels = {
//     wholesale: 'Wholesale Inquiry',
//     custom: 'Custom Manufacturing',
//     sample: 'Sample Request',
//     partnership: 'Partnership',
//     other: 'Other'
//   };
//   return labels[type] || type;
// };

// /**
//  * Send contact form submission emails (customer + admin)
//  */
// const sendContactFormEmails = async (formData) => {
//   console.log('📧 Sending contact form emails...');
//   console.log('📧 Customer email:', formData.email);
//   console.log('📧 Admin email:', process.env.INFO_EMAIL_FROM);
  
//   try {
//     const {
//       name,
//       email,
//       phone,
//       company,
//       country,
//       inquiryType,
//       message,
//       productInterest
//     } = formData;

//     if (!email) {
//       throw new Error('Customer email is required');
//     }

//     const inquiryTypeColor = getInquiryTypeColor(inquiryType);
//     const inquiryTypeLabel = getInquiryTypeLabel(inquiryType);
//     const currentDate = formatDate(new Date());

//     // 1. Send confirmation email to CUSTOMER
//     const customerEmailResult = await transporter.sendMail({
//       from: `"Jute Craftify" <${process.env.INFO_EMAIL_FROM}>`,
//       to: email,  // Customer's email address
//       subject: `🌾 Thank You for Contacting Jute Craftify`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//             body { 
//               font-family: Arial, sans-serif; 
//               line-height: 1.6; 
//               color: ${JUTE_COLORS.textDark}; 
//               margin: 0;
//               padding: 0;
//               background-color: ${JUTE_COLORS.lightBg};
//             }
//             .container {
//               max-width: 600px;
//               margin: 20px auto;
//               background-color: ${JUTE_COLORS.white};
//               border-radius: 12px;
//               overflow: hidden;
//               box-shadow: 0 4px 15px rgba(0,0,0,0.1);
//             }
//             .header {
//               background: linear-gradient(135deg, ${JUTE_COLORS.primary} 0%, #8B6B51 100%);
//               padding: 30px 20px;
//               text-align: center;
//             }
//             .header h1 {
//               color: ${JUTE_COLORS.white};
//               margin: 0;
//               font-size: 28px;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               gap: 12px;
//             }
//             .header h1 span:first-child {
//               font-size: 36px;
//             }
//             .content {
//               padding: 30px;
//               text-align: left;
//             }
//             .section-title {
//               font-size: 18px;
//               font-weight: 600;
//               margin: 25px 0 15px 0;
//               display: flex;
//               align-items: center;
//               gap: 8px;
//               color: ${JUTE_COLORS.textDark};
//               border-bottom: 2px solid ${JUTE_COLORS.border};
//               padding-bottom: 10px;
//             }
//             .info-box {
//               background: ${JUTE_COLORS.lightBg};
//               padding: 20px;
//               border-radius: 8px;
//               margin: 15px 0;
//               border-left: 4px solid ${JUTE_COLORS.primary};
//             }
//             .info-row {
//               display: flex;
//               margin-bottom: 12px;
//               border-bottom: 1px solid ${JUTE_COLORS.border};
//               padding-bottom: 8px;
//             }
//             .info-label {
//               width: 120px;
//               font-weight: 600;
//               color: ${JUTE_COLORS.textLight};
//             }
//             .info-value {
//               flex: 1;
//               color: ${JUTE_COLORS.textDark};
//             }
//             .inquiry-badge {
//               display: inline-block;
//               background: ${inquiryTypeColor};
//               color: ${JUTE_COLORS.white};
//               padding: 5px 15px;
//               border-radius: 20px;
//               font-size: 12px;
//               font-weight: 600;
//             }
//             .footer {
//               margin-top: 30px;
//               padding-top: 20px;
//               border-top: 1px solid ${JUTE_COLORS.border};
//               text-align: left;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>
//                 <span>🌾</span>
//                 <span>Thank You for Contacting Us</span>
//               </h1>
//             </div>
            
//             <div class="content">
//               <p style="margin-bottom: 20px; font-size: 16px;">Dear <strong>${name}</strong>,</p>
              
//               <p style="margin-bottom: 20px; font-size: 16px;">
//                 Thank you for reaching out to <strong>Jute Craftify</strong>. We have received your inquiry and our team will get back to you within <strong>24 hours</strong>.
//               </p>

//               <div class="section-title">
//                 <span>📋</span>
//                 <span>Inquiry Summary</span>
//               </div>
              
//               <div class="info-box">
//                 <div class="info-row">
//                   <div class="info-label">Inquiry Type:</div>
//                   <div class="info-value">
//                     <span class="inquiry-badge">${inquiryTypeLabel}</span>
//                   </div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Date:</div>
//                   <div class="info-value">${currentDate}</div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Name:</div>
//                   <div class="info-value">${name}</div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Email:</div>
//                   <div class="info-value">${email}</div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Phone:</div>
//                   <div class="info-value">${phone}</div>
//                 </div>
//                 ${company ? `
//                 <div class="info-row">
//                   <div class="info-label">Company:</div>
//                   <div class="info-value">${company}</div>
//                 </div>
//                 ` : ''}
//                 ${productInterest ? `
//                 <div class="info-row">
//                   <div class="info-label">Product Interest:</div>
//                   <div class="info-value">${productInterest}</div>
//                 </div>
//                 ` : ''}
//               </div>

//               <div class="section-title">
//                 <span>💬</span>
//                 <span>Your Message</span>
//               </div>
              
//               <div style="background: ${JUTE_COLORS.secondary}; padding: 15px; border-radius: 8px; margin: 15px 0;">
//                 <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
//               </div>

//               <div class="footer">
//                 <p style="margin-bottom: 5px; font-size: 16px;">Best regards,</p>
//                 <p style="margin: 0; font-weight: bold; color: ${JUTE_COLORS.primary}; font-size: 16px;">The Jute Craftify Team</p>
//                 <p style="font-size: 12px; color: ${JUTE_COLORS.textLight}; margin-top: 15px;">
//                   📧 ${process.env.INFO_EMAIL_FROM}<br>
//                   📞 +880 1305-785685<br>
//                   34/6, Mongla, Khulna, Bangladesh
//                 </p>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     });
//     console.log('✅ Customer confirmation email sent to:', email, 'Message ID:', customerEmailResult.messageId);

//     // 2. Send notification email to ADMIN
//     const adminEmailResult = await transporter.sendMail({
//       from: `"Jute Craftify Contact" <${process.env.INFO_EMAIL_FROM}>`,
//       to: process.env.INFO_EMAIL_FROM,  // Admin email
//       subject: `🌾 New Contact Form Submission - ${name} - ${inquiryTypeLabel}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//             body { 
//               font-family: Arial, sans-serif; 
//               line-height: 1.6; 
//               color: ${JUTE_COLORS.textDark}; 
//               margin: 0;
//               padding: 20px;
//               background-color: ${JUTE_COLORS.lightBg};
//             }
//             .container {
//               max-width: 700px;
//               margin: 0 auto;
//               background-color: ${JUTE_COLORS.white};
//               border-radius: 12px;
//               overflow: hidden;
//               box-shadow: 0 4px 15px rgba(0,0,0,0.1);
//             }
//             .header {
//               background: linear-gradient(135deg, ${JUTE_COLORS.primary} 0%, #8B6B51 100%);
//               padding: 25px 30px;
//               text-align: center;
//             }
//             .header h1 {
//               color: ${JUTE_COLORS.white};
//               margin: 0;
//               font-size: 28px;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               gap: 10px;
//             }
//             .content {
//               padding: 30px;
//               text-align: left;
//             }
//             .section-title {
//               font-size: 18px;
//               font-weight: 600;
//               margin: 25px 0 15px 0;
//               display: flex;
//               align-items: center;
//               gap: 8px;
//               color: ${JUTE_COLORS.textDark};
//               border-bottom: 2px solid ${JUTE_COLORS.border};
//               padding-bottom: 10px;
//             }
//             .info-grid {
//               background: ${JUTE_COLORS.lightBg};
//               padding: 20px;
//               border-radius: 8px;
//               margin: 15px 0;
//             }
//             .info-row {
//               display: flex;
//               margin-bottom: 12px;
//               border-bottom: 1px solid ${JUTE_COLORS.border};
//               padding-bottom: 8px;
//             }
//             .info-label {
//               width: 120px;
//               font-weight: 600;
//               color: ${JUTE_COLORS.textLight};
//             }
//             .info-value {
//               flex: 1;
//               color: ${JUTE_COLORS.textDark};
//             }
//             .message-box {
//               background: ${JUTE_COLORS.secondary};
//               padding: 20px;
//               border-radius: 8px;
//               margin: 20px 0;
//               border: 1px solid ${JUTE_COLORS.border};
//             }
//             .inquiry-badge {
//               display: inline-block;
//               background: ${inquiryTypeColor};
//               color: ${JUTE_COLORS.white};
//               padding: 4px 12px;
//               border-radius: 20px;
//               font-size: 12px;
//               font-weight: 600;
//             }
//             .action-buttons {
//               margin: 30px 0;
//               text-align: center;
//             }
//             .button {
//               background: ${JUTE_COLORS.primary};
//               color: ${JUTE_COLORS.white};
//               padding: 10px 25px;
//               text-decoration: none;
//               border-radius: 8px;
//               display: inline-block;
//               font-weight: bold;
//               font-size: 14px;
//               margin: 0 10px;
//             }
//             .footer {
//               margin-top: 30px;
//               padding-top: 20px;
//               border-top: 1px solid ${JUTE_COLORS.border};
//               text-align: left;
//               font-size: 13px;
//               color: ${JUTE_COLORS.textLight};
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>
//                 <span>🌾</span>
//                 <span>New Contact Form Submission</span>
//               </h1>
//             </div>
            
//             <div class="content">
//               <p style="margin-bottom: 20px;">A new contact form has been submitted.</p>

//               <div class="section-title">
//                 <span>👤</span>
//                 <span>Contact Information</span>
//               </div>
              
//               <div class="info-grid">
//                 <div class="info-row">
//                   <div class="info-label">Inquiry Type:</div>
//                   <div class="info-value">
//                     <span class="inquiry-badge">${inquiryTypeLabel}</span>
//                   </div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Name:</div>
//                   <div class="info-value"><strong>${name}</strong></div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Email:</div>
//                   <div class="info-value"><a href="mailto:${email}" style="color: ${JUTE_COLORS.primary};">${email}</a></div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Phone:</div>
//                   <div class="info-value"><a href="tel:${phone}" style="color: ${JUTE_COLORS.textDark};">${phone}</a></div>
//                 </div>
//                 ${company ? `
//                 <div class="info-row">
//                   <div class="info-label">Company:</div>
//                   <div class="info-value">${company}</div>
//                 </div>
//                 ` : ''}
//                 ${country ? `
//                 <div class="info-row">
//                   <div class="info-label">Country:</div>
//                   <div class="info-value">${country}</div>
//                 </div>
//                 ` : ''}
//                 ${productInterest ? `
//                 <div class="info-row">
//                   <div class="info-label">Product Interest:</div>
//                   <div class="info-value">${productInterest}</div>
//                 </div>
//                 ` : ''}
//               </div>

//               <div class="section-title">
//                 <span>💬</span>
//                 <span>Message</span>
//               </div>
              
//               <div class="message-box">
//                 <p style="margin: 0; white-space: pre-wrap;">${message}</p>
//               </div>

//               <div class="action-buttons">
//                 <a href="mailto:${email}" class="button">📧 Reply via Email</a>
//                 <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" class="button">📱 WhatsApp Reply</a>
//               </div>
              
//               <div class="footer">
//                 <p>This is an automated notification from Jute Craftify contact form.</p>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     });
//     console.log('✅ Admin notification email sent to:', process.env.INFO_EMAIL_FROM, 'Message ID:', adminEmailResult.messageId);

//     return { success: true };
//   } catch (error) {
//     console.error('❌ Contact form email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// module.exports = {
//   sendContactFormEmails
// };


// utils/contactEmailService.js
const nodemailer = require('nodemailer');

// Jute Craftify Brand Colors
const JUTE_COLORS = {
  primary: '#6B4F3A',
  secondary: '#F5E6D3',
  accent: '#3A7D44',
  textDark: '#2C2420',
  textLight: '#8B7355',
  white: '#FFFFFF',
  lightBg: '#FAF7F2',
  border: '#E5D5C0'
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
   console.log('🕐 Current time (Bangladesh):', formatDate(new Date()));
  try {
    const {
      name,
      email,
      phone,
      company,
      country,
      message,
      productInterest
    } = formData;

    if (!email) {
      throw new Error('Customer email is required');
    }

    const currentDate = formatDate(new Date());

    // 1. Send confirmation email to CUSTOMER
    const customerEmailResult = await transporter.sendMail({
      from: `"Jute Craftify" <${process.env.INFO_EMAIL_FROM}>`,
      to: email,
      subject: `🌾 Thank You for Contacting Jute Craftify`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
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
              color: ${JUTE_COLORS.textDark};
              border-bottom: 2px solid ${JUTE_COLORS.border};
              padding-bottom: 10px;
            }
            .info-box {
              background: ${JUTE_COLORS.lightBg};
              padding: 20px;
              border-radius: 8px;
              margin: 15px 0;
              border-left: 4px solid ${JUTE_COLORS.primary};
            }
            .info-row {
              display: flex;
              margin-bottom: 12px;
              border-bottom: 1px solid ${JUTE_COLORS.border};
              padding-bottom: 8px;
            }
            .info-label {
              width: 120px;
              font-weight: 600;
              color: ${JUTE_COLORS.textLight};
            }
            .info-value {
              flex: 1;
              color: ${JUTE_COLORS.textDark};
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid ${JUTE_COLORS.border};
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>🌾</span>
                <span>Thank You for Contacting Us</span>
              </h1>
            </div>
            
            <div class="content">
              <p style="margin-bottom: 20px; font-size: 16px;">Dear <strong>${name}</strong>,</p>
              
              <p style="margin-bottom: 20px; font-size: 16px;">
                Thank you for reaching out to <strong>Jute Craftify</strong>. We have received your inquiry and our team will get back to you within <strong>24 hours</strong>.
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
                ${company ? `
                <div class="info-row">
                  <div class="info-label">Company:</div>
                  <div class="info-value">${company}</div>
                </div>
                ` : ''}
                ${productInterest ? `
                <div class="info-row">
                  <div class="info-label">Product Interest:</div>
                  <div class="info-value">${productInterest}</div>
                </div>
                ` : ''}
              </div>

              <div class="section-title">
                <span>💬</span>
                <span>Your Message</span>
              </div>
              
              <div style="background: ${JUTE_COLORS.secondary}; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
              </div>

              <div class="footer">
                <p style="margin-bottom: 5px; font-size: 16px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: ${JUTE_COLORS.primary}; font-size: 16px;">The Jute Craftify Team</p>
                <p style="font-size: 12px; color: ${JUTE_COLORS.textLight}; margin-top: 15px;">
                  📧 ${process.env.INFO_EMAIL_FROM}<br>
                  📞 +880 1305-785685<br>
                  34/6, Mongla, Khulna, Bangladesh
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
      from: `"Jute Craftify Contact" <${process.env.INFO_EMAIL_FROM}>`,
      to: process.env.INFO_EMAIL_FROM,
      subject: `🌾 New Contact Form Submission - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              color: ${JUTE_COLORS.textDark}; 
              margin: 0;
              padding: 20px;
              background-color: ${JUTE_COLORS.lightBg};
            }
            .container {
              max-width: 700px;
              margin: 0 auto;
              background-color: ${JUTE_COLORS.white};
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, ${JUTE_COLORS.primary} 0%, #8B6B51 100%);
              padding: 25px 30px;
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
              color: ${JUTE_COLORS.textDark};
              border-bottom: 2px solid ${JUTE_COLORS.border};
              padding-bottom: 10px;
            }
            .info-grid {
              background: ${JUTE_COLORS.lightBg};
              padding: 20px;
              border-radius: 8px;
              margin: 15px 0;
            }
            .info-row {
              display: flex;
              margin-bottom: 12px;
              border-bottom: 1px solid ${JUTE_COLORS.border};
              padding-bottom: 8px;
            }
            .info-label {
              width: 120px;
              font-weight: 600;
              color: ${JUTE_COLORS.textLight};
            }
            .info-value {
              flex: 1;
              color: ${JUTE_COLORS.textDark};
            }
            .message-box {
              background: ${JUTE_COLORS.secondary};
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
              border: 1px solid ${JUTE_COLORS.border};
            }
            .action-buttons {
              margin: 30px 0;
              text-align: center;
            }
            .button {
              background: ${JUTE_COLORS.primary};
              color: ${JUTE_COLORS.white};
              padding: 10px 25px;
              text-decoration: none;
              border-radius: 8px;
              display: inline-block;
              font-weight: bold;
              font-size: 14px;
              margin: 0 10px;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid ${JUTE_COLORS.border};
              text-align: left;
              font-size: 13px;
              color: ${JUTE_COLORS.textLight};
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>🌾</span>
                <span>New Contact Form Submission</span>
              </h1>
            </div>
            
            <div class="content">
              <p style="margin-bottom: 20px;">A new contact form has been submitted.</p>

              <div class="section-title">
                <span>👤</span>
                <span>Contact Information</span>
              </div>
              
              <div class="info-grid">
                <div class="info-row">
                  <div class="info-label">Name:</div>
                  <div class="info-value"><strong>${name}</strong></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Email:</div>
                  <div class="info-value"><a href="mailto:${email}" style="color: ${JUTE_COLORS.primary};">${email}</a></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Phone:</div>
                  <div class="info-value"><a href="tel:${phone}" style="color: ${JUTE_COLORS.textDark};">${phone}</a></div>
                </div>
                ${company ? `
                <div class="info-row">
                  <div class="info-label">Company:</div>
                  <div class="info-value">${company}</div>
                </div>
                ` : ''}
                ${country ? `
                <div class="info-row">
                  <div class="info-label">Country:</div>
                  <div class="info-value">${country}</div>
                </div>
                ` : ''}
                ${productInterest ? `
                <div class="info-row">
                  <div class="info-label">Product Interest:</div>
                  <div class="info-value">${productInterest}</div>
                </div>
                ` : ''}
              </div>

              <div class="section-title">
                <span>💬</span>
                <span>Message</span>
              </div>
              
              <div class="message-box">
                <p style="margin: 0; white-space: pre-wrap;">${message}</p>
              </div>

              <div class="action-buttons">
                <a href="mailto:${email}" class="button">📧 Reply via Email</a>
                <a href="https://wa.me/${phone.replace(/[^0-9]/g, '')}" class="button">📱 WhatsApp Reply</a>
              </div>
              
              <div class="footer">
                <p>This is an automated notification from Jute Craftify contact form.</p>
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