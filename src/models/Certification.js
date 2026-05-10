// models/Certification.js
const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  // Basic Info
  name: {
    type: String,
    required: [true, 'Certification name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['Quality', 'Organic', 'Ethical', 'Environmental', 'Safety', 'Trade', 'Sustainability', 'Other'],
    default: 'Quality'
  },
  issuingAuthority: {
    type: String,
    required: [true, 'Issuing authority is required'],
    trim: true
  },
  
  // Media
  logo: {
    type: String,
    required: [true, 'Certification logo is required']
  },
  logoPublicId: {
    type: String,
    required: true
  },
  certificateFile: {
    type: String,
    default: ''
  },
  certificateFilePublicId: {
    type: String,
    default: ''
  },
  
  // Content
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  badgeText: {
    type: String,
    default: 'Certified',
    trim: true
  },
  
  // Dates
  issueDate: {
    type: Date,
    default: null
  },
  expiryDate: {
    type: Date,
    default: null
  },
  
  // Verification
  certificateNumber: {
    type: String,
    trim: true,
    default: ''
  },
  verificationLink: {
    type: String,
    trim: true,
    default: ''
  },
  country: {
    type: String,
    trim: true,
    default: ''
  },
  
  // Display Settings
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  
  // Tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create slug from name
certificationSchema.pre('save', function() {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
});

const Certification = mongoose.models.Certification || mongoose.model('Certification', certificationSchema);

module.exports = Certification;