// const Review = require('../models/Review');
// const Product = require('../models/Product');
// const User = require('../models/User');


// // @desc    Create a new review
// // @route   POST /api/reviews
// // @access  Private (All authenticated users)
// const createReview = async (req, res) => {
//   try {
//     const {
//       rating,
//       title,
//       comment,
//       productId,
//       isAnonymous
//     } = req.body;

//     // Validation
//     if (!rating || rating < 1 || rating > 5) {
//       return res.status(400).json({
//         success: false,
//         error: 'Rating must be between 1 and 5'
//       });
//     }

//     if (!comment || comment.length < 10) {
//       return res.status(400).json({
//         success: false,
//         error: 'Review must be at least 10 characters long'
//       });
//     }

//     // Get user data
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: 'User not found'
//       });
//     }

//     let product = null;
//     // If product ID provided, check if product exists
//     if (productId) {
//       product = await Product.findById(productId);
//       if (!product) {
//         return res.status(404).json({
//           success: false,
//           error: 'Product not found'
//         });
//       }

//       // Check if user already reviewed this product
//       const existingReview = await Review.findOne({
//         user: req.user.id,
//         product: productId
//       });

//       if (existingReview) {
//         return res.status(400).json({
//           success: false,
//           error: 'You have already reviewed this product'
//         });
//       }
//     }

//     // Prepare user display name
//     const userName = isAnonymous 
//       ? 'Anonymous Buyer' 
//       : user.contactPerson || user.companyName || user.email.split('@')[0];

//     // Create review
//     const review = await Review.create({
//       rating,
//       title: title || '',
//       comment,
//       product: productId || null,
//       user: req.user.id,
//       userName,
//       userCompany: isAnonymous ? null : user.companyName,
//       userEmail: user.email,
//       isAnonymous: isAnonymous || false,
//       status: 'pending' // All reviews start as pending
//     });

//     // If product exists, add review reference to product (even if pending)
//     if (product) {
//       // Add to product's reviews array (for pending reviews)
//       product.reviews.push({
//         reviewId: review._id,
//         rating: review.rating,
//         title: review.title,
//         comment: review.comment,
//         userName: review.userName,
//         userCompany: review.userCompany,
//         createdAt: review.createdAt,
//         isFeatured: false
//       });

//       // Update review stats (include pending in counts but not in average)
//       product.reviewStats.totalReviews += 1;
//       product.reviewStats.ratingDistribution[rating] += 1;
      
//       // Only approved reviews count towards average
//       // We'll update average when review is approved
      
//       await product.save();
//     }

//     // Populate user and product data for response
//     await review.populate([
//       { path: 'user', select: 'companyName contactPerson email' },
//       { path: 'product', select: 'productName images' }
//     ]);

//     res.status(201).json({
//       success: true,
//       data: review,
//       message: 'Review submitted successfully. It will be published after moderation.'
//     });

//   } catch (error) {
//     console.error('Create review error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while creating review'
//     });
//   }
// };

// // @desc    Get all reviews (with filters)
// // @route   GET /api/reviews
// // @access  Public
// // const getReviews = async (req, res) => {
// //   try {
// //     const {
// //       page = 1,
// //       limit = 10,
// //       product,
// //       user,
// //       status,
// //       rating,
// //       isFeatured,
// //       sort = '-createdAt'
// //     } = req.query;

// //     // Build query
// //     const query = {};

// //     // Check if user is authenticated and has admin/moderator role
// //     const isAdminOrModerator = req.user && (req.user.role === 'admin' || req.user.role === 'moderator');
    
// //     console.log('User role:', req.user?.role);
// //     console.log('Is admin/moderator:', isAdminOrModerator);
// //     console.log('Status filter from query:', status);
    
// //     if (!isAdminOrModerator) {
// //       // Public users only see approved reviews
// //       query.status = 'approved';
// //       console.log('Public user - forcing status=approved');
// //     } else {
// //       // Admin/moderator can see all reviews based on status filter
// //       if (status) {
// //         query.status = status;
// //         console.log('Admin/moderator with status filter:', status);
// //       } else {
// //         // If no status filter, show ALL reviews (pending, approved, rejected)
// //         // Don't add any status to query
// //         console.log('Admin/moderator - showing ALL reviews (no status filter)');
// //       }
// //     }

// //     // Filter by product
// //     if (product) {
// //       query.product = product;
// //     }

// //     // Filter by user (for admin or user themselves)
// //     if (user) {
// //       // Only allow users to see their own reviews, or admin to see any
// //       if (req.user && (req.user.id === user || isAdminOrModerator)) {
// //         query.user = user;
// //       }
// //     }

// //     // Filter by rating
// //     if (rating) {
// //       query.rating = parseInt(rating);
// //     }

// //     // Filter featured
// //     if (isFeatured === 'true') {
// //       query.isFeatured = true;
// //     }

// //     console.log('Final query:', JSON.stringify(query));

// //     // Parse sort
// //     let sortOption = {};
// //     switch (sort) {
// //       case 'newest':
// //         sortOption = { createdAt: -1 };
// //         break;
// //       case 'oldest':
// //         sortOption = { createdAt: 1 };
// //         break;
// //       case 'highest':
// //         sortOption = { rating: -1 };
// //         break;
// //       case 'lowest':
// //         sortOption = { rating: 1 };
// //         break;
// //       case 'helpful':
// //         sortOption = { helpfulCount: -1 };
// //         break;
// //       default:
// //         sortOption = { createdAt: -1 };
// //     }

// //     const reviews = await Review.find(query)
// //       .populate('user', 'companyName contactPerson email')
// //       .populate('product', 'productName images slug')
// //       .populate('moderatedBy', 'contactPerson email')
// //       .populate('response.respondedBy', 'contactPerson email')
// //       .sort(sortOption)
// //       .limit(parseInt(limit))
// //       .skip((parseInt(page) - 1) * parseInt(limit));

// //     const total = await Review.countDocuments(query);

// //     console.log(`Found ${reviews.length} reviews out of ${total} total`);

// //     // Calculate average rating if product filter is applied
// //     let averageRating = null;
// //     if (product) {
// //       const avgData = await Review.getAverageRating(product);
// //       averageRating = avgData.averageRating;
// //     }

// //     res.json({
// //       success: true,
// //       data: reviews,
// //       averageRating,
// //       pagination: {
// //         total,
// //         page: parseInt(page),
// //         pages: Math.ceil(total / parseInt(limit)),
// //         limit: parseInt(limit)
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Get reviews error:', error);
// //     res.status(500).json({
// //       success: false,
// //       error: error.message || 'Server error while fetching reviews'
// //     });
// //   }
// // };
// // @desc    Get all reviews (with filters)
// // @route   GET /api/reviews
// // @access  Public (but with role-based filtering)
// const getReviews = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 10,
//       product,
//       user,
//       status,
//       rating,
//       isFeatured,
//       search, // ADD THIS LINE
//       sort = '-createdAt'
//     } = req.query;

//     // Build query
//     const query = {};

//     // Check if user is authenticated and has admin/moderator role
//     const isAdminOrModerator = req.user && (req.user.role === 'admin' || req.user.role === 'moderator');
    
//     console.log('User role:', req.user?.role);
//     console.log('Is admin/moderator:', isAdminOrModerator);
//     console.log('Status filter from query:', status);
//     console.log('Search term:', search); // ADD THIS LOG
    
//     if (!isAdminOrModerator) {
//       // Public users only see approved reviews
//       query.status = 'approved';
//       console.log('Public user - forcing status=approved');
//     } else {
//       // Admin/moderator can see all reviews based on status filter
//       if (status) {
//         query.status = status;
//         console.log('Admin/moderator with status filter:', status);
//       } else {
//         // If no status filter, show ALL reviews (pending, approved, rejected)
//         // Don't add any status to query
//         console.log('Admin/moderator - showing ALL reviews (no status filter)');
//       }
//     }

//     // Filter by product
//     if (product) {
//       query.product = product;
//     }

//     // Filter by user (for admin or user themselves)
//     if (user) {
//       // Only allow users to see their own reviews, or admin to see any
//       if (req.user && (req.user.id === user || isAdminOrModerator)) {
//         query.user = user;
//       }
//     }

//     // Filter by rating
//     if (rating) {
//       query.rating = parseInt(rating);
//     }

//     // Filter featured
//     if (isFeatured === 'true') {
//       query.isFeatured = true;
//     }

//     // ADD SEARCH FUNCTIONALITY HERE
//     if (search && search.trim()) {
//       const searchRegex = new RegExp(search.trim(), 'i');
//       query.$or = [
//         { title: searchRegex },
//         { comment: searchRegex },
//         { userName: searchRegex },
//         { userEmail: searchRegex }
//       ];
//       console.log('Added search to query:', search);
//     }

//     console.log('Final query:', JSON.stringify(query));

//     // Parse sort
//     let sortOption = {};
//     switch (sort) {
//       case 'newest':
//         sortOption = { createdAt: -1 };
//         break;
//       case 'oldest':
//         sortOption = { createdAt: 1 };
//         break;
//       case 'highest':
//         sortOption = { rating: -1 };
//         break;
//       case 'lowest':
//         sortOption = { rating: 1 };
//         break;
//       case 'helpful':
//         sortOption = { helpfulCount: -1 };
//         break;
//       default:
//         sortOption = { createdAt: -1 };
//     }

//     const reviews = await Review.find(query)
//       .populate('user', 'companyName contactPerson email')
//       .populate('product', 'productName images slug')
//       .populate('moderatedBy', 'contactPerson email')
//       .populate('response.respondedBy', 'contactPerson email')
//       .sort(sortOption)
//       .limit(parseInt(limit))
//       .skip((parseInt(page) - 1) * parseInt(limit));

//     const total = await Review.countDocuments(query);

//     console.log(`Found ${reviews.length} reviews out of ${total} total`);

//     // Calculate average rating if product filter is applied
//     let averageRating = null;
//     if (product) {
//       const avgData = await Review.getAverageRating(product);
//       averageRating = avgData.averageRating;
//     }

//     res.json({
//       success: true,
//       data: reviews,
//       averageRating,
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
//       error: error.message || 'Server error while fetching reviews'
//     });
//   }
// };


// // @desc    Get public reviews (approved only) for homepage/all reviews page
// // @route   GET /api/reviews/public
// // @access  Public
// const getPublicReviews = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 9,
//       sort = '-createdAt',
//       rating,
//       search
//     } = req.query;

//     // Build query - only approved reviews
//     const query = { 
//       status: 'approved'
//     };

//     // Filter by rating
//     if (rating) {
//       query.rating = parseInt(rating);
//     }

//     // Search in comment, title, or product name
//     if (search) {
//       query.$or = [
//         { comment: { $regex: search, $options: 'i' } },
//         { title: { $regex: search, $options: 'i' } }
//       ];
//     }

//     // Parse sort
//     let sortOption = {};
//     if (sort === '-createdAt' || sort === 'newest') {
//       sortOption = { createdAt: -1 };
//     } else if (sort === '-rating' || sort === 'highest') {
//       sortOption = { rating: -1, createdAt: -1 };
//     } else {
//       sortOption = { createdAt: -1 };
//     }

//     const reviews = await Review.find(query)
//       .populate('user', 'companyName contactPerson email')
//       .populate('product', 'productName images slug')
//       .populate('response.respondedBy', 'contactPerson email')
//       .sort(sortOption)
//       .limit(parseInt(limit))
//       .skip((parseInt(page) - 1) * parseInt(limit));

//     const total = await Review.countDocuments(query);

//     // Calculate average rating for all approved reviews
//     const allApproved = await Review.find({ status: 'approved' }).select('rating');
//     const averageRating = allApproved.length > 0
//       ? allApproved.reduce((sum, r) => sum + r.rating, 0) / allApproved.length
//       : 0;

//     res.json({
//       success: true,
//       data: reviews,
//       averageRating,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });

//   } catch (error) {
//     console.error('Get public reviews error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching reviews'
//     });
//   }
// };

// // @desc    Get single review by ID
// // @route   GET /api/reviews/:id
// // @access  Public
// const getReviewById = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id)
//       .populate('user', 'companyName contactPerson email')
//       .populate('product', 'productName images slug')
//       .populate('moderatedBy', 'contactPerson email')
//       .populate('response.respondedBy', 'contactPerson email');

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         error: 'Review not found'
//       });
//     }

//     // If review is not approved, only show to owner or admin/moderator
//     if (review.status !== 'approved') {
//       if (!req.user || 
//           (req.user.id !== review.user._id.toString() && 
//            req.user.role !== 'admin' && 
//            req.user.role !== 'moderator')) {
//         return res.status(403).json({
//           success: false,
//           error: 'Not authorized to view this review'
//         });
//       }
//     }

//     res.json({
//       success: true,
//       data: review
//     });

//   } catch (error) {
//     console.error('Get review error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching review'
//     });
//   }
// };


// // @route   PUT /api/reviews/:id
// // @access  Private (Owner can update only pending, Admin/Moderator can update any)
// const updateReview = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         error: 'Review not found'
//       });
//     }

//     // Check if user is admin or moderator
//     const isAdminOrModerator = req.user.role === 'admin' || req.user.role === 'moderator';
    
//     // Check if user owns this review
//     const isOwner = review.user.toString() === req.user.id;

//     // Authorization check
//     if (!isOwner && !isAdminOrModerator) {
//       return res.status(403).json({
//         success: false,
//         error: 'You are not authorized to update this review'
//       });
//     }

//     // If user is owner (not admin/moderator), enforce pending status restriction
//     if (isOwner && !isAdminOrModerator && review.status !== 'pending') {
//       return res.status(400).json({
//         success: false,
//         error: `You can only update reviews that are in 'pending' status. This review is ${review.status}.`
//       });
//     }

//     const {
//       rating,
//       title,
//       comment
//     } = req.body;

//     // Update fields with validation
//     if (rating !== undefined) {
//       if (rating < 1 || rating > 5) {
//         return res.status(400).json({
//           success: false,
//           error: 'Rating must be between 1 and 5'
//         });
//       }
//       review.rating = rating;
//     }

//     if (title !== undefined) {
//       review.title = title;
//     }
    
//     if (comment !== undefined) {
//       if (comment.length < 10) {
//         return res.status(400).json({
//           success: false,
//           error: 'Review must be at least 10 characters long'
//         });
//       }
//       review.comment = comment;
//     }

//     // If admin/moderator is updating, we might want to track who made the change
//     if (isAdminOrModerator && !isOwner) {
//       // Optional: Add a field to track admin edits
//       review.lastEditedBy = req.user.id;
//       review.lastEditedAt = new Date();
//     }

//     await review.save();

//     // Populate for response
//     await review.populate([
//       { path: 'user', select: 'companyName contactPerson email' },
//       { path: 'product', select: 'productName images slug' },
//       { path: 'moderatedBy', select: 'contactPerson email' },
//       { path: 'lastEditedBy', select: 'contactPerson email' }
//     ]);

//     res.json({
//       success: true,
//       data: review,
//       message: isAdminOrModerator && !isOwner 
//         ? 'Review updated by admin/moderator successfully' 
//         : 'Review updated successfully'
//     });

//   } catch (error) {
//     console.error('Update review error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while updating review'
//     });
//   }
// };

// // @desc    Delete review
// // @route   DELETE /api/reviews/:id
// // @access  Private (Owner or Admin)
// const deleteReview = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         error: 'Review not found'
//       });
//     }

//     // Check permissions: Owner, Admin, or Moderator can delete
//     if (review.user.toString() !== req.user.id && 
//         req.user.role !== 'admin' && 
//         req.user.role !== 'moderator') {
//       return res.status(403).json({
//         success: false,
//         error: 'Not authorized to delete this review'
//       });
//     }

//     await review.deleteOne();

//     res.json({
//       success: true,
//       message: 'Review deleted successfully'
//     });

//   } catch (error) {
//     console.error('Delete review error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while deleting review'
//     });
//   }
// };

// // @desc    Moderate review (Approve/Reject)
// // @route   PUT /api/reviews/:id/moderate
// // @access  Private (Admin/Moderator only)
// // const moderateReview = async (req, res) => {
// //   try {
// //     const { status, moderationNote } = req.body;

// //     if (!status || !['approved', 'rejected'].includes(status)) {
// //       return res.status(400).json({
// //         success: false,
// //         error: 'Valid status (approved/rejected) is required'
// //       });
// //     }

// //     const review = await Review.findById(req.params.id);

// //     if (!review) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Review not found'
// //       });
// //     }

// //     review.status = status;
// //     review.moderatedBy = req.user.id;
// //     review.moderatedAt = new Date();
// //     if (moderationNote) review.moderationNote = moderationNote;

// //     await review.save();

// //     res.json({
// //       success: true,
// //       data: review,
// //       message: `Review ${status} successfully`
// //     });

// //   } catch (error) {
// //     console.error('Moderate review error:', error);
// //     res.status(500).json({
// //       success: false,
// //       error: error.message || 'Server error while moderating review'
// //     });
// //   }
// // };
// // @desc    Moderate review (Approve/Reject)
// // @route   PUT /api/reviews/:id/moderate
// // @access  Private (Admin/Moderator only)
// const moderateReview = async (req, res) => {
//   try {
//     const { status, moderationNote } = req.body;

//     if (!status || !['approved', 'rejected'].includes(status)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Valid status (approved/rejected) is required'
//       });
//     }

//     const review = await Review.findById(req.params.id).populate('product');

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         error: 'Review not found'
//       });
//     }

//     const oldStatus = review.status;
//     review.status = status;
//     review.moderatedBy = req.user.id;
//     review.moderatedAt = new Date();
//     if (moderationNote) review.moderationNote = moderationNote;

//     await review.save();

//     // Update product review stats if review is for a product
//     if (review.product) {
//       const product = await Product.findById(review.product._id);
      
//       if (product) {
//         // Find the review in product's reviews array
//         const productReview = product.reviews.find(r => 
//           r.reviewId.toString() === review._id.toString()
//         );

//         if (productReview) {
//           // Update the review's featured status if it changed
//           productReview.isFeatured = review.isFeatured;
//         }

//         // Recalculate average rating if review was approved
//         if (status === 'approved' && oldStatus !== 'approved') {
//           // Get all approved reviews for this product
//           const approvedReviews = await Review.find({
//             product: review.product._id,
//             status: 'approved'
//           });
          
//           if (approvedReviews.length > 0) {
//             const total = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
//             product.reviewStats.averageRating = total / approvedReviews.length;
//           }
//         } else if (status !== 'approved' && oldStatus === 'approved') {
//           // Review was unapproved, recalculate average without it
//           const approvedReviews = await Review.find({
//             product: review.product._id,
//             status: 'approved'
//           });
          
//           if (approvedReviews.length > 0) {
//             const total = approvedReviews.reduce((sum, r) => sum + r.rating, 0);
//             product.reviewStats.averageRating = total / approvedReviews.length;
//           } else {
//             product.reviewStats.averageRating = 0;
//           }
//         }

//         await product.save();
//       }
//     }

//     res.json({
//       success: true,
//       data: review,
//       message: `Review ${status} successfully`
//     });

//   } catch (error) {
//     console.error('Moderate review error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while moderating review'
//     });
//   }
// };

// // @desc    Toggle featured status
// // @route   PUT /api/reviews/:id/feature
// // @desc    Toggle featured status (Admin/Moderator can feature)
// // @route   PUT /api/reviews/:id/feature
// // @access  Private (Admin/Moderator only)
// const toggleFeatured = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         error: 'Review not found'
//       });
//     }

//     // Toggle featured status
//     review.isFeatured = !review.isFeatured;
//     await review.save();

//     res.json({
//       success: true,
//       data: review,
//       message: `Review ${review.isFeatured ? 'featured' : 'unfeatured'} successfully`
//     });

//   } catch (error) {
//     console.error('Toggle featured error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while toggling featured'
//     });
//   }
// };

// // @desc    Get featured reviews
// // @route   GET /api/reviews/featured
// // @access  Public
// const getFeaturedReviews = async (req, res) => {
//   try {
//     const { limit = 6 } = req.query;

//     const reviews = await Review.find({ 
//       status: 'approved',
//       isFeatured: true 
//     })
//       .populate('user', 'companyName contactPerson email')
//       .populate('product', 'productName images slug')
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit));

//     res.json({
//       success: true,
//       data: reviews,
//       count: reviews.length
//     });

//   } catch (error) {
//     console.error('Get featured reviews error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching featured reviews'
//     });
//   }
// };

// // @desc    Mark review as helpful
// // @route   POST /api/reviews/:id/helpful
// // @access  Private
// const markHelpful = async (req, res) => {
//   try {
//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         error: 'Review not found'
//       });
//     }

//     // Check if user already marked this review as helpful
//     const alreadyMarked = review.helpfulUsers.includes(req.user.id);

//     if (alreadyMarked) {
//       // Remove mark
//       review.helpfulUsers = review.helpfulUsers.filter(
//         id => id.toString() !== req.user.id
//       );
//       review.helpfulCount -= 1;
//     } else {
//       // Add mark
//       review.helpfulUsers.push(req.user.id);
//       review.helpfulCount += 1;
//     }

//     await review.save();

//     res.json({
//       success: true,
//       data: {
//         helpfulCount: review.helpfulCount,
//         isHelpful: !alreadyMarked
//       }
//     });

//   } catch (error) {
//     console.error('Mark helpful error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error'
//     });
//   }
// };

// // @desc    Add response to review (Admin/Moderator)
// // @route   POST /api/reviews/:id/respond
// // @access  Private (Admin/Moderator only)
// const addResponse = async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text || text.trim().length < 5) {
//       return res.status(400).json({
//         success: false,
//         error: 'Response must be at least 5 characters long'
//       });
//     }

//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         error: 'Review not found'
//       });
//     }

//     review.response = {
//       text,
//       respondedBy: req.user.id,
//       respondedAt: new Date()
//     };

//     await review.save();

//     await review.populate('response.respondedBy', 'contactPerson email');

//     res.json({
//       success: true,
//       data: review,
//       message: 'Response added successfully'
//     });

//   } catch (error) {
//     console.error('Add response error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while adding response'
//     });
//   }
// };

// // @desc    Get user's own reviews
// // @route   GET /api/reviews/user/me
// // @access  Private
// // const getMyReviews = async (req, res) => {
// //   try {
// //     const { page = 1, limit = 10 } = req.query;

// //     const reviews = await Review.find({ user: req.user.id })
// //       .populate('product', 'productName images slug')
// //       .sort({ createdAt: -1 })
// //       .limit(parseInt(limit))
// //       .skip((parseInt(page) - 1) * parseInt(limit));

// //     const total = await Review.countDocuments({ user: req.user.id });

// //     res.json({
// //       success: true,
// //       data: reviews,
// //       pagination: {
// //         total,
// //         page: parseInt(page),
// //         pages: Math.ceil(total / parseInt(limit)),
// //         limit: parseInt(limit)
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Get my reviews error:', error);
// //     res.status(500).json({
// //       success: false,
// //       error: error.message || 'Server error while fetching your reviews'
// //     });
// //   }
// // };
// // @desc    Get user's own reviews
// // @route   GET /api/reviews/user/me
// // @access  Private
// const getMyReviews = async (req, res) => {
//   try {
//     const { 
//       page = 1, 
//       limit = 10,
//       status,
//       search 
//     } = req.query;

//     // Build query
//     const query = { user: req.user.id };

//     // Add status filter if provided
//     if (status && status !== 'all') {
//       query.status = status;
//     }

//     // Add search filter if provided
//     if (search && search.trim()) {
//       const searchRegex = new RegExp(search.trim(), 'i');
//       query.$or = [
//         { title: searchRegex },
//         { comment: searchRegex }
//       ];
//     }

//     console.log('Get my reviews query:', JSON.stringify(query)); // Debug log

//     const reviews = await Review.find(query)
//       .populate('product', 'productName images slug')
//       .sort({ createdAt: -1 })
//       .limit(parseInt(limit))
//       .skip((parseInt(page) - 1) * parseInt(limit));

//     const total = await Review.countDocuments(query);

//     res.json({
//       success: true,
//       data: reviews,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });

//   } catch (error) {
//     console.error('Get my reviews error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching your reviews'
//     });
//   }
// };
// // @desc    Get pending reviews count (Admin/Moderator)
// // @route   GET /api/reviews/pending/count
// // @access  Private (Admin/Moderator only)
// const getPendingCount = async (req, res) => {
//   try {
//     const count = await Review.countDocuments({ status: 'pending' });

//     res.json({
//       success: true,
//       data: { pendingCount: count }
//     });

//   } catch (error) {
//     console.error('Get pending count error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error'
//     });
//   }
// };
// // @desc    Get reviews for a specific product
// // @route   GET /api/reviews/product/:productId
// // @access  Public
// const getProductReviews = async (req, res) => {
//   try {
//     const { productId } = req.params;
//     const { page = 1, limit = 10, sort = '-createdAt' } = req.query;

//     console.log('Fetching reviews for product:', productId);

//     // Check if product exists
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     // Build query - only show approved reviews to public
//     const query = { 
//       product: productId,
//       status: 'approved'
//     };

//     console.log('Query:', query);

//     // Parse sort
//     let sortOption = {};
//     switch (sort) {
//       case 'newest':
//         sortOption = { createdAt: -1 };
//         break;
//       case 'oldest':
//         sortOption = { createdAt: 1 };
//         break;
//       case 'highest':
//         sortOption = { rating: -1 };
//         break;
//       case 'lowest':
//         sortOption = { rating: 1 };
//         break;
//       case 'helpful':
//         sortOption = { helpfulCount: -1 };
//         break;
//       default:
//         sortOption = { createdAt: -1, isFeatured: -1 };
//     }

//     // First, let's just get the reviews without aggregation to isolate the issue
//     const reviews = await Review.find(query)
//       .populate('user', 'companyName contactPerson email')
//       .populate('response.respondedBy', 'contactPerson email')
//       .sort(sortOption)
//       .limit(parseInt(limit))
//       .skip((parseInt(page) - 1) * parseInt(limit));

//     const total = await Review.countDocuments(query);

//     console.log(`Found ${reviews.length} reviews out of ${total} total`);

//     // Calculate rating distribution safely
//     const ratingDistribution = {
//       1: 0, 2: 0, 3: 0, 4: 0, 5: 0
//     };
    
//     // Calculate from the fetched reviews (for current page)
//     // For accurate distribution, we should do this with aggregation, but let's keep it simple for now
//     try {
//       // Get all approved reviews for this product to calculate distribution
//       const allReviews = await Review.find({ 
//         product: productId, 
//         status: 'approved' 
//       }).select('rating');
      
//       allReviews.forEach(review => {
//         if (review.rating >= 1 && review.rating <= 5) {
//           ratingDistribution[review.rating] += 1;
//         }
//       });
//     } catch (distError) {
//       console.error('Error calculating rating distribution:', distError);
//       // Continue with zeros
//     }

//     // Calculate average rating
//     let averageRating = 0;
//     if (total > 0) {
//       // Get all approved reviews for accurate average
//       const allReviews = await Review.find({ 
//         product: productId, 
//         status: 'approved' 
//       }).select('rating');
      
//       const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
//       averageRating = totalRating / total;
//     }

//     res.json({
//       success: true,
//       data: {
//         reviews,
//         productStats: {
//           averageRating,
//           totalReviews: total,
//           ratingDistribution
//         }
//       },
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });

//   } catch (error) {
//     console.error('Get product reviews error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching product reviews'
//     });
//   }
// };

// // @desc    Get current user's review for a specific product
// // @route   GET /api/reviews/product/:productId/my-review
// // @access  Private
// const getMyProductReview = async (req, res) => {
//   try {
//     const { productId } = req.params;
    
//     console.log('Fetching user review for product:', productId, 'user:', req.user.id);

//     const review = await Review.findOne({
//       product: productId,
//       user: req.user.id
//     }).populate('user', 'companyName contactPerson email')
//       .populate('response.respondedBy', 'contactPerson email')
//       .populate('moderatedBy', 'contactPerson email');

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         error: 'No review found'
//       });
//     }

//     res.json({
//       success: true,
//       data: review
//     });

//   } catch (error) {
//     console.error('Get my product review error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching your review'
//     });
//   }
// };

// module.exports = {
//   createReview,
//   getReviews,
//   getReviewById,
//   updateReview,
//   deleteReview,
//   moderateReview,
//   toggleFeatured,
//   markHelpful,
//   addResponse,
//   getMyReviews,
//   getPendingCount,
//   getFeaturedReviews,
//   getProductReviews,
//   getPublicReviews,
//   getMyProductReview
// };




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

    // IMPORTANT: For admin users, show ALL reviews - no status filter
    // Only apply status filter if specifically requested by admin
    if (status && status !== 'all') {
      query.status = status;
    }
    
    // If no status filter and user is not admin, only show approved
    if (!status && (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator'))) {
      query.status = 'approved';
      query.isApproved = true;
    }

    // Filter by rating
    if (rating && rating !== 'all') {
      query.rating = parseInt(rating);
    }

    // Filter by approval status (admin/mod only)
    if (isApproved !== undefined && isApproved !== 'all' && req.user && (req.user.role === 'admin' || req.user.role === 'moderator')) {
      query.isApproved = isApproved === 'true';
    }

    // Search in comment and title
    if (search && search.trim()) {
      query.$or = [
        { comment: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { userName: { $regex: search, $options: 'i' } }
      ];
    }

    console.log('Final query:', JSON.stringify(query, null, 2));
    
    // First, let's count total documents without any filters to debug
    const totalAll = await Review.countDocuments({});
    console.log('Total reviews in database:', totalAll);
    
    // Count with our query
    const countWithQuery = await Review.countDocuments(query);
    console.log('Reviews matching query:', countWithQuery);
    
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
    console.log('First review sample:', reviews[0] ? {
      id: reviews[0]._id,
      productName: reviews[0].productName,
      status: reviews[0].status
    } : 'No reviews');

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