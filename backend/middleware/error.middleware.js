const multer = require('multer');

// 404 Not Found Middleware
exports.notFound = (req, res, next) => {
  res.status(404).json({ 
    error: `Not Found - ${req.method} ${req.originalUrl}` 
  });
};

// Error Handling Middleware
exports.errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  // Handle Multer file upload errors
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ 
      error: 'File upload error', 
      details: err.message 
    });
  }

  // Handle other errors
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    error: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
};