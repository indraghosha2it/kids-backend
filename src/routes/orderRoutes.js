const express = require('express');
const router = express.Router();
const { protect, optionalProtect, isAdmin, isModeratorOrAdmin } = require('../middleware/authMiddleware');
const {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats
} = require('../controllers/orderController');

// ============= PUBLIC ROUTES (with optional auth) =============
router.post('/', optionalProtect, createOrder);
router.get('/', optionalProtect, getUserOrders);
router.get('/:id', optionalProtect, getOrderById);
router.put('/:id/cancel', optionalProtect, cancelOrder);

// ============= PROTECTED ROUTES (Admin/Moderator only) =============
router.get('/admin/all', protect, isModeratorOrAdmin, getAllOrders);
router.get('/admin/stats', protect, isAdmin, getOrderStats);
router.put('/:id/status', protect, isModeratorOrAdmin, updateOrderStatus);
router.put('/:id/payment', protect, isModeratorOrAdmin, updatePaymentStatus);

module.exports = router;