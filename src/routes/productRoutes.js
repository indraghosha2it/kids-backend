// const express = require('express');
// const router = express.Router();
// const { protect, isModeratorOrAdmin, isAdmin } = require('../middleware/authMiddleware');
// const { uploadMultiple } = require('../config/cloudinary'); // Import the new multiple upload
// const {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,

//   toggleProductStatus,
//   getProductsByCategory
// } = require('../controllers/productController');

// // Public routes
// router.get('/', getProducts);
// router.get('/category/:categoryId', getProductsByCategory);
// router.get('/:id', getProductById);

// // All routes below require authentication
// router.use(protect);

// // Create product - Moderators and Admins
// router.post('/', 
//   isModeratorOrAdmin,
//   // uploadMultiple('images', 4), 
//   createProduct
// );

// // Update product - Moderators can update own, Admins can update any
// router.put('/:id', 
//   isModeratorOrAdmin,
//   // uploadMultiple('images', 4),
//   updateProduct
// );

// // Admin only routes
// router.delete('/:id', isAdmin, deleteProduct);
// router.put('/:id/toggle', isAdmin, toggleProductStatus);

// module.exports = router;
// D:\kids-site\kids-backend\src\routes\productRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isModeratorOrAdmin, isAdmin } = require('../middleware/authMiddleware');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  getProductsByAgeGroup,
  getFlashSaleProducts,
  getFeaturedProducts,
  getTrendingProducts
} = require('../controllers/productController');

// ============= PUBLIC ROUTES =============
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/trending', getTrendingProducts);
router.get('/age/:ageGroup', getProductsByAgeGroup);
router.get('/:id', getProductById);

// ============= PROTECTED ROUTES =============
// All routes below require authentication
router.use(protect);

// Review route
router.post('/:id/review', addProductReview);

// Moderator/Admin routes
router.post('/', isModeratorOrAdmin, createProduct);
router.put('/:id', isModeratorOrAdmin, updateProduct);

// Admin only routes
router.delete('/:id', isAdmin, deleteProduct);

module.exports = router;