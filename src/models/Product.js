

// module.exports = mongoose.model('Product', productSchema);
const mongoose = require('mongoose');

// Counter Schema for sequential SKU generation
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Review Schema
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true
  },
  comment: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    publicId: String
  }],
  isVerifiedPurchase: {
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Additional Info Schema
const additionalInfoSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
    trim: true
  },
  fieldValue: {
    type: String,
    required: true,
    trim: true
  }
});

// Meta Settings Schema
const metaSettingsSchema = new mongoose.Schema({
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [70, 'Meta title should not exceed 70 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description should not exceed 160 characters']
  },
  metaKeywords: [{
    type: String,
    trim: true
  }]
});

// Main Product Schema (Toy Product)
const productSchema = new mongoose.Schema({
  // Basic Information
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    trim: true
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required'],
    trim: true
  },

  // Categories
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  categoryName: {
    type: String,
    trim: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category.subcategories'
  },
  subcategoryName: {
    type: String,
    trim: true
  },
  childSubcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category.subcategories.children'
  },
  childSubcategoryName: {
    type: String,
    trim: true
  },

  // Brand & Age
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  ageGroup: {
    type: String,
    required: [true, 'Age group is required'],
    enum: ['0-2', '3-5', '6-10', '11-14']
  },

  // Pricing
  regularPrice: {
    type: Number,
    required: [true, 'Regular price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: [0, 'Discount price cannot be negative']
  },
  
  // Inventory
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  skuCode: {
    type: String,
    unique: true,
    sparse: true
  },

  // Delivery
 deliveryInfo: {
  type: String,
  required: [true, 'Delivery information is required'],
  trim: true
},
codAvailable: {
  type: Boolean,
  default: false
},

  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  videoUrl: {
    type: String,
    default: ''
  },
  videoPublicId: {
    type: String,
    default: ''
  },
  videoType: {
    type: String,
    enum: ['upload', 'youtube'],
    default: 'upload'
  },

  // Tags & Promotions
  tags: [{
    type: String,
    enum: [
      'Best Seller', 'New Arrival', 'Limited Edition', 'Eco-Friendly',
      'Educational', 'STEM Toy', 'Montessori', 'Creative Play',
      'Outdoor Fun', 'Battery Included', 'Non-Toxic', 'Award Winner',
      'Musical Toy', 'Interactive', 'Light Up', 'Remote Control',
      'Building Set', 'Puzzle Game', 'Art & Craft', 'Pretend Play'
    ]
  }],
  promotion: {
    type: String,
    enum: ['flash-sale', 'new-arrival', 'trending', 'clearance', 'holiday-special', 'bundle-deal', 'limited-stock', ''],
    default: ''
  },
  isFeatured: {
    type: Boolean,
    default: false
  },

  // Rating
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  // Additional Information
  additionalInfo: [additionalInfoSchema],

  // Meta Settings
  metaSettings: metaSettingsSchema,

  // Reviews & Stats
  reviews: [reviewSchema],
  reviewStats: {
    averageRating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    ratingDistribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },

  // Status flags
  isActive: {
    type: Boolean,
    default: true
  },

  // Tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Meta
  views: {
    type: Number,
    default: 0
  },
  purchaseCount: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

// Create slug and generate SKU before saving
productSchema.pre('save', async function() {
  // Generate slug
  if (this.isModified('productName')) {
    this.slug = this.productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  
  // Initialize metaSettings as empty object if not exists
  if (!this.metaSettings) {
    this.metaSettings = {};
  }
  
  // Generate sequential SKU only if not provided (always generate for new products)
  if (!this.skuCode || this.isNew) {
    try {
      // Get base prefix (you can customize this based on category if needed)
      const basePrefix = 'TOY';
      // Use timestamp for unique prefix per batch/day (optional)
      const timestamp = Date.now().toString().slice(0, 5); // First 5 digits of timestamp
      
      // Counter ID combines prefix and timestamp for uniqueness
      const counterId = `${basePrefix}_${timestamp}`;
      
      // Get and increment the counter atomically
      const counter = await Counter.findByIdAndUpdate(
        counterId,
        { $inc: { sequence_value: 1 } },
        { new: true, upsert: true }
      );
      
      // Start from 900 to ensure 3-digit numbers (900, 901, 902...)
      // This gives you from TOY-91185-900 to TOY-91185-999 (100 products)
      const sequenceNumber = 900 + counter.sequence_value;
      
      // Generate SKU: TOY-91185-921
      this.skuCode = `${basePrefix}-${timestamp}-${sequenceNumber}`;
      
      console.log(`Generated SKU: ${this.skuCode} for product: ${this.productName}`);
    } catch (error) {
      console.error('Error generating sequential SKU:', error);
      // Fallback to random SKU if counter fails
      this.skuCode = `TOY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  }
});

// Calculate discount percentage (virtual)
productSchema.virtual('discountPercentage').get(function() {
  if (this.regularPrice > 0 && this.discountPrice > 0 && this.discountPrice < this.regularPrice) {
    return Math.round(((this.regularPrice - this.discountPrice) / this.regularPrice) * 100);
  }
  return 0;
});

// Check stock status (virtual)
productSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity <= 0) return 'Out of Stock';
  if (this.stockQuantity <= 10) return 'Low Stock';
  return 'In Stock';
});

// Indexes for search
productSchema.index({ productName: 'text', brand: 'text', fullDescription: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ ageGroup: 1 });
productSchema.index({ regularPrice: 1 });
productSchema.index({ discountPrice: 1 });
productSchema.index({ skuCode: 1 });

module.exports = mongoose.model('Product', productSchema);