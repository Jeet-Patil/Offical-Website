const express = require('express');

const router = express.Router();

// Recruitment is currently closed — reject all applications
router.post('/apply', (req, res) => {
  return res.status(410).json({
    success: false,
    error: 'Recruitment is currently closed. Applications are not being accepted.',
  });
});

module.exports = router;