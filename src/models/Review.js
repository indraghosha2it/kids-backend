// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema({
//   // Rating (1-5)
//   rating: {
//     type: Number,
//     required: [true, 'Rating is required'],
//     min: 1,
//     max: 5
//   },

//   // Review title (optional)
//   title: {
//     type: String,
//     trim: true,
//     maxlength: [100, 'Title cannot exceed 100 characters']
//   },

//   // Review comment
//   comment: {
//     type: String,
//     required: [true, 'Review comment is required'],
//     trim: true,
//     minlength: [10, 'Review must be at least 10 characters'],
//     maxlength: [500, 'Review cannot exceed 500 characters']
//   },

//   // Product being reviewed (optional)
//   product: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product'
//   },

//   // User who wrote the review
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },

//   // Display name (for anonymous or actual name)
//   userName: {
//     type: String,
//     required: true,
//     trim: true
//   },

//   // Company name (if not anonymous)
//   userCompany: {
//     type: String,
//     trim: true
//   },

//   // User email (for contact)
//   userEmail: {
//     type: String,
//     required: true
//   },

//   // Is anonymous?
//   isAnonymous: {
//     type: Boolean,
//     default: false
//   },

//   // Status
//   status: {
//     type: String,
//     enum: ['pending', 'approved', 'rejected'],
//     default: 'pending'
//   },

//   // Moderation
//   moderatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   moderatedAt: Date,
//   moderationNote: String,

//   // Helpful counts
//   helpfulCount: {
//     type: Number,
//     default: 0
//   },

//   // Users who marked this review as helpful
//   helpfulUsers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   }],

//   // Admin can feature reviews
//   isFeatured: {
//     type: Boolean,
//     default: false
//   },
//    lastEditedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   lastEditedAt: {
//     type: Date
//   },


//   // Response from seller/admin (optional)
//   response: {
//     text: String,
//     respondedBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User'
//     },
//     respondedAt: Date
//   }
// }, {
//   timestamps: true
// });

// // Indexes for better query performance
// reviewSchema.index({ product: 1, status: 1 });
// reviewSchema.index({ user: 1, createdAt: -1 });
// reviewSchema.index({ status: 1, createdAt: -1 });
// reviewSchema.index({ rating: 1 });
// reviewSchema.index({ isFeatured: 1 });

// // Ensure one review per user per product (if product is selected)
// reviewSchema.index({ user: 1, product: 1 }, { 
//   unique: true, 
//   partialFilterExpression: { product: { $type: "objectId" } } 
// });

// // Virtual for average rating calculation
// reviewSchema.statics.getAverageRating = async function(productId) {
//   const result = await this.aggregate([
//     {
//       $match: { 
//         product: mongoose.Types.ObjectId(productId),
//         status: 'approved'
//       }
//     },
//     {
//       $group: {
//         _id: '$product',
//         averageRating: { $avg: '$rating' },
//         totalReviews: { $sum: 1 }
//       }
//     }
//   ]);
  
//   return result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
// };


const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  isGuest: {
    type: Boolean,
    default: false
  },
  guestEmail: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        if (this.isGuest && !v) return false;
        if (!this.isGuest) return true;
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email for guest review'
    }
  },
  guestName: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        if (this.isGuest && !v) return false;
        return true;
      },
      message: 'Please provide your name for guest review'
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  userName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },
  productName: {
    type: String,
    trim: true,
    default: ''
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
    maxlength: 500
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  }],
  video: {
    url: {
      type: String,
      default: null
    },
    publicId: {
      type: String,
      default: null
    }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
   isFeatured: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  helpfulUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  moderationNote: {
    type: String,
    trim: true,
    default: ''
  },
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: {
    type: Date
  },
  reply: {
    text: {
      type: String,
      trim: true,
      default: ''
    },
    repliedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    repliedAt: {
      type: Date
    }
  }
}, {
  timestamps: true
});

// FIXED: Remove 'next' parameter - just use async function without 'next'
// In Mongoose, when using async/await in pre-save middleware, don't use 'next'
reviewSchema.pre('save', async function() {
  // For guest reviews, ensure user is null and guest fields are present
  if (this.isGuest) {
    this.user = null;
    // Don't throw error here, just validate
    if (!this.guestEmail || !this.guestName) {
      throw new Error('Guest reviews require guestEmail and guestName');
    }
  } else {
    // For logged-in users, ensure user is present and guest fields are null
    if (!this.user) {
      throw new Error('Logged-in reviews require a user ID');
    }
    this.guestEmail = null;
    this.guestName = null;
  }
});

// Indexes for better query performance
reviewSchema.index({ user: 1, createdAt: -1 });
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ status: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isApproved: 1 });
reviewSchema.index({ email: 1 });
reviewSchema.index({ isGuest: 1, guestEmail: 1 });

// Virtual for display name (handles anonymous reviews)
reviewSchema.virtual('displayName').get(function() {
  if (this.isAnonymous) {
    return 'Anonymous User';
  }
  return this.userName;
});

// Ensure virtuals are included in JSON output
reviewSchema.set('toJSON', { virtuals: true });
reviewSchema.set('toObject', { virtuals: true });

// Fix: Use mongoose.models to prevent overwriting model
module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);