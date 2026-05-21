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
    console.error('❌ Order Email Service - Configuration error:', error.message);
  } else {
    console.log('✅ Order Email Service is ready');
    console.log(`📧 Using account: ${process.env.SMTP_USER}`);
  }
});

// Toy Store Brand Colors
const BRAND_COLORS = {
  primary: '#4A8A90',
  secondary: '#FFB6C1',
  accent: '#FFD93D',
  lightBg: '#FFF9F0',
  border: '#FFE0E6',
  text: '#2D3A5C',
  textLight: '#6B7B8D',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444'
};

/**
 * Format currency (BDT)
 */
const formatPrice = (price) => {
  const numPrice = parseFloat(price) || 0;
  return `৳${numPrice.toFixed(2)}`;
};

/**
 * Format date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-BD', {
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
 * Get status badge color
 */
const getStatusColor = (status) => {
  const statusColors = {
    'placed': '#3B82F6',
    'confirmed': '#06B6D4',
    'processing': '#8B5CF6',
    'shipped': '#6366F1',
    'delivered': '#10B981',
    'cancelled': '#EF4444'
  };
  return statusColors[status] || '#6B7280';
};

const getPaymentStatusColor = (status) => {
  const statusColors = {
    'pending': '#F59E0B',
    'paid': '#10B981',
    'failed': '#EF4444',
    'refunded': '#F97316'
  };
  return statusColors[status] || '#6B7280';
};

/**
 * Generate order items HTML
 */
const generateOrderItemsHTML = (items) => {
  if (!items || items.length === 0) return '<p>No items found</p>';
  
  let html = `
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
      <thead>
        <tr style="background: ${BRAND_COLORS.secondary}; border-bottom: 2px solid ${BRAND_COLORS.border};">
          <th style="padding: 12px; text-align: left; font-weight: 600; color: ${BRAND_COLORS.text};">Product</th>
          <th style="padding: 12px; text-align: center; font-weight: 600; color: ${BRAND_COLORS.text};">Quantity</th>
          <th style="padding: 12px; text-align: right; font-weight: 600; color: ${BRAND_COLORS.text};">Price</th>
          <th style="padding: 12px; text-align: right; font-weight: 600; color: ${BRAND_COLORS.text};">Total</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  items.forEach((item) => {
    const price = item.discountPrice > 0 ? item.discountPrice : item.regularPrice;
    const totalPrice = price * item.quantity;
    
    html += `
      <tr style="border-bottom: 1px solid ${BRAND_COLORS.border};">
        <td style="padding: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <img src="${item.image || 'https://via.placeholder.com/50'}" alt="${item.productName}" 
                 style="width: 50px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid ${BRAND_COLORS.border};">
            <div>
              <strong style="color: ${BRAND_COLORS.text};">${item.productName}</strong>
              ${item.discountPrice > 0 ? `<p style="margin: 4px 0 0 0; font-size: 12px; color: ${BRAND_COLORS.success};">Sale Price Applied</p>` : ''}
            </div>
          </div>
        </td>
        <td style="padding: 12px; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; text-align: right;">${formatPrice(price)}</td>
        <td style="padding: 12px; text-align: right; font-weight: 600; color: ${BRAND_COLORS.primary};">${formatPrice(totalPrice)}</td>
      </tr>
    `;
  });
  
  html += `
      </tbody>
    </table>
  `;
  
  return html;
};

/**
 * Generate order summary HTML
 */
const generateOrderSummaryHTML = (order) => {
  const statusColor = getStatusColor(order.orderStatus);
  const paymentStatusColor = getPaymentStatusColor(order.paymentStatus);
  
  return `
    <div style="background: ${BRAND_COLORS.lightBg}; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <h2 style="margin: 0 0 15px 0; color: ${BRAND_COLORS.primary}; font-size: 18px;">Order Summary</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; width: 140px;"><strong>Order ID:</strong></td>
          <td style="color: ${BRAND_COLORS.primary};">${order.orderNumber || order._id.slice(-8).toUpperCase()}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Order Date:</strong></td>
          <td>${formatDate(order.createdAt)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Order Status:</strong></td>
          <td><span style="display: inline-block; padding: 4px 12px; background: ${statusColor}20; color: ${statusColor}; border-radius: 20px; font-size: 12px; font-weight: 500;">${order.orderStatus.toUpperCase()}</span></td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Payment Status:</strong></td>
          <td><span style="display: inline-block; padding: 4px 12px; background: ${paymentStatusColor}20; color: ${paymentStatusColor}; border-radius: 20px; font-size: 12px; font-weight: 500;">${order.paymentStatus.toUpperCase()}</span></td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
          <td>${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</td>
        </tr>
        ${order.paymentMethod === 'cod' ? `
        <tr>
          <td style="padding: 8px 0;"><strong>Payment Due:</strong></td>
          <td>Pay when you receive your toys</td>
        </tr>
        ` : ''}
      </table>
    </div>
  `;
};

/**
 * Generate pricing breakdown HTML
 */
const generatePricingHTML = (order) => {
  return `
    <div style="background: ${BRAND_COLORS.lightBg}; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <h2 style="margin: 0 0 15px 0; color: ${BRAND_COLORS.primary}; font-size: 18px;">Price Breakdown</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 6px 0;"><strong>Subtotal:</strong></td>
          <td style="text-align: right;">${formatPrice(order.subtotal)}</td>
        </tr>
        <tr>
          <td style="padding: 6px 0;"><strong>Shipping:</strong></td>
          <td style="text-align: right;">${formatPrice(order.shippingCost)}</td>
        </tr>
        ${order.discount > 0 ? `
        <tr>
          <td style="padding: 6px 0; color: ${BRAND_COLORS.success};"><strong>Discount:</strong></td>
          <td style="text-align: right; color: ${BRAND_COLORS.success};">-${formatPrice(order.discount)}</td>
        </tr>
        ${order.couponCode ? `
        <tr>
          <td style="padding: 6px 0;"><strong>Coupon Applied:</strong></td>
          <td style="text-align: right;">${order.couponCode}</td>
        </tr>
        ` : ''}
        ` : ''}
        <tr style="border-top: 2px solid ${BRAND_COLORS.border}; margin-top: 10px;">
          <td style="padding: 12px 0 0 0; font-size: 18px; font-weight: bold;"><strong>Total:</strong></td>
          <td style="padding: 12px 0 0 0; text-align: right; font-size: 20px; font-weight: bold; color: ${BRAND_COLORS.primary};">${formatPrice(order.total)}</td>
        </tr>
      </table>
    </div>
  `;
};

/**
 * Generate customer info HTML
 */
const generateCustomerInfoHTML = (order) => {
  return `
    <div style="background: ${BRAND_COLORS.lightBg}; padding: 20px; border-radius: 12px; margin: 20px 0;">
      <h2 style="margin: 0 0 15px 0; color: ${BRAND_COLORS.primary}; font-size: 18px;">Customer Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; width: 120px;"><strong>Name:</strong></td>
          <td>${order.customerInfo?.fullName || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Email:</strong></td>
          <td><a href="mailto:${order.customerInfo?.email}" style="color: ${BRAND_COLORS.primary};">${order.customerInfo?.email}</a></td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Phone:</strong></td>
          <td>${order.customerInfo?.phone || 'N/A'}</td>
        </tr>
        ${order.customerInfo?.whatsapp ? `
        <tr>
          <td style="padding: 8px 0;"><strong>WhatsApp:</strong></td>
          <td>${order.customerInfo.whatsapp}</td>
        </tr>
        ` : ''}
        <tr>
          <td style="padding: 8px 0;"><strong>Address:</strong></td>
          <td>${order.customerInfo?.address || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>City:</strong></td>
          <td>${order.customerInfo?.city || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>Upazila/Thana:</strong></td>
          <td>${order.customerInfo?.zone || 'N/A'}</td>
        </tr>
        ${order.customerInfo?.area ? `
        <tr>
          <td style="padding: 8px 0;"><strong>Union/Area:</strong></td>
          <td>${order.customerInfo.area}</td>
        </tr>
        ` : ''}
        ${order.customerInfo?.note ? `
        <tr>
          <td style="padding: 8px 0;"><strong>Order Note:</strong></td>
          <td>${order.customerInfo.note}</td>
        </tr>
        ` : ''}
      </table>
    </div>
  `;
};

/**
 * Generate delivery info HTML
 */
const generateDeliveryInfoHTML = (order) => {
  if (order.orderStatus !== 'delivered' && order.orderStatus !== 'shipped') {
    return '';
  }
  
  return `
    <div style="background: #ECFDF5; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${BRAND_COLORS.success};">
      <h2 style="margin: 0 0 15px 0; color: ${BRAND_COLORS.success}; font-size: 18px;">Delivery Information</h2>
      <table style="width: 100%; border-collapse: collapse;">
        ${order.deliveredAt ? `
        <tr>
          <td style="padding: 8px 0; width: 140px;"><strong>Delivered Date:</strong></td>
          <td>${formatDate(order.deliveredAt)}</td>
        </tr>
        ` : ''}
        ${order.trackingNumber ? `
        <tr>
          <td style="padding: 8px 0;"><strong>Tracking Number:</strong></td>
          <td><code style="background: #F3F4F6; padding: 4px 8px; border-radius: 4px;">${order.trackingNumber}</code></td>
        </tr>
        ` : ''}
        ${order.deliveryNote ? `
        <tr>
          <td style="padding: 8px 0;"><strong>Delivery Note:</strong></td>
          <td>${order.deliveryNote}</td>
        </tr>
        ` : ''}
      </table>
    </div>
  `;
};

/**
 * Send order confirmation email to customer
 */
const sendOrderConfirmationEmail = async (order, customerEmail) => {
  console.log('📧 Sending order confirmation email to customer...');
  
  try {
    if (!customerEmail) {
      throw new Error('Customer email is missing');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const itemsHTML = generateOrderItemsHTML(order.items);
    const summaryHTML = generateOrderSummaryHTML(order);
    const pricingHTML = generatePricingHTML(order);
    const customerInfoHTML = generateCustomerInfoHTML(order);
    const deliveryInfoHTML = generateDeliveryInfoHTML(order);

    const result = await transporter.sendMail({
      from: `"ToyStore" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `🎉 Order Confirmed! Order #${order.orderNumber || order._id.slice(-8).toUpperCase()} - ToyStore`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: ${BRAND_COLORS.lightBg}; }
            .container { max-width: 700px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; }
            .header p { color: white; margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 35px 30px; }
            .section-title { font-size: 18px; font-weight: 600; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: ${BRAND_COLORS.text}; }
            .button { background: ${BRAND_COLORS.primary}; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; transition: all 0.3s ease; }
            .button:hover { background: ${BRAND_COLORS.secondary}; color: ${BRAND_COLORS.text}; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid ${BRAND_COLORS.border}; text-align: center; }
            .social-icons { display: flex; justify-content: center; gap: 15px; margin: 15px 0; }
            .status-badge { display: inline-block; padding: 4px 12px; background: #10B98120; color: #10B981; border-radius: 20px; font-size: 12px; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>🧸</span>
                <span>Order Confirmed!</span>
              </h1>
              <p>Thank you for shopping with ToyStore</p>
            </div>
            <div class="content">
              <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              <p style="margin-bottom: 25px; font-size: 16px;">We're excited to let you know that your order has been successfully placed and is being processed. Your toys will be on their way to you soon! 🎁</p>
              
              ${summaryHTML}
              ${customerInfoHTML}
              ${deliveryInfoHTML}
              
              <div class="section-title">
                <span>📦</span>
                <span>Order Items</span>
              </div>
              ${itemsHTML}
              
              ${pricingHTML}
              
              <div style="margin: 35px 0 25px; text-align: center;">
                <a href="${frontendUrl}/customer/orders" class="button">Track Your Order</a>
              </div>
              
              <div style="background: ${BRAND_COLORS.lightBg}; padding: 20px; border-radius: 12px; margin: 20px 0; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: ${BRAND_COLORS.textLight};">Have questions about your order?</p>
                <p style="margin: 5px 0 0 0;">
                  <a href="mailto:${process.env.SMTP_USER}" style="color: ${BRAND_COLORS.primary};">Contact our support team</a>
                </p>
              </div>
              
              <div class="footer">
                <p style="margin-bottom: 5px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: ${BRAND_COLORS.primary};">The ToyStore Team</p>
                <p style="font-size: 12px; color: #999; margin-top: 15px;">
                  📧 ${process.env.SMTP_USER}<br>
                  🧸 Making childhood magical, one toy at a time!
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Customer order confirmation email sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Order confirmation email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send order notification email to admin
 */
const sendOrderNotificationToAdmin = async (order) => {
  console.log('📧 Sending order notification email to admin...');
  
  try {
    const adminEmail = process.env.OWNER_EMAIL || process.env.SMTP_USER;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const itemsHTML = generateOrderItemsHTML(order.items);
    const summaryHTML = generateOrderSummaryHTML(order);
    const pricingHTML = generatePricingHTML(order);
    const customerInfoHTML = generateCustomerInfoHTML(order);
    
    const result = await transporter.sendMail({
      from: `"ToyStore System" <${process.env.SMTP_USER}>`,
      to: adminEmail,
      subject: `🛍️ New Order Received! Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; background-color: ${BRAND_COLORS.lightBg}; }
            .container { max-width: 700px; margin: 20px auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%); padding: 25px 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 24px; }
            .content { padding: 30px; }
            .button { background: ${BRAND_COLORS.primary}; color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; }
            .section-title { font-size: 18px; font-weight: 600; margin: 25px 0 15px 0; color: ${BRAND_COLORS.text}; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🛍️ New Order Received!</h1>
            </div>
            <div class="content">
              <p>A new order has been placed and requires your attention.</p>
              
              ${customerInfoHTML}
              ${summaryHTML}
              
              <div class="section-title">📦 Order Items</div>
              ${itemsHTML}
              
              ${pricingHTML}
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${frontendUrl}/admin/orders" class="button">View Order in Dashboard</a>
              </div>
              
              <div style="background: #FEF3C7; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <p style="margin: 0; font-size: 14px; color: #92400E;">⚠️ Please review and process this order as soon as possible.</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Admin order notification sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Admin notification error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send order status update email to customer
 */
// Add this new function - Order Placed Email (Initial email when customer places order)
const sendOrderPlacedEmail = async (order, customerEmail) => {
  console.log('📧 Sending order placed email to customer...');
  
  try {
    if (!customerEmail) {
      throw new Error('Customer email is missing');
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const itemsHTML = generateOrderItemsHTML(order.items);
    const summaryHTML = generateOrderSummaryHTML(order);
    const pricingHTML = generatePricingHTML(order);
    const customerInfoHTML = generateCustomerInfoHTML(order);
    const deliveryInfoHTML = generateDeliveryInfoHTML(order);

    const result = await transporter.sendMail({
      from: `"ToyStore" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `📦 Order Placed! Order #${order.orderNumber || order._id.slice(-8).toUpperCase()} - ToyStore`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: ${BRAND_COLORS.lightBg}; }
            .container { max-width: 700px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; }
            .header p { color: white; margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 35px 30px; }
            .section-title { font-size: 18px; font-weight: 600; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: ${BRAND_COLORS.text}; }
            .button { background: ${BRAND_COLORS.primary}; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid ${BRAND_COLORS.border}; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>📦</span>
                <span>Order Placed!</span>
              </h1>
              <p>Your order has been received and is pending confirmation</p>
            </div>
            <div class="content">
              <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              <p style="margin-bottom: 25px; font-size: 16px;">Thank you for your order! We have received your order and it is now pending confirmation. You will receive another email once your order is confirmed.</p>
              
              ${summaryHTML}
              ${customerInfoHTML}
              ${deliveryInfoHTML}
              
              <div class="section-title">
                <span>📦</span>
                <span>Order Items</span>
              </div>
              ${itemsHTML}
              
              ${pricingHTML}
              
              <div style="margin: 35px 0 25px; text-align: center;">
                <a href="${frontendUrl}/customer/orders" class="button">Track Your Order</a>
              </div>
              
              <div class="footer">
                <p style="margin-bottom: 5px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: ${BRAND_COLORS.primary};">The ToyStore Team</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Order placed email sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Order placed email error:', error.message);
    return { success: false, error: error.message };
  }
};

// Update the sendOrderStatusUpdateEmail to show full order details
const sendOrderStatusUpdateEmail = async (order, customerEmail, oldStatus, newStatus) => {
  console.log('📧 Sending order status update email with full details...');
  
  try {
    if (!customerEmail) {
      throw new Error('Customer email is missing');
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const newStatusColor = getStatusColor(newStatus);
    const itemsHTML = generateOrderItemsHTML(order.items);
    const summaryHTML = generateOrderSummaryHTML(order);
    const pricingHTML = generatePricingHTML(order);
    const customerInfoHTML = generateCustomerInfoHTML(order);
    const deliveryInfoHTML = generateDeliveryInfoHTML(order);
    
    let statusTitle = '';
    let statusMessage = '';
    let statusEmoji = '';
    let headerGradient = '';
    
    switch(newStatus) {
      case 'confirmed':
        statusTitle = 'Order Confirmed!';
        statusMessage = 'Great news! Your order has been confirmed and is being prepared for shipment. Our team is working hard to pack your items carefully.';
        statusEmoji = '✅';
        headerGradient = 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';
        break;
      case 'processing':
        statusTitle = 'Order Processing';
        statusMessage = 'Your order is now being processed. Our team is preparing your items for shipment.';
        statusEmoji = '⚙️';
        headerGradient = 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)';
        break;
      case 'shipped':
        statusTitle = 'Order Shipped!';
        statusMessage = 'Your order has been shipped and is on its way to you! Get ready to receive your wonderful products.';
        statusEmoji = '🚚';
        headerGradient = 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)';
        break;
      case 'delivered':
        statusTitle = 'Order Delivered!';
        statusMessage = 'Your order has been delivered! We hope you love your new items. Thank you for shopping with us!';
        statusEmoji = '🎁';
        headerGradient = 'linear-gradient(135deg, #10B981 0%, #34D399 100%)';
        break;
      case 'cancelled':
        statusTitle = 'Order Cancelled';
        statusMessage = 'Your order has been cancelled. If you have any questions, please contact our support team.';
        statusEmoji = '❌';
        headerGradient = 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)';
        break;
      default:
        statusTitle = `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`;
        statusMessage = `Your order status has been updated to ${newStatus}.`;
        statusEmoji = '📝';
        headerGradient = `linear-gradient(135deg, ${newStatusColor} 0%, ${newStatusColor}CC 100%)`;
    }
    
    const result = await transporter.sendMail({
      from: `"ToyStore" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `${statusEmoji} ${statusTitle} - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: ${BRAND_COLORS.lightBg}; }
            .container { max-width: 700px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: ${headerGradient}; padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; }
            .header p { color: white; margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 35px 30px; }
            .status-box { background: ${newStatusColor}10; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${newStatusColor}; }
            .status-badge { display: inline-block; padding: 8px 24px; background: ${newStatusColor}; color: white; border-radius: 40px; font-weight: bold; text-transform: uppercase; font-size: 14px; }
            .section-title { font-size: 18px; font-weight: 600; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: ${BRAND_COLORS.text}; }
            .button { background: ${BRAND_COLORS.primary}; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid ${BRAND_COLORS.border}; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>${statusEmoji}</span>
                <span>${statusTitle}</span>
              </h1>
              <p>Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div class="content">
              <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              
              <div class="status-box">
                <div class="status-badge">${newStatus.toUpperCase()}</div>
                <p style="margin: 15px 0 0 0;">${statusMessage}</p>
              </div>
              
              ${summaryHTML}
              ${customerInfoHTML}
              ${deliveryInfoHTML}
              
              <div class="section-title">
                <span>📦</span>
                <span>Order Items</span>
              </div>
              ${itemsHTML}
              
              ${pricingHTML}
              
              <div style="margin: 35px 0 25px; text-align: center;">
                <a href="${frontendUrl}/customer/orders" class="button">View Order Details</a>
              </div>
              
              <div class="footer">
                <p style="margin-bottom: 5px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: ${BRAND_COLORS.primary};">The ToyStore Team</p>
                <p style="font-size: 12px; color: #999; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Order status update email sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Status update email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send payment status update email to customer
 */
const sendPaymentStatusUpdateEmail = async (order, customerEmail, oldStatus, newStatus) => {
  console.log('📧 Sending payment status update email...');
  
  try {
    if (!customerEmail) {
      throw new Error('Customer email is missing');
    }
    
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const itemsHTML = generateOrderItemsHTML(order.items);
    const summaryHTML = generateOrderSummaryHTML(order);
    const pricingHTML = generatePricingHTML(order);
    const customerInfoHTML = generateCustomerInfoHTML(order);
    
    let statusMessage = '';
    let statusEmoji = '';
    let statusColor = '';
    
    switch(newStatus) {
      case 'paid':
        statusMessage = 'Your payment has been successfully received. Thank you for your purchase!';
        statusEmoji = '✅';
        statusColor = '#10B981';
        break;
      case 'failed':
        statusMessage = 'Your payment has failed. Please try again or contact your bank.';
        statusEmoji = '❌';
        statusColor = '#EF4444';
        break;
      case 'refunded':
        statusMessage = 'Your payment has been refunded. The amount will be credited back to your original payment method within 3-5 business days.';
        statusEmoji = '💰';
        statusColor = '#F97316';
        break;
      default:
        statusMessage = `Your payment status has been updated to ${newStatus}.`;
        statusEmoji = '📝';
        statusColor = '#6B7280';
    }
    
    const result = await transporter.sendMail({
      from: `"ToyStore" <${process.env.SMTP_USER}>`,
      to: customerEmail,
      subject: `${statusEmoji} Payment Status Update - Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: ${BRAND_COLORS.lightBg}; }
            .container { max-width: 700px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, ${BRAND_COLORS.primary} 0%, ${BRAND_COLORS.secondary} 100%); padding: 30px; text-align: center; }
            .header h1 { color: white; margin: 0; font-size: 28px; display: flex; align-items: center; justify-content: center; gap: 12px; }
            .content { padding: 35px 30px; }
            .status-box { background: ${statusColor}10; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${statusColor}; }
            .status-badge { display: inline-block; padding: 8px 24px; background: ${statusColor}; color: white; border-radius: 40px; font-weight: bold; text-transform: uppercase; font-size: 14px; }
            .section-title { font-size: 18px; font-weight: 600; margin: 25px 0 15px 0; display: flex; align-items: center; gap: 8px; color: ${BRAND_COLORS.text}; }
            .button { background: ${BRAND_COLORS.primary}; color: white; padding: 14px 35px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid ${BRAND_COLORS.border}; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>${statusEmoji}</span>
                <span>Payment Status Update</span>
              </h1>
              <p>Order #${order.orderNumber || order._id.slice(-8).toUpperCase()}</p>
            </div>
            <div class="content">
              <p style="margin-bottom: 25px; font-size: 16px;">Dear <strong>${order.customerInfo?.fullName || 'Valued Customer'}</strong>,</p>
              
              <div class="status-box">
                <div class="status-badge">${newStatus.toUpperCase()}</div>
                <p style="margin: 15px 0 0 0;">${statusMessage}</p>
              </div>
              
              ${summaryHTML}
              ${customerInfoHTML}
              
              <div class="section-title">
                <span>📦</span>
                <span>Order Items</span>
              </div>
              ${itemsHTML}
              
              ${pricingHTML}
              
              <div style="margin: 35px 0 25px; text-align: center;">
                <a href="${frontendUrl}/customer/orders" class="button">View Order Details</a>
              </div>
              
              <div class="footer">
                <p style="margin-bottom: 5px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; color: ${BRAND_COLORS.primary};">The ToyStore Team</p>
                <p style="font-size: 12px; color: #999; margin-top: 15px;">Need help? Contact us at ${process.env.SMTP_USER}</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Payment status update email sent:', result.messageId);
    return { success: true };
  } catch (error) {
    console.error('❌ Payment status update email error:', error.message);
    return { success: false, error: error.message };
  }
};

// Update the exports to include sendOrderPlacedEmail
module.exports = {
  sendOrderPlacedEmail,
  sendOrderNotificationToAdmin,
  sendOrderStatusUpdateEmail,
  sendPaymentStatusUpdateEmail
};
