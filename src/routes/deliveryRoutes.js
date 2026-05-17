const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getDeliverySettings,
  updateDeliverySettings
} = require('../controllers/deliveryController');

// Public route - get delivery settings
router.get('/settings', getDeliverySettings);

// Admin only route - update delivery settings
router.put('/settings', protect, isAdmin, updateDeliverySettings);

module.exports = router;