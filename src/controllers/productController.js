

const Product = require('../models/Product');
const Category = require('../models/Category');

// Helper function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
      const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
      const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
      return publicId;
    }
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
  }
  return null;
};

// Add this helper function after the extractPublicIdFromUrl function
const updateEmbeddedProductInCategory = async (categoryId, productId, updateData) => {
  try {
    await Category.findOneAndUpdate(
      { 
        _id: categoryId,
        'products.productId': productId 
      },
      {
        $set: {
          'products.$.productName': updateData.productName,
          'products.$.shortDescription': updateData.shortDescription,
          'products.$.fullDescription': updateData.fullDescription,
          'products.$.brand': updateData.brand,
          'products.$.ageGroup': updateData.ageGroup,
          'products.$.regularPrice': updateData.regularPrice,
          'products.$.discountPrice': updateData.discountPrice,
          'products.$.stockQuantity': updateData.stockQuantity,
          'products.$.skuCode': updateData.skuCode,
          'products.$.deliveryInfo': updateData.deliveryInfo,
          'products.$.codAvailable': updateData.codAvailable,
          'products.$.tags': updateData.tags,
          'products.$.promotion': updateData.promotion,
          'products.$.isFeatured': updateData.isFeatured,
          'products.$.rating': updateData.rating,
          'products.$.additionalInfo': updateData.additionalInfo,
          'products.$.videoUrl': updateData.videoUrl,
          'products.$.videoPublicId': updateData.videoPublicId,
          'products.$.videoType': updateData.videoType,
          'products.$.images': updateData.images,
          'products.$.subcategoryId': updateData.subcategoryId,
          'products.$.subcategoryName': updateData.subcategoryName,
          'products.$.childSubcategoryId': updateData.childSubcategoryId,
          'products.$.childSubcategoryName': updateData.childSubcategoryName,
          'products.$.isActive': updateData.isActive,
          'products.$.updatedAt': new Date()
        }
      }
    );
  } catch (error) {
    console.error('Error updating embedded product:', error);
    throw error;
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Moderator/Admin)
// const createProduct = async (req, res) => {
//   try {
//     console.log('Create product request received');
//     console.log('Body:', req.body);

//     const {
//       productName,
//       shortDescription,
//       fullDescription,
//       category,
//       subcategory,
//       childSubcategory,
//       brand,
//       ageGroup,
//       stockQuantity,
//       skuCode,
//       regularPrice,
//       discountPrice,
//       deliveryInfo,
//       codAvailable,
//       tags,
//       promotion,
//       isFeatured,
//       rating,
//       additionalInfo,
//       videoUrl,
//       videoPublicId,
//       videoType,
//       metaSettings,
//       images
//     } = req.body;

//     // Validation
//     if (!productName) {
//       return res.status(400).json({ success: false, error: 'Product name is required' });
//     }
//      const existingProduct = await Product.findOne({ 
//       productName: { $regex: new RegExp(`^${productName}$`, 'i') } 
//     });
    
//     if (existingProduct) {
//       return res.status(400).json({ 
//         success: false, 
//         error: `Product name "${productName}" already exists. Please use a different product name.` 
//       });
//     }
//     if (!shortDescription || shortDescription === '<p></p>') {
//       return res.status(400).json({ success: false, error: 'Short description is required' });
//     }
//     if (!fullDescription || fullDescription === '<p></p>') {
//       return res.status(400).json({ success: false, error: 'Full description is required' });
//     }
//     if (!category) {
//       return res.status(400).json({ success: false, error: 'Category is required' });
//     }
//     if (!brand) {
//       return res.status(400).json({ success: false, error: 'Brand is required' });
//     }
//     if (!ageGroup) {
//       return res.status(400).json({ success: false, error: 'Age group is required' });
//     }
//     if (regularPrice <= 0) {
//       return res.status(400).json({ success: false, error: 'Regular price must be greater than 0' });
//     }
//     if (discountPrice > regularPrice) {
//       return res.status(400).json({ success: false, error: 'Discount price cannot exceed regular price' });
//     }
//    if (!deliveryInfo || deliveryInfo === '<p></p>') {
//   return res.status(400).json({ success: false, error: 'Delivery information is required' });
// }
//     if (!images || !Array.isArray(images) || images.length === 0) {
//       return res.status(400).json({ success: false, error: 'At least one product image is required' });
//     }

//     // Check if category exists
//     const categoryExists = await Category.findById(category);
//     if (!categoryExists) {
//       return res.status(400).json({ success: false, error: 'Invalid category' });
//     }

//     let categoryName = categoryExists.name;
//     let subcategoryName = '';
//     let childSubcategoryName = '';

//     // Get subcategory name if provided
//     if (subcategory) {
//       const subcategoryDoc = categoryExists.subcategories.id(subcategory);
//       if (subcategoryDoc) {
//         subcategoryName = subcategoryDoc.name;
//       }
//     }

//     // Get child subcategory name if provided
//     if (childSubcategory && subcategory) {
//       const subcategoryDoc = categoryExists.subcategories.id(subcategory);
//       if (subcategoryDoc) {
//         const childDoc = subcategoryDoc.children.id(childSubcategory);
//         if (childDoc) {
//           childSubcategoryName = childDoc.name;
//         }
//       }
//     }

//     // Process images
//     const processedImages = images.map((url, index) => ({
//       url: url,
//       publicId: extractPublicIdFromUrl(url),
//       isPrimary: index === 0
//     }));

//     // Process additional info
// // Process additional info - FIXED VERSION
// let processedAdditionalInfo = [];
// console.log('=== DEBUGGING ADDITIONAL INFO ===');
// console.log('Raw additionalInfo:', additionalInfo);
// console.log('Type:', typeof additionalInfo);

// if (additionalInfo) {
//   // If it's a string, parse it
//   let additionalInfoData = additionalInfo;
//   if (typeof additionalInfo === 'string') {
//     try {
//       additionalInfoData = JSON.parse(additionalInfo);
//       console.log('Parsed from string:', additionalInfoData);
//     } catch (e) {
//       console.error('Error parsing additionalInfo string:', e);
//     }
//   }
  
//   // If it's an array, use it directly
//   if (Array.isArray(additionalInfoData) && additionalInfoData.length > 0) {
//     processedAdditionalInfo = additionalInfoData.map(info => ({
//       fieldName: info.fieldName,
//       fieldValue: info.fieldValue
//     }));
//     console.log('Processed additionalInfo:', processedAdditionalInfo);
//   } else if (additionalInfoData && typeof additionalInfoData === 'object' && !Array.isArray(additionalInfoData)) {
//     // Handle case where it might be an object
//     console.log('additionalInfo is an object, converting to array');
//     processedAdditionalInfo = [{
//       fieldName: additionalInfoData.fieldName || '',
//       fieldValue: additionalInfoData.fieldValue || ''
//     }];
//   }
// }

// console.log('Final processedAdditionalInfo:', processedAdditionalInfo);

//     // Process meta settings
//     let processedMetaSettings = {};
//     if (metaSettings) {
//       processedMetaSettings = {
//         metaTitle: metaSettings.metaTitle || '',
//         metaDescription: metaSettings.metaDescription || '',
//         metaKeywords: metaSettings.metaKeywords || []
//       };
//     }

//     // Check if SKU already exists (if provided)
//     if (skuCode) {
//       const existingProduct = await Product.findOne({ skuCode });
//       if (existingProduct) {
//         return res.status(400).json({ success: false, error: 'SKU code already exists' });
//       }
//     }

//     // Create product
//     const product = await Product.create({
//       productName,
//       shortDescription,
//       fullDescription,
//       category,
//       categoryName,
//       subcategory: subcategory || null,
//       subcategoryName,
//       childSubcategory: childSubcategory || null,
//       childSubcategoryName,
//       brand,
//       ageGroup,
//       stockQuantity: stockQuantity || 0,
      
//       regularPrice: Number(regularPrice),
//       discountPrice: Number(discountPrice) || 0,
//       deliveryInfo,
//       codAvailable: codAvailable || false,
//       tags: tags || [],
//       promotion: promotion || '',
//       isFeatured: isFeatured || false,
//       rating: rating || 0,
//       additionalInfo: processedAdditionalInfo,
//       videoUrl: videoUrl || '',
//       videoPublicId: videoPublicId || '',
//       videoType: videoType || 'upload',
//       metaSettings: processedMetaSettings,
//       images: processedImages,
//       createdBy: req.user.id,
//       isActive: true
//     });

//     // Populate references for response
//     await product.populate([
//       { path: 'category', select: 'name slug' },
//       { path: 'createdBy', select: 'name email role' }
//     ]);

//     res.status(201).json({
//       success: true,
//       data: product,
//       message: 'Product created successfully'
//     });
//   } catch (error) {
//     console.error('Create product error:', error);

//         // Handle duplicate key error (MongoDB error code 11000)
//     if (error.code === 11000) {
//       // Check which field caused the duplicate key error
//       if (error.keyPattern && error.keyPattern.slug) {
//         return res.status(400).json({
//           success: false,
//           error: `Product name "${req.body.productName}" already exists. Please use a different product name.`
//         });
//       }
//       if (error.keyPattern && error.keyPattern.skuCode) {
//         return res.status(400).json({
//           success: false,
//           error: `SKU code already exists. Please try again.`
//         });
//       }
//       return res.status(400).json({
//         success: false,
//         error: 'Duplicate entry found. Please check your data and try again.'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while creating product'
//     });
//   }
// };

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Moderator/Admin)
const createProduct = async (req, res) => {
  try {
    console.log('Create product request received');
    console.log('Body:', req.body);

    const {
      productName,
      shortDescription,
      fullDescription,
      category,
      subcategory,
      childSubcategory,
      brand,
      ageGroup,
      stockQuantity,
      skuCode,
      regularPrice,
      discountPrice,
      deliveryInfo,
      codAvailable,
      tags,
      promotion,
      isFeatured,
      rating,
      additionalInfo,
      videoUrl,
      videoPublicId,
      videoType,
      metaSettings,
      images
    } = req.body;

    // Validation
    if (!productName) {
      return res.status(400).json({ success: false, error: 'Product name is required' });
    }
    
    const existingProduct = await Product.findOne({ 
      productName: { $regex: new RegExp(`^${productName}$`, 'i') } 
    });
    
    if (existingProduct) {
      return res.status(400).json({ 
        success: false, 
        error: `Product name "${productName}" already exists. Please use a different product name.` 
      });
    }
    
    if (!shortDescription || shortDescription === '<p></p>') {
      return res.status(400).json({ success: false, error: 'Short description is required' });
    }
    if (!fullDescription || fullDescription === '<p></p>') {
      return res.status(400).json({ success: false, error: 'Full description is required' });
    }
    if (!category) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }
    if (!brand) {
      return res.status(400).json({ success: false, error: 'Brand is required' });
    }
    if (!ageGroup) {
      return res.status(400).json({ success: false, error: 'Age group is required' });
    }
    if (regularPrice <= 0) {
      return res.status(400).json({ success: false, error: 'Regular price must be greater than 0' });
    }
    if (discountPrice > regularPrice) {
      return res.status(400).json({ success: false, error: 'Discount price cannot exceed regular price' });
    }
    if (!deliveryInfo || deliveryInfo === '<p></p>') {
      return res.status(400).json({ success: false, error: 'Delivery information is required' });
    }
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one product image is required' });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, error: 'Invalid category' });
    }

    let categoryName = categoryExists.name;
    let subcategoryName = '';
    let childSubcategoryName = '';

    // Get subcategory name if provided
    if (subcategory) {
      const subcategoryDoc = categoryExists.subcategories.id(subcategory);
      if (subcategoryDoc) {
        subcategoryName = subcategoryDoc.name;
      }
    }

    // Get child subcategory name if provided
    if (childSubcategory && subcategory) {
      const subcategoryDoc = categoryExists.subcategories.id(subcategory);
      if (subcategoryDoc) {
        const childDoc = subcategoryDoc.children.id(childSubcategory);
        if (childDoc) {
          childSubcategoryName = childDoc.name;
        }
      }
    }

    // Process images
    const processedImages = images.map((url, index) => ({
      url: url,
      publicId: extractPublicIdFromUrl(url),
      isPrimary: index === 0
    }));

    // Process additional info
    let processedAdditionalInfo = [];
    if (additionalInfo && Array.isArray(additionalInfo)) {
      processedAdditionalInfo = additionalInfo;
    }

    // Process meta settings
    let processedMetaSettings = {};
    if (metaSettings) {
      processedMetaSettings = {
        metaTitle: metaSettings.metaTitle || '',
        metaDescription: metaSettings.metaDescription || '',
        metaKeywords: metaSettings.metaKeywords || []
      };
    }

    // Create product
    const product = await Product.create({
      productName,
      shortDescription,
      fullDescription,
      category,
      categoryName,
      subcategory: subcategory || null,
      subcategoryName,
      childSubcategory: childSubcategory || null,
      childSubcategoryName,
      brand,
      ageGroup,
      stockQuantity: stockQuantity || 0,
      regularPrice: Number(regularPrice),
      discountPrice: Number(discountPrice) || 0,
      deliveryInfo,
      codAvailable: codAvailable || false,
      tags: tags || [],
      promotion: promotion || '',
      isFeatured: isFeatured || false,
      rating: rating || 0,
      additionalInfo: processedAdditionalInfo,
      videoUrl: videoUrl || '',
      videoPublicId: videoPublicId || '',
      videoType: videoType || 'upload',
      metaSettings: processedMetaSettings,
      images: processedImages,
      createdBy: req.user.id,
      isActive: true
    });

    // ============ FIXED: Properly map toy product data to embedded schema ============
    const embeddedProductData = {
      productId: product._id,
      productName: product.productName,
      slug: product.slug,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      brand: product.brand,
      ageGroup: product.ageGroup,
      images: processedImages,
      regularPrice: product.regularPrice,
      discountPrice: product.discountPrice,
      stockQuantity: product.stockQuantity,
      skuCode: product.skuCode,
      deliveryInfo: product.deliveryInfo,
      codAvailable: product.codAvailable,
      tags: product.tags,
      promotion: product.promotion,
      isFeatured: product.isFeatured,
      rating: product.rating,
      additionalInfo: processedAdditionalInfo,
      videoUrl: product.videoUrl,
      videoPublicId: product.videoPublicId,
      videoType: product.videoType,
      subcategoryId: subcategory || null,
      subcategoryName: subcategoryName,
      childSubcategoryId: childSubcategory || null,
      childSubcategoryName: childSubcategoryName,
      isActive: true,
      createdBy: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add product to category's products array
    await Category.findByIdAndUpdate(
      category,
      {
        $push: { products: embeddedProductData },
        $inc: { productCount: 1 }
      },
      { new: true }
    );

    // If subcategory is selected, increment the subcategory's product count
    if (subcategory && subcategoryName) {
      await Category.findOneAndUpdate(
        { 
          _id: category,
          'subcategories._id': subcategory
        },
        {
          $inc: { 'subcategories.$.productCount': 1 }
        }
      );
    }

    // If child subcategory is selected, increment its product count
    if (childSubcategory && childSubcategoryName && subcategory) {
      await Category.findOneAndUpdate(
        { 
          _id: category,
          'subcategories._id': subcategory,
          'subcategories.children._id': childSubcategory
        },
        {
          $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 }
        },
        {
          arrayFilters: [
            { 'sub._id': subcategory },
            { 'child._id': childSubcategory }
          ]
        }
      );
    }

    // Populate references for response
    await product.populate([
      { path: 'category', select: 'name slug' },
      { path: 'createdBy', select: 'name email role' }
    ]);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);

    // Handle duplicate key error (MongoDB error code 11000)
    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.slug) {
        return res.status(400).json({
          success: false,
          error: `Product name "${req.body.productName}" already exists. Please use a different product name.`
        });
      }
      if (error.keyPattern && error.keyPattern.skuCode) {
        return res.status(400).json({
          success: false,
          error: `SKU code already exists. Please try again.`
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry found. Please check your data and try again.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server error while creating product'
    });
  }
};

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      childSubcategory,
      ageGroup,
      brand,
      minPrice,
      maxPrice,
      tags,
      promotion,
      isFeatured,
      search,
      sort = '-createdAt',
      minRating
    } = req.query;

    const query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Subcategory filter
    if (subcategory) {
      query.subcategory = subcategory;
    }

    // Child subcategory filter
    if (childSubcategory) {
      query.childSubcategory = childSubcategory;
    }

    // Age group filter
    if (ageGroup) {
      query.ageGroup = ageGroup;
    }

    // Brand filter
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Price range filter (using effective price - discount if available)
    if (minPrice || maxPrice) {
      query.$or = [
        { regularPrice: {} },
        { discountPrice: {} }
      ];
      if (minPrice) {
        query.$or[0].regularPrice.$gte = parseFloat(minPrice);
        query.$or[1].discountPrice.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.$or[0].regularPrice.$lte = parseFloat(maxPrice);
        query.$or[1].discountPrice.$lte = parseFloat(maxPrice);
      }
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Promotion filter
    if (promotion) {
      query.promotion = promotion;
    }

    // Featured filter
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Search filter
    if (search && search.trim()) {
      const searchTerm = search.trim();
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { productName: regex },
        { brand: regex },
        { fullDescription: regex }
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { regularPrice: 1 };
        break;
      case 'price_desc':
        sortOption = { regularPrice: -1 };
        break;
      case 'rating_desc':
        sortOption = { rating: -1 };
        break;
      case 'name_asc':
        sortOption = { productName: 1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { purchaseCount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching products'
    });
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const product = await Product.findOne(query)
      .populate('category', 'name slug')
      .populate('createdBy', 'name email');

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    // Get related products (same category)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(5)
      .select('productName slug regularPrice discountPrice images rating');

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching product'
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Moderator/Admin)
// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }

//     // Check permissions
//     if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
//       return res.status(403).json({ success: false, error: 'Permission denied' });
//     }

//     const {
//       productName,
//       shortDescription,
//       fullDescription,
//       category,
//       subcategory,
//       childSubcategory,
//       brand,
//       ageGroup,
//       stockQuantity,
//       skuCode,
//       regularPrice,
//       discountPrice,
//       deliveryInfo,
//       codAvailable,
//       tags,
//       promotion,
//       isFeatured,
//       rating,
//       additionalInfo,
//       videoUrl,
//       videoPublicId,
//       videoType,
//       metaSettings,
//       images
//     } = req.body;

//     // Update basic fields
//     if (productName) product.productName = productName;
//     if (shortDescription && shortDescription !== '<p></p>') product.shortDescription = shortDescription;
//     if (fullDescription && fullDescription !== '<p></p>') product.fullDescription = fullDescription;
//     if (brand) product.brand = brand;
//     if (ageGroup) product.ageGroup = ageGroup;
//     if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
//     if (skuCode) product.skuCode = skuCode;
//     if (regularPrice !== undefined) product.regularPrice = regularPrice;
//     if (discountPrice !== undefined) product.discountPrice = discountPrice;
//     if (deliveryInfo) product.deliveryInfo = deliveryInfo;
//     if (codAvailable !== undefined) product.codAvailable = codAvailable;

//     if (tags) product.tags = tags;
//     if (promotion !== undefined) product.promotion = promotion;
//     if (isFeatured !== undefined) product.isFeatured = isFeatured;
//     if (rating !== undefined) product.rating = rating;
//     if (videoUrl !== undefined) product.videoUrl = videoUrl;
//     if (videoPublicId !== undefined) product.videoPublicId = videoPublicId;
//     if (videoType !== undefined) product.videoType = videoType;
//     if (additionalInfo) product.additionalInfo = additionalInfo;
//     if (metaSettings) product.metaSettings = metaSettings;

//     // Update category if changed
//     if (category && category !== product.category.toString()) {
//       const categoryExists = await Category.findById(category);
//       if (!categoryExists) {
//         return res.status(400).json({ success: false, error: 'Invalid category' });
//       }
//       product.category = category;
//       product.categoryName = categoryExists.name;
      
//       // Update subcategory info
//       if (subcategory) {
//         const subcategoryDoc = categoryExists.subcategories.id(subcategory);
//         if (subcategoryDoc) {
//           product.subcategory = subcategory;
//           product.subcategoryName = subcategoryDoc.name;
//         }
//       }
      
//       if (childSubcategory && subcategory) {
//         const subcategoryDoc = categoryExists.subcategories.id(subcategory);
//         if (subcategoryDoc) {
//           const childDoc = subcategoryDoc.children.id(childSubcategory);
//           if (childDoc) {
//             product.childSubcategory = childSubcategory;
//             product.childSubcategoryName = childDoc.name;
//           }
//         }
//       }
//     }

//     // Update images if provided
//     if (images && Array.isArray(images) && images.length > 0) {
//       const processedImages = images.map((url, index) => ({
//         url: url,
//         publicId: extractPublicIdFromUrl(url),
//         isPrimary: index === 0
//       }));
//       product.images = processedImages;
//     }

//     await product.save();

//     res.json({
//       success: true,
//       data: product,
//       message: 'Product updated successfully'
//     });
//   } catch (error) {
//     console.error('Update product error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while updating product'
//     });
//   }
// };

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Moderator/Admin)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check permissions
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({ success: false, error: 'Permission denied' });
    }

    const {
      productName,
      shortDescription,
      fullDescription,
      category,
      subcategory,
      childSubcategory,
      brand,
      ageGroup,
      stockQuantity,
      skuCode,
      regularPrice,
      discountPrice,
      deliveryInfo,
      codAvailable,
      tags,
      promotion,
      isFeatured,
      rating,
      additionalInfo,
      videoUrl,
      videoPublicId,
      videoType,
      metaSettings,
      images,
      imagesToDelete
    } = req.body;

    // Store old values for count updates
    const oldCategory = product.category.toString();
    const oldSubcategoryId = product.subcategory ? product.subcategory.toString() : null;
    const oldChildSubcategoryId = product.childSubcategory ? product.childSubcategory.toString() : null;
    
    const newCategory = category || oldCategory;
    let newSubcategoryId = subcategory || null;
    let newSubcategoryName = '';
    let newChildSubcategoryId = childSubcategory || null;
    let newChildSubcategoryName = '';

    // Handle category change validation
    if (category && category !== oldCategory) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ success: false, error: 'Invalid category' });
      }
    }

    // Get subcategory names if provided
    if (newSubcategoryId) {
      const categoryDoc = await Category.findById(newCategory);
      if (categoryDoc) {
        const subcategoryDoc = categoryDoc.subcategories.id(newSubcategoryId);
        if (subcategoryDoc) {
          newSubcategoryName = subcategoryDoc.name;
          
          if (newChildSubcategoryId) {
            const childDoc = subcategoryDoc.children.id(newChildSubcategoryId);
            if (childDoc) {
              newChildSubcategoryName = childDoc.name;
            }
          }
        }
      }
    }

    // Process images if provided
    let processedImages = product.images;
    if (images && Array.isArray(images) && images.length > 0) {
      processedImages = images.map((url, index) => ({
        url: url,
        publicId: extractPublicIdFromUrl(url),
        isPrimary: index === 0
      }));
    }

    // Process additional info
    let processedAdditionalInfo = product.additionalInfo;
    if (additionalInfo && Array.isArray(additionalInfo)) {
      processedAdditionalInfo = additionalInfo;
    }

    // Process meta settings
    let processedMetaSettings = product.metaSettings;
    if (metaSettings) {
      processedMetaSettings = {
        metaTitle: metaSettings.metaTitle || product.metaSettings?.metaTitle || '',
        metaDescription: metaSettings.metaDescription || product.metaSettings?.metaDescription || '',
        metaKeywords: metaSettings.metaKeywords || product.metaSettings?.metaKeywords || []
      };
    }

    // Update product fields
    if (productName) product.productName = productName;
    if (shortDescription && shortDescription !== '<p></p>') product.shortDescription = shortDescription;
    if (fullDescription && fullDescription !== '<p></p>') product.fullDescription = fullDescription;
    if (brand) product.brand = brand;
    if (ageGroup) product.ageGroup = ageGroup;
    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
    if (skuCode) product.skuCode = skuCode;
    if (regularPrice !== undefined) product.regularPrice = regularPrice;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (deliveryInfo) product.deliveryInfo = deliveryInfo;
    if (codAvailable !== undefined) product.codAvailable = codAvailable;
    if (tags) product.tags = tags;
    if (promotion !== undefined) product.promotion = promotion;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (rating !== undefined) product.rating = rating;
    if (videoUrl !== undefined) product.videoUrl = videoUrl;
    if (videoPublicId !== undefined) product.videoPublicId = videoPublicId;
    if (videoType !== undefined) product.videoType = videoType;
    if (additionalInfo) product.additionalInfo = processedAdditionalInfo;
    if (metaSettings) product.metaSettings = processedMetaSettings;
    if (images && Array.isArray(images) && images.length > 0) product.images = processedImages;

    // Update category if changed
    if (category && category !== oldCategory) {
      product.category = category;
      const categoryExists = await Category.findById(category);
      if (categoryExists) {
        product.categoryName = categoryExists.name;
      }
      product.subcategory = newSubcategoryId;
      product.subcategoryName = newSubcategoryName;
      product.childSubcategory = newChildSubcategoryId;
      product.childSubcategoryName = newChildSubcategoryName;
    } else {
      // Update subcategory info even if category didn't change
      if (subcategory !== undefined) {
        product.subcategory = newSubcategoryId;
        product.subcategoryName = newSubcategoryName;
      }
      if (childSubcategory !== undefined) {
        product.childSubcategory = newChildSubcategoryId;
        product.childSubcategoryName = newChildSubcategoryName;
      }
    }

    await product.save();

    // Prepare data for embedded product update
    const embeddedUpdateData = {
      productName: product.productName,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      brand: product.brand,
      ageGroup: product.ageGroup,
      images: processedImages,
      regularPrice: product.regularPrice,
      discountPrice: product.discountPrice,
      stockQuantity: product.stockQuantity,
      skuCode: product.skuCode,
      deliveryInfo: product.deliveryInfo,
      codAvailable: product.codAvailable,
      tags: product.tags,
      promotion: product.promotion,
      isFeatured: product.isFeatured,
      rating: product.rating,
      additionalInfo: processedAdditionalInfo,
      videoUrl: product.videoUrl,
      videoPublicId: product.videoPublicId,
      videoType: product.videoType,
      subcategoryId: product.subcategory,
      subcategoryName: product.subcategoryName,
      childSubcategoryId: product.childSubcategory,
      childSubcategoryName: product.childSubcategoryName,
      isActive: product.isActive,
      updatedAt: new Date()
    };

    // Handle category change
    if (category && category !== oldCategory) {
      // Remove from old category
      await Category.findByIdAndUpdate(
        oldCategory,
        {
          $pull: { products: { productId: product._id } },
          $inc: { productCount: -1 }
        }
      );
      
      // Update subcategory counts for old category
      if (oldSubcategoryId) {
        await Category.findOneAndUpdate(
          { 
            _id: oldCategory,
            'subcategories._id': oldSubcategoryId
          },
          { $inc: { 'subcategories.$.productCount': -1 } }
        );
      }
      
      if (oldChildSubcategoryId && oldSubcategoryId) {
        await Category.findOneAndUpdate(
          { 
            _id: oldCategory,
            'subcategories._id': oldSubcategoryId,
            'subcategories.children._id': oldChildSubcategoryId
          },
          { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
          {
            arrayFilters: [
              { 'sub._id': oldSubcategoryId },
              { 'child._id': oldChildSubcategoryId }
            ]
          }
        );
      }
      
      // Add to new category
      const newEmbeddedProduct = {
        productId: product._id,
        ...embeddedUpdateData,
        createdBy: req.user.id,
        createdAt: product.createdAt
      };
      
      await Category.findByIdAndUpdate(
        newCategory,
        {
          $push: { products: newEmbeddedProduct },
          $inc: { productCount: 1 }
        }
      );
      
      // Update subcategory counts for new category
      if (newSubcategoryId) {
        await Category.findOneAndUpdate(
          { 
            _id: newCategory,
            'subcategories._id': newSubcategoryId
          },
          { $inc: { 'subcategories.$.productCount': 1 } }
        );
      }
      
      if (newChildSubcategoryId && newSubcategoryId) {
        await Category.findOneAndUpdate(
          { 
            _id: newCategory,
            'subcategories._id': newSubcategoryId,
            'subcategories.children._id': newChildSubcategoryId
          },
          { $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 } },
          {
            arrayFilters: [
              { 'sub._id': newSubcategoryId },
              { 'child._id': newChildSubcategoryId }
            ]
          }
        );
      }
    } else {
      // Update existing embedded product in same category
      await updateEmbeddedProductInCategory(oldCategory, product._id, embeddedUpdateData);
      
      // Handle subcategory count updates if changed
      if (oldSubcategoryId !== newSubcategoryId) {
        // Decrement old subcategory
        if (oldSubcategoryId) {
          await Category.findOneAndUpdate(
            { 
              _id: oldCategory,
              'subcategories._id': oldSubcategoryId
            },
            { $inc: { 'subcategories.$.productCount': -1 } }
          );
        }
        
        // Increment new subcategory
        if (newSubcategoryId) {
          await Category.findOneAndUpdate(
            { 
              _id: oldCategory,
              'subcategories._id': newSubcategoryId
            },
            { $inc: { 'subcategories.$.productCount': 1 } }
          );
        }
      }
      
      // Handle child subcategory count updates if changed
      if (oldChildSubcategoryId !== newChildSubcategoryId) {
        if (oldChildSubcategoryId && oldSubcategoryId) {
          await Category.findOneAndUpdate(
            { 
              _id: oldCategory,
              'subcategories._id': oldSubcategoryId,
              'subcategories.children._id': oldChildSubcategoryId
            },
            { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
            {
              arrayFilters: [
                { 'sub._id': oldSubcategoryId },
                { 'child._id': oldChildSubcategoryId }
              ]
            }
          );
        }
        
        if (newChildSubcategoryId && newSubcategoryId) {
          await Category.findOneAndUpdate(
            { 
              _id: oldCategory,
              'subcategories._id': newSubcategoryId,
              'subcategories.children._id': newChildSubcategoryId
            },
            { $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 } },
            {
              arrayFilters: [
                { 'sub._id': newSubcategoryId },
                { 'child._id': newChildSubcategoryId }
              ]
            }
          );
        }
      }
    }

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }

//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ success: false, error: 'Only admins can delete products' });
//     }

//     await product.deleteOne();

//     res.json({
//       success: true,
//       message: 'Product deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete product error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while deleting product'
//     });
//   }
// };

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Only admins can delete products' });
    }

    // Remove product from category's embedded products
    await Category.findByIdAndUpdate(
      product.category,
      {
        $pull: { products: { productId: product._id } },
        $inc: { productCount: -1 }
      }
    );

    // Decrement subcategory product count
    if (product.subcategory) {
      await Category.findOneAndUpdate(
        { 
          _id: product.category,
          'subcategories._id': product.subcategory
        },
        { $inc: { 'subcategories.$.productCount': -1 } }
      );
    }

    // Decrement child subcategory product count
    if (product.childSubcategory && product.subcategory) {
      await Category.findOneAndUpdate(
        { 
          _id: product.category,
          'subcategories._id': product.subcategory,
          'subcategories.children._id': product.childSubcategory
        },
        { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
        {
          arrayFilters: [
            { 'sub._id': product.subcategory },
            { 'child._id': product.childSubcategory }
          ]
        }
      );
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while deleting product'
    });
  }
};

// @desc    Add review to product
// @route   POST /api/products/:id/review
// @access  Private
const addProductReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.some(
      review => review.userId && review.userId.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, error: 'Product already reviewed' });
    }

    const review = {
      userId: req.user.id,
      userName: req.user.name || req.user.email,
      rating: Number(rating),
      title: title || '',
      comment,
      isVerifiedPurchase: true,
      createdAt: new Date()
    };

    product.reviews.push(review);
    
    // Update review statistics
    const totalReviews = product.reviews.length;
    const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    product.rating = Math.round(avgRating * 10) / 10;
    
    // Update rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    product.reviews.forEach(r => {
      distribution[r.rating]++;
    });
    product.reviewStats = {
      averageRating: product.rating,
      totalReviews,
      ratingDistribution: distribution
    };

    await product.save();

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while adding review'
    });
  }
};

// @desc    Get products by age group
// @route   GET /api/products/age/:ageGroup
// @access  Public
const getProductsByAgeGroup = async (req, res) => {
  try {
    const { ageGroup } = req.params;
    const { limit = 8 } = req.query;

    const products = await Product.find({
      ageGroup,
      isActive: true
    })
      .limit(parseInt(limit))
      .select('productName slug regularPrice discountPrice images rating');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get products by age group error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get flash sale products
// @route   GET /api/products/flash-sale
// @access  Public
const getFlashSaleProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({
      promotion: 'flash-sale',
      isActive: true,
      discountPrice: { $gt: 0 }
    })
      .limit(parseInt(limit))
      .select('productName slug regularPrice discountPrice images rating stockQuantity');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get flash sale products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isFeatured: true,
      isActive: true
    })
      .limit(parseInt(limit))
      .select('productName slug regularPrice discountPrice images rating');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get trending products (by purchase count)
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ isActive: true })
      .sort({ purchaseCount: -1, views: -1 })
      .limit(parseInt(limit))
      .select('productName slug regularPrice discountPrice images rating purchaseCount');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get trending products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
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
};