const express = require('express');
const blockController = require('../controllers/block.controller');

const router = express.Router();

router.get('/', blockController.getBlocks);
router.get('/:id', blockController.getBlockById);

module.exports = router;