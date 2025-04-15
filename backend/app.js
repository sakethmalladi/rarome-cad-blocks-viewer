const express = require('express');
const cors = require('cors');
const fileRoutes = require('./routes/file.routes');
const blockRoutes = require('./routes/block.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/blocks', blockRoutes);

// API Documentation
app.get('/api', (req, res) => {
  res.json({
    message: 'CAD Blocks API',
    endpoints: {
      files: {
        upload: 'POST /api/files/upload',
        list: 'GET /api/files',
      },
      blocks: {
        list: 'GET /api/blocks',
        details: 'GET /api/blocks/:id',
      },
    },
    queryParameters: {
      blocks: {
        fileId: 'Filter by file ID',
        name: 'Filter by block name (case-insensitive)',
        type: 'Filter by block type',
        page: 'Pagination page number',
        limit: 'Number of items per page',
      },
    },
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

module.exports = app;