// kids-backend/src/controllers/skuController.js
const Product = require('../models/Product');

// Get Counter model
const getCounterModel = () => {
  const Counter = require('../models/Product').Counter;
  return Counter;
};

// Generate unique SKU - FIXED VERSION
const generateUniqueSku = async (req, res) => {
  try {
    // First, find the last created product to get the latest SKU
    const lastProduct = await Product.findOne({ 
      skuCode: { $regex: /^TOY-/ } 
    }).sort({ createdAt: -1 });
    
    let newSkuCode;
    
    if (lastProduct && lastProduct.skuCode) {
      // Extract sequence number from last SKU
      const lastSku = lastProduct.skuCode;
      const parts = lastSku.split('-');
      
      if (parts.length === 3) {
        const lastSequence = parseInt(parts[2]);
        if (!isNaN(lastSequence)) {
          // Increment by 1
          const newSequence = lastSequence + 1;
          const timestamp = Date.now().toString().slice(0, 5);
          newSkuCode = `TOY-${timestamp}-${newSequence}`;
          
          // Verify this new SKU doesn't exist (double-check)
          const existing = await Product.findOne({ skuCode: newSkuCode });
          if (!existing) {
            return res.json({
              success: true,
              data: { skuCode: newSkuCode }
            });
          }
        }
      }
    }
    
    // Fallback: Use timestamp + random if no previous SKU found
    const timestamp = Date.now().toString().slice(0, 5);
    const randomNum = Math.floor(Math.random() * 1000);
    newSkuCode = `TOY-${timestamp}-${900 + randomNum}`;
    
    // Ensure uniqueness
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 5) {
      const existing = await Product.findOne({ skuCode: newSkuCode });
      if (!existing) {
        isUnique = true;
      } else {
        // Regenerate if exists
        const newRandom = Math.floor(Math.random() * 1000);
        newSkuCode = `TOY-${timestamp}-${900 + newRandom}`;
      }
      attempts++;
    }
    
    res.json({
      success: true,
      data: { skuCode: newSkuCode }
    });
    
  } catch (error) {
    console.error('Generate SKU error:', error);
    // Ultimate fallback
    const fallbackSku = `TOY-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    res.json({
      success: true,
      data: { skuCode: fallbackSku }
    });
  }
};

// Alternative: Get next sequence number without incrementing Counter
const getNextSkuSequence = async () => {
  const lastProduct = await Product.findOne({ 
    skuCode: { $regex: /^TOY-/ } 
  }).sort({ createdAt: -1 });
  
  if (lastProduct && lastProduct.skuCode) {
    const parts = lastProduct.skuCode.split('-');
    if (parts.length === 3) {
      const lastSeq = parseInt(parts[2]);
      if (!isNaN(lastSeq)) {
        return lastSeq + 1;
      }
    }
  }
  return 901; // Starting sequence
};

// Validate SKU uniqueness
const validateSku = async (req, res) => {
  try {
    const { skuCode } = req.params;
    const { excludeId } = req.query;
    
    const query = { skuCode };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existingProduct = await Product.findOne(query);
    
    res.json({
      success: true,
      data: {
        isUnique: !existingProduct,
        message: existingProduct ? `SKU already used by: ${existingProduct.productName}` : 'SKU is available'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = { generateUniqueSku, validateSku };