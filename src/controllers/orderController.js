const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (with sessionId) or Private (with token)
// const createOrder = async (req, res) => {
//   try {
//     const {
//       items,
//       subtotal,
//       shippingCost,
//       discount,
//       total,
//       paymentMethod,
//       customerInfo,
//       couponCode,
//       couponDiscount,
//       freeShipping
//     } = req.body;

//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

//     // Validate required fields
//     if (!items || items.length === 0) {
//       return res.status(400).json({ success: false, error: 'No items in order' });
//     }

//     if (!customerInfo || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
//       return res.status(400).json({ success: false, error: 'Customer information is incomplete' });
//     }

//     if (!paymentMethod) {
//       return res.status(400).json({ success: false, error: 'Payment method is required' });
//     }

//     // Verify stock availability before creating order
//     for (const item of items) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, error: `Product ${item.productName} not found` });
//       }
//       if (product.stockQuantity < item.quantity) {
//         return res.status(400).json({ 
//           success: false, 
//           error: `Insufficient stock for ${product.productName}. Available: ${product.stockQuantity}` 
//         });
//       }
//     }

//     // Create order
//     const order = new Order({
//       userId: userId || null,
//       sessionId: userId ? null : sessionId,
//       items: items.map(item => ({
//         productId: item.productId,
//         productName: item.productName,
//         productSlug: item.productSlug,
//         image: item.image,
//         regularPrice: item.regularPrice,
//         discountPrice: item.discountPrice,
//         quantity: item.quantity,
//         stockQuantity: item.stockQuantity
//       })),
//       customerInfo: {
//         fullName: customerInfo.fullName,
//         email: customerInfo.email,
//         phone: customerInfo.phone,
//         whatsapp: customerInfo.whatsapp || '',
//         address: customerInfo.address,
//         city: customerInfo.city,
//         zone: customerInfo.zone,
//         area: customerInfo.area || '',
//         zipCode: customerInfo.zipCode || '',
//         country: customerInfo.country || 'Bangladesh',
//         note: customerInfo.note || ''
//       },
//       subtotal,
//       shippingCost,
//       discount: discount || 0,
//       total,
//       paymentMethod,
//       paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
//       couponCode: couponCode || null,
//       couponDiscount: couponDiscount || 0,
//       freeShipping: freeShipping || false,
//       orderStatus: 'placed',
//       orderDate: new Date()
//     });

//     await order.save();

//     // Update product stock quantities
//     for (const item of items) {
//       await Product.findByIdAndUpdate(
//         item.productId,
//         { $inc: { stockQuantity: -item.quantity, purchaseCount: item.quantity } }
//       );
//     }

//     // Clear user's cart after successful order
//     if (userId) {
//       await Cart.findOneAndDelete({ userId });
//     } else if (sessionId) {
//       await Cart.findOneAndDelete({ sessionId });
//     }

//     // Record coupon usage if coupon was applied
//     if (couponCode) {
//       try {
//         const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
//         if (coupon) {
//           coupon.totalUsedCount = (coupon.totalUsedCount || 0) + 1;
//           coupon.usageRecords = coupon.usageRecords || [];
//           coupon.usageRecords.push({
//             userId: userId || null,
//             orderId: order._id,
//             usedAt: new Date(),
//             discountAmount: couponDiscount || discount
//           });
//           await coupon.save();
//         }
//       } catch (couponError) {
//         console.error('Error recording coupon usage:', couponError);
//         // Don't fail the order if coupon recording fails
//       }
//     }

//     // Populate order details for response
//    res.status(201).json({
//   success: true,
//   data: order,
//   orderId: order._id,
//   message: 'Order placed successfully'
// });

//   } catch (error) {
//     console.error('Create order error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


// @desc    Create new order (or create pending order for online payment)
// @route   POST /api/orders
// @access  Public (with sessionId) or Private (with token)
const createOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod,
      customerInfo,
      couponCode,
      couponDiscount,
      freeShipping,
      orderStatus = 'pending',  // Default to pending
      saveOrder = true  // Default to true for COD
    } = req.body;

    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ success: false, error: 'Customer information is incomplete' });
    }

    if (!paymentMethod) {
      return res.status(400).json({ success: false, error: 'Payment method is required' });
    }

    // For online payment, we don't need to check stock or create order yet
    // Just prepare the order data and return it
    if (paymentMethod === 'online' && !saveOrder) {
      // Just prepare the data without saving
      const orderData = {
        userId: userId || null,
        sessionId: userId ? null : sessionId,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          productSlug: item.productSlug,
          image: item.image,
          regularPrice: item.regularPrice,
          discountPrice: item.discountPrice,
          quantity: item.quantity,
          stockQuantity: item.stockQuantity
        })),
        customerInfo: {
          fullName: customerInfo.fullName,
          email: customerInfo.email,
          phone: customerInfo.phone,
          whatsapp: customerInfo.whatsapp || '',
          address: customerInfo.address,
          city: customerInfo.city,
          zone: customerInfo.zone,
          area: customerInfo.area || '',
          zipCode: customerInfo.zipCode || '',
          country: customerInfo.country || 'Bangladesh',
          note: customerInfo.note || ''
        },
        subtotal,
        shippingCost,
        discount: discount || 0,
        total,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'pending',  // Not placed yet
        couponCode: couponCode || null,
        couponDiscount: couponDiscount || 0,
        freeShipping: freeShipping || false,
        orderDate: new Date()
      };
      
      // Return the order data without saving
      return res.status(200).json({
        success: true,
        data: orderData,
        message: 'Order data prepared'
      });
    }

    // For COD - Verify stock and create order
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, error: `Product ${item.productName} not found` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient stock for ${product.productName}. Available: ${product.stockQuantity}` 
        });
      }
    }

    // Create order
    const order = new Order({
      userId: userId || null,
      sessionId: userId ? null : sessionId,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        image: item.image,
        regularPrice: item.regularPrice,
        discountPrice: item.discountPrice,
        quantity: item.quantity,
        stockQuantity: item.stockQuantity
      })),
      customerInfo: {
        fullName: customerInfo.fullName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        whatsapp: customerInfo.whatsapp || '',
        address: customerInfo.address,
        city: customerInfo.city,
        zone: customerInfo.zone,
        area: customerInfo.area || '',
        zipCode: customerInfo.zipCode || '',
        country: customerInfo.country || 'Bangladesh',
        note: customerInfo.note || ''
      },
      subtotal,
      shippingCost,
      discount: discount || 0,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: orderStatus === 'pending' ? 'placed' : orderStatus,
      couponCode: couponCode || null,
      couponDiscount: couponDiscount || 0,
      freeShipping: freeShipping || false,
      orderDate: new Date()
    });

    await order.save();

    // Update product stock quantities
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity, purchaseCount: item.quantity } }
      );
    }

    // Clear user's cart after successful order
    if (userId) {
      await Cart.findOneAndDelete({ userId });
    } else if (sessionId) {
      await Cart.findOneAndDelete({ sessionId });
    }

    // Record coupon usage if coupon was applied
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
        if (coupon) {
          coupon.totalUsedCount = (coupon.totalUsedCount || 0) + 1;
          coupon.usageRecords = coupon.usageRecords || [];
          coupon.usageRecords.push({
            userId: userId || null,
            orderId: order._id,
            usedAt: new Date(),
            discountAmount: couponDiscount || discount
          });
          await coupon.save();
        }
      } catch (couponError) {
        console.error('Error recording coupon usage:', couponError);
      }
    }

    res.status(201).json({
      success: true,
      data: order,
      orderId: order._id,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Public (with sessionId) or Private (with token)
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    const { page = 1, limit = 10, orderStatus } = req.query;
    
    const query = {};
    
    if (userId) {
      query.userId = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return res.status(200).json({ 
        success: true, 
        data: [], 
        pagination: { total: 0, page: 1, pages: 0, limit: 10 }
      });
    }
    
    if (orderStatus) {
      query.orderStatus = orderStatus;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public (with sessionId) or Private (with token)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Check if user has permission to view this order
    const hasPermission = (userId && order.userId && order.userId.toString() === userId.toString()) ||
                         (sessionId && order.sessionId === sessionId);
    
    if (!hasPermission) {
      return res.status(403).json({ success: false, error: 'Unauthorized to view this order' });
    }
    
    res.json({ success: true, data: order });
    
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update order status (Admin/Moderator)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Moderator)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, deliveryNote } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
const validStatuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    
    if (orderStatus && !validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid order status' });
    }
    
    // If order is being delivered, set delivered date
    if (orderStatus === 'delivered' && order.orderStatus !== 'delivered') {
      order.deliveredAt = new Date();
    }
    
    // If order is being cancelled, set cancelled date
    if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
      order.cancelledAt = new Date();
      
      // Restore stock for cancelled order
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stockQuantity: item.quantity } }
        );
      }
    }
    
    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;
    
    await order.save();
    
    res.json({
      success: true,
      data: order,
      message: `Order status updated to ${orderStatus}`
    });
    
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update payment status (Admin/Moderator)
// @route   PUT /api/orders/:id/payment
// @access  Private (Admin/Moderator)
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentDetails } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid payment status' });
    }
    
    order.paymentStatus = paymentStatus;
    if (paymentDetails) {
      order.paymentDetails = { ...order.paymentDetails, ...paymentDetails };
    }
    
    await order.save();
    
    res.json({
      success: true,
      data: order,
      message: `Payment status updated to ${paymentStatus}`
    });
    
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Cancel order (User)
// @route   PUT /api/orders/:id/cancel
// @access  Public (with sessionId) or Private (with token)
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Check permission
    const hasPermission = (userId && order.userId && order.userId.toString() === userId.toString()) ||
                         (sessionId && order.sessionId === sessionId);
    
    if (!hasPermission) {
      return res.status(403).json({ success: false, error: 'Unauthorized to cancel this order' });
    }
    
    // Check if order can be cancelled (only pending or confirmed orders)
    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        error: `Order cannot be cancelled as it is already ${order.orderStatus}` 
      });
    }
    
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = cancellationReason || 'Cancelled by customer';
    
    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: item.quantity } }
      );
    }
    
    await order.save();
    
    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
    
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      orderStatus,
      paymentStatus,
      search,
      startDate,
      endDate,
      sort = '-createdAt'
    } = req.query;
    
    const query = {};
    
    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    // Search by order number or customer name/email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { 'customerInfo.fullName': searchRegex },
        { 'customerInfo.email': searchRegex },
        { 'customerInfo.phone': searchRegex }
      ];
    }
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'createdAt_asc':
        sortOption = { createdAt: 1 };
        break;
      case 'total_desc':
        sortOption = { total: -1 };
        break;
      case 'total_asc':
        sortOption = { total: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('userId', 'name email phone')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/admin/stats
// @access  Private (Admin only)
const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const [
      totalOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      cancelledOrders,
      todayOrders,
      monthOrders,
      totalRevenue,
      monthRevenue
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: { $in: ['confirmed', 'processing', 'shipped'] } }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.countDocuments({ orderStatus: 'cancelled' }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);
    
    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        todayOrders,
        monthOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthRevenue: monthRevenue[0]?.total || 0
      }
    });
    
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Prepare order data without saving (for online payment)
// @route   POST /api/orders/prepare
// @access  Public (with sessionId) or Private (with token)
const prepareOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod,
      customerInfo,
      couponCode,
      couponDiscount,
      freeShipping
    } = req.body;

    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
      return res.status(400).json({ success: false, error: 'Customer information is incomplete' });
    }

    // Prepare order data without saving
    const orderData = {
      userId: userId || null,
      sessionId: userId ? null : sessionId,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        image: item.image,
        regularPrice: item.regularPrice,
        discountPrice: item.discountPrice,
        quantity: item.quantity,
        stockQuantity: item.stockQuantity
      })),
      customerInfo: {
        fullName: customerInfo.fullName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        whatsapp: customerInfo.whatsapp || '',
        address: customerInfo.address,
        city: customerInfo.city,
        zone: customerInfo.zone,
        area: customerInfo.area || '',
        zipCode: customerInfo.zipCode || '',
        country: customerInfo.country || 'Bangladesh',
        note: customerInfo.note || ''
      },
      subtotal,
      shippingCost,
      discount: discount || 0,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      couponCode: couponCode || null,
      couponDiscount: couponDiscount || 0,
      freeShipping: freeShipping || false,
      orderDate: new Date()
    };
    
    res.json({
      success: true,
      data: orderData,
      message: 'Order data prepared'
    });
    
  } catch (error) {
    console.error('Prepare order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats,
  prepareOrder
};