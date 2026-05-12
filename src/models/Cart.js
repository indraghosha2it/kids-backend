const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  productSlug: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  regularPrice: {
    type: Number,
    required: true
  },
  discountPrice: {
    type: Number,
    default: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  stockQuantity: {
    type: Number,
    default: 0
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    sparse: true,
    index: true
  },
  sessionId: {
    type: String,
    sparse: true,
    index: true
  },
  items: [cartItemSchema],
  totalItems: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    default: 0
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// SIMPLIFIED FIX: No middleware, just a function that updates totals
// cartSchema.methods.updateTotals = function() {
//   this.totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//   this.subtotal = this.items.reduce((sum, item) => {
//     const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
//     return sum + (price * (item.quantity || 0));
//   }, 0);
//   this.updatedAt = new Date();
//   return this;
// };
// In Cart.js, make sure this method exists:
// In Cart.js, make sure this method exists and is correct:
cartSchema.methods.updateTotals = function() {
  this.totalItems = this.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  this.subtotal = this.items.reduce((sum, item) => {
    const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
    return sum + (price * (item.quantity || 0));
  }, 0);
  this.updatedAt = new Date();
  return this;
};

// Remove pre-save middleware entirely, update totals manually in controller
module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);

