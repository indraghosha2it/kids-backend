// const mongoose = require('mongoose');

// const orderItemSchema = new mongoose.Schema({
//   productId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     required: true
//   },
//   productName: {
//     type: String,
//     required: true
//   },
//   productSlug: {
//     type: String,
//     required: true
//   },
//   image: {
//     type: String,
//     required: true
//   },
//   regularPrice: {
//     type: Number,
//     required: true
//   },
//   discountPrice: {
//     type: Number,
//     default: 0
//   },
//   quantity: {
//     type: Number,
//     required: true,
//     min: 1,
//     default: 1
//   },
//   stockQuantity: {
//     type: Number,
//     default: 0
//   }
// });

// const customerInfoSchema = new mongoose.Schema({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true },
//   phone: { type: String, required: true },
//   whatsapp: { type: String, default: '' },
//   address: { type: String, required: true },
//   city: { type: String, required: true },
//   zone: { type: String, required: true },
//   area: { type: String, default: '' },
//   zipCode: { type: String, default: '' },
//   country: { type: String, default: 'Bangladesh' },
//   note: { type: String, default: '' }
// });

// const orderSchema = new mongoose.Schema({
//   // User identification (similar to cart and wishlist)
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     sparse: true,
//     index: true
//   },
//   sessionId: {
//     type: String,
//     sparse: true,
//     index: true
//   },
  
//   // Order items
//   items: [orderItemSchema],
  
//   // Customer information
//   customerInfo: customerInfoSchema,
  
//   // Pricing information
//   subtotal: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   shippingCost: {
//     type: Number,
//     required: true,
//     default: 0
//   },
//   discount: {
//     type: Number,
//     default: 0
//   },
//   total: {
//     type: Number,
//     required: true,
//     min: 0
//   },
  
//   // Coupon information
//   couponCode: {
//     type: String,
//     default: null
//   },
//   couponDiscount: {
//     type: Number,
//     default: 0
//   },
//   freeShipping: {
//     type: Boolean,
//     default: false
//   },
  
//   // Payment information
//   paymentMethod: {
//     type: String,
//     enum: ['cod', 'online', 'bkash', 'nagad'],
//     required: true,
//     default: 'cod'
//   },
//   paymentStatus: {
//     type: String,
//     enum: ['pending', 'paid', 'failed', 'refunded'],
//     default: 'pending'
//   },
//   paymentDetails: {
//     type: mongoose.Schema.Types.Mixed,
//     default: {}
//   },
//   transactionId: {
//   type: String,
//   default: null,
//   index: true
// },
// paymentSession: {
//   sessionKey: String,
//   gatewayUrl: String,
//   initiatedAt: Date
// },
  
//  orderStatus: {
//   type: String,
//   enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
//   default: 'placed'
// },
  
//   // Tracking information
//   trackingNumber: {
//     type: String,
//     default: null
//   },
//   deliveryNote: {
//     type: String,
//     default: ''
//   },
  
//   // Timestamps
//   orderDate: {
//     type: Date,
//     default: Date.now
//   },
//   deliveredAt: {
//     type: Date,
//     default: null
//   },
//   cancelledAt: {
//     type: Date,
//     default: null
//   },
  
//   // Cancellation reason (if applicable)
//   cancellationReason: {
//     type: String,
//     default: ''
//   }
// }, {
//   timestamps: true
// });

// // Generate order number
// orderSchema.virtual('orderNumber').get(function() {
//   return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
// });

// // Indexes for better query performance
// orderSchema.index({ createdAt: -1 });
// orderSchema.index({ orderStatus: 1, createdAt: -1 });
// orderSchema.index({ userId: 1, createdAt: -1 });
// orderSchema.index({ sessionId: 1, createdAt: -1 });

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true },
  productSlug: { type: String, required: true },
  image: { type: String, required: true },
  regularPrice: { type: Number, required: true },
  discountPrice: { type: Number, default: 0 },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  stockQuantity: { type: Number, default: 0 }
});

const customerInfoSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  whatsapp: { type: String, default: '' },
  address: { type: String, required: true },
  city: { type: String, required: true },
  zone: { type: String, required: true },
  area: { type: String, default: '' },
  zipCode: { type: String, default: '' },
  country: { type: String, default: 'Bangladesh' },
  note: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', sparse: true, index: true },
  sessionId: { type: String, sparse: true, index: true },
  items: [orderItemSchema],
  customerInfo: customerInfoSchema,
  subtotal: { type: Number, required: true, min: 0 },
  shippingCost: { type: Number, required: true, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true, min: 0 },
  couponCode: { type: String, default: null },
  couponDiscount: { type: Number, default: 0 },
  freeShipping: { type: Boolean, default: false },
  paymentMethod: { type: String, enum: ['cod', 'online'], required: true, default: 'cod' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
  paymentDetails: { type: mongoose.Schema.Types.Mixed, default: {} },
  transactionId: { type: String, default: null, index: true },
  paymentSession: { sessionKey: String, gatewayUrl: String, initiatedAt: Date },
  orderStatus: { type: String, enum: ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'], default: 'placed' },
  trackingNumber: { type: String, default: null },
  deliveryNote: { type: String, default: '' },
  orderNumber: { type: String, unique: true },
  orderDate: { type: Date, default: Date.now },
  deliveredAt: { type: Date, default: null },
  cancelledAt: { type: Date, default: null },
  cancellationReason: { type: String, default: '' }
}, { timestamps: true });

// IMPORTANT: Remove 'next' parameter - just use async function()
orderSchema.pre('save', async function() {
  if (!this.orderNumber) {
    try {
      // Get current year and month
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      
      // Count how many orders already exist
      const Order = mongoose.model('Order');
      const orderCount = await Order.countDocuments();
      
      // Next order number = current count + 1
      const nextNumber = orderCount + 1;
      
      // Pad to 4 digits (0001, 0002, etc.)
      const paddedNumber = nextNumber.toString().padStart(4, '0');
      
      // Generate order number: kidA + YYMM + sequence
      this.orderNumber = `kidA${year}${month}${paddedNumber}`;
      
      console.log(`✅ Generated Order Number: ${this.orderNumber} (Order #${nextNumber})`);
    } catch (error) {
      console.error('Error generating order number:', error);
      throw error; // Throw error to stop save if order number generation fails
    }
  }
});

// Virtual for formatted display
orderSchema.virtual('formattedOrderNumber').get(function() {
  if (this.orderNumber) {
    const match = this.orderNumber.match(/(kidA)(\d{2})(\d{2})(\d{4})/);
    if (match) {
      return `${match[1]}-${match[2]}${match[3]}-${match[4]}`;
    }
  }
  return this.orderNumber;
});

// Indexes
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });


orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);