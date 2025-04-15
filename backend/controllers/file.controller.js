const db = require('../models');
const DxfParserService = require('../services/dxfParser.service');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(uploadDir, req.file.filename);
    
    // Parse DXF file
    const dxfData = await DxfParserService.parseDxfFile(filePath);
    const blocks = DxfParserService.extractBlocks(dxfData);

    // Save file info to database
    const fileRecord = await db.File.create({
      filename: req.file.filename,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    });

    // Save blocks to database
    const blockRecords = await Promise.all(
      blocks.map(block => db.Block.create({
        ...block,
        fileId: fileRecord.id,
      }))
    );

    // Clean up - remove the uploaded file
    await unlinkAsync(filePath);

    res.status(201).json({
      message: 'File uploaded and processed successfully',
      file: fileRecord,
      blocks: blockRecords,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    res.status(500).json({ message: 'Error processing file', error: error.message });
  }
};

exports.getFiles = async (req, res) => {
  try {
    const files = await db.File.findAll({
      order: [['createdAt', 'DESC']],
    });
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving files', error: error.message });
  }
};