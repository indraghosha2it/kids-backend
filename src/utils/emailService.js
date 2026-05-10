


// // utils/emailService.js
// const nodemailer = require('nodemailer');

// // Create transporter using environment variables
// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT) || 465,
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// // Verify connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('❌ Email configuration error:', error.message);
//   } else {
//     console.log('✅ Email server is ready');
//     console.log(`📧 Using account: ${process.env.SMTP_USER}`);
//   }
// });

// /**
//  * Format currency
//  */
// const formatPrice = (price) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD',
//     minimumFractionDigits: 2
//   }).format(price || 0);
// };

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
//     minute: '2-digit'
//   });
// };

// /**
//  * Generate HTML for product items - WITH strikethrough for unavailable items
//  */
// const generateItemsHTML = (items) => {
//   let html = '';
  
//   items.forEach((item) => {
//     // Check if product is unavailable
//     const isProductUnavailable = item.isAvailable === false;
    
//     // FIX: Better image path handling
//     let productImage = 'https://via.placeholder.com/60?text=No+Image';
    
//     // Check various possible image locations
//     if (item.productImage) {
//       productImage = item.productImage;
//     } else if (item.productId && typeof item.productId === 'object') {
//       if (item.productId.images && item.productId.images.length > 0) {
//         productImage = item.productId.images[0].url || item.productId.images[0];
//       }
//     } else if (item.imageUrl) {
//       productImage = item.imageUrl;
//     }
    
//     html += `
//       <div style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid ${isProductUnavailable ? '#dc3545' : '#E39A65'}; border-radius: 4px;">
//         <div style="display: flex; align-items: flex-start; gap: 20px; margin-bottom: 15px;">
//           <img src="${productImage}" alt="${item.productName}" 
//                style="width: 70px; height: 70px; object-fit: cover; border-radius: 8px; border: 1px solid #ddd; display: block; margin-right: 15px; ${isProductUnavailable ? 'opacity: 0.6; filter: grayscale(0.3);' : ''}"
//                onerror="this.onerror=null; this.src='https://via.placeholder.com/70?text=No+Image';">
//           <div style="flex: 1;">
//             <h4 style="margin: 0 0 8px 0; color: ${isProductUnavailable ? '#999' : '#333'}; font-size: 16px; font-weight: 600; ${isProductUnavailable ? 'text-decoration: line-through;' : ''}">
//               ${item.productName}
//               ${isProductUnavailable ? '<span style="background: #dc3545; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px; margin-left: 8px; text-decoration: none;">UNAVAILABLE</span>' : ''}
//             </h4>
//             <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.5;">
//               <span style="display: inline-block; min-width: 100px;">Total Quantity:</span> <strong style="${isProductUnavailable ? 'text-decoration: line-through; color: #999;' : ''}">${item.totalQuantity} pcs</strong><br>
//               <span style="display: inline-block; min-width: 100px;">Unit Price:</span> <strong style="color: ${isProductUnavailable ? '#999' : '#E39A65'}; ${isProductUnavailable ? 'text-decoration: line-through;' : ''}">${formatPrice(item.unitPrice)}</strong>
//             </p>
//           </div>
//         </div>
        
//         <div style="margin-top: 15px;">
//           <h5 style="margin: 0 0 12px 0; color: #555; font-size: 14px; font-weight: 600;">Colors & Sizes:</h5>
//           ${item.colors.map(color => {
//             // Check if color is unavailable
//             const isColorUnavailable = color.isAvailable === false;
            
//             // Get color name (remove # code if it's just a hex code)
//             let colorName = color.color.name || color.color.code || 'Color';
//             // If colorName is a hex code (starts with #), just show "Color"
//             if (colorName.startsWith('#')) {
//               colorName = 'Color';
//             }
            
//             return `
//             <div style="margin-bottom: 10px; padding: 10px; background: ${isColorUnavailable ? '#fef0f0' : 'white'}; border-radius: 6px; border: 1px solid ${isColorUnavailable ? '#f5c6cb' : '#eee'};">
//               <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
//                 <div style="width: 22px; height: 22px; background-color: ${color.color.code}; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.1); ${isColorUnavailable ? 'opacity: 0.5;' : ''}"></div>
//                 <span style="font-weight: 600; color: ${isColorUnavailable ? '#999' : '#444'}; ${isColorUnavailable ? 'text-decoration: line-through;' : ''}">${colorName}</span>
//                 ${isColorUnavailable ? '<span style="background: #dc3545; color: white; padding: 2px 8px; border-radius: 12px; font-size: 10px;">UNAVAILABLE</span>' : ''}
//                 <span style="color: ${isColorUnavailable ? '#999' : '#E39A65'}; font-weight: 700; margin-left: auto; background: ${isColorUnavailable ? '#f0f0f0' : '#fef0e7'}; padding: 2px 10px; border-radius: 20px; ${isColorUnavailable ? 'text-decoration: line-through;' : ''}">
//                   ${color.totalForColor} pcs
//                 </span>
//               </div>
//               <div style="display: flex; flex-wrap: wrap; gap: 8px; padding-left: 32px;">
//                 ${color.sizeQuantities.map(sq => {
//                   const isSizeUnavailable = sq.isAvailable === false;
//                   return `
//                     <span style="background: ${isSizeUnavailable ? '#fee' : '#f0f0f0'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; ${isSizeUnavailable ? 'text-decoration: line-through; color: #999;' : ''}">
//                       ${sq.size}: <strong>${sq.quantity}</strong>
//                       ${isSizeUnavailable ? '<span style="margin-left: 4px; color: #dc3545;">(Unavailable)</span>' : ''}
//                     </span>
//                   `;
//                 }).join('')}
//               </div>
//             </div>
//           `}).join('')}
//         </div>
        
//         ${item.specialInstructions ? `
//           <div style="margin-top: 12px; padding: 10px; background: #fff3e0; border-radius: 6px; font-size: 13px; border-left: 3px solid #E39A65;">
//             <span style="color: #E39A65; font-weight: 600; display: block; margin-bottom: 4px;">📝 Product Note:</span>
//             <span style="color: #555;">${item.specialInstructions}</span>
//           </div>
//         ` : ''}
//       </div>
//     `;
//   });
  
//   return html;
// };

// /**
//  * Generate HTML for attachments
//  */
// const generateAttachmentsHTML = (attachments) => {
//   if (!attachments || attachments.length === 0) return '';
  
//   return `
//     <div style="margin-top: 20px;">
//       <h3 style="color: #333; border-bottom: 2px solid #E39A65; padding-bottom: 5px;">📎 Attachments</h3>
//       <ul style="list-style: none; padding: 0;">
//         ${attachments.map(file => `
//           <li style="margin-bottom: 8px;">
//             <a href="${file.fileUrl}" style="color: #E39A65; text-decoration: none; display: flex; align-items: center; gap: 5px;">
//               📄 ${file.fileName} (${(file.fileSize / 1024).toFixed(1)} KB)
//             </a>
//           </li>
//         `).join('')}
//       </ul>
//     </div>
//   `;
// };

// /**
//  * Generate HTML for summary section (used in all emails)
//  */
// const generateSummaryHTML = (inquiry) => {
//   return `
//     <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
//       <h2 style="margin-top: 0; margin-bottom: 15px; color: #333; font-size: 18px;">Summary</h2>
//       <table style="width: 100%; border-collapse: collapse;">
//         <tr><td style="padding: 8px 0; width: 120px;"><strong>Inquiry:</strong></td><td>${inquiry.inquiryNumber}</td></tr>
//         <tr><td style="padding: 8px 0;"><strong>Date:</strong></td><td>${formatDate(inquiry.createdAt)}</td></tr>
//         <tr><td style="padding: 8px 0;"><strong>Products:</strong></td><td>${inquiry.totalItems}</td></tr>
//         <tr><td style="padding: 8px 0;"><strong>Total Quantity:</strong></td><td>${inquiry.totalQuantity} pcs</td></tr>
//         <tr><td style="padding: 8px 0;"><strong>Total Value:</strong></td><td><span style="color: #E39A65; font-size: 18px; font-weight: bold;">${formatPrice(inquiry.subtotal)}</span></td></tr>
//       </table>
//     </div>
//   `;
// };

// /**
//  * Generate status section HTML (used in status update emails)
//  */
// const generateStatusHTML = (oldStatus, newStatus, statusColors) => {
//   return `
//     <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin: 25px 0; text-align: center; border: 1px solid #e9ecef;">
//       <div style="margin: 0 0 12px 0; font-size: 14px; color: #6c757d; text-transform: uppercase; letter-spacing: 1px; font-weight: 500;">Status Changed From</div>
//       <div style="display: flex; align-items: center; justify-content: center; gap: 20px; flex-wrap: wrap;">
//         <span style="padding: 12px 30px; border-radius: 40px; font-weight: 700; text-transform: uppercase; font-size: 16px; letter-spacing: 0.5px; min-width: 130px; text-align: center; background: #e9ecef; color: #495057; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">${oldStatus}</span>
//         <span style="font-size: 28px; color: #adb5bd; font-weight: 300; line-height: 1;">→</span>
//         <span style="padding: 12px 30px; border-radius: 40px; font-weight: 700; text-transform: uppercase; font-size: 16px; letter-spacing: 0.5px; min-width: 130px; text-align: center; background: ${statusColors[newStatus]}; color: white; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">${newStatus}</span>
//       </div>
//     </div>
//   `;
// };

// /**
//  * Generate Quotation HTML with Admin Note (for QUOTED status)
//  */
// const getQuotationTemplate = (inquiry, customerDetails, adminNote) => {
//   const itemsHTML = generateItemsHTML(inquiry.items);
//   const attachmentsHTML = generateAttachmentsHTML(inquiry.attachments);
//   const summaryHTML = generateSummaryHTML(inquiry);
//   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
//   return {
//     subject: `💰 Quotation Ready: ${inquiry.inquiryNumber} - Asian Clothify`,
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <style>
//           body { 
//             font-family: Arial, sans-serif; 
//             line-height: 1.6; 
//             color: #333; 
//             margin: 0;
//             padding: 20px;
//             background-color: #f4f4f4;
//           }
//           .container {
//             max-width: 600px;
//             margin: 0 auto;
//             background-color: #ffffff;
//             border-radius: 8px;
//             overflow: hidden;
//             box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//           }
//           .header {
//             background: linear-gradient(135deg, #17a2b8 0%, #138496 100%);
//             padding: 30px;
//             text-align: center;
//           }
//           .header h1 {
//             color: white;
//             margin: 0;
//             font-size: 28px;
//           }
//           .content {
//             padding: 30px;
//             text-align: left;
//           }
//           .button { 
//             background: #E39A65; 
//             color: white; 
//             padding: 12px 30px; 
//             text-decoration: none; 
//             border-radius: 5px; 
//             display: inline-block; 
//             font-weight: bold;
//             margin: 5px;
//           }
//           .button:hover { 
//             background: #d48b54; 
//           }
//           .admin-note {
//             background: #e8f4f8;
//             border-left: 4px solid #17a2b8;
//             padding: 15px;
//             margin: 20px 0;
//             border-radius: 8px;
//           }
//           .admin-note h4 {
//             margin: 0 0 10px 0;
//             color: #17a2b8;
//             font-size: 16px;
//           }
//           .admin-note p {
//             margin: 0;
//             color: #495057;
//             font-size: 14px;
//             line-height: 1.5;
//           }
//           .unavailable-note {
//             background: #fff3cd;
//             border-left: 4px solid #ffc107;
//             padding: 12px;
//             margin: 15px 0;
//             border-radius: 6px;
//             font-size: 13px;
//           }
//           .footer {
//             margin-top: 30px;
//             padding-top: 20px;
//             border-top: 1px solid #eee;
//             text-align: left;
//           }
//           img {
//             display: block !important;
//             width: auto !important;
//             max-width: 100% !important;
//           }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Your Quotation is Ready!</h1>
//           </div>
          
//           <div class="content">
//             <p style="margin-bottom: 20px; font-size: 16px;">Dear <strong>${customerDetails.contactPerson || 'Valued Customer'}</strong>,</p>
            
//             <p style="margin-bottom: 20px; font-size: 16px;">We have prepared a quotation for your inquiry <strong style="color: #E39A65;">${inquiry.inquiryNumber}</strong>. Please review the details below.</p>
            
//             ${adminNote ? `
//               <div class="admin-note">
//                 <h4>📋 Important Notes from Our Team</h4>
//                 <p>${adminNote.replace(/\n/g, '<br>')}</p>
//               </div>
//             ` : ''}
            
         
            
//             ${summaryHTML}
            
//             <h3 style="margin-bottom: 15px; font-size: 18px;">📦 Quotation Details</h3>
//             ${itemsHTML}
            
//             ${inquiry.specialInstructions ? `
//               <div style="margin: 25px 0; padding: 15px; background: #fff3e0; border-radius: 8px;">
//                 <h4 style="margin: 0 0 10px 0; color: #E39A65; font-size: 16px;">📝 Your Instructions</h4>
//                 <p style="margin: 0; color: #555;">${inquiry.specialInstructions}</p>
//               </div>
//             ` : ''}
            
//             ${attachmentsHTML}
            
//             <div style="margin: 35px 0 25px; text-align: center;">
//               <a href="${frontendUrl}/customer/inquiries" class="button" style="font-size: 16px; color: #ffffff;">
//                 View & Accept Quotation →
//               </a>
//             </div>
            
//             <div class="footer">
//               <p style="margin-bottom: 5px; font-size: 16px;">Best regards,</p>
//               <p style="margin: 0; font-weight: bold; color: #E39A65; font-size: 16px;">The Asian Clothify Team</p>
//               <p style="font-size: 13px; color: #999; margin-top: 15px;">
//                 📧 ${process.env.SMTP_USER}<br>
//                 Need help? Reply to this email or chat with us on WhatsApp
//               </p>
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `
//   };
// };

// /**
//  * Email Sending Functions
//  */

// const sendInquirySubmissionEmails = async (inquiry, customerDetails) => {
//   console.log('📧 Sending inquiry submission emails...');
//   console.log('📧 Customer email:', customerDetails?.email);
  
//   try {
//     if (!customerDetails?.email) {
//       throw new Error('Customer email is missing');
//     }

//     // Send to customer
//     const customerTemplate = getInquirySubmissionTemplate(inquiry, customerDetails.contactPerson);
//     const customerResult = await transporter.sendMail({
//       from: `"Asian Clothify" <${process.env.SMTP_USER}>`,
//       to: customerDetails.email,
//       subject: customerTemplate.subject,
//       html: customerTemplate.html
//     });
//     console.log('✅ Customer email sent:', customerResult.messageId);

//     // Send to admin
//     const adminTemplate = getNewInquiryAdminTemplate(inquiry, customerDetails);
//     const adminResult = await transporter.sendMail({
//       from: `"Asian Clothify System" <${process.env.SMTP_USER}>`,
//       to: process.env.OWNER_EMAIL || process.env.SMTP_USER,
//       subject: adminTemplate.subject,
//       html: adminTemplate.html
//     });
//     console.log('✅ Admin email sent:', adminResult.messageId);

//     return { success: true };
//   } catch (error) {
//     console.error('❌ Email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// const sendStatusUpdateEmail = async (inquiry, oldStatus, newStatus, adminNote = null) => {
//   console.log('📧 Sending status update emails...');
//   console.log('📧 Inquiry:', inquiry.inquiryNumber, `${oldStatus} → ${newStatus}`);
  
//   try {
//     if (!inquiry.userDetails?.email) {
//       throw new Error('Customer email is missing');
//     }

//     // For QUOTED status, use the quotation template with admin note
//     if (newStatus === 'quoted') {
//       const quotationTemplate = getQuotationTemplate(inquiry, inquiry.userDetails, adminNote || inquiry.adminNote);
//       const customerResult = await transporter.sendMail({
//         from: `"Asian Clothify" <${process.env.SMTP_USER}>`,
//         to: inquiry.userDetails.email,
//         subject: quotationTemplate.subject,
//         html: quotationTemplate.html
//       });
//       console.log('✅ Quotation email sent:', customerResult.messageId);
//     } else {
//       // Send to customer - WITH FULL DETAILS
//       const customerTemplate = getStatusUpdateCustomerTemplate(inquiry, oldStatus, newStatus);
//       const customerResult = await transporter.sendMail({
//         from: `"Asian Clothify" <${process.env.SMTP_USER}>`,
//         to: inquiry.userDetails.email,
//         subject: customerTemplate.subject,
//         html: customerTemplate.html
//       });
//       console.log('✅ Customer status email sent:', customerResult.messageId);
//     }

//     // Send to admin (always send admin notification)
//     const adminTemplate = getStatusUpdateAdminTemplate(inquiry, inquiry.userDetails, oldStatus, newStatus);
//     const adminResult = await transporter.sendMail({
//       from: `"Asian Clothify System" <${process.env.SMTP_USER}>`,
//       to: process.env.OWNER_EMAIL || process.env.SMTP_USER,
//       subject: `📢 Status Update: ${inquiry.inquiryNumber} - ${oldStatus} → ${newStatus}`,
//       html: adminTemplate.html
//     });
//     console.log('✅ Admin status email sent:', adminResult.messageId);

//     return { success: true };
//   } catch (error) {
//     console.error('❌ Status update email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// // Keep the existing templates for other statuses
// const getInquirySubmissionTemplate = (inquiry, customerName) => {
//   const itemsHTML = generateItemsHTML(inquiry.items);
//   const attachmentsHTML = generateAttachmentsHTML(inquiry.attachments);
//   const summaryHTML = generateSummaryHTML(inquiry);
//   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
//   return {
//     subject: `✅ Inquiry Received: ${inquiry.inquiryNumber} - Asian Clothify`,
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
//           .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
//           .header { background: linear-gradient(135deg, #E39A65 0%, #d48b54 100%); padding: 30px; text-align: center; }
//           .header h1 { color: white; margin: 0; font-size: 28px; }
//           .content { padding: 30px; text-align: left; }
//           .button { background: #E39A65; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 5px; }
//           .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: left; }
//           img { display: block !important; width: auto !important; max-width: 100% !important; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header"><h1>Thank You for Your Inquiry!</h1></div>
//           <div class="content">
//             <p>Dear <strong>${customerName || 'Valued Customer'}</strong>,</p>
//             <p>We have received your inquiry <strong>${inquiry.inquiryNumber}</strong>. Our team will review and get back to you within 24-48 hours.</p>
//             ${summaryHTML}
//             <h3>Products</h3>
//             ${itemsHTML}
//             ${inquiry.specialInstructions ? `<div style="margin: 25px 0; padding: 15px; background: #fff3e0; border-radius: 8px;"><h4 style="margin: 0 0 10px 0; color: #E39A65;">📝 Your Instructions</h4><p>${inquiry.specialInstructions}</p></div>` : ''}
//             ${attachmentsHTML}
//             <div style="text-align: center; margin: 30px 0;"><a href="${frontendUrl}" class="button">View Inquiry Status →</a></div>
//             <div class="footer"><p>Best regards,<br><strong>The Asian Clothify Team</strong></p></div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `
//   };
// };

// const getNewInquiryAdminTemplate = (inquiry, customerDetails) => {
//   const itemsHTML = generateItemsHTML(inquiry.items);
//   const attachmentsHTML = generateAttachmentsHTML(inquiry.attachments);
//   const summaryHTML = generateSummaryHTML(inquiry);
//   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
//   return {
//     subject: `🚨 New Inquiry: ${inquiry.inquiryNumber} - Action Required`,
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
//           .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
//           .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; }
//           .header h1 { color: white; margin: 0; font-size: 28px; }
//           .content { padding: 30px; text-align: left; }
//           .button { background: #E39A65; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 5px; }
//           .button-wa { background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 5px; }
//           .info-box { background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
//           .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: left; }
//           img { display: block !important; width: auto !important; max-width: 100% !important; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header"><h1>🚨 New Inquiry Received</h1></div>
//           <div class="content">
//             <p>A new inquiry requires your attention.</p>
//             <div class="info-box">
//               <h3>Customer Details</h3>
//               <p><strong>Company:</strong> ${customerDetails.companyName || 'N/A'}<br>
//               <strong>Contact:</strong> ${customerDetails.contactPerson || 'N/A'}<br>
//               <strong>Email:</strong> ${customerDetails.email || 'N/A'}<br>
//               <strong>Phone:</strong> ${customerDetails.phone || 'N/A'}<br>
//               <strong>WhatsApp:</strong> ${customerDetails.whatsapp || 'N/A'}</p>
//             </div>
//             ${summaryHTML}
//             <h3>Products</h3>
//             ${itemsHTML}
//             ${inquiry.specialInstructions ? `<div style="margin: 20px 0; padding: 15px; background: #fff3e0; border-radius: 8px;"><h4>📝 Customer Instructions</h4><p>${inquiry.specialInstructions}</p></div>` : ''}
//             ${attachmentsHTML}
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${frontendUrl}" class="button">View in Dashboard</a>
//               ${customerDetails.whatsapp ? `<a href="https://wa.me/${customerDetails.whatsapp}" class="button-wa">WhatsApp Customer</a>` : ''}
//             </div>
//             <div class="footer"><p>This is an automated notification from Asian Clothify.</p></div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `
//   };
// };

// const getStatusUpdateCustomerTemplate = (inquiry, oldStatus, newStatus) => {
//   const statusMessages = {
//     submitted: { emoji: '📝', message: 'Your inquiry has been submitted and is pending review.' },
//     quoted: { emoji: '💰', message: 'A quotation has been prepared. Please review and accept it.' },
//     accepted: { emoji: '✅', message: 'You have accepted the quotation. We will prepare an invoice.' },
//     invoiced: { emoji: '📄', message: 'An invoice has been generated. You can view and pay it.' },
//     paid: { emoji: '🎉', message: 'Payment received! Thank you for your business.' },
//     cancelled: { emoji: '❌', message: 'Your inquiry has been cancelled.' }
//   };

//   const statusColors = {
//     submitted: '#ffc107',
//     quoted: '#17a2b8',
//     accepted: '#28a745',
//     invoiced: '#6f42c1',
//     paid: '#28a745',
//     cancelled: '#dc3545'
//   };

//   const currentStatus = statusMessages[newStatus] || statusMessages.submitted;
//   const itemsHTML = generateItemsHTML(inquiry.items);
//   const attachmentsHTML = generateAttachmentsHTML(inquiry.attachments);
//   const summaryHTML = generateSummaryHTML(inquiry);
//   const statusHTML = generateStatusHTML(oldStatus, newStatus, statusColors);
//   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
//   return {
//     subject: `📢 Inquiry ${inquiry.inquiryNumber} Status Update: ${newStatus.toUpperCase()}`,
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
//           .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
//           .header { background: linear-gradient(135deg, ${statusColors[newStatus]} 0%, ${statusColors[newStatus]}dd 100%); padding: 30px; text-align: center; }
//           .header h1 { color: white; margin: 0; font-size: 28px; }
//           .content { padding: 30px; text-align: left; }
//           .button { background: #E39A65; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 5px; }
//           .message-box { margin: 25px 0; padding: 20px; background: #f8f9fa; border-left: 4px solid ${statusColors[newStatus]}; border-radius: 8px; font-size: 16px; }
//           .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: left; }
//           img { display: block !important; width: auto !important; max-width: 100% !important; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//   <h1 style="color: white; margin: 0; font-size: 28px; text-align: center;">Status Update: ${newStatus.toUpperCase()}</h1>
// </div>
//           <div class="content">
//             <p>Dear Valued Customer,</p>
//             <p>The status of your inquiry <strong>${inquiry.inquiryNumber}</strong> has been updated.</p>
//             ${statusHTML}
//             <div class="message-box"><p>${currentStatus.message}</p></div>
//             ${summaryHTML}
//             <h3>Products</h3>
//             ${itemsHTML}
//             ${inquiry.specialInstructions ? `<div style="margin: 25px 0; padding: 15px; background: #fff3e0; border-radius: 8px;"><h4>📝 Your Instructions</h4><p>${inquiry.specialInstructions}</p></div>` : ''}
//             ${attachmentsHTML}
//             <div style="text-align: center; margin: 30px 0;"><a href="${frontendUrl}" class="button">View Details</a></div>
//             <div class="footer"><p>Best regards,<br><strong>The Asian Clothify Team</strong></p></div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `
//   };
// };

// const getStatusUpdateAdminTemplate = (inquiry, customerDetails, oldStatus, newStatus) => {
//   const itemsHTML = generateItemsHTML(inquiry.items);
//   const attachmentsHTML = generateAttachmentsHTML(inquiry.attachments);
//   const summaryHTML = generateSummaryHTML(inquiry);
//   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  
//   const statusColors = {
//     submitted: '#ffc107',
//     quoted: '#17a2b8',
//     accepted: '#28a745',
//     invoiced: '#6f42c1',
//     paid: '#28a745',
//     cancelled: '#dc3545'
//   };
  
//   const statusHTML = generateStatusHTML(oldStatus, newStatus, statusColors);
  
//   return {
//     subject: `📢 Status Update: ${inquiry.inquiryNumber} - ${oldStatus} → ${newStatus}`,
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <style>
//           body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
//           .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
//           .header { background: linear-gradient(135deg, #E39A65 0%, #d48b54 100%); padding: 30px; text-align: center; }
//           .header h1 { color: white; margin: 0; font-size: 28px; }
//           .content { padding: 30px; text-align: left; }
//           .button { background: #E39A65; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 5px; }
//           .button-wa { background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; margin: 5px; }
//           .info-box { background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
//           .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: left; }
//           img { display: block !important; width: auto !important; max-width: 100% !important; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header"><h1>📢 Inquiry Status Updated</h1></div>
//           <div class="content">
//             <p>The status of inquiry <strong>${inquiry.inquiryNumber}</strong> has been updated.</p>
//             <div class="info-box">
//               <h3>Customer Details</h3>
//               <p><strong>Company:</strong> ${customerDetails.companyName || 'N/A'}<br>
//               <strong>Contact:</strong> ${customerDetails.contactPerson || 'N/A'}<br>
//               <strong>Email:</strong> ${customerDetails.email || 'N/A'}<br>
//               <strong>Phone:</strong> ${customerDetails.phone || 'N/A'}<br>
//               <strong>WhatsApp:</strong> ${customerDetails.whatsapp || 'N/A'}</p>
//             </div>
//             ${statusHTML}
//             ${summaryHTML}
//             <h3>Products</h3>
//             ${itemsHTML}
//             ${inquiry.specialInstructions ? `<div style="margin: 20px 0; padding: 15px; background: #fff3e0; border-radius: 8px;"><h4>📝 Customer Instructions</h4><p>${inquiry.specialInstructions}</p></div>` : ''}
//             ${attachmentsHTML}
//             <div style="text-align: center; margin: 30px 0;">
//               <a href="${frontendUrl}" class="button">View in Dashboard</a>
//               ${customerDetails.whatsapp ? `<a href="https://wa.me/${customerDetails.whatsapp}" class="button-wa">WhatsApp Customer</a>` : ''}
//             </div>
//             <div class="footer"><p>This is an automated notification from Asian Clothify.</p></div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `
//   };
// };

// module.exports = {
//   sendInquirySubmissionEmails,
//   sendStatusUpdateEmail,
//   sendInvoiceGeneratedEmail: async () => ({ success: true }),
//   sendPaymentConfirmationEmail: async () => ({ success: true }),
//   sendCustomEmail: async (to, subject, html) => {
//     try {
//       await transporter.sendMail({
//         from: `"Asian Clothify" <${process.env.SMTP_USER}>`,
//         to,
//         subject,
//         html
//       });
//       return { success: true };
//     } catch (error) {
//       return { success: false, error: error.message };
//     }
//   }
// };



// utils/emailService.js
const nodemailer = require('nodemailer');

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
  } else {
    console.log('✅ Email server is ready');
    console.log(`📧 Using account: ${process.env.SMTP_USER}`);
  }
});

// Jute Craftify Brand Colors
const BRAND_COLORS = {
  primary: '#6B4F3A',
  secondary: '#F5E6D3',
  accent: '#3A7D44',
  neutral: '#FAF7F2',
  dark: '#2C2420',
  textDark: '#2A2A2A',
  textLight: '#666666',
  white: '#FFFFFF',
  border: '#E8D5C0',
  unavailable: '#dc3545'
};

/**
 * Format currency
 */
const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(numPrice);
};

/**
 * Get unit label
 */
const getUnitLabel = (orderUnit) => {
  if (!orderUnit) return 'pcs';
  switch(orderUnit) {
    case 'kg': return 'kg';
    case 'ton': return 'MT';
    default: return 'pcs';
  }
};

const getUnitFullLabel = (orderUnit) => {
  if (!orderUnit) return 'Pieces';
  switch(orderUnit) {
    case 'kg': return 'Kilograms';
    case 'ton': return 'Metric Tons';
    default: return 'Pieces';
  }
};

const getPricePerUnitLabel = (orderUnit) => {
  if (!orderUnit) return 'pc';
  switch(orderUnit) {
    case 'kg': return 'kg';
    case 'ton': return 'MT';
    default: return 'pc';
  }
};

/**
 * Format date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (e) {
    return 'N/A';
  }
};

/**
 * Generate HTML for product items with full details and unavailable status
 */
/**
 * Generate HTML for product items with full details and unavailable status
 */
const generateItemsHTML = (items) => {
  if (!items || items.length === 0) return '<p>No items found</p>';
  
  let html = '';
  
  items.forEach((item) => {
    // Get unit label for this specific item (not from first item)
    const unitLabel = getUnitLabel(item.orderUnit);
    const pricePerUnitLabel = getPricePerUnitLabel(item.orderUnit);
    const unitFullLabel = getUnitFullLabel(item.orderUnit);
    const isProductUnavailable = item.isAvailable === false;
    
    let productImage = item.productImage;
    if (!productImage || productImage === 'undefined') {
      productImage = 'https://via.placeholder.com/70?text=No+Image';
    }
    
    // Calculate available quantities for this product (exclude unavailable colors/sizes)
    let productAvailableTotal = 0;
    let productAvailableSubtotal = 0;
    
 // Process colors to mark unavailable ones
// Process each color
const processedColors = (item.colors || []).map(color => {
  const isColorUnavailable = color.isAvailable === false;
  let colorTotal = 0;
  let colorSubtotal = 0;
  let colorUnitPrice = color.unitPrice || item.unitPrice || 0;
  const isWeightBased = item.orderUnit === 'kg' || item.orderUnit === 'ton';
  
  // FIX: Get the correct color code from different possible structures
  let colorCode = '#CCCCCC'; // default gray
  
  // Try to find color code from various possible structures
  if (color.color) {
    if (typeof color.color === 'object') {
      colorCode = color.color.code || color.color.hex || color.color.value || '#CCCCCC';
    } else if (typeof color.color === 'string') {
      colorCode = color.color;
    }
  }
  
  // If still not found, check other properties
  if (colorCode === '#CCCCCC' && color.code) {
    colorCode = color.code;
  }
  if (colorCode === '#CCCCCC' && color.hex) {
    colorCode = color.hex;
  }
  if (colorCode === '#CCCCCC' && color.value && color.value.startsWith('#')) {
    colorCode = color.value;
  }
  
  // Get color name
  let colorName = 'Color';
  if (color.color && typeof color.color === 'object' && color.color.name) {
    colorName = color.color.name;
  } else if (color.name) {
    colorName = color.name;
  } else if (colorCode && colorCode.startsWith('#')) {
    colorName = 'Color';
  }
  
  // Debug log to see what's happening
  console.log('Color processing:', { 
    originalColor: color, 
    extractedCode: colorCode, 
    extractedName: colorName,
    isAvailable: !isColorUnavailable
  });
  
  // Process size quantities for this color
  const processedSizeQuantities = (color.sizeQuantities || []).map(sq => {
    const isSizeUnavailable = sq.isAvailable === false;
    let sizeQuantity = sq.quantity || 0;
    
    if (isSizeUnavailable) {
      sizeQuantity = 0;
    }
    
    return {
      ...sq,
      size: sq.size,
      quantity: sizeQuantity,
      isAvailable: !isSizeUnavailable,
      originalQuantity: sq.quantity || 0
    };
  });
  
  if (isWeightBased) {
    colorTotal = color.quantity || color.totalQuantity || 0;
    if (isColorUnavailable) colorTotal = 0;
  } else {
    colorTotal = processedSizeQuantities.reduce((sum, sq) => sum + (sq.quantity || 0), 0);
  }
  
  colorSubtotal = colorTotal * colorUnitPrice;
  
  if (!isColorUnavailable) {
    productAvailableTotal += colorTotal;
    productAvailableSubtotal += colorSubtotal;
  }
  
  return {
    ...color,
    totalQuantity: colorTotal,
    subtotal: colorSubtotal,
    unitPrice: colorUnitPrice,
    isAvailable: !isColorUnavailable,
    sizeQuantities: processedSizeQuantities,
    originalQuantity: color.quantity || color.totalQuantity || 0,
    colorCode: colorCode,
    colorName: colorName
  };
});
    
    // Get unavailable colors list for display
    const unavailableColors = processedColors.filter(c => !c.isAvailable);
    const hasUnavailableItems = isProductUnavailable || unavailableColors.length > 0;
    
    // Display totals (only available items)
    const displayTotalQuantity = productAvailableTotal;
    const displayTotalValue = productAvailableSubtotal;
    
    html += `
      <div style="margin-bottom: 25px; padding: 20px; background: ${BRAND_COLORS.neutral}; border-left: 4px solid ${hasUnavailableItems ? BRAND_COLORS.unavailable : BRAND_COLORS.accent}; border-radius: 8px;">
        <!-- Product Header with Image -->
        <div style="display: flex; align-items: flex-start; gap: 20px; margin-bottom: 15px;">
          <img src="${productImage}" alt="${item.productName}" 
               style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; border: 1px solid ${BRAND_COLORS.border}; ${isProductUnavailable ? 'opacity: 0.5;' : ''}">
          <div style="flex: 1;">
            <h4 style="margin: 0 0 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 18px; font-weight: 600; ${isProductUnavailable ? 'text-decoration: line-through; color: #999;' : ''}">
              ${item.productName}
              ${isProductUnavailable ? '<span style="margin-left: 10px; background: #dc3545; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px;">UNAVAILABLE</span>' : ''}
            </h4>
            <div style="margin: 5px 0;">
              <span style="display: inline-block; background: ${BRAND_COLORS.secondary}; color: ${BRAND_COLORS.primary}; padding: 3px 12px; border-radius: 20px; font-size: 11px; font-weight: 500;">
                ${unitFullLabel}
              </span>
              <span style="display: inline-block; margin-left: 8px; color: ${BRAND_COLORS.textLight}; font-size: 12px;">
                MOQ: ${item.moq} ${unitLabel}
              </span>
            </div>
            <div style="margin: 10px 0;">
              <strong>Total Available:</strong> ${displayTotalQuantity} ${unitLabel} | 
              <strong>Total Value:</strong> ${formatPrice(displayTotalValue)}
              ${hasUnavailableItems ? `<span style="margin-left: 10px; color: #dc3545;">⚠️ Some items are unavailable</span>` : ''}
            </div>
          </div>
        </div>
        
        <!-- Colors & Sizes Section with Unavailable Status -->
        <div style="margin-top: 15px;">
          <h5 style="margin: 0 0 12px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px;">Colors & Quantities:</h5>
          ${processedColors.map(color => {
            const isColorUnavailable = !color.isAvailable;
            const colorName = color.color?.name || color.color?.code || 'Color';
            const displayColorName = colorName.startsWith('#') ? 'Color' : colorName;
            const isWeightBased = item.orderUnit === 'kg' || item.orderUnit === 'ton';
            
            if (color.totalQuantity === 0 && !isColorUnavailable) return '';
            
            const colorTotal = color.totalQuantity;
            const colorOriginalTotal = color.originalQuantity;
            const colorSubtotal = color.subtotal;
            
            // Determine color box style
         const colorBoxStyle = color.isAvailable 
  ? `background-color: ${color.colorCode};`
  : `background-color: ${color.colorCode}; opacity: 0.5; text-decoration: line-through;`;
            
            return `
            <div style="margin-bottom: 12px; padding: 12px; background: white; border-radius: 8px; border: 1px solid ${BRAND_COLORS.border}; ${isColorUnavailable ? 'opacity: 0.6;' : ''}">
              <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 24px; height: 24px; background-color: ${color.colorCode}; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); ${color.isAvailable ? '' : 'opacity: 0.5;' }"></div>
                  <span style="font-weight: 600; font-size: 14px; ${isColorUnavailable ? 'text-decoration: line-through;' : ''}">
                    ${displayColorName}
                    ${isColorUnavailable ? '<span style="margin-left: 8px; color: #dc3545; font-size: 11px;">(UNAVAILABLE)</span>' : ''}
                  </span>
                </div>
                <div style="background: ${BRAND_COLORS.secondary}; padding: 5px 15px; border-radius: 20px;">
                  <span style="color: ${BRAND_COLORS.accent}; font-weight: 700; ${isColorUnavailable ? 'text-decoration: line-through;' : ''}">
                    ${colorTotal} ${unitLabel} × ${formatPrice(color.unitPrice)} = ${formatPrice(colorSubtotal)}
                  </span>
                  ${isColorUnavailable && colorOriginalTotal > 0 ? `
                    <span style="display: block; font-size: 11px; color: #dc3545; text-decoration: line-through;">
                      (Original: ${colorOriginalTotal} ${unitLabel})
                    </span>
                  ` : ''}
                </div>
              </div>
              
              ${!isWeightBased && color.sizeQuantities && color.sizeQuantities.length > 0 ? `
              <div style="display: flex; flex-wrap: wrap; gap: 8px; padding-left: 34px;">
                ${color.sizeQuantities.map(sq => {
                  const isSizeUnavailable = !sq.isAvailable;
                  const originalQty = sq.originalQuantity;
                  const currentQty = sq.quantity;
                  
                  if (currentQty === 0 && !isSizeUnavailable) return '';
                  
                  return `
                    <span style="background: ${BRAND_COLORS.secondary}; padding: 4px 12px; border-radius: 20px; font-size: 12px; ${isSizeUnavailable ? 'opacity: 0.5;' : ''}">
                      ${sq.size}: 
                      <strong style="${isSizeUnavailable ? 'text-decoration: line-through; color: #dc3545;' : ''}">${currentQty}</strong>
                      ${isSizeUnavailable && originalQty > 0 ? `
                        <span style="font-size: 10px; color: #dc3545; text-decoration: line-through;">(was: ${originalQty})</span>
                      ` : ''}
                    </span>
                  `;
                }).join('')}
              </div>
              ` : ''}
            </div>
          `}).join('')}
        </div>
        
        ${!isProductUnavailable && unavailableColors.length > 0 ? `
          <div style="margin-top: 10px; padding: 8px 12px; background: #FFF3E0; border-radius: 6px; border-left: 3px solid #ff9800;">
            <span style="color: #e65100; font-size: 12px;">⚠️ Note: Some colors/sizes are currently unavailable and have been excluded from this quotation.</span>
          </div>
        ` : ''}
        
        ${item.specialInstructions ? `
          <div style="margin-top: 12px; padding: 10px; background: #FFF8E1; border-radius: 8px; border-left: 3px solid ${BRAND_COLORS.accent};">
            <span style="color: ${BRAND_COLORS.primary}; font-weight: 600;">📝 Special Instructions:</span>
            <p style="margin: 5px 0 0 0; color: ${BRAND_COLORS.textLight};">${item.specialInstructions}</p>
          </div>
        ` : ''}
      </div>
    `;
  });
  
  return html;
};

/**
 * Generate summary section (excluding unavailable items)
 */
const generateSummaryHTML = (inquiry) => {
  const unitLabel = getUnitLabel(inquiry.items?.[0]?.orderUnit);
  
  // Calculate totals excluding unavailable items
  let totalAvailableQuantity = 0;
  let totalAvailableValue = 0;
  
  if (inquiry.items && inquiry.items.length > 0) {
    inquiry.items.forEach(item => {
      const isProductUnavailable = item.isAvailable === false;
      if (isProductUnavailable) return;
      
      (item.colors || []).forEach(color => {
        const isColorUnavailable = color.isAvailable === false;
        if (isColorUnavailable) return;
        
        const colorUnitPrice = color.unitPrice || item.unitPrice || 0;
        let colorTotal = 0;
        
        if (item.orderUnit === 'kg' || item.orderUnit === 'ton') {
          colorTotal = color.quantity || color.totalQuantity || 0;
        } else {
          colorTotal = (color.sizeQuantities || []).reduce((sum, sq) => {
            const isSizeUnavailable = sq.isAvailable === false;
            return sum + (isSizeUnavailable ? 0 : (sq.quantity || 0));
          }, 0);
        }
        
        totalAvailableQuantity += colorTotal;
        totalAvailableValue += colorTotal * colorUnitPrice;
      });
    });
  }
  
  return `
    <div style="background: ${BRAND_COLORS.secondary}; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <h2 style="margin-top: 0; margin-bottom: 15px; color: ${BRAND_COLORS.primary}; font-size: 18px;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0; width: 140px;"><strong>Inquiry Number:</strong></td><td style="color: #17a2b8;">${inquiry.inquiryNumber}</td></tr>
        <tr><td style="padding: 8px 0;"><strong>Date:</strong></td><td>${formatDate(inquiry.createdAt)}</td></tr>
        <tr><td style="padding: 8px 0;"><strong>Total Products:</strong></td><td>${inquiry.totalItems || 0}</td></tr>
        <tr><td style="padding: 8px 0;"><strong>Available Quantity:</strong></td><td><strong>${totalAvailableQuantity}</strong> ${unitLabel}</td></tr>
        <tr><td style="padding: 8px 0;"><strong>Total Available Value:</strong></td><td style="color: ${BRAND_COLORS.accent}; font-size: 20px; font-weight: bold;">${formatPrice(totalAvailableValue)}</td></tr>
      </table>
      ${totalAvailableQuantity < (inquiry.totalQuantity || 0) ? `
        <div style="margin-top: 15px; padding: 10px; background: #FFF3E0; border-radius: 8px; text-align: center;">
          <span style="color: #e65100; font-size: 12px;">⚠️ Note: Some requested items are currently unavailable and have been excluded from this quotation.</span>
        </div>
      ` : ''}
    </div>
  `;
};

/**
 * Generate customer info section
 */
const generateCustomerInfoHTML = (customerDetails) => {
  return `
    <div style="background: ${BRAND_COLORS.neutral}; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <h2 style="margin-top: 0; margin-bottom: 15px; color: ${BRAND_COLORS.primary}; font-size: 18px;">Customer Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 6px 0; width: 120px;"><strong>Company:</strong></td><tr>${customerDetails.companyName || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0;"><strong>Contact Person:</strong></td><td>${customerDetails.contactPerson || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0;"><strong>Email:</strong></td><td>${customerDetails.email || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0;"><strong>Phone:</strong></td><td>${customerDetails.phone || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0;"><strong>WhatsApp:</strong></td><td>${customerDetails.whatsapp || 'N/A'}</td></tr>
        <td><td style="padding: 6px 0;"><strong>Address:</strong></td><td>${customerDetails.address || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0;"><strong>City:</strong></td><td>${customerDetails.city || 'N/A'}</td></tr>
        <tr><td style="padding: 6px 0;"><strong>Country:</strong></td><td>${customerDetails.country || 'N/A'}</td></tr>
      </table>
    </div>
  `;
};

/**
 * Main function to send inquiry submission emails (Customer + Admin)
 */
const sendInquirySubmissionEmails = async (inquiry, customerDetails) => {
  console.log('📧 ========== SENDING INQUIRY SUBMISSION EMAILS ==========');
  console.log('📧 Customer email:', customerDetails?.email);
  console.log('📧 Admin email:', process.env.OWNER_EMAIL || process.env.SMTP_USER);
  
  try {
    if (!customerDetails?.email) {
      console.error('❌ Customer email is missing');
      throw new Error('Customer email is missing');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Safely format data
    const itemsHTML = generateItemsHTML(inquiry.items || []);
    const summaryHTML = generateSummaryHTML(inquiry);
    const customerInfoHTML = generateCustomerInfoHTML(customerDetails);
    
    // ========== CUSTOMER EMAIL ==========
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Inquiry Received - Jute Craftify</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2A2A2A; margin: 0; padding: 20px; background-color: #FAF7F2; }
          .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #6B4F3A 0%, #8B6B51 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 26px; }
          .header p { color: rgba(255,255,255,0.9); margin: 8px 0 0; }
          .content { padding: 30px; }
          .button { background: #6B4F3A; color: #6B4F3A; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E8D5C0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌾 Inquiry Received Successfully!</h1>
            <p>Jute Craftify - Premium Jute Products</p>
          </div>
          <div class="content">
            <p>Dear <strong>${customerDetails.contactPerson || 'Valued Customer'}</strong>,</p>
            <p>Thank you for your inquiry. We have received your request and our team will review it shortly. You will receive a quotation within 24-48 hours.</p>
            
            ${summaryHTML}
            
            <h2 style="color: ${BRAND_COLORS.primary}; margin: 20px 0 15px;">Products Details</h2>
            ${itemsHTML}
            
            ${inquiry.specialInstructions ? `
              <div style="margin: 20px 0; padding: 15px; background: #FFF8E1; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: ${BRAND_COLORS.primary};">📝 Your Special Instructions</h4>
                <p style="margin: 0;">${inquiry.specialInstructions}</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/customer/inquiries" class="button">Track Your Inquiry →</a>
            </div>
            
            <div class="footer">
              <p>Best regards,<br><strong>The Jute Craftify Team</strong></p>
              <p style="font-size: 12px; color: #999; margin-top: 10px;">
                Need help? Reply to this email or contact us on WhatsApp
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // ========== ADMIN EMAIL ==========
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Inquiry - Jute Craftify</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2A2A2A; margin: 0; padding: 20px; background-color: #FAF7F2; }
          .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 25px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .button { background: #6B4F3A; color: white; padding: 10px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E8D5C0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🚨 New Inquiry Received - Action Required!</h1>
          </div>
          <div class="content">
            <p>A new inquiry requires your attention. Please review the details below.</p>
            
            <div style="background: #FFF3E0; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <p style="margin: 0;"><strong>🔔 Action Required:</strong> Please review and prepare quotation for this customer.</p>
            </div>
            
            ${customerInfoHTML}
            ${summaryHTML}
            
            <h2 style="color: ${BRAND_COLORS.primary}; margin: 20px 0 15px;">Products Ordered</h2>
            ${itemsHTML}
            
            ${inquiry.specialInstructions ? `
              <div style="margin: 20px 0; padding: 15px; background: #FFF8E1; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: ${BRAND_COLORS.primary};">📝 Customer Special Instructions</h4>
                <p style="margin: 0;">${inquiry.specialInstructions}</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/admin/inquiries" class="button">View in Dashboard →</a>
            </div>
            
            <div class="footer">
              <p style="font-size: 12px; color: #999;">This is an automated notification from Jute Craftify.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to customer
    const customerResult = await transporter.sendMail({
      from: `"Jute Craftify" <${process.env.SMTP_USER}>`,
      to: customerDetails.email,
      subject: `✅ Inquiry Received: ${inquiry.inquiryNumber} - Jute Craftify`,
      html: customerHtml
    });
    console.log('✅ Customer email sent to:', customerDetails.email);
    console.log('✅ Message ID:', customerResult.messageId);

    // Send to admin
    const adminResult = await transporter.sendMail({
      from: `"Jute Craftify System" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL || process.env.SMTP_USER,
      subject: `🚨 NEW INQUIRY: ${inquiry.inquiryNumber} - Action Required`,
      html: adminHtml
    });
    console.log('✅ Admin email sent to:', process.env.OWNER_EMAIL || process.env.SMTP_USER);
    console.log('✅ Message ID:', adminResult.messageId);

    return { success: true };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send status update email (Quoted, Accepted, etc.)
 */
const sendStatusUpdateEmail = async (inquiry, oldStatus, newStatus, adminNote = null) => {
  console.log('📧 ========== SENDING STATUS UPDATE EMAIL ==========');
  console.log('📧 Inquiry:', inquiry?.inquiryNumber);
  console.log('📧 Status change:', `${oldStatus} → ${newStatus}`);
  
  try {
    if (!inquiry) {
      throw new Error('Inquiry data is missing');
    }
    
    if (!inquiry.userDetails?.email) {
      console.error('❌ Customer email is missing');
      throw new Error('Customer email is missing');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    // Safely format data
    const itemsHTML = generateItemsHTML(inquiry.items || []);
    const summaryHTML = generateSummaryHTML(inquiry);
    const customerInfoHTML = generateCustomerInfoHTML(inquiry.userDetails);
    
    const statusNames = {
      submitted: 'Submitted',
      quoted: 'Quoted',
      accepted: 'Accepted',
      invoiced: 'Invoiced',
      paid: 'Paid',
      cancelled: 'Cancelled'
    };

    const statusColors = {
      quoted: '#17a2b8',
      accepted: '#28a745',
      invoiced: '#6f42c1',
      paid: '#28a745',
      cancelled: '#dc3545'
    };

    const statusMessages = {
      quoted: 'We have prepared a quotation for you based on your inquiry. Please review the details below.',
      accepted: 'You have accepted our quotation. We will now prepare an invoice for you.',
      invoiced: 'An invoice has been generated. You can view and pay it online.',
      paid: 'Payment received! Thank you for your business.',
      cancelled: 'Your inquiry has been cancelled.',
      submitted: 'Your inquiry has been submitted and is pending review.'
    };

    const message = adminNote || statusMessages[newStatus] || statusMessages.submitted;

    // Header color based on status
    const headerColor = newStatus === 'quoted' ? '#17a2b8' : 
                       newStatus === 'accepted' ? '#28a745' :
                       newStatus === 'invoiced' ? '#6f42c1' :
                       newStatus === 'paid' ? '#28a745' : '#6B4F3A';

    // ========== CUSTOMER STATUS EMAIL ==========
    const customerHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Status Update - Jute Craftify</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2A2A2A; margin: 0; padding: 20px; background-color: #FAF7F2; }
          .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, ${headerColor} 0%, ${headerColor}dd 100%); padding: 25px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 24px; }
          .content { padding: 30px; }
          .status-box { background: ${BRAND_COLORS.neutral}; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center; border: 1px solid ${BRAND_COLORS.border}; }
          .old-status { background: #e9ecef; color: #495057; padding: 8px 20px; border-radius: 30px; display: inline-block; }
          .new-status { background: ${headerColor}; color: white; padding: 8px 20px; border-radius: 30px; display: inline-block; font-weight: bold; }
          .arrow { font-size: 24px; margin: 0 15px; color: ${BRAND_COLORS.primary}; }
          .button { background: #6B4F3A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E8D5C0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 Inquiry Status: ${statusNames[newStatus] || newStatus}</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${inquiry.userDetails?.contactPerson || 'Valued Customer'}</strong>,</p>
            
            <div class="status-box">
              <span class="old-status">${statusNames[oldStatus] || oldStatus}</span>
              <span class="arrow">→</span>
              <span class="new-status">${statusNames[newStatus] || newStatus}</span>
            </div>
            
            <div style="background: ${BRAND_COLORS.secondary}; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;">${message}</p>
            </div>
            
            ${adminNote ? `
              <div style="background: #E8F5E9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <h4 style="margin: 0 0 10px 0; color: #2E7D32;">📋 Message from Our Team</h4>
                <p style="margin: 0;">${adminNote}</p>
              </div>
            ` : ''}
            
            ${summaryHTML}
            
            <h2 style="color: ${BRAND_COLORS.primary}; margin: 20px 0 15px;">Order Details</h2>
            ${itemsHTML}
            
            ${inquiry.specialInstructions ? `
              <div style="margin: 20px 0; padding: 15px; background: #FFF8E1; border-radius: 8px;">
                <h4 style="margin: 0 0 10px 0; color: ${BRAND_COLORS.primary};">📝 Your Instructions</h4>
                <p style="margin: 0;">${inquiry.specialInstructions}</p>
              </div>
            ` : ''}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/customer/inquiries" class="button">View My Inquiries →</a>
            </div>
            
            <div class="footer">
              <p>Best regards,<br><strong>The Jute Craftify Team</strong></p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to customer
    const customerResult = await transporter.sendMail({
      from: `"Jute Craftify" <${process.env.SMTP_USER}>`,
      to: inquiry.userDetails.email,
      subject: `📢 Inquiry ${inquiry.inquiryNumber} Status Update: ${(statusNames[newStatus] || newStatus).toUpperCase()} - Jute Craftify`,
      html: customerHtml
    });
    console.log('✅ Status email sent to customer:', inquiry.userDetails.email);
    console.log('✅ Message ID:', customerResult.messageId);

    // ========== ADMIN STATUS EMAIL ==========
    const adminHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admin Status Update - Jute Craftify</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #2A2A2A; margin: 0; padding: 20px; background-color: #FAF7F2; }
          .container { max-width: 700px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
          .header { background: linear-gradient(135deg, #E39A65 0%, #d48b54 100%); padding: 20px; text-align: center; }
          .header h1 { color: white; margin: 0; font-size: 22px; }
          .content { padding: 25px; }
          .button { background: #6B4F3A; color: white; padding: 10px 25px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #E8D5C0; text-align: center; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📢 Inquiry Status Updated</h1>
            <p>${inquiry.inquiryNumber} - ${statusNames[oldStatus] || oldStatus} → ${statusNames[newStatus] || newStatus}</p>
          </div>
          <div class="content">
            <p>An inquiry status has been updated.</p>
            
            ${customerInfoHTML}
            ${summaryHTML}
            ${itemsHTML}
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/admin/inquiries" class="button">View in Dashboard →</a>
            </div>
            
            <div class="footer">
              <p style="font-size: 12px; color: #999;">Admin notification from Jute Craftify</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to admin
    const adminResult = await transporter.sendMail({
      from: `"Jute Craftify System" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL || process.env.SMTP_USER,
      subject: `📢 Status Update: ${inquiry.inquiryNumber} - ${oldStatus} → ${newStatus}`,
      html: adminHtml
    });
    console.log('✅ Admin status email sent to:', process.env.OWNER_EMAIL || process.env.SMTP_USER);
    console.log('✅ Message ID:', adminResult.messageId);

    return { success: true };
  } catch (error) {
    console.error('❌ Status update email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send invoice generated email
 */
const sendInvoiceGeneratedEmail = async (inquiry, invoiceDetails) => {
  console.log('📧 ========== SENDING INVOICE GENERATED EMAIL ==========');
  
  try {
    if (!inquiry?.userDetails?.email) {
      throw new Error('Customer email is missing');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice Generated - Jute Craftify</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #6B4F3A 0%, #8B6B51 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 30px; }
          .button { background: #6B4F3A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📄 Invoice Generated</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${inquiry.userDetails.contactPerson || 'Valued Customer'}</strong>,</p>
            <p>Your invoice has been generated for inquiry <strong>${inquiry.inquiryNumber}</strong>.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/customer/invoices/${invoiceDetails._id}" class="button">View Invoice →</a>
            </div>
            <p>Best regards,<br><strong>Jute Craftify Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Jute Craftify" <${process.env.SMTP_USER}>`,
      to: inquiry.userDetails.email,
      subject: `📄 Invoice Generated: ${inquiry.inquiryNumber} - Jute Craftify`,
      html: invoiceHtml
    });
    
    return { success: true };
  } catch (error) {
    console.error('❌ Invoice email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send payment confirmation email
 */
const sendPaymentConfirmationEmail = async (inquiry, paymentDetails) => {
  console.log('📧 ========== SENDING PAYMENT CONFIRMATION EMAIL ==========');
  
  try {
    if (!inquiry?.userDetails?.email) {
      throw new Error('Customer email is missing');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    
    const paymentHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Payment Confirmed - Jute Craftify</title>
        <style>
          body { font-family: 'Inter', Arial, sans-serif; background-color: #FAF7F2; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; }
          .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; }
          .header h1 { color: white; margin: 0; }
          .content { padding: 30px; }
          .button { background: #6B4F3A; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Payment Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${inquiry.userDetails.contactPerson || 'Valued Customer'}</strong>,</p>
            <p>Your payment for inquiry <strong>${inquiry.inquiryNumber}</strong> has been confirmed.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${frontendUrl}/customer/inquiries" class="button">Track Order →</a>
            </div>
            <p>Thank you for your business!<br><strong>Jute Craftify Team</strong></p>
          </div>
        </div>
      </body>
      </html>
    `;

    await transporter.sendMail({
      from: `"Jute Craftify" <${process.env.SMTP_USER}>`,
      to: inquiry.userDetails.email,
      subject: `✅ Payment Confirmed: ${inquiry.inquiryNumber} - Jute Craftify`,
      html: paymentHtml
    });
    
    return { success: true };
  } catch (error) {
    console.error('❌ Payment email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send custom email
 */
const sendCustomEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"Jute Craftify" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('❌ Custom email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendInquirySubmissionEmails,
  sendStatusUpdateEmail,
  sendInvoiceGeneratedEmail,
  sendPaymentConfirmationEmail,
  sendCustomEmail
};