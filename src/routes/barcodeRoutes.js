const express = require('express');
const router = express.Router();
const { protect, isModeratorOrAdmin, isAdmin } = require('../middleware/authMiddleware');
const {
  generateBarcodes,
  getAvailableBarcodes,
  getAssignedBarcodes,
  validateBarcode,
  getBarcodeStats,
  releaseBarcode,
  deleteBarcode
} = require('../controllers/barcodeController');

// Public routes
router.get('/validate/:barcodeNumber', validateBarcode);

// Protected routes
router.use(protect);

// Stats (admin only)
router.get('/stats', isAdmin, getBarcodeStats);

// Generate barcodes (moderator/admin) - Always CODE128
router.post('/generate', isModeratorOrAdmin, generateBarcodes);

// Get barcodes
router.get('/available', isModeratorOrAdmin, getAvailableBarcodes);
router.get('/assigned', isModeratorOrAdmin, getAssignedBarcodes);

// Single barcode operations
router.put('/:barcodeNumber/release', isModeratorOrAdmin, releaseBarcode);
router.delete('/:barcodeNumber', isAdmin, deleteBarcode);

module.exports = router;