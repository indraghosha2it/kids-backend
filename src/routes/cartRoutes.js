



// const express = require('express');
// const router = express.Router();
// const { protect, optionalProtect } = require('../middleware/authMiddleware');
// const {
//   getCartItems,
//   addToCart,
//   updateCartItem,
//   removeFromCart,
//   clearCart,
//   mergeCart,
//   checkCartStatus
// } = require('../controllers/cartController');

// // Use optionalProtect for routes that need to know if user is logged in
// router.get('/', optionalProtect, getCartItems);
// router.post('/', optionalProtect, addToCart);

// // Fully protected routes
// router.put('/:itemId', protect, updateCartItem);
// router.delete('/:itemId', protect, removeFromCart);
// router.delete('/', protect, clearCart);
// router.post('/merge', protect, mergeCart);
// router.post('/check-status', optionalProtect, checkCartStatus);


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

// Use optionalProtect for ALL routes - allows both guests and logged-in users
router.get('/', optionalProtect, getCartItems);
router.post('/', optionalProtect, addToCart);
router.put('/:itemId', optionalProtect, updateCartItem);
router.delete('/:itemId', optionalProtect, removeFromCart);
router.delete('/', optionalProtect, clearCart);
router.post('/merge', protect, mergeCart); // This still needs full auth
router.post('/check-status', optionalProtect, checkCartStatus);

module.exports = router;