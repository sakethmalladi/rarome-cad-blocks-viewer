module.exports = (sequelize, DataTypes) => {
  const Block = sequelize.define('Block', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
    },
    layer: {
      type: DataTypes.STRING,
    },
    x: {
      type: DataTypes.FLOAT,
    },
    y: {
      type: DataTypes.FLOAT,
    },
    z: {
      type: DataTypes.FLOAT,
    },
    properties: {
      type: DataTypes.JSONB,
    },
  });

  Block.associate = (models) => {
    Block.belongsTo(models.File, {
      foreignKey: 'fileId',
      as: 'file',
    });
  };

  return Block;
};