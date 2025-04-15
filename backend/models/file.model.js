module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define('File', {
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    originalname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mimetype: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.INTEGER,
    },
  });

  File.associate = (models) => {
    File.hasMany(models.Block, {
      foreignKey: 'fileId',
      as: 'blocks',
    });
  };

  return File;
};