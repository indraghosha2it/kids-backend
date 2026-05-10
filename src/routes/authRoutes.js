// const express = require('express');
// const router = express.Router();
// const {
//   registerUser,
//   loginUser,
//   getMe,
//   updateProfile,
//   changePassword,
//   verifyEmail,
//   forgotPassword,
//   resetPassword,
//   logoutUser
// } = require('../controllers/authController');
// const { protect, authorize } = require('../middleware/authMiddleware');

// // Public routes
// router.post('/register', registerUser);
// router.post('/login', loginUser);
// router.get('/verify-email/:token', verifyEmail);
// router.post('/forgot-password', forgotPassword);
// router.post('/reset-password/:token', resetPassword);

// // Protected routes
// router.get('/me', protect, getMe);
// router.put('/profile', protect, updateProfile);
// router.put('/change-password', protect, changePassword);
// router.post('/logout', protect, logoutUser);

// // Admin only route
// router.get('/users', protect, authorize('admin'), (req, res) => {
//   res.json({ message: 'Admin only route' });
// });

// module.exports = router;



// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyOTP,
  resendOTP,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyResetOTP,
   googleAuth,
  completeProfile,
  logoutUser,
  googleSignup,
  checkProfileStatus,
  adminCreateCustomer,

    subscribeToNewsletter,
  unsubscribeFromNewsletter,
  getSubscriptionStatus
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);
router.post('/google', googleAuth);
router.post('/complete-profile', protect, completeProfile);
router.post('/google-signup', googleSignup);
// Add this route with the other routes

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/logout', protect, logoutUser);
router.get('/profile-status', protect, checkProfileStatus);



// ADD THESE NEW SUBSCRIPTION ROUTES (Protected)
router.post('/subscribe', protect, subscribeToNewsletter);
router.post('/unsubscribe', protect, unsubscribeFromNewsletter);
router.get('/subscription-status', protect, getSubscriptionStatus);

// Admin only route
router.post('/admin/create-customer', protect, authorize('admin'), adminCreateCustomer);

router.get('/users', protect, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin only route' });
});

module.exports = router;