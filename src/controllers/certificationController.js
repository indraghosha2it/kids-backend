// controllers/certificationController.js
const Certification = require('../models/Certification');
const { cloudinary } = require('../config/cloudinary');

// @desc    Create new certification
// @route   POST /api/certifications
// @access  Private (Admin only)
const createCertification = async (req, res) => {
  try {
    const {
      name,
      type,
      issuingAuthority,
      logoUrl,
      logoPublicId,
      certificateFileUrl,
      certificateFilePublicId,
      description,
      badgeText,
      issueDate,
      expiryDate,
      certificateNumber,
      verificationLink,
      country,
      isFeatured,
      displayOrder
    } = req.body;

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Certification name is required'
      });
    }

    if (!issuingAuthority) {
      return res.status(400).json({
        success: false,
        error: 'Issuing authority is required'
      });
    }

    if (!logoUrl) {
      return res.status(400).json({
        success: false,
        error: 'Certification logo is required'
      });
    }

    const certification = await Certification.create({
      name,
      type: type || 'Quality',
      issuingAuthority,
      logo: logoUrl,
      logoPublicId,
      certificateFile: certificateFileUrl || '',
      certificateFilePublicId: certificateFilePublicId || '',
      description: description || '',
      badgeText: badgeText || 'Certified',
      issueDate: issueDate || null,
      expiryDate: expiryDate || null,
      certificateNumber: certificateNumber || '',
      verificationLink: verificationLink || '',
      country: country || '',
      isFeatured: isFeatured === 'true' || isFeatured === true,
      displayOrder: displayOrder || 0,
      createdBy: req.user.id,
      isActive: true
    });

    res.status(201).json({
      success: true,
      data: certification,
      message: 'Certification created successfully'
    });
  } catch (error) {
    console.error('Create certification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while creating certification'
    });
  }
};

// @desc    Get all certifications (Public)
// @route   GET /api/certifications
// @access  Public
const getCertifications = async (req, res) => {
  try {
    const { featured, type, limit = 50, sort = 'displayOrder' } = req.query;

    const query = { isActive: true };

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (type) {
      query.type = type;
    }

    let sortOption = {};
    if (sort === 'displayOrder') {
      sortOption = { displayOrder: 1, createdAt: -1 };
    } else if (sort === 'newest') {
      sortOption = { createdAt: -1 };
    } else {
      sortOption = { displayOrder: 1, createdAt: -1 };
    }

    const certifications = await Certification.find(query)
      .sort(sortOption)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: certifications,
      total: certifications.length
    });
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching certifications'
    });
  }
};

// @desc    Get all certifications (Admin - includes inactive)
// @route   GET /api/admin/certifications
// @access  Private (Admin only)
const getAllCertificationsAdmin = async (req, res) => {
  try {
    const { status, type } = req.query;

    const query = {};

    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }

    if (type) {
      query.type = type;
    }

    const certifications = await Certification.find(query)
      .populate('createdBy', 'contactPerson email role')
      .populate('updatedBy', 'contactPerson email role')
      .sort({ displayOrder: 1, createdAt: -1 });

    res.json({
      success: true,
      data: certifications
    });
  } catch (error) {
    console.error('Get admin certifications error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching certifications'
    });
  }
};

// @desc    Get single certification by ID or slug
// @route   GET /api/certifications/:id
// @access  Public
const getCertificationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    
    let query = {};
    if (isObjectId) {
      query = { _id: id };
    } else {
      query = { slug: id };
    }
    
    query.isActive = true;

    const certification = await Certification.findOne(query);

    if (!certification) {
      return res.status(404).json({
        success: false,
        error: 'Certification not found'
      });
    }

    res.json({
      success: true,
      data: certification
    });
  } catch (error) {
    console.error('Get certification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching certification'
    });
  }
};

// @desc    Update certification
// @route   PUT /api/admin/certifications/:id
// @access  Private (Admin only)
const updateCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        error: 'Certification not found'
      });
    }

    const {
      name,
      type,
      issuingAuthority,
      logoUrl,
      logoPublicId,
      certificateFileUrl,
      certificateFilePublicId,
      description,
      badgeText,
      issueDate,
      expiryDate,
      certificateNumber,
      verificationLink,
      country,
      isFeatured,
      displayOrder,
      isActive
    } = req.body;

    // Update fields
    if (name) certification.name = name;
    if (type) certification.type = type;
    if (issuingAuthority) certification.issuingAuthority = issuingAuthority;
    if (description !== undefined) certification.description = description;
    if (badgeText) certification.badgeText = badgeText;
    if (issueDate) certification.issueDate = issueDate;
    if (expiryDate) certification.expiryDate = expiryDate;
    if (certificateNumber !== undefined) certification.certificateNumber = certificateNumber;
    if (verificationLink !== undefined) certification.verificationLink = verificationLink;
    if (country !== undefined) certification.country = country;
    if (isFeatured !== undefined) certification.isFeatured = isFeatured === 'true' || isFeatured === true;
    if (displayOrder !== undefined) certification.displayOrder = displayOrder;
    if (isActive !== undefined) certification.isActive = isActive === 'true' || isActive === true;

    // Handle logo update
    if (logoUrl && logoUrl !== certification.logo) {
      // Delete old logo from Cloudinary
      if (certification.logoPublicId) {
        try {
          await cloudinary.uploader.destroy(certification.logoPublicId);
        } catch (err) {
          console.error('Error deleting old logo:', err);
        }
      }
      certification.logo = logoUrl;
      certification.logoPublicId = logoPublicId;
    }

    // Handle certificate file update
    if (certificateFileUrl !== undefined) {
      if (certification.certificateFilePublicId && certificateFileUrl !== certification.certificateFile) {
        try {
          await cloudinary.uploader.destroy(certification.certificateFilePublicId, { resource_type: 'raw' });
        } catch (err) {
          console.error('Error deleting old certificate:', err);
        }
      }
      certification.certificateFile = certificateFileUrl;
      certification.certificateFilePublicId = certificateFilePublicId;
    }

    certification.updatedBy = req.user.id;
    await certification.save();

    res.json({
      success: true,
      data: certification,
      message: 'Certification updated successfully'
    });
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while updating certification'
    });
  }
};

// @desc    Delete certification
// @route   DELETE /api/admin/certifications/:id
// @access  Private (Admin only)
const deleteCertification = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        error: 'Certification not found'
      });
    }

    // Delete logo from Cloudinary
    if (certification.logoPublicId) {
      try {
        await cloudinary.uploader.destroy(certification.logoPublicId);
      } catch (err) {
        console.error('Error deleting logo:', err);
      }
    }

    // Delete certificate file from Cloudinary
    if (certification.certificateFilePublicId) {
      try {
        await cloudinary.uploader.destroy(certification.certificateFilePublicId, { resource_type: 'raw' });
      } catch (err) {
        console.error('Error deleting certificate file:', err);
      }
    }

    await certification.deleteOne();

    res.json({
      success: true,
      message: 'Certification deleted successfully'
    });
  } catch (error) {
    console.error('Delete certification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while deleting certification'
    });
  }
};

// @desc    Toggle certification status
// @route   PUT /api/admin/certifications/:id/toggle
// @access  Private (Admin only)
const toggleCertificationStatus = async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);

    if (!certification) {
      return res.status(404).json({
        success: false,
        error: 'Certification not found'
      });
    }

    certification.isActive = !certification.isActive;
    certification.updatedBy = req.user.id;
    await certification.save();

    res.json({
      success: true,
      data: certification,
      message: `Certification ${certification.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle certification error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while toggling certification status'
    });
  }
};

module.exports = {
  createCertification,
  getCertifications,
  getAllCertificationsAdmin,
  getCertificationById,
  updateCertification,
  deleteCertification,
  toggleCertificationStatus
};