const express = require('express');
const ContactMessage = require('../models/ContactMessage');

const router = express.Router();

const getClientIp = (req) => {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.trim()) {
    return forwardedFor.split(',')[0].trim();
  }
  return req.ip || '';
};

const validate = (body) => {
  const errors = {};
  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim().toLowerCase();
  const subject = String(body.subject || '').trim();
  const message = String(body.message || '').trim();

  if (!name || name.length < 2) errors.name = 'Name is required (minimum 2 characters).';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Valid email is required.';
  if (!subject || subject.length < 3) errors.subject = 'Subject is required (minimum 3 characters).';
  if (!message || message.length < 10) errors.message = 'Message is required (minimum 10 characters).';
  if (message.length > 5000) errors.message = 'Message is too long (maximum 5000 characters).';

  return Object.keys(errors).length ? errors : null;
};

router.post('/', async (req, res) => {
  const errors = validate(req.body || {});
  if (errors) {
    return res.status(400).json({ success: false, errors });
  }

  try {
    const payload = {
      name: String(req.body.name).trim(),
      email: String(req.body.email).trim().toLowerCase(),
      subject: String(req.body.subject).trim(),
      message: String(req.body.message).trim(),
      ip: getClientIp(req),
      userAgent: String(req.headers['user-agent'] || '').slice(0, 400),
    };

    const contactMessage = await ContactMessage.create(payload);

    return res.status(201).json({
      success: true,
      message: 'Message received successfully.',
      contactId: contactMessage._id,
    });
  } catch (err) {
    console.error('Contact message save error:', err);
    return res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

module.exports = router;