const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Helper to get cart for user or session
const getCart = async (userId, sessionId) => {
  let query = {};
  if (userId) {
    query = { userId };
  } else if (sessionId) {
    query = { sessionId };
  } else {
    return null;
  }
  
  return await Cart.findOne(query);
};

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Public (with sessionId) or Private (with token)
// const getCartItems = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     if (!userId && !sessionId) {
//       return res.status(200).json({ success: true, data: { items: [], totalItems: 0, subtotal: 0 } });
//     }
    
//     const cart = await getCart(userId, sessionId);
    
//     if (!cart) {
//       return res.status(200).json({ success: true, data: { items: [], totalItems: 0, subtotal: 0 } });
//     }
    
//     res.json({ success: true, data: cart });
//   } catch (error) {
//     console.error('Get cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// @desc    Get user's cart
// @route   GET /api/cart
// @access  Public (with sessionId) or Private (with token)
// @desc    Get user's cart
// @route   GET /api/cart
// @access  Public (with sessionId) or Private (with token)
// @desc    Get user's cart
// @route   GET /api/cart
// @access  Public (with sessionId) or Private (with token)
// @desc    Get user's cart
// @route   GET /api/cart
// @access  Public (with sessionId) or Private (with token)
const getCartItems = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    console.log('=== GET CART ===');
    console.log('UserId:', userId);
    console.log('SessionId:', sessionId);
    
    let cart = null;
    
    if (userId) {
      // LOGGED IN USER - ONLY search by userId
      cart = await Cart.findOne({ userId });
      console.log('Searching for cart with userId:', userId);
      console.log('Cart found:', !!cart);
      if (cart) {
        console.log('Cart totalItems:', cart.totalItems);
      }
    } else if (sessionId) {
      // GUEST USER - ONLY search by sessionId
      cart = await Cart.findOne({ sessionId });
      console.log('Searching for cart with sessionId:', sessionId);
      console.log('Cart found:', !!cart);
      if (cart) {
        console.log('Cart totalItems:', cart.totalItems);
      }
    }
    
    if (!cart) {
      console.log('No cart found, returning empty cart');
      return res.status(200).json({ 
        success: true, 
        data: { items: [], totalItems: 0, subtotal: 0 } 
      });
    }
    
    // Remove _tempSessionId if exists
    if (cart._tempSessionId) {
      delete cart._tempSessionId;
    }
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};



// const addToCart = async (req, res) => {
//   console.log('=== ADD TO CART ===');
//   console.log('req.user:', req.user);
//   console.log('req.user?._id:', req.user?._id);
//   console.log('Authorization header:', req.headers.authorization);
  
//   try {
//     const { productId, quantity = 1 } = req.body;
//     const userId = req.user?._id;
    
//     if (!productId) {
//       return res.status(400).json({ success: false, error: 'Product ID is required' });
//     }
    
//     // Get product details
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }
    
//     if (product.stockQuantity < quantity) {
//       return res.status(400).json({ success: false, error: 'Insufficient stock' });
//     }
    
//     let cart;
    
//     if (userId) {
//       // LOGGED IN USER - Find or create cart by userId
//       console.log('Adding to cart for logged-in user:', userId);
//       cart = await Cart.findOne({ userId });
      
//       if (!cart) {
//         cart = new Cart({
//           userId: userId,
//           sessionId: null,
//           items: []
//         });
//         console.log('Created new cart for user:', userId);
//       }
//     } else {
//       // GUEST USER - Find or create cart by sessionId
//       let sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
      
//       if (!sessionId) {
//         sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
//       }
      
//       console.log('Adding to cart for guest user, sessionId:', sessionId);
//       cart = await Cart.findOne({ sessionId });
      
//       if (!cart) {
//         cart = new Cart({
//           userId: null,
//           sessionId: sessionId,
//           items: []
//         });
//         console.log('Created new cart for session:', sessionId);
//       }
      
//       // Set session cookie for guest
//       if (!req.headers['x-session-id']) {
//         res.cookie('sessionId', sessionId, {
//           httpOnly: true,
//           maxAge: 30 * 24 * 60 * 60 * 1000,
//           sameSite: 'lax'
//         });
//       }
      
//       // Store sessionId to return in response
//       cart._tempSessionId = sessionId;
//     }
    
//     // Check if product already in cart
//     const existingItemIndex = cart.items.findIndex(
//       item => item.productId.toString() === productId
//     );
    
//     if (existingItemIndex >= 0) {
//       // If product exists, just update quantity, don't increase totalItems count
//       const newQuantity = cart.items[existingItemIndex].quantity + quantity;
//       if (product.stockQuantity < newQuantity) {
//         return res.status(400).json({ success: false, error: 'Insufficient stock' });
//       }
//       cart.items[existingItemIndex].quantity = newQuantity;
//       console.log('Updated existing item quantity to:', newQuantity);
//     } else {
//       // Add new item - this increases totalItems count
//       cart.items.push({
//         productId: product._id,
//         productName: product.productName,
//         productSlug: product.slug || product._id.toString(),
//         image: product.images && product.images[0]?.url || '',
//         regularPrice: product.regularPrice,
//         discountPrice: product.discountPrice || 0,
//         quantity: quantity,
//         stockQuantity: product.stockQuantity
//       });
//       console.log('Added new item to cart');
//     }
    
//     // Update totals - totalItems should be the number of unique items, not sum of quantities
//     cart.totalItems = cart.items.length; // This is the key fix
//     cart.subtotal = cart.items.reduce((sum, item) => {
//       const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
//       return sum + (price * (item.quantity || 0));
//     }, 0);
//     cart.updatedAt = new Date();
    
//     await cart.save();
    
//     console.log('Cart saved - Total items (unique):', cart.totalItems, 'User ID:', userId || 'guest');
    
//     // Prepare response
//     const responseData = {
//       success: true,
//       data: cart,
//       message: 'Item added to cart'
//     };
    
//     // Only send sessionId for guest users
//     if (!userId && cart._tempSessionId) {
//       responseData.sessionId = cart._tempSessionId;
//       delete cart._tempSessionId;
//     }
    
//     res.json(responseData);
    
//   } catch (error) {
//     console.error('Add to cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

const addToCart = async (req, res) => {
  console.log('=== ADD TO CART ===');
  console.log('req.user:', req.user);
  console.log('req.user?._id:', req.user?._id);
  console.log('Authorization header:', req.headers.authorization);
  
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user?._id;
    
    if (!productId) {
      return res.status(400).json({ success: false, error: 'Product ID is required' });
    }
    
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    // Check stock
    if (product.stockQuantity < 1) {
      return res.status(400).json({ success: false, error: 'Product out of stock' });
    }
    
    let cart;
    
    if (userId) {
      // LOGGED IN USER - Find or create cart by userId
      console.log('Adding to cart for logged-in user:', userId);
      cart = await Cart.findOne({ userId });
      
      if (!cart) {
        cart = new Cart({
          userId: userId,
          sessionId: null,
          items: []
        });
        console.log('Created new cart for user:', userId);
      }
    } else {
      // GUEST USER - Find or create cart by sessionId
      let sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
      
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      }
      
      console.log('Adding to cart for guest user, sessionId:', sessionId);
      cart = await Cart.findOne({ sessionId });
      
      if (!cart) {
        cart = new Cart({
          userId: null,
          sessionId: sessionId,
          items: []
        });
        console.log('Created new cart for session:', sessionId);
      }
      
      // Set session cookie for guest
      if (!req.headers['x-session-id']) {
        res.cookie('sessionId', sessionId, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: 'lax'
        });
      }
      
      // Store sessionId to return in response
      cart._tempSessionId = sessionId;
    }
    
    // Check if product already in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    
    if (existingItemIndex >= 0) {
      // PRODUCT ALREADY EXISTS - DO NOT INCREASE QUANTITY
      // Just return a message that product is already in cart
      console.log('Product already in cart, not adding again');
      
      // Prepare response
      const responseData = {
        success: true,
        data: cart,
        message: 'Product already in cart',
        alreadyInCart: true
      };
      
      // Only send sessionId for guest users
      if (!userId && cart._tempSessionId) {
        responseData.sessionId = cart._tempSessionId;
        delete cart._tempSessionId;
      }
      
      return res.json(responseData);
    } else {
      // Add new item - quantity always 1
      cart.items.push({
        productId: product._id,
        productName: product.productName,
        productSlug: product.slug || product._id.toString(),
        image: product.images && product.images[0]?.url || '',
        regularPrice: product.regularPrice,
        discountPrice: product.discountPrice || 0,
        quantity: 1, // Always start with quantity 1
        stockQuantity: product.stockQuantity
      });
      console.log('Added new item to cart');
    }
    
    // Update totals - totalItems should be the number of unique items
    cart.totalItems = cart.items.length;
    cart.subtotal = cart.items.reduce((sum, item) => {
      const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
      return sum + (price * (item.quantity || 0));
    }, 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    
    console.log('Cart saved - Total items (unique):', cart.totalItems, 'User ID:', userId || 'guest');
    
    // Prepare response
    const responseData = {
      success: true,
      data: cart,
      message: 'Item added to cart'
    };
    
    // Only send sessionId for guest users
    if (!userId && cart._tempSessionId) {
      responseData.sessionId = cart._tempSessionId;
      delete cart._tempSessionId;
    }
    
    res.json(responseData);
    
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    // Allow both authenticated and guest users
    let cart;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return res.status(401).json({ success: false, error: 'Cart not found' });
    }
    
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    if (itemIndex === -1) {
      return res.status(404).json({ success: false, error: 'Item not found in cart' });
    }
    
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const product = await Product.findById(cart.items[itemIndex].productId);
      if (product && product.stockQuantity < quantity) {
        return res.status(400).json({ success: false, error: 'Insufficient stock' });
      }
      cart.items[itemIndex].quantity = quantity;
    }
    
    // Recalculate totals
   cart.totalItems = cart.items.length; // Number of unique items, not sum of quantities
cart.subtotal = cart.items.reduce((sum, item) => {
  const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
  return sum + (price * (item.quantity || 0));
}, 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Public (with sessionId) or Private (with token)
// const removeFromCart = async (req, res) => {
//   try {
//     const { itemId } = req.params;
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     if (!userId && !sessionId) {
//       return res.status(401).json({ success: false, error: 'Cart not found' });
//     }
    
//     const cart = await getCart(userId, sessionId);
//     if (!cart) {
//       return res.status(404).json({ success: false, error: 'Cart not found' });
//     }
    
//     cart.items = cart.items.filter(item => item._id.toString() !== itemId);
//     await cart.save();
    
//     res.json({ success: true, data: cart });
//   } catch (error) {
//     console.error('Remove from cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Public (with sessionId) or Private (with token)
const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    console.log('Removing item - UserId:', userId, 'SessionId:', sessionId);
    
    // Allow both authenticated and guest users
    let cart;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    } else {
      return res.status(401).json({ success: false, error: 'Cart not found' });
    }
    
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    const originalLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    console.log('Items before:', originalLength, 'Items after:', cart.items.length);
    
    // Recalculate totals
   cart.totalItems = cart.items.length; // Number of unique items remaining
cart.subtotal = cart.items.reduce((sum, item) => {
  const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
  return sum + (price * (item.quantity || 0));
}, 0);
    cart.updatedAt = new Date();
    
    await cart.save();
    
    console.log('Cart saved - Total items:', cart.totalItems, 'Subtotal:', cart.subtotal);
    
    res.json({ success: true, data: cart });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Public (with sessionId) or Private (with token)
// const clearCart = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     if (!userId && !sessionId) {
//       return res.status(401).json({ success: false, error: 'Cart not found' });
//     }
    
//     const cart = await getCart(userId, sessionId);
//     if (cart) {
//       cart.items = [];
//       await cart.save();
//     }
    
//     res.json({ success: true, message: 'Cart cleared' });
//   } catch (error) {
//     console.error('Clear cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };
// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Public (with sessionId) or Private (with token)
const clearCart = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    if (!userId && !sessionId) {
      return res.status(401).json({ success: false, error: 'Cart not found' });
    }
    
    const cart = await getCart(userId, sessionId);
    if (cart) {
      cart.items = [];
      cart.totalItems = 0;
      cart.subtotal = 0;
      cart.updatedAt = new Date();
      await cart.save();
    }
    
    res.json({ success: true, message: 'Cart cleared', data: { items: [], totalItems: 0, subtotal: 0 } });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// const mergeCart = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const sessionId = req.body.sessionId;
    
//     console.log('Merging cart for user:', userId, 'SessionId:', sessionId);
    
//     if (!sessionId) {
//       return res.json({ success: true, message: 'No guest cart to merge' });
//     }
    
//     // Find guest cart
//     const guestCart = await Cart.findOne({ sessionId });
    
//     if (!guestCart || guestCart.items.length === 0) {
//       return res.json({ success: true, message: 'No items to merge' });
//     }
    
//     console.log('Guest cart has', guestCart.items.length, 'items');
    
//     // Find user cart
//     let userCart = await Cart.findOne({ userId });
    
//     if (!userCart) {
//       // Convert guest cart to user cart
//       guestCart.userId = userId;
//       guestCart.sessionId = null;
//       userCart = guestCart;
      
//       // Update totals
//       userCart.totalItems = userCart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//       userCart.subtotal = userCart.items.reduce((sum, item) => {
//         const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
//         return sum + (price * (item.quantity || 0));
//       }, 0);
      
//       await userCart.save();
//     } else {
//       // Merge items from guest cart to user cart
//       for (const guestItem of guestCart.items) {
//         const existingItemIndex = userCart.items.findIndex(
//           item => item.productId.toString() === guestItem.productId.toString()
//         );
        
//         if (existingItemIndex >= 0) {
//           userCart.items[existingItemIndex].quantity += guestItem.quantity;
//         } else {
//           userCart.items.push(guestItem);
//         }
//       }
      
//       // Update totals
//       userCart.totalItems = userCart.items.reduce((sum, item) => sum + (item.quantity || 0), 0);
//       userCart.subtotal = userCart.items.reduce((sum, item) => {
//         const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
//         return sum + (price * (item.quantity || 0));
//       }, 0);
      
//       await userCart.save();
      
//       // Delete guest cart
//       await guestCart.deleteOne();
//     }
    
//     console.log('Cart merged successfully. User cart now has', userCart.totalItems, 'items');
    
//     res.json({ 
//       success: true, 
//       message: 'Cart merged successfully',
//       data: userCart
//     });
//   } catch (error) {
//     console.error('Merge cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// Add to cartController.js


// @desc    Merge guest cart with user cart after login
// @route   POST /api/cart/merge
// @access  Private

// 2
// const mergeCart = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const sessionId = req.body.sessionId;
    
//     console.log('Merging cart for user:', userId, 'SessionId:', sessionId);
    
//     if (!sessionId) {
//       return res.json({ success: true, message: 'No guest cart to merge' });
//     }
    
//     // Find guest cart
//     const guestCart = await Cart.findOne({ sessionId });
    
//     if (!guestCart || guestCart.items.length === 0) {
//       return res.json({ success: true, message: 'No items to merge' });
//     }
    
//     console.log('Guest cart has', guestCart.items.length, 'items');
    
//     // Find user cart
//     let userCart = await Cart.findOne({ userId });
    
//     if (!userCart) {
//       // Convert guest cart to user cart
//       guestCart.userId = userId;
//       guestCart.sessionId = null;
//       userCart = guestCart;
      
//       // Update totals - IMPORTANT: Use length, not sum of quantities
//       userCart.totalItems = userCart.items.length; // Number of unique items
//       userCart.subtotal = userCart.items.reduce((sum, item) => {
//         const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
//         return sum + (price * (item.quantity || 0));
//       }, 0);
      
//       await userCart.save();
//     } else {
//       // Merge items from guest cart to user cart
//       for (const guestItem of guestCart.items) {
//         const existingItemIndex = userCart.items.findIndex(
//           item => item.productId.toString() === guestItem.productId.toString()
//         );
        
//         if (existingItemIndex >= 0) {
//           // Product exists - just update quantity, don't add new item
//           userCart.items[existingItemIndex].quantity += guestItem.quantity;
//         } else {
//           // New product - add to cart
//           userCart.items.push(guestItem);
//         }
//       }
      
//       // Update totals - IMPORTANT: Use length, not sum of quantities
//       userCart.totalItems = userCart.items.length; // Number of unique items
//       userCart.subtotal = userCart.items.reduce((sum, item) => {
//         const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
//         return sum + (price * (item.quantity || 0));
//       }, 0);
      
//       await userCart.save();
      
//       // Delete guest cart
//       await guestCart.deleteOne();
//     }
    
//     console.log('Cart merged successfully. User cart now has', userCart.totalItems, 'unique items');
    
//     res.json({ 
//       success: true, 
//       message: 'Cart merged successfully',
//       data: userCart
//     });
//   } catch (error) {
//     console.error('Merge cart error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


// @desc    Merge guest cart with user cart after login
// @route   POST /api/cart/merge
// @access  Private
const mergeCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const sessionId = req.body.sessionId;
    
    console.log('Merging cart for user:', userId, 'SessionId:', sessionId);
    
    if (!sessionId) {
      return res.json({ success: true, message: 'No guest cart to merge' });
    }
    
    // Find guest cart
    const guestCart = await Cart.findOne({ sessionId });
    
    if (!guestCart || guestCart.items.length === 0) {
      return res.json({ success: true, message: 'No items to merge' });
    }
    
    console.log('Guest cart has', guestCart.items.length, 'items');
    
    // Find user cart
    let userCart = await Cart.findOne({ userId });
    
    if (!userCart) {
      // Convert guest cart to user cart
      guestCart.userId = userId;
      guestCart.sessionId = null;
      userCart = guestCart;
      
      // Update totals
      userCart.totalItems = userCart.items.length;
      userCart.subtotal = userCart.items.reduce((sum, item) => {
        const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
        return sum + (price * (item.quantity || 0));
      }, 0);
      
      await userCart.save();
    } else {
      // Merge items from guest cart to user cart - WITHOUT adding quantities
      for (const guestItem of guestCart.items) {
        const existingItemIndex = userCart.items.findIndex(
          item => item.productId.toString() === guestItem.productId.toString()
        );
        
        if (existingItemIndex >= 0) {
          // Product already exists in user cart - DO NOT MERGE/INCREASE QUANTITY
          // Just skip this item (keep the existing one)
          console.log(`Product ${guestItem.productName} already in user cart, skipping merge`);
          continue; // Skip adding this duplicate product
        } else {
          // New product - add to cart with quantity 1
          userCart.items.push({
            productId: guestItem.productId,
            productName: guestItem.productName,
            productSlug: guestItem.productSlug,
            image: guestItem.image,
            regularPrice: guestItem.regularPrice,
            discountPrice: guestItem.discountPrice,
            quantity: 1, // Always set to 1, not guestItem.quantity
            stockQuantity: guestItem.stockQuantity
          });
          console.log(`Added new product ${guestItem.productName} to user cart`);
        }
      }
      
      // Update totals
      userCart.totalItems = userCart.items.length;
      userCart.subtotal = userCart.items.reduce((sum, item) => {
        const price = (item.discountPrice && item.discountPrice > 0) ? item.discountPrice : (item.regularPrice || 0);
        return sum + (price * (item.quantity || 0));
      }, 0);
      
      await userCart.save();
      
      // Delete guest cart
      await guestCart.deleteOne();
    }
    
    console.log('Cart merged successfully. User cart now has', userCart.totalItems, 'unique items');
    
    res.json({ 
      success: true, 
      message: 'Cart merged successfully',
      data: userCart
    });
  } catch (error) {
    console.error('Merge cart error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const checkCartStatus = async (req, res) => {
  try {
    const { productIds } = req.body;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    let cart = null;
    if (userId) {
      cart = await Cart.findOne({ userId });
    } else if (sessionId) {
      cart = await Cart.findOne({ sessionId });
    }
    
    const inCartMap = {};
    if (cart && cart.items) {
      productIds.forEach(productId => {
        inCartMap[productId] = cart.items.some(item => item.productId.toString() === productId);
      });
    } else {
      productIds.forEach(productId => {
        inCartMap[productId] = false;
      });
    }
    
    res.json({ success: true, data: inCartMap });
  } catch (error) {
    console.error('Check cart status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add route in cartRoutes.js

module.exports = {
  getCartItems,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
checkCartStatus
};



