const express = require('express');
const { v2: cloudinary } = require('cloudinary');
const rateLimit = require('express-rate-limit');
const Recruitment = require('../models/Recruitment');
const uploadDoc = require('../middleware/uploadDoc');
const { appendRecruitmentRow } = require('../sheets');

const router = express.Router();

// Config Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Configure rate limiter
const applyLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 5, // Limit each IP to 5 submissions
  message: {
    success: false,
    error: 'Too many applications submitted from this IP address. Please try again after 30 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadToCloudinary = (buffer, folder) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'auto' },
      (err, result) => {
        if (err) return reject(err);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });

const runUpload = (req, res) =>
  new Promise((resolve, reject) => {
    uploadDoc.single('resumeFile')(req, res, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

const validate = (body, file) => {
  const e = {};
  if (!body.fullName?.trim()) e.fullName = 'Full name is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email || '')) {
    e.email = 'Valid email is required';
  }
  if (!/^\d{10}$/.test((body.mobile || '').replace(/\s/g, ''))) {
    e.mobile = 'Valid 10-digit mobile number is required';
  }
  if (!body.yearOfStudy?.trim()) e.yearOfStudy = 'Year of study is required';
  if (!body.branch?.trim()) e.branch = 'Branch is required';
  
  let roles = [];
  try {
    roles = JSON.parse(body.roles || '[]');
  } catch {
    // Malformed JSON
  }
  if (!Array.isArray(roles) || roles.length === 0) {
    e.roles = 'Please select at least one role';
  }

  if (!body.preferredRole?.trim()) e.preferredRole = 'Preferred role is required';
  if (!file) e.resumeFile = 'Resume is required';

  return Object.keys(e).length ? e : null;
};

router.post('/apply', applyLimiter, async (req, res) => {
  try {
    await runUpload(req, res);
  } catch (err) {
    const msg =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File too large. Maximum 10 MB allowed.'
        : err.message;
    return res.status(400).json({ success: false, error: msg });
  }

  const errors = validate(req.body, req.file);
  if (errors) return res.status(400).json({ success: false, errors });

  let roles = [];
  try {
    roles = JSON.parse(req.body.roles || '[]');
  } catch {
    roles = [];
  }

  try {
    // Check for existing email/mobile to give a cleaner database error message before Cloudinary upload
    const existingEmail = await Recruitment.findOne({ email: req.body.email.trim().toLowerCase() });
    if (existingEmail) {
      return res.status(409).json({ success: false, error: 'You have already submitted an application using this email.' });
    }

    const existingMobile = await Recruitment.findOne({ mobile: req.body.mobile.trim() });
    if (existingMobile) {
      return res.status(409).json({ success: false, error: 'You have already submitted an application using this mobile number.' });
    }

    // Upload PDF/doc to Cloudinary
    const resumeUrl = await uploadToCloudinary(
      req.file.buffer,
      'recruitment/resumes'
    );

    // Save Recruitment to MongoDB
    const application = await Recruitment.create({
      fullName: req.body.fullName.trim(),
      email: req.body.email.trim().toLowerCase(),
      mobile: req.body.mobile.trim(),
      yearOfStudy: req.body.yearOfStudy.trim(),
      branch: req.body.branch.trim(),
      roles,
      preferredRole: req.body.preferredRole.trim(),
      secondPreference: (req.body.secondPreference || '').trim(),
      previousClubExperience: (req.body.previousClubExperience || '').trim(),
      leadershipExperience: (req.body.leadershipExperience || '').trim(),
      github: (req.body.github || '').trim(),
      linkedin: (req.body.linkedin || '').trim(),
      portfolioWebsite: (req.body.portfolioWebsite || '').trim(),
      resumeUrl,
      additionalPortfolioLink: (req.body.additionalPortfolioLink || '').trim(),
      whyJoinDesoc: (req.body.whyJoinDesoc || '').trim(),
    });

    // Sync to Google Sheets
    appendRecruitmentRow(application).catch((err) =>
      console.error('Google Sheets recruitment append failed:', err.message)
    );

    return res.status(201).json({ success: true, applicationId: application._id });

  } catch (err) {
    if (err.code === 11000) {
      const key = Object.keys(err.keyPattern || {})[0] || '';
      const msg = key.includes('email')
        ? 'You have already submitted an application using this email.'
        : key.includes('mobile')
        ? 'You have already submitted an application using this mobile number.'
        : 'You have already submitted an application.';
      return res.status(409).json({ success: false, error: msg });
    }

    console.error('Recruitment application error:', err);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

module.exports = router;
