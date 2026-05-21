




const Review = require('../models/Review');
const Product = require('../models/Product');
const User = require('../models/User');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// @desc    Create a new review (supports both logged-in and guest users)
// @route   POST /api/reviews
// @access  Public (with optional auth)
// const createReview = async (req, res) => {
//   try {
//     const {
//       rating,
//       title,
//       comment,
//       productId,
//       productName,
//       images = [],
//       video = null,
//       isAnonymous = false,
//       reviewerName,
//       email
//     } = req.body;

//     // Check if user is logged in
//     const isLoggedIn = req.user && req.user.id;
    
//     let userId = null;
//     let userName = '';
//     let userEmail = '';
//     let isGuest = false;

//     if (isLoggedIn) {
//       // Logged in user
//       userId = req.user.id;
//       userEmail = req.user.email;
//       userName = req.user.contactPerson || req.user.companyName || userEmail.split('@')[0];
//       isGuest = false;
//     } else {
//       // Guest user - validation required
//       if (!reviewerName || !reviewerName.trim()) {
//         return res.status(400).json({
//           success: false,
//           error: 'Please provide your name'
//         });
//       }
      
//       if (!email || !email.trim()) {
//         return res.status(400).json({
//           success: false,
//           error: 'Please provide your email address'
//         });
//       }
      
//       if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//         return res.status(400).json({
//           success: false,
//           error: 'Please provide a valid email address'
//         });
//       }
      
//       userName = reviewerName.trim();
//       userEmail = email.toLowerCase().trim();
//       isGuest = true;
//     }

//     // Validation
//     if (!rating || rating < 1 || rating > 5) {
//       return res.status(400).json({
//         success: false,
//         error: 'Rating must be between 1 and 5'
//       });
//     }

//     if (!comment || comment.trim().length < 10) {
//       return res.status(400).json({
//         success: false,
//         error: 'Review must be at least 10 characters long'
//       });
//     }

//     if (comment.length > 500) {
//       return res.status(400).json({
//         success: false,
//         error: 'Review cannot exceed 500 characters'
//       });
//     }

//     // For logged-in users, check if they've already reviewed this product
//     if (!isGuest && productId) {
//       const existingReview = await Review.findOne({
//         user: userId,
//         product: productId
//       });

//       if (existingReview) {
//         return res.status(400).json({
//           success: false,
//           error: 'You have already reviewed this product'
//         });
//       }
//     }
    
//     // For guest users, check if same email has reviewed this product recently
//     if (isGuest && productId) {
//       const existingReview = await Review.findOne({
//         guestEmail: userEmail,
//         product: productId,
//         createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
//       });

//       if (existingReview) {
//         return res.status(400).json({
//           success: false,
//           error: 'You have already reviewed this product recently'
//         });
//       }
//     }

//     // Create review
//     const review = await Review.create({
//       user: userId,
//       userName,
//       email: userEmail,
//       product: productId || null,
//       productName: productName || '',
//       rating,
//       title: title || '',
//       comment: comment.trim(),
//       images: images || [],
//       video: video || null,
//       isAnonymous: isLoggedIn ? isAnonymous : false, // Guests cannot be anonymous
//       isGuest,
//       guestEmail: isGuest ? userEmail : null,
//       guestName: isGuest ? userName : null,
//       isVerifiedPurchase: false,
//       status: 'pending',
//       isApproved: false
//     });

//     // Populate user info for response (if logged in)
//     if (!isGuest) {
//       await review.populate('user', 'contactPerson email profilePicture');
//     }

//     res.status(201).json({
//       success: true,
//       data: review,
//       message: isGuest 
//         ? 'Review submitted successfully! It will be published after moderation.'
//         : 'Review submitted successfully and pending approval'
//     });

//   } catch (error) {
//     console.error('Create review error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Failed to submit review'
//     });
//   }
// };

// @desc    Create a new review (supports both logged-in and guest users)
// @route   POST /api/reviews
// @access  Public (with optional auth)
const createReview = async (req, res) => {
  try {
    const {
      rating,
      title,
      comment,
      productId,
      productName,
      images = [],
      video = null,
      isAnonymous = false,
      reviewerName,
      email
    } = req.body;

    // Check if user is logged in
    const isLoggedIn = req.user && req.user.id;
    
    let userId = null;
    let userName = '';
    let userEmail = '';
    let isGuest = false;
    let isVerifiedPurchase = false;

    if (isLoggedIn) {
      // Logged in user
      userId = req.user.id;
      userEmail = req.user.email;
      userName = req.user.contactPerson || req.user.companyName || userEmail.split('@')[0];
      isGuest = false;
      
      // Check if user has purchased this product
      if (productId) {
        const Order = require('../models/Order');
        
        // Find if user has a completed order with this product
        const hasPurchased = await Order.findOne({
          userId: userId,
          orderStatus: 'delivered', // or 'completed', 'confirmed' depending on your order flow
          'items.productId': productId
        });
        
        isVerifiedPurchase = !!hasPurchased;
      }
    } else {
      // Guest user - validation required
      if (!reviewerName || !reviewerName.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Please provide your name'
        });
      }
      
      if (!email || !email.trim()) {
        return res.status(400).json({
          success: false,
          error: 'Please provide your email address'
        });
      }
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          success: false,
          error: 'Please provide a valid email address'
        });
      }
      
      userName = reviewerName.trim();
      userEmail = email.toLowerCase().trim();
      isGuest = true;
      isVerifiedPurchase = false; // Guest users cannot be verified
    }

    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    if (!comment || comment.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: 'Review must be at least 10 characters long'
      });
    }

    if (comment.length > 500) {
      return res.status(400).json({
        success: false,
        error: 'Review cannot exceed 500 characters'
      });
    }

    // For logged-in users, check if they've already reviewed this product
    if (!isGuest && productId) {
      const existingReview = await Review.findOne({
        user: userId,
        product: productId
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          error: 'You have already reviewed this product'
        });
      }
    }
    
    // For guest users, check if same email has reviewed this product recently
    if (isGuest && productId) {
      const existingReview = await Review.findOne({
        guestEmail: userEmail,
        product: productId,
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      });

      if (existingReview) {
        return res.status(400).json({
          success: false,
          error: 'You have already reviewed this product recently'
        });
      }
    }

    // Create review
    const review = await Review.create({
      user: userId,
      userName,
      email: userEmail,
      product: productId || null,
      productName: productName || '',
      rating,
      title: title || '',
      comment: comment.trim(),
      images: images || [],
      video: video || null,
      isAnonymous: isLoggedIn ? isAnonymous : false, // Guests cannot be anonymous
      isGuest,
      guestEmail: isGuest ? userEmail : null,
      guestName: isGuest ? userName : null,
      isVerifiedPurchase, // Set based on purchase history
      status: 'pending',
      isApproved: false
    });

    // Populate user info for response (if logged in)
    if (!isGuest) {
      await review.populate('user', 'contactPerson email profilePicture');
    }

    res.status(201).json({
      success: true,
      data: review,
      message: isGuest 
        ? 'Review submitted successfully! It will be published after moderation.'
        : `Review submitted successfully and pending approval${isVerifiedPurchase ? ' (Verified Purchase)' : ''}`
    });

  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to submit review'
    });
  }
};

// @desc    Get all reviews (with filters)
// @route   GET /api/reviews
// @access  Public/Private (Admin/Mod can see all)
// const getReviews = async (req, res) => {
//   try {
//     console.log('=== GET REVIEWS DEBUG ===');
//     console.log('User:', req.user ? { id: req.user.id, role: req.user.role } : 'No user');
//     console.log('Query params:', req.query);
    
//     const {
//       page = 1,
//       limit = 10,
//       productId,
//       userId,
//       status,
//       rating,
//       isApproved,
//       search,
//       sort = '-createdAt'
//     } = req.query;

//     const query = {};

//     // Filter by product
//     if (productId) {
//       query.product = productId;
//     }

//     // Filter by user
//     if (userId) {
//       query.user = userId;
//     }

//     // IMPORTANT: For admin users, show ALL reviews - no status filter
//     // Only apply status filter if specifically requested by admin
//     if (status && status !== 'all') {
//       query.status = status;
//     }
    
//     // If no status filter and user is not admin, only show approved
//     if (!status && (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator'))) {
//       query.status = 'approved';
//       query.isApproved = true;
//     }

//     // Filter by rating
//     if (rating && rating !== 'all') {
//       query.rating = parseInt(rating);
//     }

//     // Filter by approval status (admin/mod only)
//     if (isApproved !== undefined && isApproved !== 'all' && req.user && (req.user.role === 'admin' || req.user.role === 'moderator')) {
//       query.isApproved = isApproved === 'true';
//     }

//     // Search in comment and title
//     if (search && search.trim()) {
//       query.$or = [
//         { comment: { $regex: search, $options: 'i' } },
//         { title: { $regex: search, $options: 'i' } },
//         { userName: { $regex: search, $options: 'i' } }
//       ];
//     }

//     console.log('Final query:', JSON.stringify(query, null, 2));
    
//     // First, let's count total documents without any filters to debug
//     const totalAll = await Review.countDocuments({});
//     console.log('Total reviews in database:', totalAll);
    
//     // Count with our query
//     const countWithQuery = await Review.countDocuments(query);
//     console.log('Reviews matching query:', countWithQuery);
    
//     // Pagination
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     // Sort options
//     let sortOption = {};
//     switch (sort) {
//       case 'rating_asc':
//         sortOption = { rating: 1 };
//         break;
//       case 'rating_desc':
//         sortOption = { rating: -1 };
//         break;
//       case 'oldest':
//         sortOption = { createdAt: 1 };
//         break;
//       default:
//         sortOption = { createdAt: -1 };
//     }

//     const [reviews, total] = await Promise.all([
//       Review.find(query)
//         .populate('user', 'contactPerson email profilePicture')
//         .populate('product', 'productName slug images')
//         .sort(sortOption)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Review.countDocuments(query)
//     ]);

//     console.log(`Found ${reviews.length} reviews out of ${total} total matching query`);
//     console.log('First review sample:', reviews[0] ? {
//       id: reviews[0]._id,
//       productName: reviews[0].productName,
//       status: reviews[0].status
//     } : 'No reviews');

//     // Calculate average rating and distribution for products (if product filter is applied)
//     let stats = null;
//     if (productId) {
//       const allProductReviews = await Review.find({ 
//         product: productId, 
//         status: 'approved',
//         isApproved: true 
//       });
      
//       const totalReviews = allProductReviews.length;
//       const avgRating = totalReviews > 0 
//         ? allProductReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
//         : 0;
      
//       const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//       allProductReviews.forEach(r => {
//         distribution[r.rating]++;
//       });
      
//       stats = {
//         averageRating: Math.round(avgRating * 10) / 10,
//         totalReviews,
//         ratingDistribution: distribution
//       };
//     }

//     res.json({
//       success: true,
//       data: reviews,
//       stats,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });

//   } catch (error) {
//     console.error('Get reviews error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Failed to fetch reviews'
//     });
//   }
// };

// @desc    Get all reviews (with filters)
// @route   GET /api/reviews
// @access  Public/Private (Admin/Mod can see all)
const getReviews = async (req, res) => {
  try {
    console.log('=== GET REVIEWS DEBUG ===');
    console.log('User:', req.user ? { id: req.user.id, role: req.user.role } : 'No user');
    console.log('Query params:', req.query);
    
    const {
      page = 1,
      limit = 10,
      productId,
      userId,
      status,
      rating,
      isApproved,
      search,
      sort = '-createdAt'
    } = req.query;

    const query = {};

    // Filter by product
    if (productId) {
      query.product = productId;
    }

    // Filter by user
    if (userId) {
      query.user = userId;
    }

    // Get current logged-in user ID
    const currentUserId = req.user?._id || req.user?.id;
    const isAdminOrMod = req.user && (req.user.role === 'admin' || req.user.role === 'moderator');
  // ADD THESE LOGS HERE (after defining isAdminOrMod and currentUserId)
    console.log('Is Admin/Mod:', isAdminOrMod);
    console.log('Current User ID for query:', currentUserId);
    console.log('Query params:', { productId, userId, status, rating, isApproved, search, sort });

    // ========== MODIFIED: Allow users to see their own pending/rejected reviews ==========
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // If no status filter and user is not admin/mod, show approved reviews + user's own pending/rejected
    if (!status && !isAdminOrMod) {
      // For non-admin users, show:
      // 1. All approved reviews
      // 2. Their own pending reviews
      // 3. Their own rejected reviews
      query.$or = [
        { status: 'approved', isApproved: true }, // All approved reviews
        ...(currentUserId ? [
          { user: currentUserId, status: 'pending' }, // User's own pending reviews
          { user: currentUserId, status: 'rejected' }  // User's own rejected reviews
        ] : [])
      ];
    }
    
    // For admin/mod, show all (no additional filtering)
    // For status='all' or when status is explicitly provided, use the existing query

    // Filter by rating
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }

    // Filter by approval status (admin/mod only)
    if (isApproved !== undefined && isApproved !== 'all' && isAdminOrMod) {
      query.isApproved = isApproved === 'true';
    }

    // Search in comment and title
    if (search && search.trim()) {
      const searchRegex = { $regex: search, $options: 'i' };
      query.$or = [
        ...(query.$or || []),
        { comment: searchRegex },
        { title: searchRegex },
        { userName: searchRegex }
      ];
    }

    console.log('Final query:', JSON.stringify(query, null, 2));
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'rating_asc':
        sortOption = { rating: 1 };
        break;
      case 'rating_desc':
        sortOption = { rating: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate('user', 'contactPerson email profilePicture')
        .populate('product', 'productName slug images')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments(query)
    ]);

    console.log(`Found ${reviews.length} reviews out of ${total} total matching query`);

    // Calculate average rating and distribution for products (if product filter is applied)
    let stats = null;
    if (productId) {
      const allProductReviews = await Review.find({ 
        product: productId, 
        status: 'approved',
        isApproved: true 
      });
      
      const totalReviews = allProductReviews.length;
      const avgRating = totalReviews > 0 
        ? allProductReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews 
        : 0;
      
      const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      allProductReviews.forEach(r => {
        distribution[r.rating]++;
      });
      
      stats = {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews,
        ratingDistribution: distribution
      };
    }

    res.json({
      success: true,
      data: reviews,
      stats,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch reviews'
    });
  }
};

// @desc    Get single review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'contactPerson email profilePicture')
      .populate('product', 'productName slug images regularPrice discountPrice');

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check if review is approved for public viewing
    if (review.status !== 'approved' && (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator'))) {
      return res.status(403).json({
        success: false,
        error: 'Review is not available'
      });
    }

    res.json({
      success: true,
      data: review
    });

  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch review'
    });
  }
};

// // @desc    Update review
// // @route   PUT /api/reviews/:id
// // @access  Private (Owner or Admin/Mod)
// const updateReview = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         error: 'Review not found'
//       });
//     }

//     // Check permissions - FIX: Handle case when review.user is null (guest review)
//     const isOwner = review.user && review.user.toString() === req.user.id;
//     const isModerator = req.user.role === 'moderator';
//     const isAdmin = req.user.role === 'admin';

//     // For guest reviews, only admin/moderator can edit
//     if (!review.user) {
//       if (!isModerator && !isAdmin) {
//         return res.status(403).json({
//           success: false,
//           error: 'Only admins and moderators can edit guest reviews'
//         });
//       }
//     } else if (!isOwner && !isModerator && !isAdmin) {
//       return res.status(403).json({
//         success: false,
//         error: 'You are not authorized to update this review'
//       });
//     }

//     // Regular users can only update their own pending reviews
//     if (isOwner && !isModerator && !isAdmin && review.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         error: 'You can only edit pending reviews'
//       });
//     }

//     const {
//       rating,
//       title,
//       comment,
//       images,
//       video,
//       isAnonymous,
//       status,
//       imagesToDelete,
//       videoToDelete,
//       newImages,
//       newVideo
//     } = req.body;

//     // Update fields
//     if (rating) review.rating = rating;
//     if (title !== undefined) review.title = title;
//     if (comment) review.comment = comment.trim();
//     if (isAnonymous !== undefined && review.user) review.isAnonymous = isAnonymous;
    
//     // Update status (admin/mod only)
//     if (status && (isModerator || isAdmin)) {
//       review.status = status;
//       if (status === 'approved') {
//         review.isApproved = true;
//       } else if (status === 'rejected') {
//         review.isApproved = false;
//       }
//     }

//     // Handle image deletion
//     if (imagesToDelete && imagesToDelete.length > 0 && (isModerator || isAdmin)) {
//       for (const publicId of imagesToDelete) {
//         try {
//           await cloudinary.uploader.destroy(publicId);
//         } catch (err) {
//           console.error('Failed to delete image:', err);
//         }
//       }
//       review.images = review.images.filter(img => !imagesToDelete.includes(img.publicId));
//     }

//     // Handle video deletion
//     if (videoToDelete && (isModerator || isAdmin)) {
//       try {
//         await cloudinary.uploader.destroy(videoToDelete, { resource_type: 'video' });
//       } catch (err) {
//         console.error('Failed to delete video:', err);
//       }
//       review.video = null;
//     }

//     // Add new images
//     if (newImages && newImages.length > 0 && (isModerator || isAdmin)) {
//       review.images = [...(review.images || []), ...newImages];
//     }

//     // Add new video
//     if (newVideo && (isModerator || isAdmin)) {
//       review.video = newVideo;
//     }

//     await review.save();

//     res.json({
//       success: true,
//       data: review,
//       message: 'Review updated successfully'
//     });

//   } catch (error) {
//     console.error('Update review error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Failed to update review'
//     });
//   }
// };


// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Owner or Admin/Mod)
const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Check permissions - Handle case when review.user is null (guest review)
    const isOwner = review.user && review.user.toString() === req.user.id;
    const isModerator = req.user.role === 'moderator';
    const isAdmin = req.user.role === 'admin';

    // For guest reviews, only admin/moderator can edit
    if (!review.user) {
      if (!isModerator && !isAdmin) {
        return res.status(403).json({
          success: false,
          error: 'Only admins and moderators can edit guest reviews'
        });
      }
    } else if (!isOwner && !isModerator && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to update this review'
      });
    }

    // Regular users can only update their own pending reviews
    if (isOwner && !isModerator && !isAdmin && review.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: 'You can only edit pending reviews'
      });
    }

    const {
      rating,
      title,
      comment,
      isAnonymous,
      status,
      isFeatured,
      imagesToDelete,
      videoToDelete,
      newImages,
      newVideo
    } = req.body;

    // Update text fields (always allowed for owner or admin/mod)
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment.trim();
    if (isAnonymous !== undefined && review.user) review.isAnonymous = isAnonymous;
    
    // Update status (admin/mod only)
    if (status && (isModerator || isAdmin)) {
      review.status = status;
      if (status === 'approved') {
        review.isApproved = true;
      } else if (status === 'rejected') {
        review.isApproved = false;
      }
    }
     if (isFeatured !== undefined && (isModerator || isAdmin)) {
      review.isFeatured = isFeatured;
    }


    // Handle image deletion - Allow owner OR admin/mod
    if (imagesToDelete && imagesToDelete.length > 0 && (isOwner || isModerator || isAdmin)) {
      for (const publicId of imagesToDelete) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted image: ${publicId}`);
        } catch (err) {
          console.error('Failed to delete image:', err);
        }
      }
      // Filter out deleted images from review
      review.images = review.images.filter(img => !imagesToDelete.includes(img.publicId));
    }

    // Handle video deletion - Allow owner OR admin/mod
    if (videoToDelete && (isOwner || isModerator || isAdmin)) {
      try {
        await cloudinary.uploader.destroy(videoToDelete, { resource_type: 'video' });
        console.log(`Deleted video: ${videoToDelete}`);
      } catch (err) {
        console.error('Failed to delete video:', err);
      }
      review.video = null;
    }

    // Add new images - Allow owner OR admin/mod
    if (newImages && newImages.length > 0 && (isOwner || isModerator || isAdmin)) {
      // Ensure images array exists
      if (!review.images) review.images = [];
      // Add new images
      review.images = [...review.images, ...newImages];
      console.log(`Added ${newImages.length} new images`);
    }

    // Add new video - Allow owner OR admin/mod
    if (newVideo && (isOwner || isModerator || isAdmin)) {
      review.video = newVideo;
      console.log('Added new video');
    }

    await review.save();

    console.log('Review updated successfully:', {
      id: review._id,
      imagesCount: review.images?.length,
      hasVideo: !!review.video
    });

    res.json({
      success: true,
      data: review,
      message: 'Review updated successfully'
    });

  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to update review'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin/Mod only)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Only admin or moderator can delete reviews
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({
        success: false,
        error: 'Only admins and moderators can delete reviews'
      });
    }

    // Delete images from Cloudinary
    if (review.images && review.images.length > 0) {
      for (const image of review.images) {
        if (image.publicId) {
          try {
            await cloudinary.uploader.destroy(image.publicId);
          } catch (cloudinaryError) {
            console.error('Failed to delete image from Cloudinary:', cloudinaryError);
          }
        }
      }
    }

    // Delete video from Cloudinary
    if (review.video && review.video.publicId) {
      try {
        await cloudinary.uploader.destroy(review.video.publicId, { resource_type: 'video' });
      } catch (cloudinaryError) {
        console.error('Failed to delete video from Cloudinary:', cloudinaryError);
      }
    }

    await review.deleteOne();

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete review'
    });
  }
};

// @desc    Approve review (Admin/Mod only)
// @route   PUT /api/reviews/:id/approve
// @access  Private (Admin/Mod)
const approveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    review.status = 'approved';
    review.isApproved = true;
    review.moderatedBy = req.user.id;
    review.moderatedAt = new Date();

    await review.save();

    // Update product rating if review is for a product
    if (review.product) {
      const productReviews = await Review.find({
        product: review.product,
        status: 'approved',
        isApproved: true
      });

      const totalReviews = productReviews.length;
      const avgRating = totalReviews > 0
        ? productReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
        : 0;

      await Product.findByIdAndUpdate(review.product, {
        rating: Math.round(avgRating * 10) / 10
      });
    }

    res.json({
      success: true,
      data: review,
      message: 'Review approved successfully'
    });

  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to approve review'
    });
  }
};

// @desc    Reject review (Admin/Mod only)
// @route   PUT /api/reviews/:id/reject
// @access  Private (Admin/Mod)
const rejectReview = async (req, res) => {
  try {
    const { moderationNote } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    review.status = 'rejected';
    review.isApproved = false;
    review.moderationNote = moderationNote || '';
    review.moderatedBy = req.user.id;
    review.moderatedAt = new Date();

    await review.save();

    res.json({
      success: true,
      data: review,
      message: 'Review rejected'
    });

  } catch (error) {
    console.error('Reject review error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to reject review'
    });
  }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
const markHelpful = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    const userId = req.user.id;

    // Check if user already marked as helpful
    if (review.helpfulUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        error: 'You have already marked this review as helpful'
      });
    }

    review.helpful += 1;
    review.helpfulUsers.push(userId);
    await review.save();

    res.json({
      success: true,
      data: { helpful: review.helpful },
      message: 'Review marked as helpful'
    });

  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to mark review as helpful'
    });
  }
};

// @desc    Reply to review (Admin/Mod only)
// @route   POST /api/reviews/:id/reply
// @access  Private (Admin/Mod)
const replyToReview = async (req, res) => {
  try {
    const { replyText } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    if (!replyText || replyText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Reply text is required'
      });
    }

    review.reply = {
      text: replyText.trim(),
      repliedBy: req.user.id,
      repliedAt: new Date()
    };

    await review.save();

    await review.populate('reply.repliedBy', 'contactPerson email');

    res.json({
      success: true,
      data: review,
      message: 'Reply added successfully'
    });

  } catch (error) {
    console.error('Reply to review error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to add reply'
    });
  }
};

// @desc    Get user's own reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [reviews, total] = await Promise.all([
      Review.find({ user: req.user.id })
        .populate('product', 'productName slug images regularPrice discountPrice')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Review.countDocuments({ user: req.user.id })
    ]);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Get my reviews error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch your reviews'
    });
  }
};

// @desc    Upload media for review
// @route   POST /api/reviews/upload-media
// @access  Private
const uploadMedia = async (req, res) => {
  try {
    const { file, type } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file provided'
      });
    }

    // Note: This endpoint expects base64 or a file upload
    // You'll need to implement file handling based on your setup
    // For Cloudinary direct uploads, handle it client-side

    res.json({
      success: true,
      message: 'Upload endpoint - implement based on your needs'
    });

  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to upload media'
    });
  }
};

// @desc    Get review statistics
// @route   GET /api/reviews/stats
// @access  Public
const getReviewStats = async (req, res) => {
  try {
    const { productId } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: 'Product ID is required'
      });
    }

    const reviews = await Review.find({
      product: productId,
      status: 'approved',
      isApproved: true
    });

    const totalReviews = reviews.length;
    const avgRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach(r => {
      distribution[r.rating]++;
    });

    const percentageDistribution = {};
    for (let i = 1; i <= 5; i++) {
      percentageDistribution[i] = totalReviews > 0 
        ? (distribution[i] / totalReviews) * 100 
        : 0;
    }

    res.json({
      success: true,
      data: {
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews,
        ratingDistribution: distribution,
        percentageDistribution
      }
    });

  } catch (error) {
    console.error('Get review stats error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch review statistics'
    });
  }
};

// @desc    Toggle featured status of a review (Admin/Mod only)
// @route   PUT /api/reviews/:id/featured
// @access  Private (Admin/Mod)
const toggleFeatured = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        error: 'Review not found'
      });
    }

    // Only admin or moderator can toggle featured
    if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
      return res.status(403).json({
        success: false,
        error: 'Only admins and moderators can feature reviews'
      });
    }

    // Toggle the featured status
    review.isFeatured = !review.isFeatured;
    await review.save();

    res.json({
      success: true,
      data: review,
      message: review.isFeatured ? 'Review featured successfully' : 'Review removed from featured'
    });

  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to toggle featured status'
    });
  }
};

// @desc    Get featured reviews
// @route   GET /api/reviews/featured
// @access  Public
const getFeaturedReviews = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const reviews = await Review.find({
      isFeatured: true,
      status: 'approved',
      isApproved: true
    })
      .populate('user', 'contactPerson email profilePicture')
      .populate('product', 'productName slug images')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: reviews,
      count: reviews.length
    });

  } catch (error) {
    console.error('Get featured reviews error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fetch featured reviews'
    });
  }
};

module.exports = {
  createReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview,
  approveReview,
  rejectReview,
  markHelpful,
  replyToReview,
  getMyReviews,
  uploadMedia,
  getReviewStats,
  toggleFeatured,
  getFeaturedReviews
};