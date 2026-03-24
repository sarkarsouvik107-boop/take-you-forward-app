// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Initialize Express app
const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ==================== MIDDLEWARE ====================

// Body parser middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Log requests in development mode
if (NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}
// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the API server"
  });
});
// CORS middleware (optional - uncomment if needed)
// const cors = require('cors');
// app.use(cors());

// ==================== ROUTES ====================

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes placeholder
app.use('/api/v1', require('./src/routes'));

// ==================== ERROR HANDLING ====================

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method,
  });
});

// General error handler
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  console.error('Error:', {
    status,
    message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  res.status(status).json({
    success: false,
    message,
    status,
    ...(NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// ==================== SERVER START ====================

// Start the server
const server = app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║       SERVER STARTED SUCCESSFULLY      ║
  ╠════════════════════════════════════════╣
  ║  Environment: ${NODE_ENV.padEnd(20)} ║
  ║  Port: ${PORT.toString().padEnd(31)}║
  ║  Timestamp: ${new Date().toISOString()}  ║
  ╚════════════════════════════════════════╝
  `);
});

// Handle server errors
server.on('error', (err) => {
  console.error('Server Error:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Export app for testing
module.exports = app;
