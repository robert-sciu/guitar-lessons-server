module.exports = (sequelize, DataTypes) => {
  const PageImage = sequelize.define("PageImage", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    section: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return PageImage;
};
