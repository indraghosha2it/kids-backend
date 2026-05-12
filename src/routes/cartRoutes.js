// const express = require('express');
// const router = express.Router();
// const { protect } = require('../middleware/authMiddleware');
// const {
//   getCartItems,
//   addToCart,
//   updateCartItem,
//   removeFromCart,
//   clearCart,
//   mergeCart
// } = require('../controllers/cartController');

// // Public routes (with session support)
// router.get('/', getCartItems);
// router.post('/', addToCart);
// router.put('/:itemId', updateCartItem);
// router.delete('/:itemId', removeFromCart);
// router.delete('/', clearCart);

// // Protected routes
// router.post('/merge', protect, mergeCart);

// module.exports = router;



const express = require('express');
const router = express.Router();
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
  checkCartStatus
} = require('../controllers/cartController');

// Use optionalProtect for routes that need to know if user is logged in
router.get('/', optionalProtect, getCartItems);
router.post('/', optionalProtect, addToCart);

// Fully protected routes
router.put('/:itemId', protect, updateCartItem);
router.delete('/:itemId', protect, removeFromCart);
router.delete('/', protect, clearCart);
router.post('/merge', protect, mergeCart);
router.post('/check-status', optionalProtect, checkCartStatus);


module.exports = router;