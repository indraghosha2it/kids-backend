const InquiryCart = require('../models/InquiryCart');
const Inquiry = require('../models/Inquiry');
const Product = require('../models/Product');
const { sendInquirySubmissionEmails } = require('../utils/emailService');
// @desc    Get user's inquiry cart
// @route   GET /api/inquiry-cart
// @access  Private
// @desc    Get user's inquiry cart
// @route   GET /api/inquiry-cart
// @access  Private
const getCart = async (req, res) => {
  try {
    let cart = await InquiryCart.findOne({ userId: req.user.id });
    
    if (!cart) {
      cart = await InquiryCart.create({
        userId: req.user.id,
        items: []
      });
    }

    console.log(`Cart for user ${req.user.id} has ${cart.items.length} items`); // Debug log

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error fetching cart'
    });
  }
};




// @route   POST /api/inquiry-cart/add
// @access  Private  before color based quantity
// const addToCart = async (req, res) => {
//   try {
//     const { productId, productName, colors, unitPrice, moq, productImage, specialInstructions } = req.body;

//     console.log('📦 Add to cart request received:', { 
//       userId: req.user.id, 
//       productId, 
//       colorsCount: colors?.length,
//       colorsData: JSON.stringify(colors)
//     });

//     // Get product details to verify
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     // Validate colors array
//     if (!colors || !Array.isArray(colors) || colors.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'At least one color with quantities is required'
//       });
//     }

//     // Find or create cart
//     let cart = await InquiryCart.findOne({ userId: req.user.id });
//     if (!cart) {
//       cart = new InquiryCart({ userId: req.user.id, items: [] });
//       console.log('🆕 Created new cart for user');
//     }

//     // Format colors data properly and calculate totals
//     let formattedColors = [];
//     let calculatedTotalQuantity = 0;
    
//     formattedColors = colors.map(colorItem => {
//       const colorObj = colorItem.color || {};
      
//       // Process size quantities
//       let sizeQuantitiesArray = [];
      
//       if (colorItem.sizeQuantities) {
//         if (Array.isArray(colorItem.sizeQuantities)) {
//           sizeQuantitiesArray = colorItem.sizeQuantities.map(sq => ({
//             size: sq.size || '',
//             quantity: parseInt(sq.quantity) || 0
//           }));
//         } else if (typeof colorItem.sizeQuantities === 'object') {
//           sizeQuantitiesArray = Object.entries(colorItem.sizeQuantities).map(([size, qty]) => ({
//             size: size,
//             quantity: parseInt(qty) || 0
//           }));
//         }
//       }
      
//       // Filter out entries with empty size
//       sizeQuantitiesArray = sizeQuantitiesArray.filter(sq => sq.size && sq.size.trim() !== '');
      
//       // Calculate total for this color
//       const colorTotal = sizeQuantitiesArray.reduce((sum, sq) => sum + (sq.quantity || 0), 0);
      
//       // Add to overall total
//       calculatedTotalQuantity += colorTotal;

//       return {
//         color: {
//           code: colorObj.code || '#CCCCCC',
//           name: colorObj.name || colorObj.code || 'Unknown Color'
//         },
//         sizeQuantities: sizeQuantitiesArray,
//         totalForColor: colorTotal,
//         totalQuantity: colorTotal // Add both fields for compatibility
//       };
//     }).filter(colorItem => colorItem.sizeQuantities.length > 0);

//     console.log('🎨 Formatted colors:', JSON.stringify(formattedColors, null, 2));
//     console.log('📊 Calculated total quantity:', calculatedTotalQuantity);

//     if (formattedColors.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'No valid colors with quantities provided'
//       });
//     }

//     // Determine the correct unit price based on the calculated total quantity
//     let updatedUnitPrice = unitPrice || product.pricePerUnit;
    
//     if (product.quantityBasedPricing && product.quantityBasedPricing.length > 0) {
//       const sortedTiers = [...product.quantityBasedPricing].sort((a, b) => {
//         const aMin = parseInt(a.range.split('-')[0] || a.range.replace('+', ''));
//         const bMin = parseInt(b.range.split('-')[0] || b.range.replace('+', ''));
//         return aMin - bMin;
//       });
      
//       for (const tier of sortedTiers) {
//         const range = tier.range;
//         if (range.includes('-')) {
//           const [min, max] = range.split('-').map(Number);
//           if (calculatedTotalQuantity >= min && calculatedTotalQuantity <= max) {
//             updatedUnitPrice = tier.price;
//             break;
//           }
//         } else if (range.includes('+')) {
//           const minQty = parseInt(range.replace('+', ''));
//           if (calculatedTotalQuantity >= minQty) {
//             updatedUnitPrice = tier.price;
//             break;
//           }
//         }
//       }
//     }

//     // Check if product already exists in cart
//     const existingItemIndex = cart.items.findIndex(item => 
//       item.productId.toString() === productId
//     );

//     console.log('🔍 Looking for existing product. Found at index:', existingItemIndex);

//     if (existingItemIndex > -1) {
//       // PRODUCT EXISTS - UPDATE THE SPECIFIC COLOR
//       const existingItem = cart.items[existingItemIndex];
      
//       // Since we're updating a specific color, we need to merge properly
//       // The frontend sends ALL colors when updating, so we should replace the entire colors array
      
//       // Check if we're updating existing colors or adding new ones
//       // For update operations, we want to replace the colors completely
//       existingItem.colors = formattedColors;
      
//       // Recalculate total quantity
//       existingItem.totalQuantity = existingItem.colors.reduce(
//         (sum, color) => sum + (color.totalForColor || color.totalQuantity || 0), 
//         0
//       );
      
//       // Update unit price based on new total
//       if (product.quantityBasedPricing && product.quantityBasedPricing.length > 0) {
//         const sortedTiers = [...product.quantityBasedPricing].sort((a, b) => {
//           const aMin = parseInt(a.range.split('-')[0] || a.range.replace('+', ''));
//           const bMin = parseInt(b.range.split('-')[0] || b.range.replace('+', ''));
//           return aMin - bMin;
//         });
        
//         for (const tier of sortedTiers) {
//           const range = tier.range;
//           if (range.includes('-')) {
//             const [min, max] = range.split('-').map(Number);
//             if (existingItem.totalQuantity >= min && existingItem.totalQuantity <= max) {
//               existingItem.unitPrice = tier.price;
//               break;
//             }
//           } else if (range.includes('+')) {
//             const minQty = parseInt(range.replace('+', ''));
//             if (existingItem.totalQuantity >= minQty) {
//               existingItem.unitPrice = tier.price;
//               break;
//             }
//           }
//         }
//       }
      
//       // Update special instructions if provided
//       if (specialInstructions !== undefined) {
//         existingItem.specialInstructions = specialInstructions;
//       }

//       cart.markModified(`items.${existingItemIndex}`);
      
//       console.log('🔄 Updated existing product. Now has colors:', existingItem.colors.length);
//       console.log('📊 New total quantity:', existingItem.totalQuantity);
//       console.log('💰 New unit price:', existingItem.unitPrice);
      
//     } else {
//       // NEW PRODUCT - Add as new item
//       const newItem = {
//         productId,
//         productName: product.productName,
//         colors: formattedColors,
//         totalQuantity: calculatedTotalQuantity,
//         unitPrice: updatedUnitPrice,
//         moq,
//         productImage: productImage || (product.images && product.images.length > 0 ? product.images[0].url : null),
//         specialInstructions: specialInstructions || ''
//       };
      
//       cart.items.push(newItem);
//       console.log('➕ Added new product with', formattedColors.length, 'colors');
//     }

//     await cart.save();
    
//     console.log('✅ Cart saved successfully. Final items:', cart.items.map(item => ({
//       productId: item.productId,
//       productName: item.productName,
//       colorsCount: item.colors?.length || 0,
//       totalQty: item.totalQuantity
//     })));

//     res.json({
//       success: true,
//       data: cart,
//       message: existingItemIndex > -1 ? 'Cart updated successfully' : 'Product added to cart'
//     });
    
//   } catch (error) {
//     console.error('❌ Add to cart error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Error adding item to cart'
//     });
//   }
// };


// @desc    Add item to cart (with per-color pricing)
// @route   POST /api/inquiry-cart/add
// @desc    Add item to cart (groups all colors under one product)
// @route   POST /api/inquiry-cart/add
// @access  Private
// const addToCart = async (req, res) => {
//   try {
//     const { productId, productName, colors, unitPrice, moq, productImage, specialInstructions } = req.body;

//     console.log('📦 Add to cart request received:', { 
//       userId: req.user.id, 
//       productId, 
//       colorsCount: colors?.length,
//     });

//     // Get product details
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     // Validate colors array
//     if (!colors || !Array.isArray(colors) || colors.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'At least one color with quantities is required'
//       });
//     }

//     // Find or create cart
//     let cart = await InquiryCart.findOne({ userId: req.user.id });
//     if (!cart) {
//       cart = new InquiryCart({ userId: req.user.id, items: [] });
//       console.log('🆕 Created new cart for user');
//     }

//     // Helper function to get price based on quantity
//     const getPriceForQuantity = (quantity) => {
//       if (!product.quantityBasedPricing || product.quantityBasedPricing.length === 0) {
//         return product.pricePerUnit;
//       }
      
//       const sortedTiers = [...product.quantityBasedPricing].sort((a, b) => {
//         const aMin = parseInt(a.range.split('-')[0] || a.range.replace('+', ''));
//         const bMin = parseInt(b.range.split('-')[0] || b.range.replace('+', ''));
//         return aMin - bMin;
//       });
      
//       for (const tier of sortedTiers) {
//         const range = tier.range;
//         if (range.includes('-')) {
//           const [min, max] = range.split('-').map(Number);
//           if (quantity >= min && quantity <= max) {
//             return tier.price;
//           }
//         } else if (range.includes('+')) {
//           const minQty = parseInt(range.replace('+', ''));
//           if (quantity >= minQty) {
//             return tier.price;
//           }
//         }
//       }
      
//       const highestTier = sortedTiers[sortedTiers.length - 1];
//       if (highestTier && highestTier.range.includes('-') && quantity > parseInt(highestTier.range.split('-')[1])) {
//         return highestTier.price;
//       }
      
//       return product.pricePerUnit;
//     };

//     // Format colors data properly - FIXED: Convert object to array
//     let formattedColors = [];
//     let calculatedTotalQuantity = 0;
    
//     formattedColors = colors.map(colorItem => {
//       const colorObj = colorItem.color || {};
      
//       // CRITICAL FIX: Convert sizeQuantities from OBJECT to ARRAY
//       let sizeQuantitiesArray = [];
      
//       if (colorItem.sizeQuantities) {
//         // Check if sizeQuantities is an object (key-value pairs)
//         if (typeof colorItem.sizeQuantities === 'object' && !Array.isArray(colorItem.sizeQuantities)) {
//           // Convert object to array
//           sizeQuantitiesArray = Object.entries(colorItem.sizeQuantities)
//             .filter(([size, qty]) => size && size.trim() !== '')
//             .map(([size, qty]) => ({
//               size: size,
//               quantity: parseInt(qty) || 0
//             }));
//         } 
//         // If it's already an array
//         else if (Array.isArray(colorItem.sizeQuantities)) {
//           sizeQuantitiesArray = colorItem.sizeQuantities.map(sq => ({
//             size: sq.size || '',
//             quantity: parseInt(sq.quantity) || 0
//           }));
//         }
//       }
      
//       // Filter out entries with zero quantity
//       sizeQuantitiesArray = sizeQuantitiesArray.filter(sq => sq.quantity > 0);
      
//       // Calculate total for this color
//       const colorTotal = sizeQuantitiesArray.reduce((sum, sq) => sum + (sq.quantity || 0), 0);
      
//       // Calculate unit price for this color based on its quantity
//       const colorUnitPrice = colorItem.unitPrice || getPriceForQuantity(colorTotal);
      
//       // Add to overall total
//       calculatedTotalQuantity += colorTotal;

//       console.log(`🎨 Color ${colorObj.code}: total=${colorTotal}, price=${colorUnitPrice}, sizes:`, sizeQuantitiesArray);

//       return {
//         color: {
//           code: colorObj.code || '#CCCCCC',
//           name: colorObj.name || colorObj.code || 'Unknown Color'
//         },
//         sizeQuantities: sizeQuantitiesArray,
//         totalForColor: colorTotal,
//         totalQuantity: colorTotal,
//         unitPrice: colorUnitPrice
//       };
//     }).filter(colorItem => colorItem.sizeQuantities.length > 0);

//     console.log('🎨 Formatted colors:', JSON.stringify(formattedColors, null, 2));

//     if (formattedColors.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'No valid colors with quantities provided'
//       });
//     }

//     // Check if product already exists in cart
//     const existingItemIndex = cart.items.findIndex(item => 
//       item.productId.toString() === productId
//     );

//     if (existingItemIndex > -1) {
//       // PRODUCT EXISTS - Merge colors
//       const existingItem = cart.items[existingItemIndex];
//       const existingColors = existingItem.colors || [];
      
//       // Merge colors: update existing or add new
//       const updatedColors = [...existingColors];
      
//       formattedColors.forEach(newColor => {
//         const existingColorIndex = updatedColors.findIndex(
//           existingColor => existingColor.color.code === newColor.color.code
//         );
        
//         if (existingColorIndex > -1) {
//           // Update existing color
//           updatedColors[existingColorIndex] = newColor;
//           console.log(`🔄 Updated existing color: ${newColor.color.code}`);
//         } else {
//           // Add new color
//           updatedColors.push(newColor);
//           console.log(`➕ Added new color: ${newColor.color.code}`);
//         }
//       });
      
//       existingItem.colors = updatedColors;
      
//       // Recalculate total quantity
//       existingItem.totalQuantity = existingItem.colors.reduce(
//         (sum, color) => sum + (color.totalForColor || 0), 
//         0
//       );
      
//       // Keep base unit price for reference
//       existingItem.unitPrice = product.pricePerUnit;
      
//       if (specialInstructions !== undefined) {
//         existingItem.specialInstructions = specialInstructions;
//       }

//       cart.markModified(`items.${existingItemIndex}`);
      
//     } else {
//       // NEW PRODUCT
//       const newItem = {
//         productId,
//         productName: product.productName,
//         colors: formattedColors,
//         totalQuantity: calculatedTotalQuantity,
//         unitPrice: product.pricePerUnit,
//         moq,
//         productImage: productImage || (product.images && product.images.length > 0 ? product.images[0].url : null),
//         specialInstructions: specialInstructions || ''
//       };
      
//       cart.items.push(newItem);
//       console.log('➕ Added new product with', formattedColors.length, 'colors');
//     }

//     await cart.save();
    
//     console.log('✅ Cart saved. Items count:', cart.items.length);
//     console.log('📊 Cart data:', JSON.stringify(cart, null, 2));

//     res.json({
//       success: true,
//       data: cart,
//       message: existingItemIndex > -1 ? 'Cart updated successfully' : 'Product added to cart'
//     });
    
//   } catch (error) {
//     console.error('❌ Add to cart error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Error adding item to cart'
//     });
//   }
// };

// controllers/inquiryCartController.js - Updated addToCart function

// @desc    Add item to cart (supports both piece-based and weight-based products)
// @route   POST /api/inquiry-cart/add
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { 
      productId, 
      productName, 
      colors, 
      unitPrice, 
      moq, 
      productImage, 
      specialInstructions,
      orderUnit = 'piece'  // Default to 'piece' if not provided
    } = req.body;

    console.log('📦 Add to cart request received:', { 
      userId: req.user.id, 
      productId, 
      orderUnit,
      colorsCount: colors?.length,
    });

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Validate colors array
    if (!colors || !Array.isArray(colors) || colors.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'At least one color with quantities is required'
      });
    }

    // Find or create cart
    let cart = await InquiryCart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = new InquiryCart({ userId: req.user.id, items: [] });
      console.log('🆕 Created new cart for user');
    }

    // Helper function to get price based on quantity
    const getPriceForQuantity = (quantity) => {
      if (!product.quantityBasedPricing || product.quantityBasedPricing.length === 0) {
        return product.pricePerUnit;
      }
      
      const sortedTiers = [...product.quantityBasedPricing].sort((a, b) => {
        const aMin = parseInt(a.range.split('-')[0] || a.range.replace('+', ''));
        const bMin = parseInt(b.range.split('-')[0] || b.range.replace('+', ''));
        return aMin - bMin;
      });
      
      for (const tier of sortedTiers) {
        const range = tier.range;
        if (range.includes('-')) {
          const [min, max] = range.split('-').map(Number);
          if (quantity >= min && quantity <= max) {
            return tier.price;
          }
        } else if (range.includes('+')) {
          const minQty = parseInt(range.replace('+', ''));
          if (quantity >= minQty) {
            return tier.price;
          }
        }
      }
      
      return product.pricePerUnit;
    };

    // Format colors data based on order unit type
    let formattedColors = [];
    let calculatedTotalQuantity = 0;
    
    formattedColors = colors.map(colorItem => {
      const colorObj = colorItem.color || {};
      let colorTotal = 0;
      let sizeQuantitiesArray = [];
      let simpleQuantity = 0;
      
      // Check if this is weight-based (kg/ton) or piece-based
      const isWeightBased = orderUnit === 'kg' || orderUnit === 'ton';
      
      if (isWeightBased) {
        // Weight-based: use simple quantity
        simpleQuantity = colorItem.totalQuantity || colorItem.quantity || 0;
        colorTotal = simpleQuantity;
      } else {
        // Piece-based: process size quantities
        if (colorItem.sizeQuantities) {
          // Handle both object and array formats
          if (typeof colorItem.sizeQuantities === 'object' && !Array.isArray(colorItem.sizeQuantities)) {
            // Convert object to array
            sizeQuantitiesArray = Object.entries(colorItem.sizeQuantities)
              .filter(([size, qty]) => size && size.trim() !== '' && qty > 0)
              .map(([size, qty]) => ({
                size: size,
                quantity: parseInt(qty) || 0
              }));
          } else if (Array.isArray(colorItem.sizeQuantities)) {
            sizeQuantitiesArray = colorItem.sizeQuantities
              .filter(sq => sq.size && sq.size.trim() !== '' && sq.quantity > 0)
              .map(sq => ({
                size: sq.size,
                quantity: parseInt(sq.quantity) || 0
              }));
          }
        }
        
        colorTotal = sizeQuantitiesArray.reduce((sum, sq) => sum + (sq.quantity || 0), 0);
      }
      
      // If no quantity, skip this color
      if (colorTotal === 0) return null;
      
      // Calculate unit price for this color based on its quantity
      const colorUnitPrice = colorItem.unitPrice || getPriceForQuantity(colorTotal);
      
      // Add to overall total
      calculatedTotalQuantity += colorTotal;

      console.log(`🎨 Color ${colorObj.code}: total=${colorTotal}, price=${colorUnitPrice}, isWeightBased=${isWeightBased}`);

      const colorData = {
        color: {
          code: colorObj.code || '#CCCCCC',
          name: colorObj.name || colorObj.code || 'Unknown Color'
        },
        totalForColor: colorTotal,
        totalQuantity: colorTotal,
        unitPrice: colorUnitPrice
      };
      
      if (isWeightBased) {
        colorData.quantity = simpleQuantity;
        colorData.sizeQuantities = [];
      } else {
        colorData.sizeQuantities = sizeQuantitiesArray;
        colorData.quantity = 0;
      }
      
      return colorData;
    }).filter(color => color !== null);

    console.log('🎨 Formatted colors:', JSON.stringify(formattedColors, null, 2));

    if (formattedColors.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No valid colors with quantities provided'
      });
    }

    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(item => 
      item.productId.toString() === productId
    );

    if (existingItemIndex > -1) {
      // PRODUCT EXISTS - Merge colors
      const existingItem = cart.items[existingItemIndex];
      const existingColors = existingItem.colors || [];
      
      // Merge colors: update existing or add new
      const updatedColors = [...existingColors];
      
      formattedColors.forEach(newColor => {
        const existingColorIndex = updatedColors.findIndex(
          existingColor => existingColor.color.code === newColor.color.code
        );
        
        if (existingColorIndex > -1) {
          // Update existing color
          updatedColors[existingColorIndex] = newColor;
          console.log(`🔄 Updated existing color: ${newColor.color.code}`);
        } else {
          // Add new color
          updatedColors.push(newColor);
          console.log(`➕ Added new color: ${newColor.color.code}`);
        }
      });
      
      existingItem.colors = updatedColors;
      existingItem.orderUnit = orderUnit;
      
      // Recalculate total quantity
      existingItem.totalQuantity = existingItem.colors.reduce(
        (sum, color) => sum + (color.totalQuantity || 0), 
        0
      );
      
      // Keep base unit price for reference
      existingItem.unitPrice = product.pricePerUnit;
      
      if (specialInstructions !== undefined) {
        existingItem.specialInstructions = specialInstructions;
      }

      cart.markModified(`items.${existingItemIndex}`);
      
    } else {
      // NEW PRODUCT
      const newItem = {
        productId,
        productName: product.productName,
        orderUnit: orderUnit,
        colors: formattedColors,
        totalQuantity: calculatedTotalQuantity,
        unitPrice: product.pricePerUnit,
        moq,
        productImage: productImage || (product.images && product.images.length > 0 ? product.images[0].url : null),
        specialInstructions: specialInstructions || ''
      };
      
      cart.items.push(newItem);
      console.log('➕ Added new product with', formattedColors.length, 'colors, orderUnit:', orderUnit);
    }

    await cart.save();
    
    console.log('✅ Cart saved. Items count:', cart.items.length);

    res.json({
      success: true,
      data: cart,
      message: existingItemIndex > -1 ? 'Cart updated successfully' : 'Product added to cart'
    });
    
  } catch (error) {
    console.error('❌ Add to cart error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error adding item to cart'
    });
  }
};




// @desc    Update cart item
// @route   PUT /api/inquiry-cart/item/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { sizeQuantities, totalQuantity } = req.body;

    const cart = await InquiryCart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    // Update item
    if (sizeQuantities) cart.items[itemIndex].sizeQuantities = sizeQuantities;
    if (totalQuantity) cart.items[itemIndex].totalQuantity = totalQuantity;

    await cart.save();

    res.json({
      success: true,
      data: cart,
      message: 'Cart updated successfully'
    });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error updating cart'
    });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/inquiry-cart/item/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;

    const cart = await InquiryCart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save();

    res.json({
      success: true,
      data: cart,
      message: 'Item removed from cart'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error removing item'
    });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/inquiry-cart/clear
// @access  Private
const clearCart = async (req, res) => {
  try {
    const cart = await InquiryCart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    cart.items = [];
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error clearing cart'
    });
  }
};


// const submitInquiry = async (req, res) => {
//   try {
//     const { specialInstructions, attachments } = req.body;

//     console.log('📝 Submitting inquiry for user:', req.user.id);

//     // Get user's cart
//     const cart = await InquiryCart.findOne({ userId: req.user.id });
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'Cart is empty'
//       });
//     }

//     // DEBUG: Log cart structure to see what's in the cart
//     console.log('🛒 CART STRUCTURE:', JSON.stringify({
//       items: cart.items.map(item => ({
//         productId: item.productId,
//         productName: item.productName,
//         colorsCount: item.colors?.length || 0,
//         colors: item.colors?.map(c => ({
//           color: c.color,
//           totalForColor: c.totalForColor,
//           totalQuantity: c.totalQuantity,
//           unitPrice: c.unitPrice,
//           sizeQuantities: c.sizeQuantities
//         }))
//       }))
//     }, null, 2));

//     // Get user details
//     const userDetails = {
//       companyName: req.user.companyName || '',
//       contactPerson: req.user.contactPerson || '',
//       email: req.user.email || '',
//       phone: req.user.phone || '',
//       whatsapp: req.user.whatsapp || '',
//       country: req.user.country || '',
//       address: req.user.address || '',
//       city: req.user.city || '',
//       zipCode: req.user.zipCode || ''
//     };

//     console.log('🔍 User email for notifications:', userDetails.email);

//     // CRITICAL FIX: Map cart items to inquiry items PRESERVING unitPrice and totalQuantity
//     const inquiryItems = cart.items.map(cartItem => {
//       // Ensure colors array exists and has data - PRESERVE ALL FIELDS
//       const colors = (cartItem.colors || []).map(color => {
//         // Calculate total for this color from sizeQuantities if not already set
//         const colorTotal = color.totalForColor || 
//           color.totalQuantity ||
//           (color.sizeQuantities || []).reduce((sum, sq) => sum + (sq.quantity || 0), 0);
        
//         return {
//           color: {
//             code: color.color?.code || '#CCCCCC',
//             name: color.color?.name || color.color?.code || 'Unknown Color'
//           },
//           sizeQuantities: (color.sizeQuantities || [])
//             .filter(sq => sq.quantity > 0) // Only include non-zero quantities
//             .map(sq => ({
//               size: sq.size,
//               quantity: sq.quantity
//             })),
//           totalForColor: colorTotal,
//           totalQuantity: colorTotal,  // ← PRESERVE totalQuantity
//           unitPrice: color.unitPrice || 0  // ← PRESERVE unitPrice (CRITICAL!)
//         };
//       }).filter(color => color.sizeQuantities.length > 0); // Only include colors with quantities

//       return {
//         productId: cartItem.productId,
//         productName: cartItem.productName,
//         colors: colors,
//         totalQuantity: cartItem.totalQuantity || 0,
//         unitPrice: cartItem.unitPrice || 0,
//         moq: cartItem.moq || 0,
//         productImage: cartItem.productImage || '',
//         specialInstructions: cartItem.specialInstructions || ''
//       };
//     }).filter(item => item.colors.length > 0); // Only include items with colors

//     console.log('📦 INQUIRY ITEMS WITH PER-COLOR PRICING:', JSON.stringify({
//       items: inquiryItems.map(item => ({
//         productName: item.productName,
//         colorsCount: item.colors.length,
//         colors: item.colors.map(c => ({
//           color: c.color.code,
//           totalForColor: c.totalForColor,
//           totalQuantity: c.totalQuantity,
//           unitPrice: c.unitPrice,  // ← Now showing unitPrice
//           sizeCount: c.sizeQuantities.length
//         }))
//       }))
//     }, null, 2));

//     // Calculate totals using PER-COLOR pricing (not product unitPrice)
//     const totalQuantity = inquiryItems.reduce((sum, item) => sum + item.totalQuantity, 0);
    
//     // CRITICAL: Calculate subtotal based on each color's quantity × its unit price
//     const subtotal = inquiryItems.reduce((total, item) => {
//       const itemTotal = item.colors.reduce((sum, color) => {
//         const colorQty = color.totalQuantity || color.totalForColor || 0;
//         const colorPrice = color.unitPrice || 0;
//         const colorSubtotal = colorQty * colorPrice;
//         console.log(`   Color ${color.color.code}: ${colorQty} × ${colorPrice} = ${colorSubtotal}`);
//         return sum + colorSubtotal;
//       }, 0);
//       return total + itemTotal;
//     }, 0);

//     console.log(`📊 Total Quantity: ${totalQuantity}`);
//     console.log(`💰 Calculated Subtotal (per-color pricing): ${subtotal}`);

//     // Create inquiry
//     const inquiry = new Inquiry({
//       userId: req.user.id,
//       userDetails,
//       items: inquiryItems,
//       specialInstructions: specialInstructions || '',
//       attachments: attachments || [],
//       totalItems: inquiryItems.length,
//       totalQuantity: totalQuantity,
//       subtotal: subtotal,  // ← Now using per-color calculated total
//       status: 'submitted'
//     });

//     await inquiry.save();

//     console.log('✅ Inquiry created successfully:', inquiry.inquiryNumber);
//     console.log('💾 SAVED INQUIRY:', JSON.stringify({
//       inquiryNumber: inquiry.inquiryNumber,
//       subtotal: inquiry.subtotal,
//       items: inquiry.items.map(item => ({
//         productName: item.productName,
//         colorsCount: item.colors.length,
//         colors: item.colors.map(c => ({
//           color: c.color.code,
//           totalForColor: c.totalForColor,
//           totalQuantity: c.totalQuantity,
//           unitPrice: c.unitPrice  // ← Verify this is saved
//         }))
//       }))
//     }, null, 2));

//     // Clear the cart after successful submission
//     cart.items = [];
//     cart.totalItems = 0;
//     cart.totalQuantity = 0;
//     cart.estimatedTotal = 0;
//     await cart.save();

//     // --- EMAIL NOTIFICATIONS ---
//     try {
//       console.log('📧 SENDING EMAILS NOW...');
//       const { sendInquirySubmissionEmails } = require('../utils/emailService');
//       const emailResult = await sendInquirySubmissionEmails(inquiry, userDetails);
//       console.log('📧 Email result:', emailResult);
//     } catch (emailError) {
//       console.error('❌ Email sending error:', emailError.message);
//     }
//     // --- END EMAIL NOTIFICATIONS ---

//     res.status(201).json({
//       success: true,
//       data: {
//         inquiryId: inquiry._id,
//         inquiryNumber: inquiry.inquiryNumber,
//         status: inquiry.status
//       },
//       message: 'Inquiry submitted successfully'
//     });

//   } catch (error) {
//     console.error('❌ Submit inquiry error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Error submitting inquiry'
//     });
//   }
// };


// In your inquiryCartController.js - UPDATED submitInquiry function
const submitInquiry = async (req, res) => {
  try {
    const { specialInstructions, attachments } = req.body;

    console.log('📝 Submitting inquiry for user:', req.user.id);

    // Get user's cart
    const cart = await InquiryCart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Cart is empty'
      });
    }

    // DEBUG: Log cart data to see what's there
    console.log('🛒 CART DATA:', JSON.stringify(cart, null, 2));

    // Get user details from req.user
    const userDetails = {
      companyName: req.user.companyName || '',
      contactPerson: req.user.contactPerson || '',
      email: req.user.email || '',
      phone: req.user.phone || '',
      whatsapp: req.user.whatsapp || '',
      country: req.user.country || '',
      address: req.user.address || '',
      city: req.user.city || '',
      zipCode: req.user.zipCode || ''
    };

    // IMPORTANT: Preserve ALL fields from cart, especially unitPrice and totalQuantity
    const inquiryItems = cart.items.map(cartItem => {
      console.log(`📦 Processing product: ${cartItem.productName}`);
      console.log(`   Cart item colors:`, JSON.stringify(cartItem.colors, null, 2));
      
      return {
        productId: cartItem.productId,
        productName: cartItem.productName,
        colors: cartItem.colors.map(color => ({
          color: {
            code: color.color?.code || '#CCCCCC',
            name: color.color?.name || color.color?.code || 'Unknown Color'
          },
          sizeQuantities: (color.sizeQuantities || [])
            .filter(sq => sq.quantity > 0)
            .map(sq => ({
              size: sq.size,
              quantity: sq.quantity
            })),
          totalForColor: color.totalQuantity || color.totalForColor || 0,
          totalQuantity: color.totalQuantity || color.totalForColor || 0,
          unitPrice: color.unitPrice || 0,
          // For weight-based products
          quantity: color.quantity || 0
        })),
        totalQuantity: cartItem.totalQuantity || 0,
        unitPrice: cartItem.unitPrice || 0,
        moq: cartItem.moq || 0,
        productImage: cartItem.productImage || '',
        specialInstructions: cartItem.specialInstructions || '',
        orderUnit: cartItem.orderUnit || 'piece'  // IMPORTANT: Preserve order unit
      };
    });

    // Calculate totals using per-color pricing
    const totalQuantity = inquiryItems.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
    
    // Calculate subtotal based on per-color pricing
    const subtotal = inquiryItems.reduce((total, item) => {
      const itemTotal = item.colors.reduce((sum, color) => {
        let colorQty = color.totalQuantity || color.totalForColor || color.quantity || 0;
        let colorPrice = color.unitPrice || 0;
        const colorSubtotal = colorQty * colorPrice;
        console.log(`   Color ${color.color.code}: ${colorQty} × ${colorPrice} = ${colorSubtotal}`);
        return sum + colorSubtotal;
      }, 0);
      return total + itemTotal;
    }, 0);

    console.log(`📦 Creating inquiry with ${inquiryItems.length} products`);
    console.log(`💰 Total quantity: ${totalQuantity}`);
    console.log(`💰 Calculated subtotal using per-color pricing: ${subtotal}`);

    // Create inquiry
    const inquiry = new Inquiry({
      userId: req.user.id,
      userDetails,
      items: inquiryItems,
      specialInstructions: specialInstructions || '',
      attachments: attachments || [],
      totalItems: inquiryItems.length,
      totalQuantity: totalQuantity,
      subtotal: subtotal,
      status: 'submitted'
    });

    await inquiry.save();

    console.log('✅ Inquiry created successfully:', inquiry.inquiryNumber);
    console.log('💾 Saved inquiry:', JSON.stringify({
      inquiryNumber: inquiry.inquiryNumber,
      itemsCount: inquiry.items.length,
      totalQuantity: inquiry.totalQuantity,
      subtotal: inquiry.subtotal
    }, null, 2));

     try {
      console.log('📧 SENDING EMAIL NOTIFICATIONS...');
      const emailResult = await sendInquirySubmissionEmails(inquiry, userDetails);
      console.log('📧 Email result:', emailResult);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      // Don't fail the request if email fails
    }

    // Clear the cart after successful submission
    cart.items = [];
    cart.totalItems = 0;
    cart.totalQuantity = 0;
    cart.estimatedTotal = 0;
    await cart.save();

    res.status(201).json({
      success: true,
      data: {
        inquiryId: inquiry._id,
        inquiryNumber: inquiry.inquiryNumber,
        status: inquiry.status
      },
      message: 'Inquiry submitted successfully'
    });
  } catch (error) {
    console.error('❌ Submit inquiry error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error submitting inquiry'
    });
  }
};


const uploadAttachment = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    console.log('📁 File uploaded to Cloudinary:', req.file);

    const attachment = {
      fileName: req.file.originalname,
      fileUrl: req.file.path, // Cloudinary URL
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      publicId: req.file.filename // Cloudinary public ID
    };

    res.json({
      success: true,
      data: attachment,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error uploading file'
    });
  }
};



// @desc    Remove a specific color from a cart item
// @route   DELETE /api/inquiry-cart/item/:itemId/color/:colorIndex
// @access  Private
const removeColorFromItem = async (req, res) => {
  try {
    const { itemId, colorIndex } = req.params;
    const index = parseInt(colorIndex);

    const cart = await InquiryCart.findOne({ userId: req.user.id });
    if (!cart) {
      return res.status(404).json({
        success: false,
        error: 'Cart not found'
      });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Item not found in cart'
      });
    }

    const item = cart.items[itemIndex];
    
    if (!item.colors || index < 0 || index >= item.colors.length) {
      return res.status(400).json({
        success: false,
        error: 'Invalid color index'
      });
    }

    // Remove the color
    item.colors.splice(index, 1);

    // Recalculate totals
    let newTotalQuantity = 0;
    if (item.colors.length > 0) {
      newTotalQuantity = item.colors.reduce((sum, color) => {
        return sum + (color.totalForColor || 0);
      }, 0);
      
      // Update each color's totalForColor
      item.colors.forEach(color => {
        color.totalForColor = color.sizeQuantities.reduce(
          (sum, sq) => sum + (sq.quantity || 0), 
          0
        );
      });
    }

    item.totalQuantity = newTotalQuantity;

    // If no colors left, remove entire item
    if (item.colors.length === 0) {
      cart.items.splice(itemIndex, 1);
    }

    // Recalculate cart totals
    cart.totalItems = cart.items.length;
    cart.totalQuantity = cart.items.reduce((sum, item) => sum + (item.totalQuantity || 0), 0);
    
    // Calculate estimated total based on per-color pricing
    cart.estimatedTotal = cart.items.reduce((total, item) => {
      const itemTotal = item.colors.reduce((sum, color) => {
        return sum + ((color.totalForColor || 0) * (color.unitPrice || 0));
      }, 0);
      return total + itemTotal;
    }, 0);

    await cart.save();

    res.json({
      success: true,
      data: cart,
      message: 'Color removed successfully'
    });
  } catch (error) {
    console.error('❌ Remove color error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Error removing color'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  submitInquiry,
  uploadAttachment,
  removeColorFromItem
};