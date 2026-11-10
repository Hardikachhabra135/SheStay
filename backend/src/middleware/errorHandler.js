const config = require('../config');

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const isDev = config.nodeEnv === 'development';

  // Sanitize error logging: avoid logging headers or query strings with sensitive info
  console.error(`[Error] ${req.method} ${req.path} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    error: err.message || 'An unexpected internal server error occurred.',
    ...(isDev && { stack: err.stack })
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};

