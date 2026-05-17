const DeliverySettings = require('../models/DeliverySettings');

// @desc    Get delivery settings
// @route   GET /api/delivery/settings
// @access  Public
const getDeliverySettings = async (req, res) => {
  try {
    const settings = await DeliverySettings.getSettings();
    res.json({
      success: true,
      data: {
        insideDhaka: settings.insideDhaka,
        outsideDhaka: settings.outsideDhaka
      }
    });
  } catch (error) {
    console.error('Get delivery settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update delivery settings (Admin only)
// @route   PUT /api/delivery/settings
// @access  Private (Admin only)
const updateDeliverySettings = async (req, res) => {
  try {
    const { insideDhaka, outsideDhaka } = req.body;
    
    let settings = await DeliverySettings.findOne();
    
    if (!settings) {
      settings = new DeliverySettings();
    }
    
    if (insideDhaka !== undefined) settings.insideDhaka = insideDhaka;
    if (outsideDhaka !== undefined) settings.outsideDhaka = outsideDhaka;
    settings.updatedBy = req.user._id;
    settings.lastUpdated = new Date();
    
    await settings.save();
    
    res.json({
      success: true,
      data: {
        insideDhaka: settings.insideDhaka,
        outsideDhaka: settings.outsideDhaka
      },
      message: 'Delivery settings updated successfully'
    });
  } catch (error) {
    console.error('Update delivery settings error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getDeliverySettings,
  updateDeliverySettings
};