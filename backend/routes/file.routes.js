const express = require('express');
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/file.controller');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/dxf' || file.originalname.endsWith('.dxf')) {
      cb(null, true);
    } else {
      cb(new Error('Only DXF files are allowed'));
    }
  },
});

const router = express.Router();

router.post('/upload', upload.single('file'), fileController.uploadFile);
router.get('/', fileController.getFiles);

module.exports = router;