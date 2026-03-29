// Routes index file
const express = require('express');
const router = express.Router();

// Welcome route
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the API',
    version: '1.0.0',
  });
});

// Example route - remove or modify as needed
router.get('/example', (req, res) => {
  res.json({
    success: true,
    message: 'This is an example route',
  });
});

module.exports = router;
