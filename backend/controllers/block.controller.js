const db = require('../models');

exports.getBlocks = async (req, res) => {
  try {
    const { fileId, name, type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (fileId) where.fileId = fileId;
    if (name) where.name = { [db.Sequelize.Op.iLike]: `%${name}%` };
    if (type) where.type = { [db.Sequelize.Op.iLike]: `%${type}%` };

    const { count, rows } = await db.Block.findAndCountAll({
      where,
      include: [{ model: db.File, as: 'file' }],
      order: [['name', 'ASC']],
      offset,
      limit: parseInt(limit),
    });

    res.json({
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      blocks: rows,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving blocks', error: error.message });
  }
};

exports.getBlockById = async (req, res) => {
  try {
    const block = await db.Block.findByPk(req.params.id, {
      include: [{ model: db.File, as: 'file' }],
    });

    if (!block) {
      return res.status(404).json({ message: 'Block not found' });
    }

    res.json(block);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving block', error: error.message });
  }
};