



// const Product = require('../models/Product');
// const Category = require('../models/Category');
// const { cloudinary } = require('../config/cloudinary');



// // @desc    Create new product - WITH SUBCATEGORY SUPPORT
// // @route   POST /api/products
// // @access  Private (Moderator/Admin)
// const createProduct = async (req, res) => {
//   try {
//     console.log('Create product request received');
//     console.log('Body:', req.body);

//     const {
//       productName,
//       description,
//       instruction,
//       category,
//       subcategory, // NEW: Subcategory ID (optional)
//       childSubcategory,
//       targetedCustomer,
//       fabric,
//        orderUnit,        // ← Changed from orderType
//   weightPerUnit,  
//       moq,
//       pricePerUnit,
//       quantityBasedPricing,
//       sizes,
       
//       colors,
//       additionalInfo,
//       customizationOptions,
//       isFeatured,
//       tags,
//       metaSettings,
//       images
//     } = req.body;

//     console.log('Category:', category);
//     console.log('Subcategory:', subcategory);
//     console.log('Images received:', images);
//     console.log('Images array length:', images?.length);

//     // Validation
//     if (!productName) {
//       return res.status(400).json({
//         success: false,
//         error: 'Product name is required'
//       });
//     }

//     if (!category) {
//       return res.status(400).json({
//         success: false,
//         error: 'Category is required'
//       });
//     }

//     // Check if category exists
//     const categoryExists = await Category.findById(category);
//     if (!categoryExists) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid category'
//       });
//     }

//     // If subcategory is provided, validate it exists in the category
//     let subcategoryName = '';
//     let subcategoryDoc = null;
//     let childSubcategoryName = '';
// let childSubcategoryDoc = null;

//     if (subcategory && subcategory !== '') {
//       // Find the subcategory in the category's subcategories array
//       subcategoryDoc = categoryExists.subcategories.id(subcategory);
      
//       if (!subcategoryDoc) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid subcategory for this category'
//         });
//       }
      
//       subcategoryName = subcategoryDoc.name;
// // NEW: Validate child subcategory if provided
//   if (childSubcategory && childSubcategory !== '') {
//     childSubcategoryDoc = subcategoryDoc.children.id(childSubcategory);
//     if (!childSubcategoryDoc) {
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid child subcategory for this subcategory'
//       });
//     }
//     childSubcategoryName = childSubcategoryDoc.name;
//   }

      
//     }


    

//     // CRITICAL: Check if at least one image URL is provided
//     if (!images || !Array.isArray(images) || images.length === 0) {
//       console.log('No images provided. Images:', images);
//       return res.status(400).json({
//         success: false,
//         error: 'At least one product image is required'
//       });
//     }

//     // Validate image URLs
//     if (!Array.isArray(images) || images.some(img => typeof img !== 'string')) {
//       return res.status(400).json({
//         success: false,
//         error: 'Images must be an array of valid URLs'
//       });
//     }

//     // Parse JSON fields (if they come as strings)
//     let parsedQuantityPricing = [];
//     let parsedSizes = [];
//     let parsedColors = [];
//     let parsedAdditionalInfo = [];
//     let parsedTags = [];
//     let parsedMetaSettings = {};
//     let parsedCustomizationOptions = []; 

//     try {
//       parsedQuantityPricing = typeof quantityBasedPricing === 'string' 
//         ? JSON.parse(quantityBasedPricing) 
//         : quantityBasedPricing || [];
      
//       parsedSizes = typeof sizes === 'string' 
//         ? JSON.parse(sizes) 
//         : sizes || [];
      
//       parsedColors = typeof colors === 'string' 
//         ? JSON.parse(colors) 
//         : colors || [];
      
//       if (additionalInfo) {
//         parsedAdditionalInfo = typeof additionalInfo === 'string' 
//           ? JSON.parse(additionalInfo) 
//           : additionalInfo;
//       }

//       if (tags) {
//         parsedTags = typeof tags === 'string' 
//           ? JSON.parse(tags) 
//           : tags || [];
//       }

//       if (metaSettings) {
//         parsedMetaSettings = typeof metaSettings === 'string' 
//           ? JSON.parse(metaSettings) 
//           : metaSettings || {};
//       }

//           if (customizationOptions) {
//         parsedCustomizationOptions = typeof customizationOptions === 'string' 
//           ? JSON.parse(customizationOptions) 
//           : customizationOptions || [];
//       }
//     } catch (error) {
//       console.error('Error parsing JSON fields:', error);
//       return res.status(400).json({
//         success: false,
//         error: 'Invalid data format for sizes, colors, pricing, tags, or meta settings'
//       });
//     }

//     // Validate sizes
//    // Validate sizes - Now optional, only validate if sizes are provided
// if (parsedSizes && parsedSizes.length > 0) {
//   // Optional: Add validation for size values if needed
//   const validSizes = parsedSizes.filter(s => s && s.trim());
//   if (validSizes.length === 0 && parsedSizes.length > 0) {
//     return res.status(400).json({
//       success: false,
//       error: 'Invalid size values provided'
//     });
//   }
// }
// // Sizes are now optional - no error if empty

//     // Validate colors
//     if (!parsedColors || parsedColors.length === 0) {
//       return res.status(400).json({
//         success: false,
//         error: 'At least one color is required'
//       });
//     }

//     // Validate tags if provided
//     if (parsedTags && parsedTags.length > 0) {
//       // const validTags = [
//       //   'Top Ranking', 'New Arrival', 'Top Deal', 'Best Seller',
//       //   'Summer Collection', 'Winter Collection', 'Limited Edition', 'Trending'
//       // ];

//        const validTags = [
//        'Best Seller',
//   'New Arrival',
//   'Top Deal',
//   'Eco-Friendly',
//   'Hot Export Item',
//   'Customizable',
//   'Premium Quality',
//   'Trending'
//       ];
      
//       for (const tag of parsedTags) {
//         if (!validTags.includes(tag)) {
//           return res.status(400).json({
//             success: false,
//             error: `Invalid tag: ${tag}`
//           });
//         }
//       }
//     }

//     // Validate meta title length
//     if (parsedMetaSettings.metaTitle && parsedMetaSettings.metaTitle.length > 70) {
//       return res.status(400).json({
//         success: false,
//         error: 'Meta title should not exceed 70 characters'
//       });
//     }

//     // Validate meta description length
//     if (parsedMetaSettings.metaDescription && parsedMetaSettings.metaDescription.length > 160) {
//       return res.status(400).json({
//         success: false,
//         error: 'Meta description should not exceed 160 characters'
//       });
//     }

//     // Process images - Convert URLs to the format expected by the schema
//     const processedImages = images.map((url, index) => ({
//       url: url,
//       publicId: extractPublicIdFromUrl(url),
//       isPrimary: index === 0
//     }));

//     console.log('Processed images:', processedImages);

//     // Create product with all fields
//     const product = await Product.create({
//       productName,
//       description: description || '',
//       instruction: instruction || '',
//       category,
//       subcategory: subcategory || null, // Store subcategory ID
//       subcategoryName: subcategoryName, // Store subcategory name for denormalization
//        childSubcategory: childSubcategory || null, // NEW
//   childSubcategoryName: childSubcategoryName, // NEW
//       targetedCustomer: targetedCustomer || 'unisex',
//       fabric,
//         orderUnit: orderUnit || 'piece',        // ← Changed from orderType
//   weightPerUnit: weightPerUnit ? parseFloat(weightPerUnit) : null, 
//       moq: parseInt(moq) || 100,
//       pricePerUnit: parseFloat(pricePerUnit) || 0,
//       quantityBasedPricing: parsedQuantityPricing,
//       sizes: parsedSizes,
//       colors: parsedColors,
//       additionalInfo: parsedAdditionalInfo,
//        customizationOptions: parsedCustomizationOptions, 
//       isFeatured: isFeatured === true || isFeatured === 'true',
//       tags: parsedTags,
//       metaSettings: parsedMetaSettings,
//       images: processedImages,
//       createdBy: req.user.id,
//       isActive: true
//     });

//     // Prepare embedded product data for category
//     const embeddedProduct = {
//       productId: product._id,
//       productName: product.productName,
//       slug: product.slug,
//       description: product.description,
//       instruction: product.instruction,
//       targetedCustomer: product.targetedCustomer,
//       fabric: product.fabric,
//       images: product.images,
//       sizes: product.sizes,
//       colors: product.colors,
//       moq: product.moq,
//       pricePerUnit: product.pricePerUnit,
//       quantityBasedPricing: product.quantityBasedPricing,
//       additionalInfo: product.additionalInfo,
//       isFeatured: product.isFeatured,
//       tags: product.tags,
//       subcategoryId: product.subcategory, // Store subcategory ID in embedded product
//       subcategoryName: product.subcategoryName, // Store subcategory name in embedded product
//      childSubcategoryId: product.childSubcategory, // NEW
//   childSubcategoryName: product.childSubcategoryName, // NEW
     
//       isActive: product.isActive,
//       createdBy: product.createdBy,
//       createdAt: product.createdAt
//     };

//     // Add product to category's products array
//     await Category.findByIdAndUpdate(
//       category,
//       {
//         $push: { products: embeddedProduct },
//         $inc: { productCount: 1 }
//       },
//       { new: true }
//     );

//     if (childSubcategory && childSubcategoryDoc) {
//   await Category.findOneAndUpdate(
//     { 
//       _id: category,
//       'subcategories._id': subcategory,
//       'subcategories.children._id': childSubcategory
//     },
//     {
//       $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 }
//     },
//     {
//       arrayFilters: [
//         { 'sub._id': subcategory },
//         { 'child._id': childSubcategory }
//       ]
//     }
//   );
// }

//     // If subcategory is selected, also increment the subcategory's product count
//     if (subcategory && subcategoryDoc) {
//       await Category.findOneAndUpdate(
//         { 
//           _id: category,
//           'subcategories._id': subcategory
//         },
//         {
//           $inc: { 'subcategories.$.productCount': 1 }
//         }
//       );
//       console.log(`Incremented product count for subcategory: ${subcategoryName}`);
//     }

//     // Populate references for response
//     await product.populate([
//       { path: 'category', select: 'name slug' },
//       { path: 'createdBy', select: 'contactPerson email role' }
//     ]);

//     res.status(201).json({
//       success: true,
//       data: product,
//       message: 'Product created successfully'
//     });
//   } catch (error) {
//     console.error('Create product error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while creating product'
//     });
//   }
// };

// // Helper function to extract public ID from Cloudinary URL
// const extractPublicIdFromUrl = (url) => {
//   if (!url) return null;
  
//   try {
//     // Extract public_id from Cloudinary URL
//     // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/b2b-products/abc123.jpg
//     const parts = url.split('/');
//     const uploadIndex = parts.findIndex(part => part === 'upload');
//     if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
//       // Skip the version part (v1234567890)
//       const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
//       // Remove file extension
//       const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
//       return publicId;
//     }
//   } catch (error) {
//     console.error('Error extracting public ID from URL:', error);
//   }
  
//   return null;
// };

// // Helper function to extract public ID from Cloudinary URL
// // const extractPublicIdFromUrl = (url) => {
// //   if (!url) return null;
  
// //   try {
// //     // Extract public_id from Cloudinary URL
// //     // Example URL: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/b2b-products/abc123.jpg
// //     const parts = url.split('/');
// //     const uploadIndex = parts.findIndex(part => part === 'upload');
// //     if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
// //       // Skip the version part (v1234567890)
// //       const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
// //       // Remove file extension
// //       const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
// //       return publicId;
// //     }
// //   } catch (error) {
// //     console.error('Error extracting public ID from URL:', error);
// //   }
  
// //   return null;
// // };





// // Keep all other functions (getProducts, getProductById, deleteProduct, etc.) exactly as they are
// // They don't need to be modified







// // @desc    Get all products - FIXED with proper partial search
// // @route   GET /api/products
// // @access  Public
// const getProducts = async (req, res) => {
//   try {
//     const { 
//       page = 1, 
//       limit = 12, 
//       category, 
//       subcategory,
//        childSubcategory,
//       search, 
//       minPrice, 
//       maxPrice,
//       fabric,
//       targetedCustomer,
//       isFeatured,
//       tags,
//       isActive,
//       sort = '-createdAt',
//       includeInactive = false
//     } = req.query;

//     // Build query
//     const query = {};
    
//     // Handle active/inactive filtering
//     if (isActive !== undefined) {
//       query.isActive = isActive === 'true';
//     } 
//     else if (!includeInactive) {
//       query.isActive = true;
//     }

//     // Filter by featured
//     if (isFeatured !== undefined) {
//       query.isFeatured = isFeatured === 'true';
//     }

//     // Filter by tags
//     if (tags) {
//       if (Array.isArray(tags)) {
//         query.tags = { $in: tags };
//       } else {
//         query.tags = tags;
//       }
//     }

//     // Filter by category
//     if (category) {
//       if (Array.isArray(category)) {
//         query.category = { $in: category };
//       } else {
//         query.category = category;
//       }
//     }
//      if (subcategory) {
//       if (Array.isArray(subcategory)) {
//         query.subcategory = { $in: subcategory };
//       } else {
//         query.subcategory = subcategory;
//       }
//     }

//       // NEW: Filter by childSubcategory
//     if (childSubcategory) {
//       if (Array.isArray(childSubcategory)) {
//         query.childSubcategory = { $in: childSubcategory };
//       } else {
//         query.childSubcategory = childSubcategory;
//       }
//     }

//     // Filter by targetedCustomer
//     if (targetedCustomer) {
//       if (Array.isArray(targetedCustomer)) {
//         query.targetedCustomer = { $in: targetedCustomer };
//       } else {
//         query.targetedCustomer = targetedCustomer;
//       }
//     }

//     // FIXED: Search with partial matching using regex
//     if (search && search.trim() !== '') {
//       const searchTerm = search.trim();
//       // Create a regex pattern that matches the search term anywhere in the string
//       // Case insensitive and escapes special regex characters
//       const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//       const regex = new RegExp(escapedSearchTerm, 'i');
      
//       query.$or = [
//         { productName: regex },
//         { fabric: regex },
//         { description: regex }
//       ];
//     }

//     // Filter by fabric (if not already in search)
//     if (fabric && !search) {
//       query.fabric = { $regex: fabric, $options: 'i' };
//     }

//     // Price range filter
//     if (minPrice || maxPrice) {
//       query.pricePerUnit = {};
//       if (minPrice) query.pricePerUnit.$gte = parseFloat(minPrice);
//       if (maxPrice) query.pricePerUnit.$lte = parseFloat(maxPrice);
//     }

//     // Parse sort
//     let sortOption = {};
//     let useCollation = false;
    
//     if (sort === 'price_asc') {
//       sortOption = { pricePerUnit: 1 };
//     } else if (sort === 'price_desc') {
//       sortOption = { pricePerUnit: -1 };
//     } else if (sort === 'name_asc') {
//       sortOption = { productName: 1 };
//       useCollation = true;
//     } else if (sort === 'featured') {
//       sortOption = { isFeatured: -1, createdAt: -1 };
//     } else if (sort === 'newest') {
//       sortOption = { createdAt: -1 };
//     } else {
//       sortOption = { createdAt: -1 };
//     }


//     console.log('Child Subcategory filter:', childSubcategory); // Debug log
//     console.log('Subcategory filter:', subcategory);
//     console.log('Search query:', search); // Debug log
//     console.log('MongoDB query:', JSON.stringify(query)); // Debug log

//     // Build the query
//     let productsQuery = Product.find(query)
//       .populate('category', 'name slug')
//       .populate('createdBy', 'contactPerson');

//     // Apply case-insensitive collation for name sorting
//     if (useCollation) {
//       productsQuery = productsQuery.collation({ locale: 'en', strength: 2 });
//     }

//     // Apply sort and pagination
//     const products = await productsQuery
//       .sort(sortOption)
//       .limit(parseInt(limit))
//       .skip((parseInt(page) - 1) * parseInt(limit));

//     const total = await Product.countDocuments(query);

//     res.json({
//       success: true,
//       data: products,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });
//   } catch (error) {
//     console.error('Get products error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching products'
//     });
//   }
// };


// // @desc    Get single product by ID or slug
// // @route   GET /api/products/:id
// // @access  Public
// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     // Check if id is MongoDB ObjectId or slug
//     const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
//     let query = {};
//     if (isObjectId) {
//       query = { _id: id };
//     } else {
//       query = { slug: id };
//     }

//     const product = await Product.findOne(query)
//       .populate('category', 'name slug')
//       .populate('createdBy', 'companyName contactPerson email role'); // Added more fields

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     // Increment view count
//     product.views += 1;
//     await product.save();

//     res.json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     console.error('Get product error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching product'
//     });
//   }
// };


// // // Helper function to update embedded product in category - UPDATE THIS
// // const updateEmbeddedProductInCategory = async (categoryId, productId, updateData) => {
// //   try {
// //     await Category.findOneAndUpdate(
// //       { 
// //         _id: categoryId,
// //         'products.productId': productId 
// //       },
// //       {
// //         $set: {
// //           'products.$.productName': updateData.productName,
// //           'products.$.description': updateData.description,
// //            'products.$.instruction': updateData.instruction,
// //           'products.$.targetedCustomer': updateData.targetedCustomer,
// //           'products.$.fabric': updateData.fabric,
// //           'products.$.sizes': updateData.sizes,
// //           'products.$.colors': updateData.colors,
// //           'products.$.moq': updateData.moq,
// //           'products.$.pricePerUnit': updateData.pricePerUnit,
// //           'products.$.quantityBasedPricing': updateData.quantityBasedPricing,
// //           'products.$.additionalInfo': updateData.additionalInfo,
// //           'products.$.images': updateData.images,
// //           'products.$.isActive': updateData.isActive,
// //           'products.$.isFeatured': updateData.isFeatured, // NEW
// //           'products.$.tags': updateData.tags, // NEW
// //           'products.$.updatedAt': new Date()
// //         }
// //       }
// //     );
// //   } catch (error) {
// //     console.error('Error updating embedded product:', error);
// //     throw error;
// //   }
// // };

// // Helper function to update embedded product in category - UPDATE THIS
// const updateEmbeddedProductInCategory = async (categoryId, productId, updateData) => {
//   try {
//     await Category.findOneAndUpdate(
//       { 
//         _id: categoryId,
//         'products.productId': productId 
//       },
//       {
//         $set: {
//           'products.$.productName': updateData.productName,
//           'products.$.description': updateData.description,
//           'products.$.instruction': updateData.instruction,
//           'products.$.targetedCustomer': updateData.targetedCustomer,
//           'products.$.fabric': updateData.fabric,
//           'products.$.orderUnit': updateData.orderUnit,           // ← ADD THIS
//           'products.$.weightPerUnit': updateData.weightPerUnit,   // ← ADD THIS
//           'products.$.sizes': updateData.sizes,
//           'products.$.colors': updateData.colors,
//           'products.$.moq': updateData.moq,
//           'products.$.pricePerUnit': updateData.pricePerUnit,
//           'products.$.quantityBasedPricing': updateData.quantityBasedPricing,
//           'products.$.additionalInfo': updateData.additionalInfo,
//           'products.$.customizationOptions': updateData.customizationOptions,
//           'products.$.images': updateData.images,
//           'products.$.isActive': updateData.isActive,
//           'products.$.isFeatured': updateData.isFeatured,
//           'products.$.tags': updateData.tags,
//           'products.$.subcategoryId': updateData.subcategoryId,
//           'products.$.subcategoryName': updateData.subcategoryName,
//           'products.$.childSubcategoryId': updateData.childSubcategoryId,
//           'products.$.childSubcategoryName': updateData.childSubcategoryName,
//           'products.$.updatedAt': updateData.updatedAt || new Date()
//         }
//       }
//     );
//   } catch (error) {
//     console.error('Error updating embedded product:', error);
//     throw error;
//   }
// };


// // Helper function to remove embedded product from category
// const removeEmbeddedProductFromCategory = async (categoryId, productId) => {
//   try {
//     await Category.findByIdAndUpdate(
//       categoryId,
//       {
//         $pull: { products: { productId: productId } },
//         $inc: { productCount: -1 }
//       }
//     );
//   } catch (error) {
//     console.error('Error removing embedded product:', error);
//     throw error;
//   }
// };




// // // @desc    Update product - WITH SUBCATEGORY & CHILD SUBCATEGORY SUPPORT
// // // @route   PUT /api/products/:id
// // // @access  Private (Moderator/Admin)
// // const updateProduct = async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id);

// //     if (!product) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Product not found'
// //       });
// //     }

// //     // Check permissions
// //     if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
// //       return res.status(403).json({
// //         success: false,
// //         error: 'You do not have permission to update products'
// //       });
// //     }

// //     const {
// //       productName,
// //       description,
// //       instruction,
// //       category,
// //       subcategory,
// //       childSubcategory, // NEW: Add childSubcategory
// //       targetedCustomer,
// //       fabric,
// //       moq,
// //       pricePerUnit,
// //       quantityBasedPricing,
// //       sizes,
// //       colors,
// //       additionalInfo,
// //       isFeatured,
// //       tags,
// //       metaSettings,
// //       images,
// //       imagesToDelete
// //     } = req.body;

// //     // Store old values for count updates
// //     const oldCategory = product.category.toString();
// //     const oldSubcategoryId = product.subcategory ? product.subcategory.toString() : null;
// //     const oldChildSubcategoryId = product.childSubcategory ? product.childSubcategory.toString() : null;
    
// //     const newCategory = category || oldCategory;
// //     let newSubcategoryId = subcategory || null;
// //     let newSubcategoryName = '';
// //     let newChildSubcategoryId = childSubcategory || null;
// //     let newChildSubcategoryName = '';

// //     // Check if category is being changed
// //     if (category && category !== oldCategory) {
// //       const categoryExists = await Category.findById(category);
// //       if (!categoryExists) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'Invalid category'
// //         });
// //       }
// //     }

// //     // Handle subcategory validation
// //     if (newSubcategoryId) {
// //       const categoryDoc = await Category.findById(newCategory);
// //       if (!categoryDoc) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'Category not found'
// //         });
// //       }
      
// //       const subcategoryDoc = categoryDoc.subcategories.id(newSubcategoryId);
// //       if (!subcategoryDoc) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'Invalid subcategory for this category'
// //         });
// //       }
// //       newSubcategoryName = subcategoryDoc.name;
      
// //       // Handle child subcategory validation
// //       if (newChildSubcategoryId) {
// //         const childSubcategoryDoc = subcategoryDoc.children.id(newChildSubcategoryId);
// //         if (!childSubcategoryDoc) {
// //           return res.status(400).json({
// //             success: false,
// //             error: 'Invalid child subcategory for this subcategory'
// //           });
// //         }
// //         newChildSubcategoryName = childSubcategoryDoc.name;
// //       }
// //     }

// //     // Handle count updates for subcategories and child subcategories
    
// //     // Case 1: Subcategory changed
// //     if (oldSubcategoryId !== newSubcategoryId) {
// //       // Decrement old subcategory count
// //       if (oldSubcategoryId) {
// //         await Category.findOneAndUpdate(
// //           { 
// //             _id: oldCategory,
// //             'subcategories._id': oldSubcategoryId
// //           },
// //           { $inc: { 'subcategories.$.productCount': -1 } }
// //         );
// //       }
      
// //       // Increment new subcategory count
// //       if (newSubcategoryId) {
// //         await Category.findOneAndUpdate(
// //           { 
// //             _id: newCategory,
// //             'subcategories._id': newSubcategoryId
// //           },
// //           { $inc: { 'subcategories.$.productCount': 1 } }
// //         );
// //       }
// //     }
    
// //     // Case 2: Child subcategory changed (only if subcategory is the same)
// //     if (oldSubcategoryId === newSubcategoryId && oldChildSubcategoryId !== newChildSubcategoryId) {
// //       // Decrement old child subcategory count
// //       if (oldChildSubcategoryId && oldSubcategoryId) {
// //         await Category.findOneAndUpdate(
// //           { 
// //             _id: oldCategory,
// //             'subcategories._id': oldSubcategoryId,
// //             'subcategories.children._id': oldChildSubcategoryId
// //           },
// //           {
// //             $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 }
// //           },
// //           {
// //             arrayFilters: [
// //               { 'sub._id': oldSubcategoryId },
// //               { 'child._id': oldChildSubcategoryId }
// //             ]
// //           }
// //         );
// //       }
      
// //       // Increment new child subcategory count
// //       if (newChildSubcategoryId && newSubcategoryId) {
// //         await Category.findOneAndUpdate(
// //           { 
// //             _id: newCategory,
// //             'subcategories._id': newSubcategoryId,
// //             'subcategories.children._id': newChildSubcategoryId
// //           },
// //           {
// //             $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 }
// //           },
// //           {
// //             arrayFilters: [
// //               { 'sub._id': newSubcategoryId },
// //               { 'child._id': newChildSubcategoryId }
// //             ]
// //           }
// //         );
// //       }
// //     }
    
// //     // Case 3: Both subcategory and child subcategory changed
// //     if (oldSubcategoryId !== newSubcategoryId && oldChildSubcategoryId) {
// //       // Decrement old child subcategory count
// //       if (oldChildSubcategoryId && oldSubcategoryId) {
// //         await Category.findOneAndUpdate(
// //           { 
// //             _id: oldCategory,
// //             'subcategories._id': oldSubcategoryId,
// //             'subcategories.children._id': oldChildSubcategoryId
// //           },
// //           {
// //             $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 }
// //           },
// //           {
// //             arrayFilters: [
// //               { 'sub._id': oldSubcategoryId },
// //               { 'child._id': oldChildSubcategoryId }
// //             ]
// //           }
// //         );
// //       }
      
// //       // Increment new child subcategory count
// //       if (newChildSubcategoryId && newSubcategoryId) {
// //         await Category.findOneAndUpdate(
// //           { 
// //             _id: newCategory,
// //             'subcategories._id': newSubcategoryId,
// //             'subcategories.children._id': newChildSubcategoryId
// //           },
// //           {
// //             $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 }
// //           },
// //           {
// //             arrayFilters: [
// //               { 'sub._id': newSubcategoryId },
// //               { 'child._id': newChildSubcategoryId }
// //             ]
// //           }
// //         );
// //       }
// //     }

// //     // Delete old images from Cloudinary if provided
// //     if (imagesToDelete && Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
// //       for (const publicId of imagesToDelete) {
// //         try {
// //           await cloudinary.uploader.destroy(publicId);
// //           console.log('Deleted image from Cloudinary:', publicId);
// //         } catch (cloudinaryError) {
// //           console.error('Error deleting image from Cloudinary:', cloudinaryError);
// //         }
// //       }
// //     }

// //     // Update basic fields
// //     if (productName) product.productName = productName;
// //     if (description !== undefined) product.description = description;
// //     if (instruction !== undefined) product.instruction = instruction;
// //     if (category) product.category = category;
// //     if (subcategory !== undefined) {
// //       product.subcategory = newSubcategoryId;
// //       product.subcategoryName = newSubcategoryName;
// //     }
// //     if (childSubcategory !== undefined) {
// //       product.childSubcategory = newChildSubcategoryId;
// //       product.childSubcategoryName = newChildSubcategoryName;
// //     }
// //     if (targetedCustomer) product.targetedCustomer = targetedCustomer;
// //     if (fabric) product.fabric = fabric;
// //     if (moq) product.moq = parseInt(moq);
// //     if (pricePerUnit) product.pricePerUnit = parseFloat(pricePerUnit);

// //     // Update new fields
// //     if (isFeatured !== undefined) {
// //       product.isFeatured = isFeatured === 'true' || isFeatured === true;
// //     }

// //     // Parse and update quantity based pricing
// //     if (quantityBasedPricing) {
// //       try {
// //         const parsed = typeof quantityBasedPricing === 'string' 
// //           ? JSON.parse(quantityBasedPricing) 
// //           : quantityBasedPricing;
// //         product.quantityBasedPricing = parsed;
// //       } catch (error) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'Invalid quantity based pricing format'
// //         });
// //       }
// //     }

// //     // Parse and update sizes
// //     if (sizes) {
// //       try {
// //         const parsed = typeof sizes === 'string' 
// //           ? JSON.parse(sizes) 
// //           : sizes;
// //         if (parsed.length === 0) {
// //           return res.status(400).json({
// //             success: false,
// //             error: 'At least one size is required'
// //           });
// //         }
// //         product.sizes = parsed;
// //       } catch (error) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'Invalid sizes format'
// //         });
// //       }
// //     }

// //     // Parse and update colors
// //     if (colors) {
// //       try {
// //         const parsed = typeof colors === 'string' 
// //           ? JSON.parse(colors) 
// //           : colors;
// //         if (parsed.length === 0) {
// //           return res.status(400).json({
// //             success: false,
// //             error: 'At least one color is required'
// //           });
// //         }
// //         product.colors = parsed;
// //       } catch (error) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'Invalid colors format'
// //         });
// //       }
// //     }

// //     // Parse and update additional info
// //     if (additionalInfo) {
// //       try {
// //         const parsed = typeof additionalInfo === 'string' 
// //           ? JSON.parse(additionalInfo) 
// //           : additionalInfo;
        
// //         if (parsed && parsed.length > 0) {
// //           for (const info of parsed) {
// //             if (!info.fieldName || !info.fieldName.trim()) {
// //               return res.status(400).json({
// //                 success: false,
// //                 error: 'Field name is required for additional information'
// //               });
// //             }
// //             if (!info.fieldValue || !info.fieldValue.trim()) {
// //               return res.status(400).json({
// //                 success: false,
// //                 error: 'Field value is required for additional information'
// //               });
// //             }
// //           }
// //         }
        
// //         product.additionalInfo = parsed;
// //       } catch (error) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'Invalid additional info format'
// //         });
// //       }
// //     }

// //     // Parse and update tags
// //     if (tags) {
// //       try {
// //         const parsed = typeof tags === 'string' 
// //           ? JSON.parse(tags) 
// //           : tags;
        
// //         if (parsed && parsed.length > 0) {
// //           const validTags = [
// //             'Top Ranking', 'New Arrival', 'Top Deal', 'Best Seller',
// //             'Summer Collection', 'Winter Collection', 'Limited Edition', 'Trending'
// //           ];
          
// //           for (const tag of parsed) {
// //             if (!validTags.includes(tag)) {
// //               return res.status(400).json({
// //                 success: false,
// //                 error: `Invalid tag: ${tag}`
// //               });
// //             }
// //           }
// //         }
        
// //         product.tags = parsed;
// //       } catch (error) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'Invalid tags format'
// //         });
// //       }
// //     }

// //     // Parse and update meta settings
// //     if (metaSettings) {
// //       try {
// //         const parsed = typeof metaSettings === 'string' 
// //           ? JSON.parse(metaSettings) 
// //           : metaSettings;
        
// //         if (parsed.metaTitle && parsed.metaTitle.length > 70) {
// //           return res.status(400).json({
// //             success: false,
// //             error: 'Meta title should not exceed 70 characters'
// //           });
// //         }

// //         if (parsed.metaDescription && parsed.metaDescription.length > 160) {
// //           return res.status(400).json({
// //             success: false,
// //             error: 'Meta description should not exceed 160 characters'
// //           });
// //         }

// //         product.metaSettings = {
// //           ...product.metaSettings,
// //           ...parsed
// //         };
// //       } catch (error) {
// //         return res.status(400).json({
// //           success: false,
// //           error: 'Invalid meta settings format'
// //         });
// //       }
// //     }

// //     // Update images if provided
// //     if (images && Array.isArray(images) && images.length > 0) {
// //       // Delete old images from Cloudinary
// //       for (const image of product.images) {
// //         if (image.publicId) {
// //           try {
// //             await cloudinary.uploader.destroy(image.publicId);
// //           } catch (cloudinaryError) {
// //             console.error('Error deleting image from Cloudinary:', cloudinaryError);
// //           }
// //         }
// //       }

// //       // Process new images
// //       const processedImages = images.map((url, index) => ({
// //         url: url,
// //         publicId: extractPublicIdFromUrl(url),
// //         isPrimary: index === 0
// //       }));
      
// //       product.images = processedImages;
// //     }

// //     await product.save();

// //     // Prepare update data for embedded product in category
// //     const updateData = {
// //       productName: product.productName,
// //       description: product.description,
// //       instruction: product.instruction,
// //       targetedCustomer: product.targetedCustomer,
// //       fabric: product.fabric,
// //       sizes: product.sizes,
// //       colors: product.colors,
// //       moq: product.moq,
// //       pricePerUnit: product.pricePerUnit,
// //       quantityBasedPricing: product.quantityBasedPricing,
// //       additionalInfo: product.additionalInfo || [],
// //       images: product.images,
// //       isActive: product.isActive,
// //       isFeatured: product.isFeatured,
// //       tags: product.tags,
// //       subcategoryId: product.subcategory,
// //       subcategoryName: product.subcategoryName,
// //       childSubcategoryId: product.childSubcategory, // NEW
// //       childSubcategoryName: product.childSubcategoryName, // NEW
// //       updatedAt: new Date()
// //     };

// //     // If category changed, remove from old and add to new
// //     if (category && category !== oldCategory) {
// //       await removeEmbeddedProductFromCategory(oldCategory, product._id);
      
// //       const embeddedProduct = {
// //         productId: product._id,
// //         ...updateData,
// //         createdBy: product.createdBy,
// //         createdAt: product.createdAt
// //       };
      
// //       await Category.findByIdAndUpdate(
// //         newCategory,
// //         {
// //           $push: { products: embeddedProduct },
// //           $inc: { productCount: 1 }
// //         }
// //       );
// //     } else {
// //       await updateEmbeddedProductInCategory(newCategory, product._id, updateData);
// //     }

// //     await product.populate([
// //       { path: 'category', select: 'name slug' },
// //       { path: 'createdBy', select: 'contactPerson' }
// //     ]);

// //     res.json({
// //       success: true,
// //       data: product,
// //       message: 'Product updated successfully'
// //     });
// //   } catch (error) {
// //     console.error('Update product error:', error);
// //     res.status(500).json({
// //       success: false,
// //       error: error.message || 'Server error while updating product'
// //     });
// //   }
// // };

// // @desc    Update product - WITH SUBCATEGORY, CHILD SUBCATEGORY, ORDER UNIT & WEIGHT SUPPORT
// // @route   PUT /api/products/:id
// // @access  Private (Moderator/Admin)
// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     // Check permissions
//     if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
//       return res.status(403).json({
//         success: false,
//         error: 'You do not have permission to update products'
//       });
//     }

//     const {
//       productName,
//       description,
//       instruction,
//       category,
//       subcategory,
//       childSubcategory,
//       targetedCustomer,
//       fabric,
//       orderUnit,        // ← ADD THIS
//       weightPerUnit,    // ← ADD THIS
//       moq,
//       pricePerUnit,
//       quantityBasedPricing,
//       sizes,
//       colors,
//       additionalInfo,
//       customizationOptions,
//       isFeatured,
//       tags,
//       metaSettings,
//       images,
//       imagesToDelete
//     } = req.body;

//     // Store old values for count updates
//     const oldCategory = product.category.toString();
//     const oldSubcategoryId = product.subcategory ? product.subcategory.toString() : null;
//     const oldChildSubcategoryId = product.childSubcategory ? product.childSubcategory.toString() : null;
    
//     const newCategory = category || oldCategory;
//     let newSubcategoryId = subcategory || null;
//     let newSubcategoryName = '';
//     let newChildSubcategoryId = childSubcategory || null;
//     let newChildSubcategoryName = '';

//     // Check if category is being changed
//     if (category && category !== oldCategory) {
//       const categoryExists = await Category.findById(category);
//       if (!categoryExists) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid category'
//         });
//       }
//     }

//     // Handle subcategory validation
//     if (newSubcategoryId) {
//       const categoryDoc = await Category.findById(newCategory);
//       if (!categoryDoc) {
//         return res.status(400).json({
//           success: false,
//           error: 'Category not found'
//         });
//       }
      
//       const subcategoryDoc = categoryDoc.subcategories.id(newSubcategoryId);
//       if (!subcategoryDoc) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid subcategory for this category'
//         });
//       }
//       newSubcategoryName = subcategoryDoc.name;
      
//       // Handle child subcategory validation
//       if (newChildSubcategoryId) {
//         const childSubcategoryDoc = subcategoryDoc.children.id(newChildSubcategoryId);
//         if (!childSubcategoryDoc) {
//           return res.status(400).json({
//             success: false,
//             error: 'Invalid child subcategory for this subcategory'
//           });
//         }
//         newChildSubcategoryName = childSubcategoryDoc.name;
//       }
//     }

//     // Handle count updates for subcategories and child subcategories (existing code remains)
//     // ... (keep your existing count update logic)

//     // Delete old images from Cloudinary if provided
//     if (imagesToDelete && Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
//       for (const publicId of imagesToDelete) {
//         try {
//           await cloudinary.uploader.destroy(publicId);
//           console.log('Deleted image from Cloudinary:', publicId);
//         } catch (cloudinaryError) {
//           console.error('Error deleting image from Cloudinary:', cloudinaryError);
//         }
//       }
//     }

//     // Update basic fields
//     if (productName) product.productName = productName;
//     if (description !== undefined) product.description = description;
//     if (instruction !== undefined) product.instruction = instruction;
//     if (category) product.category = category;
//     if (subcategory !== undefined) {
//       product.subcategory = newSubcategoryId;
//       product.subcategoryName = newSubcategoryName;
//     }
//     if (childSubcategory !== undefined) {
//       product.childSubcategory = newChildSubcategoryId;
//       product.childSubcategoryName = newChildSubcategoryName;
//     }
//     if (targetedCustomer) product.targetedCustomer = targetedCustomer;
//     if (fabric) product.fabric = fabric;
    
//     // ← ADD THESE NEW FIELD UPDATES ↓
//     if (orderUnit !== undefined) {
//       product.orderUnit = orderUnit;
//     }
//     if (weightPerUnit !== undefined) {
//       product.weightPerUnit = weightPerUnit ? parseFloat(weightPerUnit) : null;
//     }
    
//     if (moq) product.moq = parseInt(moq);
//     if (pricePerUnit) product.pricePerUnit = parseFloat(pricePerUnit);

//     // Update new fields
//     if (isFeatured !== undefined) {
//       product.isFeatured = isFeatured === 'true' || isFeatured === true;
//     }

//     // Parse and update quantity based pricing
//     if (quantityBasedPricing) {
//       try {
//         const parsed = typeof quantityBasedPricing === 'string' 
//           ? JSON.parse(quantityBasedPricing) 
//           : quantityBasedPricing;
//         product.quantityBasedPricing = parsed;
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid quantity based pricing format'
//         });
//       }
//     }

//     // Parse and update sizes
//     if (sizes) {
//       try {
//         const parsed = typeof sizes === 'string' 
//           ? JSON.parse(sizes) 
//           : sizes;
//         // Sizes are now optional - no validation for empty
//         product.sizes = parsed;
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid sizes format'
//         });
//       }
//     }

//     // Parse and update colors
//     if (colors) {
//       try {
//         const parsed = typeof colors === 'string' 
//           ? JSON.parse(colors) 
//           : colors;
//         if (parsed.length === 0) {
//           return res.status(400).json({
//             success: false,
//             error: 'At least one color is required'
//           });
//         }
//         product.colors = parsed;
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid colors format'
//         });
//       }
//     }

//     // Parse and update additional info
//     if (additionalInfo) {
//       try {
//         const parsed = typeof additionalInfo === 'string' 
//           ? JSON.parse(additionalInfo) 
//           : additionalInfo;
//         product.additionalInfo = parsed;
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid additional info format'
//         });
//       }
//     }

//     // Parse and update customization options
//     if (customizationOptions) {
//       try {
//         const parsed = typeof customizationOptions === 'string' 
//           ? JSON.parse(customizationOptions) 
//           : customizationOptions;
//         product.customizationOptions = parsed;
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid customization options format'
//         });
//       }
//     }

//     // Parse and update tags
//     if (tags) {
//       try {
//         const parsed = typeof tags === 'string' 
//           ? JSON.parse(tags) 
//           : tags;
//         product.tags = parsed;
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid tags format'
//         });
//       }
//     }

//     // Parse and update meta settings
//     if (metaSettings) {
//       try {
//         const parsed = typeof metaSettings === 'string' 
//           ? JSON.parse(metaSettings) 
//           : metaSettings;
        
//         if (parsed.metaTitle && parsed.metaTitle.length > 70) {
//           return res.status(400).json({
//             success: false,
//             error: 'Meta title should not exceed 70 characters'
//           });
//         }

//         if (parsed.metaDescription && parsed.metaDescription.length > 160) {
//           return res.status(400).json({
//             success: false,
//             error: 'Meta description should not exceed 160 characters'
//           });
//         }

//         product.metaSettings = {
//           ...product.metaSettings,
//           ...parsed
//         };
//       } catch (error) {
//         return res.status(400).json({
//           success: false,
//           error: 'Invalid meta settings format'
//         });
//       }
//     }

//     // Update images if provided
//     if (images && Array.isArray(images) && images.length > 0) {
//       // Delete old images from Cloudinary
//       for (const image of product.images) {
//         if (image.publicId) {
//           try {
//             await cloudinary.uploader.destroy(image.publicId);
//           } catch (cloudinaryError) {
//             console.error('Error deleting image from Cloudinary:', cloudinaryError);
//           }
//         }
//       }

//       // Process new images
//       const processedImages = images.map((url, index) => ({
//         url: url,
//         publicId: extractPublicIdFromUrl(url),
//         isPrimary: index === 0
//       }));
      
//       product.images = processedImages;
//     }

//     await product.save();

//     // Prepare update data for embedded product in category (include orderUnit and weightPerUnit)
//     const updateData = {
//       productName: product.productName,
//       description: product.description,
//       instruction: product.instruction,
//       targetedCustomer: product.targetedCustomer,
//       fabric: product.fabric,
//       orderUnit: product.orderUnit,        // ← ADD THIS
//       weightPerUnit: product.weightPerUnit, // ← ADD THIS
//       sizes: product.sizes,
//       colors: product.colors,
//       moq: product.moq,
//       pricePerUnit: product.pricePerUnit,
//       quantityBasedPricing: product.quantityBasedPricing,
//       additionalInfo: product.additionalInfo || [],
//       customizationOptions: product.customizationOptions || [],
//       images: product.images,
//       isActive: product.isActive,
//       isFeatured: product.isFeatured,
//       tags: product.tags,
//       subcategoryId: product.subcategory,
//       subcategoryName: product.subcategoryName,
//       childSubcategoryId: product.childSubcategory,
//       childSubcategoryName: product.childSubcategoryName,
//       updatedAt: new Date()
//     };

//     // If category changed, remove from old and add to new
//     if (category && category !== oldCategory) {
//       await removeEmbeddedProductFromCategory(oldCategory, product._id);
      
//       const embeddedProduct = {
//         productId: product._id,
//         ...updateData,
//         createdBy: product.createdBy,
//         createdAt: product.createdAt
//       };
      
//       await Category.findByIdAndUpdate(
//         newCategory,
//         {
//           $push: { products: embeddedProduct },
//           $inc: { productCount: 1 }
//         }
//       );
//     } else {
//       await updateEmbeddedProductInCategory(newCategory, product._id, updateData);
//     }

//     await product.populate([
//       { path: 'category', select: 'name slug' },
//       { path: 'createdBy', select: 'contactPerson' }
//     ]);

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

// // Helper function to extract public ID from Cloudinary URL
// // const extractPublicIdFromUrl = (url) => {
// //   if (!url) return null;
  
// //   try {
// //     const parts = url.split('/');
// //     const uploadIndex = parts.findIndex(part => part === 'upload');
// //     if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
// //       const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
// //       const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
// //       return publicId;
// //     }
// //   } catch (error) {
// //     console.error('Error extracting public ID from URL:', error);
// //   }
  
// //   return null;
// // };


// // @desc    Delete product
// // @route   DELETE /api/products/:id





// // @access  Private (Admin only)
// // const deleteProduct = async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id);

// //     if (!product) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Product not found'
// //       });
// //     }

// //     // Check permissions
// //     if (req.user.role !== 'admin') {
// //       return res.status(403).json({
// //         success: false,
// //         error: 'Only admins can delete products'
// //       });
// //     }

// //     // Remove embedded product from category
// //     await removeEmbeddedProductFromCategory(product.category, product._id);

// //     // Delete images from Cloudinary
// //     for (const image of product.images) {
// //       if (image.publicId) {
// //         await cloudinary.uploader.destroy(image.publicId);
// //       }
// //     }

// //     await product.deleteOne();

// //     res.json({
// //       success: true,
// //       message: 'Product deleted successfully'
// //     });
// //   } catch (error) {
// //     console.error('Delete product error:', error);
// //     res.status(500).json({
// //       success: false,
// //       error: error.message || 'Server error while deleting product'
// //     });
// //   }
// // };

// // @desc    Delete product
// // @route   DELETE /api/products/:id
// // @access  Private (Admin only)
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     // Check permissions
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({
//         success: false,
//         error: 'Only admins can delete products'
//       });
//     }


//     // Decrement child subcategory product count if product has a child subcategory
//     if (product.childSubcategory && product.subcategory) {
//       await Category.findOneAndUpdate(
//         { 
//           _id: product.category,
//           'subcategories._id': product.subcategory,
//           'subcategories.children._id': product.childSubcategory
//         },
//         {
//           $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 }
//         },
//         {
//           arrayFilters: [
//             { 'sub._id': product.subcategory },
//             { 'child._id': product.childSubcategory }
//           ]
//         }
//       );
//       console.log(`Decremented product count for child subcategory: ${product.childSubcategoryName}`);
//     }

//     // Decrement subcategory product count if product has a subcategory
//     if (product.subcategory) {
//       await Category.findOneAndUpdate(
//         { 
//           _id: product.category,
//           'subcategories._id': product.subcategory
//         },
//         { $inc: { 'subcategories.$.productCount': -1 } }
//       );
//       console.log(`Decremented product count for subcategory: ${product.subcategoryName}`);
//     }

//     // Remove embedded product from category
//     await removeEmbeddedProductFromCategory(product.category, product._id);

//     // Delete images from Cloudinary
//     for (const image of product.images) {
//       if (image.publicId) {
//         await cloudinary.uploader.destroy(image.publicId);
//       }
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

// // @desc    Toggle product active status
// // @route   PUT /api/products/:id/toggle
// // @access  Private (Admin only)
// // const toggleProductStatus = async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id);

// //     if (!product) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Product not found'
// //       });
// //     }

// //     product.isActive = !product.isActive;
// //     await product.save();

// //     // Update embedded product in category
// //     // await updateEmbeddedProductInCategory(product.category, product._id, {
// //     //   isActive: product.isActive
// //     // });
// //       // Update embedded product in category with complete data
// //     await updateEmbeddedProductInCategory(product.category, product._id, {
// //       productName: product.productName,
// //       description: product.description,
// //       targetedCustomer: product.targetedCustomer,
// //       fabric: product.fabric,
// //       sizes: product.sizes,
// //       colors: product.colors,
// //       moq: product.moq,
// //       pricePerUnit: product.pricePerUnit,
// //       quantityBasedPricing: product.quantityBasedPricing,
// //       additionalInfo: product.additionalInfo || [], // Include additionalInfo
// //       images: product.images,
// //       isActive: product.isActive
// //     });

// //     res.json({
// //       success: true,
// //       data: product,
// //       message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`
// //     });
// //   } catch (error) {
// //     console.error('Toggle product error:', error);
// //     res.status(500).json({
// //       success: false,
// //       error: error.message || 'Server error while toggling product status'
// //     });
// //   }
// // };
// // @desc    Toggle product active status - UPDATE THIS
// // @route   PUT /api/products/:id/toggle
// // @access  Private (Admin only)
// const toggleProductStatus = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     product.isActive = !product.isActive;
//     await product.save();

//     // Update embedded product in category with complete data including new fields
//     await updateEmbeddedProductInCategory(product.category, product._id, {
//       productName: product.productName,
//       description: product.description,
//       targetedCustomer: product.targetedCustomer,
//       fabric: product.fabric,
//       sizes: product.sizes,
//       colors: product.colors,
//       moq: product.moq,
//       pricePerUnit: product.pricePerUnit,
//       quantityBasedPricing: product.quantityBasedPricing,
//       additionalInfo: product.additionalInfo || [],
//       images: product.images,
//       isActive: product.isActive,
//       isFeatured: product.isFeatured, // NEW
//       tags: product.tags // NEW
//     });

//     res.json({
//       success: true,
//       data: product,
//       message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`
//     });
//   } catch (error) {
//     console.error('Toggle product error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while toggling product status'
//     });
//   }
// };

// // @desc    Get products by category
// // @route   GET /api/products/category/:categoryId
// // @access  Public
// const getProductsByCategory = async (req, res) => {
//   try {
//     const { categoryId } = req.params;
//     const { page = 1, limit = 12 } = req.query;

//     // Check if category exists
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({
//         success: false,
//         error: 'Category not found'
//       });
//     }

//     const query = { 
//       category: categoryId,
//       isActive: true
//     };

//     const products = await Product.find(query)
//       .populate('category', 'name slug')
//       .populate('createdBy', 'contactPerson')
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit))
//       .skip((parseInt(page) - 1) * parseInt(limit));

//     const total = await Product.countDocuments(query);

//     res.json({
//       success: true,
//       data: {
//         category,
//         products,
//         pagination: {
//           total,
//           page: parseInt(page),
//           pages: Math.ceil(total / parseInt(limit)),
//           limit: parseInt(limit)
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Get products by category error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching products by category'
//     });
//   }
// };

// module.exports = {
//   createProduct,
//   getProducts,
//   getProductById,
//   getProductsByCategory,
//   updateProduct,
//   deleteProduct,
//   toggleProductStatus,
//   updateEmbeddedProductInCategory,
//   removeEmbeddedProductFromCategory,
// };

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
    if (!deliveryInfo) {
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
// Process additional info - FIXED VERSION
let processedAdditionalInfo = [];
console.log('=== DEBUGGING ADDITIONAL INFO ===');
console.log('Raw additionalInfo:', additionalInfo);
console.log('Type:', typeof additionalInfo);

if (additionalInfo) {
  // If it's a string, parse it
  let additionalInfoData = additionalInfo;
  if (typeof additionalInfo === 'string') {
    try {
      additionalInfoData = JSON.parse(additionalInfo);
      console.log('Parsed from string:', additionalInfoData);
    } catch (e) {
      console.error('Error parsing additionalInfo string:', e);
    }
  }
  
  // If it's an array, use it directly
  if (Array.isArray(additionalInfoData) && additionalInfoData.length > 0) {
    processedAdditionalInfo = additionalInfoData.map(info => ({
      fieldName: info.fieldName,
      fieldValue: info.fieldValue
    }));
    console.log('Processed additionalInfo:', processedAdditionalInfo);
  } else if (additionalInfoData && typeof additionalInfoData === 'object' && !Array.isArray(additionalInfoData)) {
    // Handle case where it might be an object
    console.log('additionalInfo is an object, converting to array');
    processedAdditionalInfo = [{
      fieldName: additionalInfoData.fieldName || '',
      fieldValue: additionalInfoData.fieldValue || ''
    }];
  }
}

console.log('Final processedAdditionalInfo:', processedAdditionalInfo);

    // Process meta settings
    let processedMetaSettings = {};
    if (metaSettings) {
      processedMetaSettings = {
        metaTitle: metaSettings.metaTitle || '',
        metaDescription: metaSettings.metaDescription || '',
        metaKeywords: metaSettings.metaKeywords || []
      };
    }

    // Check if SKU already exists (if provided)
    if (skuCode) {
      const existingProduct = await Product.findOne({ skuCode });
      if (existingProduct) {
        return res.status(400).json({ success: false, error: 'SKU code already exists' });
      }
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

    // Update basic fields
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
    if (tags) product.tags = tags;
    if (promotion !== undefined) product.promotion = promotion;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (rating !== undefined) product.rating = rating;
    if (videoUrl !== undefined) product.videoUrl = videoUrl;
    if (videoPublicId !== undefined) product.videoPublicId = videoPublicId;
    if (videoType !== undefined) product.videoType = videoType;
    if (additionalInfo) product.additionalInfo = additionalInfo;
    if (metaSettings) product.metaSettings = metaSettings;

    // Update category if changed
    if (category && category !== product.category.toString()) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ success: false, error: 'Invalid category' });
      }
      product.category = category;
      product.categoryName = categoryExists.name;
      
      // Update subcategory info
      if (subcategory) {
        const subcategoryDoc = categoryExists.subcategories.id(subcategory);
        if (subcategoryDoc) {
          product.subcategory = subcategory;
          product.subcategoryName = subcategoryDoc.name;
        }
      }
      
      if (childSubcategory && subcategory) {
        const subcategoryDoc = categoryExists.subcategories.id(subcategory);
        if (subcategoryDoc) {
          const childDoc = subcategoryDoc.children.id(childSubcategory);
          if (childDoc) {
            product.childSubcategory = childSubcategory;
            product.childSubcategoryName = childDoc.name;
          }
        }
      }
    }

    // Update images if provided
    if (images && Array.isArray(images) && images.length > 0) {
      const processedImages = images.map((url, index) => ({
        url: url,
        publicId: extractPublicIdFromUrl(url),
        isPrimary: index === 0
      }));
      product.images = processedImages;
    }

    await product.save();

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
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Only admins can delete products' });
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