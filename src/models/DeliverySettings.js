const mongoose = require('mongoose');

const deliverySettingsSchema = new mongoose.Schema({
  insideDhaka: {
    type: Number,
    required: true,
    default: 70,
    min: 0
  },
  outsideDhaka: {
    type: Number,
    required: true,
    default: 150,
    min: 0
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
deliverySettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({
      insideDhaka: 70,
      outsideDhaka: 150
    });
  }
  return settings;
};

module.exports = mongoose.models.DeliverySettings || mongoose.model('DeliverySettings', deliverySettingsSchema);