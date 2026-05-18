const express = require('express');
const router = express.Router();
const { protect, authorize, isModeratorOrAdmin, optionalProtect } = require('../middleware/authMiddleware');
const {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  markHelpful,
  replyToReview,
  getMyReviews,
  uploadMedia,
  getReviewStats
} = require('../controllers/reviewController');

// ============= PUBLIC ROUTES =============
router.get('/', optionalProtect, getReviews);
router.get('/stats', getReviewStats);
router.get('/:id', optionalProtect, getReviewById);

// ============= CREATE REVIEW - PUBLIC (Supports both guest and logged-in) =============
router.post('/', optionalProtect, createReview);  // Changed from 'protect' to 'optionalProtect'

// ============= PROTECTED ROUTES (Authenticated users only) =============
router.use(protect);

// User routes
router.get('/my-reviews', getMyReviews);
router.put('/:id', updateReview);
router.put('/:id/helpful', markHelpful);
router.post('/upload-media', uploadMedia);

// ============= ADMIN/MODERATOR ONLY ROUTES =============
router.delete('/:id', isModeratorOrAdmin, deleteReview);
router.put('/:id/approve', isModeratorOrAdmin, approveReview);
router.put('/:id/reject', isModeratorOrAdmin, rejectReview);
router.post('/:id/reply', isModeratorOrAdmin, replyToReview);

module.exports = router;