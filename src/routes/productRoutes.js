

// // module.exports = router;
// // D:\kids-site\kids-backend\src\routes\productRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect, isModeratorOrAdmin, isAdmin } = require('../middleware/authMiddleware');
// const {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
//   addProductReview,
//   getProductsByAgeGroup,
//   getFlashSaleProducts,
//   getFeaturedProducts,
//   getTrendingProducts
// } = require('../controllers/productController');

// // ============= PUBLIC ROUTES =============
// router.get('/', getProducts);
// router.get('/featured', getFeaturedProducts);
// router.get('/flash-sale', getFlashSaleProducts);
// router.get('/trending', getTrendingProducts);
// router.get('/age/:ageGroup', getProductsByAgeGroup);
// router.get('/:id', getProductById);

// // ============= PROTECTED ROUTES =============
// // All routes below require authentication
// router.use(protect);

// // Review route
// router.post('/:id/review', addProductReview);

// // Moderator/Admin routes
// router.post('/', isModeratorOrAdmin, createProduct);
// router.put('/:id', isModeratorOrAdmin, updateProduct);

// // Admin only routes
// router.delete('/:id', isAdmin, deleteProduct);

// // Add these routes after other routes
// // Barcode validation for product creation
// router.get('/validate-barcode/:barcodeNumber', async (req, res) => {
//   try {
//     const { barcodeNumber } = req.params;
//     const Barcode = require('../models/Barcode');
//     const Product = require('../models/Product');
    
//     // Check if barcode is already used
//     const existingProduct = await Product.findOne({ barcode: barcodeNumber });
//     const existingBarcode = await Barcode.findOne({ barcodeNumber });
    
//     let isAvailable = true;
//     let message = 'Barcode is available';
    
//     if (existingProduct) {
//       isAvailable = false;
//       message = `Barcode already assigned to: ${existingProduct.productName}`;
//     } else if (existingBarcode && existingBarcode.status === 'assigned') {
//       isAvailable = false;
//       message = `Barcode already assigned to: ${existingBarcode.productName}`;
//     } else if (existingBarcode && existingBarcode.status !== 'available') {
//       isAvailable = false;
//       message = `Barcode is ${existingBarcode.status}`;
//     }
    
//     res.json({
//       success: true,
//       data: { isAvailable, message, existsInSystem: !!existingBarcode }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });



// // Get product by SKU
// router.get('/sku/:sku', async (req, res) => {
//   try {
//     const { sku } = req.params;
    
//     const product = await Product.findOne({ skuCode: sku })
//       .populate('category', 'name slug');
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found for this SKU'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     console.error('Get product by SKU error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// // Get product by barcode - Also search by barcode field
// router.get('/barcode/:barcode', async (req, res) => {
//   try {
//     const { barcode } = req.params;
    
//     const product = await Product.findOne({ 
//       $or: [
//         { barcode: barcode },
//         { skuCode: barcode }
//       ]
//     }).populate('category', 'name slug');
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found for this barcode/SKU'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     console.error('Get product by barcode error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

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

// ============= BARCODE & SKU SEARCH ROUTES (PUBLIC) =============
// These need to be ABOVE the /:id route to avoid conflicts

// Get product by barcode (also searches SKU as fallback)
router.get('/barcode/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;
    const Product = require('../models/Product');
    
    console.log('Searching for barcode/SKU:', barcode);
    
    const product = await Product.findOne({ 
      $or: [
        { barcode: barcode },
        { skuCode: barcode }
      ]
    }).populate('category', 'name slug');
    
    if (!product) {
      console.log('Product not found for:', barcode);
      return res.status(404).json({
        success: false,
        error: 'Product not found for this barcode/SKU'
      });
    }
    
    console.log('Product found:', product.productName);
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by barcode error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get product by SKU
router.get('/sku/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    const Product = require('../models/Product');
    
    const product = await Product.findOne({ skuCode: sku })
      .populate('category', 'name slug');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found for this SKU'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by SKU error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Validate barcode for product creation
router.get('/validate-barcode/:barcodeNumber', async (req, res) => {
  try {
    const { barcodeNumber } = req.params;
    const Barcode = require('../models/Barcode');
    const Product = require('../models/Product');
    
    // Check if barcode is already used
    const existingProduct = await Product.findOne({ barcode: barcodeNumber });
    const existingBarcode = await Barcode.findOne({ barcodeNumber });
    
    let isAvailable = true;
    let message = 'Barcode is available';
    
    if (existingProduct) {
      isAvailable = false;
      message = `Barcode already assigned to: ${existingProduct.productName}`;
    } else if (existingBarcode && existingBarcode.status === 'assigned') {
      isAvailable = false;
      message = `Barcode already assigned to: ${existingBarcode.productName}`;
    } else if (existingBarcode && existingBarcode.status !== 'available') {
      isAvailable = false;
      message = `Barcode is ${existingBarcode.status}`;
    }
    
    res.json({
      success: true,
      data: { isAvailable, message, existsInSystem: !!existingBarcode }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;