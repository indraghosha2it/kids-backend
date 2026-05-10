// // routes/certificationRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect, isAdmin } = require('../middleware/authMiddleware');
// const {
//   createCertification,
//   getCertifications,
//   getAllCertificationsAdmin,
//   getCertificationById,
//   updateCertification,
//   deleteCertification,
//   toggleCertificationStatus
// } = require('../controllers/certificationController');

// // ========== PUBLIC ROUTES ==========
// router.get('/', getCertifications);
// router.get('/:id', getCertificationById);

// // ========== PROTECTED ROUTES (All require authentication) ==========
// router.use(protect);

// // ========== ADMIN ONLY ROUTES ==========
// router.post('/', isAdmin, createCertification);
// router.get('/admin/all', isAdmin, getAllCertificationsAdmin);
// router.put('/admin/:id', isAdmin, updateCertification);
// router.delete('/admin/:id', isAdmin, deleteCertification);
// router.put('/admin/:id/toggle', isAdmin, toggleCertificationStatus);

// module.exports = router;


// routes/certificationRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin, isModeratorOrAdmin } = require('../middleware/authMiddleware');
const {
  createCertification,
  getCertifications,
  getAllCertificationsAdmin,
  getCertificationById,
  updateCertification,
  deleteCertification,
  toggleCertificationStatus
} = require('../controllers/certificationController');

// ========== PUBLIC ROUTES ==========
router.get('/', getCertifications);
router.get('/:id', getCertificationById);

// ========== PROTECTED ROUTES (All require authentication) ==========
router.use(protect);

// ========== ADMIN/MODERATOR ROUTES (Both can view) ==========
router.get('/admin/all', isModeratorOrAdmin, getAllCertificationsAdmin);

// ========== ADMIN ONLY ROUTES (Create, Update, Delete, Toggle) ==========
router.post('/', isModeratorOrAdmin, createCertification);
router.put('/admin/:id', isAdmin, updateCertification);
router.delete('/admin/:id', isAdmin, deleteCertification);
router.put('/admin/:id/toggle', isAdmin, toggleCertificationStatus);

module.exports = router;